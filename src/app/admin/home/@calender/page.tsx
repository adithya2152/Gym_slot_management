"use client";

import Card from "@/components/dashCard";
import { toast, Toaster } from "react-hot-toast";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import axios from "axios";

interface SLOTS {
  sid: number;
  isBooked: boolean;
  date: string;
  max_users: number;
  start_time: string;
  end_time: string;
}

export default function CalendarPage() {
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get("/admin/home/getSlots");
        if (res.status === 200) {
          setSlots(res.data);
        } else {
          toast.error(res.data.message || "Failed to fetch slots.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "An error occurred");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getTileClassName = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const slot = slots.find((slot) => slot.date === formattedDate);
    return slot ? (slot.isBooked ? "booked-slot" : "free-slot") : "";
  };

  return (
    <Card>
      <div className="calendar-container">
        {loading && <div className="loader"></div>}
        <h2>Calendar</h2>
        <Calendar tileClassName={getTileClassName} />
        <Toaster />
      </div>
    </Card>
  );
}
