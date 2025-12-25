import React, { useEffect, useState } from "react";
import axiosInstance from "@/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Fetch profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/profile");
        console.log("Fetched user:", response.data);

        
        setUser({
          name: response.data.userName,
          email: response.data.email,
          phone: response.data.phone,
        });

        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
        alert("Error loading profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      //  Map frontend's name to backend's expected userName
      const response = await axiosInstance.put("/user/profile", {
        userName: user.name,
        email: user.email,
        phone: user.phone,
      });

      alert("✅ Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("❌ Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-4 max-w-md  bg-white shadow-xl rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium">Name</label>
        <Input
          name="name"
          value={user?.name || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Email</label>
        <Input
          name="email"
          type="email"
          value={user?.email || ""}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Phone</label>

        <Input
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={user?.phone || ""}
          onChange={(e) => {
            const value = e.target.value;

            if (/^\d*$/.test(value)) {
              setUser({ ...user, phone: value });
            }
          }}
          disabled={!editMode}
        />
      </div>

      {editMode ? (
        <div className="flex gap-2">
          <Button onClick={handleUpdate}>Save</Button>
          <Button variant="outline" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
      )}
    </div>
  );
};

export default Profile;
