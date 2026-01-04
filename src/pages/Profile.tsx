import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Camera, Mail, Briefcase, MapPin, Phone, Calendar, Save } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/contexts/ProfileContext";

const Profile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profileData, updateProfile, updateProfileImage } = useProfile();
  
  const [localProfileData, setLocalProfileData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        updateProfileImage(imageData);
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalProfileData({
      ...localProfileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateProfile(localProfileData);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalProfileData(profileData);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and profile picture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Card */}
          <Card className="glass-card lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                  {profileData.profileImage ? (
                    <img 
                      src={profileData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-5 h-5 text-primary-foreground" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF (Max 5MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={localProfileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary/30" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={localProfileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary/30" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={localProfileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary/30" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={localProfileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary/30" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={localProfileData.occupation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-secondary/30" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    value={localProfileData.joinDate}
                    disabled
                    className="bg-secondary/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={localProfileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={!isEditing ? "bg-secondary/30" : ""}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Stats Card */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your investment journey at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
                <p className="text-2xl font-bold text-success">$125,450</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Total Investments</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                <p className="text-2xl font-bold text-warning">8</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Total Return</p>
                <p className="text-2xl font-bold text-success">+24.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
