"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "@/styles/manage_user.css"   


interface TRAINERS {
    id: string;
    Trainer_name: string;
    email: string;
    age: number;
    weight: number;
    height: number;
    status: string;
}

export default function Trainers() {
    const [trainers, setTrainers] = useState<TRAINERS[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTrainers = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/getTrainer");
                if (res.status === 200) {
                    setTrainers(res.data);
                } else {
                    toast.error("Failed to fetch trainers");
                    throw new Error(res.data.message);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    toast.error(error.response?.data?.message || "An error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTrainers();
     
    }, []);

    const deleteTrainer = async(id: string) => {
        setLoading(true);
        try {
            
            const res = await axios.delete(`/api/deleteTrainer/${id}`);
            if (res.status === 200) {
                
                toast.success("Trainer deleted successfully");
                setTrainers((prevTrainers) => prevTrainers.filter((trainer) => trainer.id!== id));
            }
            else {
                toast.error("Failed to delete trainer");
                throw new Error("Failed to delete trainer");
            }
        } catch (error) {
            if(axios.isAxiosError(error))
            {
                console.error("Delete Error:", error);
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
        finally {
            setLoading(false);
    
        }
    }
    return (
        <div>
            {loading && <div className="loader"></div>}
            <h1 className="title">Trainers</h1>
            <button className="add-user-btn">Add Trainer</button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Trainer Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Weight</th>
                        <th>Height</th>
                        <th>Status</th>
                        <th>Action</th>
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
                            <td>{trainer.status}</td>
                            <td>
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn"
                                    onClick={() => deleteTrainer(trainer.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
             <Toaster />
        </div>
    );
}

     
