import React from "react";

import "@/styles/profileCard.css";
interface PROFILE {
  username?: string;
  name?: string;
  email: string;
  age: number;
  weight?: number;
  height?: number;
}

interface ProfileCardProps {
  profile: PROFILE;
  role: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, role }) => {
  const isAdmin = role === "admin";

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2 className="profile-header">
          {isAdmin ? "Admin Profile" : "Member Profile"}
        </h2> 
        <p>
          <strong>Name:</strong> {profile.username || profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Age:</strong> {profile.age}
        </p>
        {!isAdmin && profile.weight !== undefined && profile.height !== undefined && (
          <>
            <p>
              <strong>Weight:</strong> {profile.weight} kg
            </p>
            <p>
              <strong>Height:</strong> {profile.height} cm
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
