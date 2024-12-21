"use client"
import {useState} from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

interface MEMBERS{
id: string,
username: string,
email: string,
age: number,
weights: number
height: number,
}
 
export default function ManageUsers() {
    const [members, setMembers] = useState<MEMBERS[]>([]);
    const [loading , setLoading ] = useState(false);
    useEffect(()=>
    {
        const fetchMembers = async()=>
        {
            setLoading(true);

            try {

                const res = await axios.get("/api/getMembers");

                if(res.status === 200)
                 {
                    setMembers(res.data);
                 }
                else
                {
                    toast.error("Failed to fetch members");
                    throw new Error(res.data.message);
                }

            } catch (error) {
                if(axios.isAxiosError(error))
                {
                    console.log(error);
                    toast.error(error.response?.data?.message || "An error occurred");
                }
            }   
            finally
            {
                setLoading(false);
            }
        }
        fetchMembers();
    },[])
    return (
        <div>
            <Toaster />
            {loading && <div className="loader"></div>}
            <h1>Manage Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Weights</th>
                        <th>Height</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member)=>
                    (
                        <tr key={member.id}>
                            <td>{member.id}</td>
                            <td>{member.username}</td>
                            <td>{member.email}</td>
                            <td>{member.age}</td>
                            <td>{member.weights}</td>
                            <td>{member.height}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
