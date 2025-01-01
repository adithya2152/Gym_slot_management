"use client";
import ProfileCard from "@/components/profileCard";
import axios from "axios";
import { useEffect, useState } from "react";

interface PROFILE {
  username?: string;
  name?: string;
  email: string;
  age: number;
  weight?: number;
  height?: number;
}

 

export default function Profile() {
  const [profile, setProfile] = useState<PROFILE | null>(null);
  const [role, setRole] = useState<string | null>(null); // To store the role
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/getProfile");

        if (res.status === 200) {
          const { MemberData, TrainerData, AdminData, role } = res.data;

          // Set the correct profile data based on the role
          if (role === "member" && MemberData) {
            setProfile(MemberData);
          } else if (role === "trainer" && TrainerData) {
            setProfile(TrainerData);
          } else if (role === "admin" && AdminData) {
            setProfile(AdminData);
          }

          setRole(role); // Set the role
          setLoading(false);
          setError(null);
        } else {
          console.error("Error fetching profile:", res.data.error);
          setLoading(false);
          setError(res.data.error);
          throw new Error(res.data.error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile || !role) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  return (
    <div>
      <button onClick={() => window.location.href = "/" }>HOME</button>

      {/* Pass both profile and role as props to ProfileCard */}
      <ProfileCard profile={profile} role={role} />
    </div>
  );
}
