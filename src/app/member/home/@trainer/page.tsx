"use client";
import Card from "@/components/dashCard";
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/trainerstyles.css"

interface Trainer {
  id: string;
  Trainer_name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
}

export default function Trainer() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/member/home/getTrainerBooked");
        if (res.status === 200) {
          if (res.data.message) {
            setError(res.data.message); // Handle "No trainer" message
          } else {
            setTrainer(res.data[0]); // Fetch trainer data if available
          }
        } else {
          console.error("Error:", res.data.error || "Failed to fetch trainer");
          setError(res.data.error || "Failed to fetch trainer");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, []);

  return (
    <Card >
        <div className="trainer-card">
              <h2 className="trainer-title">My Trainer</h2>
            {loading && <p className="loading-text">Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            {trainer ? (
                <div className="trainer-info">
                <p><strong>Name:</strong> {trainer.Trainer_name}</p>
                <p><strong>Email:</strong> {trainer.email}</p>
                <p><strong>Age:</strong> {trainer.age}</p>
                <p><strong>Weight:</strong> {trainer.weight} kg</p>
                <p><strong>Height:</strong> {trainer.height} cm</p>
                </div>
            ) : (
                !loading && !error && <p className="no-trainer-text">No trainer information available.</p>
            )}

        </div>
      
    </Card>
  );
}
