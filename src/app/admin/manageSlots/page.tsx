"use client";
import React, { useState, useEffect } from "react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "@/styles/manage_slots.css";
import FormDialog from "@/components/formDialog";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface SLOTS {
  sid: number;
  date: string;
  start_time: string;
  end_time: string;
  max_alloc: number;
  isBooked: boolean;
  booked: number;
}

interface formdata {
  date: string;
  start_time: string;
  end_time: string;
  max_alloc: number;
}

export default function Slots() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        let url = "/api/getSlots";

        if (filter === "date" && date) {
          url += `?date=${date}`;
        } else if (filter === "time" && time) {
          url += `?time=${time}`;
        }

        const res = await axios.get(url);
        if (res.status === 200) {
          setSlots(res.data);
        } else {
          toast.error("Failed to fetch slots");
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

    fetchSlots();
  }, [date, time, filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmDialogOpen = (slotId: number) => {
    setSelectedSlotId(slotId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setSelectedSlotId(null);
    setConfirmDialogOpen(false);
  };

  const handleDeleteSlot = async () => {
    if (!selectedSlotId) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/api/deleteSlot/${selectedSlotId}`);
      if (res.status === 200) {
        toast.success("Slot deleted successfully");
        setSlots(slots.filter((slot) => slot.sid !== selectedSlotId));
        handleConfirmDialogClose();
      } else {
        toast.error("Failed to delete slot");
        throw new Error("Failed to delete slot");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: formdata) => {
    setLoading(true);
    try {
      console.log("Received data from component", data);

      const res = await axios.post(
        "/api/insertSlots",
        { data },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Slot added successfully");
        window.location.reload();
        handleDialogClose();
      } else {
        toast.error("Failed to add slot");
        throw new Error("Failed to add slot");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && <div className="loader"></div>}
      <h1 className="page-title">Slots</h1>
      <div className="filter-section">
        <Button className="add-slot-btn" onClick={handleDialogOpen}>
          Add Slot
        </Button>
        <Button className="add-slot-btn">Add Multiple Slots</Button>
        <select
          className="filter-select"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="" disabled>
            Filter
          </option>
          <option value="Any">All Slots</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>

        {filter === "date" && (
          <input
            type="date"
            className="date-input"
            value={date || ""}
            onChange={handleDateChange}
          />
        )}

        {filter === "time" && (
          <input
            type="time"
            className="time-input"
            value={time || ""}
            onChange={handleTimeChange}
          />
        )}
      </div>

      <div className="slots-list">
        {slots.length > 0 ? (
          <table className="slots-table">
            <thead>
              <tr>
                <th>Slot ID</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Max Alloc</th>
                <th>Is Booked</th>
                <th>Booked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr
                  key={slot.sid}
                  className={slot.isBooked ? "is-booked-slot" : ""}
                >
                  <td>{slot.sid}</td>
                  <td>{slot.date}</td>
                  <td>{slot.start_time}</td>
                  <td>{slot.end_time}</td>
                  <td>{slot.max_alloc}</td>
                  <td>{slot.isBooked ? "Yes" : "No"}</td>
                  <td>{slot.booked}</td>
                  <td>
                    <Button
                      className="delete-slot-btn"
                      onClick={() => handleConfirmDialogOpen(slot.sid)}
                    >
                      Delete Slot
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-slots-message">No slots available</p>
        )}
      </div>
      <Toaster />
      <FormDialog open={dialogOpen} handleClose={handleDialogClose} Submit={handleSubmit} />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this slot? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button color="error" onClick={handleDeleteSlot}>
          {loading ? "Deleting...":"Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
