"use client";
import Card from "@/components/dashCard";
import axios from "axios";
import { useState, useEffect } from "react";
import "@/styles/goals.css"

interface Goals {
    goal: string;
    status: boolean;
    remark: string;
}

export default function MyGoals() {
    const [goals, setGoals] = useState<Goals[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/member/home/getGoals");
                if (res.status === 200) {
                    setGoals(res.data);
                } else {
                    console.error("Error:", res.data.error || "Failed to fetch goals");
                    throw new Error(res.data.error || "Failed to fetch goals");
                }
            } catch (error) {
                console.error("An error occurred while fetching goals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    return (
        <Card >
            <div className="Card">
                <h2>My Goals</h2>
                {/* Show loader while loading */}
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : goals.length > 0 ? (
                    <div className="Goals-container">
                        {goals.map((goal, index) => (
                            <div key={index} className="Goal-item">
                                <h3>Goal: {goal.goal}</h3>
                                <p>Status: {goal.status ? "Completed" : "Not Completed"}</p>
                                <p>Remark: {goal.remark}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="No-goals-message">Ask the respective trainer to set goals.</p>
                )}
            </div>
        </Card>
    );
}
