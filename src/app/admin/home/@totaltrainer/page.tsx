"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/dashCard";
import "@/app/admin/home/styles/slots.css"

export default function Member() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await axios.get("/admin/home/trainercount");
        setMemberCount(response.data.count);
      } catch (err) {
        console.error("Error fetching trainers  count:", err);
        setError("Failed to fetch member count");
      }
    };

    fetchMemberCount();
  }, []);

  return (
    <Card>
      <div className="card">
        <h2>Members Count</h2>
        {error ? (
          <div className="stats"><p className="text-red-500">{error}</p></div>
        ) : memberCount !== null ? (
         <div className="stats"><p>Number of trainers: <span>{memberCount}</span></p></div> 
        ) : (
          <p>Loading...</p>
        )}
      </div>
       
    </Card>
  );
}
