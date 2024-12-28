"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/dashCard";
import "@/app/admin/home/styles/slots.css"
interface Slot {
  sid: number;
  isBooked: boolean;
  date: string;
  max_users: number;
  start_time: string;
  end_time: string;
}

export default function Slots() {
  const [data, setData] = useState({
    totalSlots: 0,
    totalBookings: 0,
    freeSlots: 0,
    unfreeSlots: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data for bookings and slots using Axios
        const [bookingsResponse, slotsResponse] = await Promise.all([
          axios.get("/admin/home/getBookings"), // Endpoint for bookings
          axios.get("/admin/home/getTotalslots"), // Endpoint for slots
        ]);

        const bookings = bookingsResponse.data;
        const slots = slotsResponse.data;

        // Calculate free and unfree slots
        const totalSlots = slots.length;
        const unfreeSlots = slots.filter((slot: Slot) => slot.isBooked).length;
        const freeSlots = totalSlots - unfreeSlots;

        // Set data
        setData({
          totalSlots,
          totalBookings: bookings.length,
          freeSlots,
          unfreeSlots,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card>
      <div className="card">
        <h2>Slots</h2>
        <div className="stats">
          <p>
            Total Slots: <span>{data.totalSlots}</span>
          </p>
          <p>
            Total Bookings: <span>{data.totalBookings}</span>
          </p>
          <p>
            Free Slots: <span>{data.freeSlots}</span>
          </p>
          <p>
            Unfree Slots: <span>{data.unfreeSlots}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
