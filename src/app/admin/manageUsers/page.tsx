"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "@/styles/manage_user.css"

interface MEMBERS {
    id: string;
    username: string;
    email: string;
    age: number;
    weights: number;
    height: number;
}

export default function ManageUsers() {
    const [members, setMembers] = useState<MEMBERS[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/getMembers");
                if (res.status === 200) {
                    setMembers(res.data);
                } else {
                    toast.error("Failed to fetch members");
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
        fetchMembers();
    }, []); 

    const deleteMember = async (id: string) => {
        setLoading(true);
        try {
            const res = await axios.delete("/api/deleteMember/" + id);
            if (res.status === 200) {
                toast.success("Member deleted successfully");
                setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
            } else {
                toast.error("Failed to delete member");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Delete Error:", error);
                toast.error(error.response?.data?.message || "An error occurred");
            }
        }
        finally {
            setLoading(false);
        }       
    };

    return (
        <div className="container">
            <Toaster />
            {loading && <div className="loader"></div>}
            <h1 className="title">Manage Users</h1>
            <button className="add-user-btn">Add User</button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Weights</th>
                        <th>Height</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>{member.username}</td>
                            <td>{member.email}</td>
                            <td>{member.age}</td>
                            <td>{member.weights}</td>
                            <td>{member.height}</td>
                            <td>
                                <button
                                    onClick={() => deleteMember(member.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
