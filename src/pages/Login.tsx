import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(
    searchParams.get("mode") === "register" ? "register" : "login",
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">InvestX</h1>
            <p className="text-xs text-muted-foreground">Account Access</p>
          </div>
          <div className="ml-auto">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm ${mode === "login" ? "bg-primary text-primary-foreground" : "bg-secondary/50"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm ${mode === "register" ? "bg-primary text-primary-foreground" : "bg-secondary/50"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
              placeholder="your_username"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary outline-none"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-60"
          >
            {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
