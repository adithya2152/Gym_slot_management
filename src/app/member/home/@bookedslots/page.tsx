"use client"
import Card from "@/components/dashCard"
import axios from "axios"
import toast , {Toaster} from "react-hot-toast"
import { useState ,useEffect } from "react"

import "@/styles/manage_slots.css";


interface SLOTS {
    sid: number;
    date: string;
    start_time: string;
    end_time: string;
  }
export default function BookedSlots()
{
    const [slots, setSlots] = useState<SLOTS[]>([])
    const [loading , setLoading] = useState(false)
    useEffect(()=>
    {
        const fetchSlots = async()=>
        {
            setLoading(true)
            try {
                
                const res = await axios.get("/member/home/getBookedSlots")

                if(res.status === 200)
                {
                    setSlots(res.data)

                }
                else
                {
                    toast.error(res.data.error)
                    throw new Error(res.data.error)
                }
            } catch (error) {
                
                if(axios.isAxiosError(error))
                {
                    toast.error(error.message);
                    console.error("eerror",error);
                    
                }
            }
            finally
            {
                setLoading(false)
            }
        }
        fetchSlots()
    },[])
    return (
        <Card>
            <div className = "container1">
                {loading && <div className="loader"></div>}
                <h1 className = "page-title">Booked Slots</h1>
                <button className="add-slot-btn" onClick={() => window.location.href = "/member/bookSlots"}>Book Slot</button>
                <div className="slots-list">
                    {slots.length > 0 ? (
                        <div className="table-container">
                            <table className="slots-table">
                                <thead>
                                    <tr >
                                        <th>Slot ID</th>
                                        <th>Date</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slots.map((slot) => (
                                        <tr key={slot.sid}>
                                            <td>{slot.sid}</td>
                                            <td>{slot.date}</td>
                                            <td>{slot.start_time}</td>
                                            <td>{slot.end_time}</td>
                                            <td>
                                                <button className="delete-slot-btn">Delete Booking</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ):
                    (
                        <p className="no-slots-message">NO Slots found </p>
                    )}


                </div>
                <Toaster />
                </div>
                
        </Card>
    )
}