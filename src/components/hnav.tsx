"use client";
import Link from "next/link";
import { useState } from "react";
import "./nav.css";

type StyleProps = {
  style: string;
  onSelect?: (muscle: string) => void; // Optional prop
};

export default function Hnav(props: StyleProps) {
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedMuscle(selectedValue);

    // Call onSelect if it is provided
    if (props.onSelect) {
      props.onSelect(selectedValue);
    }
  };

   
  return (
    <div>
      <nav>
        {props.style === "exercise" ? (
          <>
            <div className="nav-left">
              <Link className="header" href="/home">
                <h1>GymSync</h1>
              </Link>
            </div>

            <div className="nav-right">
              <select
                className="dropdown"
                value={selectedMuscle}
                onChange={handleChange} // Attach only if onSelect is passed
              >
                <option value="" disabled>
                  Select Muscle Type
                </option>
                <option value="Any">Show All</option>
                <option value="biceps">Biceps</option>
                <option value="chest">Chest</option>
                <option value="legs">Legs</option>
                <option value="back">Back</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="nav-left">
              <Link className="header" href="/home">
                <h1>GymSync</h1>
              </Link>
            </div>
            <div className="nav-right">
              <Link href="/AdminLogin" className="admin-login-nav">
                Admin Login
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
