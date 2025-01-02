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

  // Helper functions to calculate metrics
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100; // Convert cm to meters
    return (weight / (heightInMeters ** 2)).toFixed(2); // Round to 2 decimal places
  };

  const calculateBSA = (weight: number, height: number) => {
    // DuBois and DuBois formula
    return (0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725)).toFixed(2);
  };

  const calculatePI = (weight: number, height: number) => {
    const heightInMeters = height / 100; // Convert cm to meters
    return (weight / Math.pow(heightInMeters, 3)).toFixed(2);
  };

  // Calculate metrics if weight and height are provided
  const weight = profile.weight;
  const height = profile.height;

  const metrics =
    weight !== undefined && height !== undefined
      ? {
          BMI: calculateBMI(weight, height),
          BSA: calculateBSA(weight, height),
          PI: calculatePI(weight, height),
        }
      : null;

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
        {!isAdmin && weight !== undefined && height !== undefined && (
          <>
            <p>
              <strong>Weight:</strong> {weight} kg
            </p>
            <p>
              <strong>Height:</strong> {height} cm
            </p>
            <div className="calculated-metrics">
              <p>
                <strong>BMI:</strong> {metrics?.BMI}
              </p>
              <p>
                <strong>BSA:</strong> {metrics?.BSA} m²
              </p>
              <p>
                <strong>PI:</strong> {metrics?.PI}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
