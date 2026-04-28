import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import unquote, urlparse


class AuthRepository:
    def __init__(self, db_url: str) -> None:
        self.db_url = db_url.strip()
        parsed = urlparse(self.db_url)
        scheme = parsed.scheme.lower()

        if scheme in ("", "sqlite", "sqlite3"):
            self.engine = "sqlite"
            sqlite_path = parsed.path or self.db_url
            if sqlite_path.startswith("///"):
                sqlite_path = sqlite_path[2:]
            self.sqlite_path = unquote(sqlite_path.lstrip("/")) if self.db_url.startswith("sqlite:///") else sqlite_path
            if not self.sqlite_path:
                self.sqlite_path = "data/investx.db"
            Path(self.sqlite_path).parent.mkdir(parents=True, exist_ok=True)
            return

        if scheme in ("mysql", "mysql+mysqlconnector", "mysql+pymysql"):
            self.engine = "mysql"
            self.mysql_host = parsed.hostname or "127.0.0.1"
            self.mysql_port = parsed.port or 3306
            self.mysql_user = unquote(parsed.username or "")
            self.mysql_password = unquote(parsed.password or "")
            self.mysql_database = (parsed.path or "/").lstrip("/")
            if not self.mysql_user or not self.mysql_database:
                raise ValueError("MySQL URL must include user and database name")
            return

        raise ValueError(f"Unsupported AUTH_DB_URL scheme: {scheme}")

    def _connect_sqlite(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.sqlite_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _connect_mysql(self):
        try:
            import mysql.connector  # type: ignore
        except ModuleNotFoundError as exc:  # pragma: no cover
            raise RuntimeError(
                "mysql-connector-python is required for MySQL AUTH_DB_URL. "
                "Install it via pip."
            ) from exc

        return mysql.connector.connect(
            host=self.mysql_host,
            port=self.mysql_port,
            user=self.mysql_user,
            password=self.mysql_password,
            database=self.mysql_database,
        )

    def init_db(self) -> None:
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS sessions (
                        token TEXT PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        created_at TEXT NOT NULL,
                        expires_at TEXT NOT NULL,
                        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                    """
                )
                conn.commit()
            return

        conn = self._connect_mysql()
        cur = conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(191) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at VARCHAR(64) NOT NULL
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                token VARCHAR(255) PRIMARY KEY,
                user_id INT NOT NULL,
                created_at VARCHAR(64) NOT NULL,
                expires_at VARCHAR(64) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        conn.commit()
        cur.close()
        conn.close()

    def create_user(self, username: str, password_hash: str) -> Dict[str, Any]:
        created_at = datetime.now(timezone.utc).isoformat()
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                cur = conn.execute(
                    "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)",
                    (username, password_hash, created_at),
                )
                conn.commit()
                user_id = int(cur.lastrowid)
            return {"id": user_id, "username": username, "created_at": created_at}

        conn = self._connect_mysql()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, password_hash, created_at) VALUES (%s, %s, %s)",
            (username, password_hash, created_at),
        )
        conn.commit()
        user_id = int(cur.lastrowid)
        cur.close()
        conn.close()
        return {"id": user_id, "username": username, "created_at": created_at}

    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                row = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
            return dict(row) if row else None

        conn = self._connect_mysql()
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return dict(row) if row else None

    def create_session(self, token: str, user_id: int, expires_at: str) -> None:
        created_at = datetime.now(timezone.utc).isoformat()
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                conn.execute(
                    "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
                    (token, user_id, created_at, expires_at),
                )
                conn.commit()
            return

        conn = self._connect_mysql()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (%s, %s, %s, %s)",
            (token, user_id, created_at, expires_at),
        )
        conn.commit()
        cur.close()
        conn.close()

    def get_session_user(self, token: str) -> Optional[Dict[str, Any]]:
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                row = conn.execute(
                    """
                    SELECT u.id, u.username, u.created_at, s.expires_at
                    FROM sessions s
                    JOIN users u ON u.id = s.user_id
                    WHERE s.token = ?
                    """,
                    (token,),
                ).fetchone()
            row_data = dict(row) if row else None
        else:
            conn = self._connect_mysql()
            cur = conn.cursor(dictionary=True)
            cur.execute(
                """
                SELECT u.id, u.username, u.created_at, s.expires_at
                FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token = %s
                """,
                (token,),
            )
            row = cur.fetchone()
            cur.close()
            conn.close()
            row_data = dict(row) if row else None

        if not row_data:
            return None

        expires_at = datetime.fromisoformat(row_data["expires_at"])
        if expires_at <= datetime.now(timezone.utc):
            self.delete_session(token)
            return None

        return row_data

    def delete_session(self, token: str) -> None:
        if self.engine == "sqlite":
            with self._connect_sqlite() as conn:
                conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
                conn.commit()
            return

        conn = self._connect_mysql()
        cur = conn.cursor()
        cur.execute("DELETE FROM sessions WHERE token = %s", (token,))
        conn.commit()
        cur.close()
        conn.close()
