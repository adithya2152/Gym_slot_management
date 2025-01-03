"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/manage_user.css";
interface Trainer{
    id: string;
    Trainer_name: string;
    email: string;
    age: number;
    weight: number;
    height: number;
}

export default function BookTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getTrainer");

        if (res.status === 200) {
          setTrainers(res.data);
        } else {
          console.error("Failed to fetch trainers", res.data.error);
          setError(res.data.error);
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

    fetchTrainers();
  }, []);

  return (
    <div>
      <h1 className="title">Book a Trainer</h1>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="table-container">
             <table className="user-table">
                <thead>
                    <tr>
                    <th>Trainer Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Weight</th>
                    <th>Height</th>
                    </tr>
                </thead>
                <tbody>
                    {trainers.map((trainer) => (
                    <tr key={trainer.id}>
                        <td>{trainer.Trainer_name}</td>
                        <td>{trainer.email}</td>
                        <td>{trainer.age}</td>
                        <td>{trainer.weight}</td>
                        <td>{trainer.height}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
       
      )}
    </div>
  )
}
