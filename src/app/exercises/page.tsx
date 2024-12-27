"use client";
import Hnav from "@/components/hnav";
import { useEffect, useState } from "react";
import Exercise_Card from "@/components/exer_card";
import axios from "axios";
import "@/styles/exercise.css"; // Import the CSS file

interface Exercises {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercises[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muscle, setMuscle] = useState("");

  useEffect(() => {
    const get_exercises = async () => {
      setLoading(true);

      try {
        const queryMuscle = muscle === "Any" ? "" : muscle;

        const res = await axios.get(
          `https://api.api-ninjas.com/v1/exercises?muscle=${queryMuscle}`,
          {
            headers: {
              "X-Api-Key": "7Ys/hwZU4JHiw6PnKKkGGQ==zIo1cUyFvUzXW8f8",
            },
          }
        );

        if (res.status === 200) {
          setExercises(res.data);
        } else {
          throw new Error("Error fetching exercises");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "An error occurred");
        }
        console.error(error);
      } finally {
        setLoading(false);
        setError(null);
      }
    };
    get_exercises();
  }, [muscle]);

  const handleMuscleChange = (muscle: string) => {
    setMuscle(muscle);
  };

  return (
    <div className="exercise-page">
      <Hnav style="exercise" onSelect={handleMuscleChange} />
      <h1>Exercises</h1>

      {error && <p className="error">{error}</p>}
      {loading && <div className="loader"></div>}

      <div className="exercise-grid-container">
        {exercises.map((exer, index) => (
          <div key={index} className="exercise-card-container">
            <Exercise_Card {...exer} />
          </div>
        ))}
      </div>
    </div>
  );
}
