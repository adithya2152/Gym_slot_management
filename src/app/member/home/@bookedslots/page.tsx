"use client";

import Card from "@/components/dashCard";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

import "@/styles/manage_slots.css";

interface SLOTS {
  sid: number;
  date: string;
  start_time: string;
  end_time: string;
}

export default function BookedSlots() {
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState<number | null>(null); // Tracks the slot being deleted

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/member/home/getBookedSlots");
        if (res.status === 200) {
          setSlots(res.data);
        } else {
          toast.error(res.data.error || "Failed to fetch slots.");
          throw new Error(res.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
          console.error("Error fetching slots:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleDeleteSlot = (slotId: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this slot?"
    );
    if (!confirm) return;

    const deleteSlot = async () => {
      setDeletingSlot(slotId); // Set the slot being deleted
      try {
        const res = await axios.delete(`/api/deleteBookedSlot/${slotId}`);
        if (res.status === 200) {
          toast.success(res.data.message || "Slot deleted successfully.");
          setSlots((prev) => prev.filter((slot) => slot.sid !== slotId)); // Update state after deletion
        } else {
          toast.error(res.data.error || "Failed to delete slot.");
          throw new Error(res.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.message);
          console.error("Error deleting slot:", error);
        }
      } finally {
        setDeletingSlot(null); // Reset the deleting slot state
      }
    };

    deleteSlot();
  };

  return (
    <Card>
      <div className="container1">
        {loading && <div className="loader"></div>} {/* Loader during data fetching */}
        <h1 className="page-title">Booked Slots</h1>
        <button
          className="add-slot-btn"
          onClick={() => (window.location.href = "/member/bookSlots")}
        >
          Book Slot
        </button>
        <div className="slots-list">
          {slots.length > 0 ? (
            <div className="table-container">
              <table className="slots-table">
                <thead>
                  <tr>
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
                        <button
                          className="delete-slot-btn"
                          onClick={() => handleDeleteSlot(slot.sid)}
                          disabled={deletingSlot === slot.sid} // Disable button while deleting
                        >
                          {deletingSlot === slot.sid ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-slots-message">No slots found.</p>
          )}
        </div>
        <Toaster />
      </div>
    </Card>
  );
}
