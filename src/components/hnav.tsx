"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import "./nav.css";

type StyleProps = {
  style: string;
  onSelect?: (muscle: string) => void;
};

export default function Hnav(props: StyleProps) {
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedMuscle(selectedValue);

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
              <Link className="header" href="/">
                <Image src="/logo.png" alt="GymSync Logo" className="logo" width={50} height={50} />
                <h1>GymSync</h1>
              </Link>
            </div>

            <div className="nav-right">
              <select
                className="dropdown"
                value={selectedMuscle}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Muscle Type
                </option>
                <option value="Any">Show All</option>
                <option value="biceps">Biceps</option>
                <option value="abdominals">Abdominals</option>
                <option value="abductors">Abductors</option>
                <option value="back">Back</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="nav-left">
              <Link className="header" href="/">
                <Image src="/logo.png" alt="GymSync Logo" className="logo" width={50} height={50} />
                <h1>GymSync</h1>
              </Link>
            </div>
            <div className="nav-right">
              <Link href="/admin/login" className="admin-login-nav">
                Admin Login
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
