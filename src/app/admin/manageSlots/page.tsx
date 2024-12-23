"use client"
import axios from "axios";  
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "@/styles/manage_slots.css"

interface SLOTS {
  sid: number;
  date: string;
  start_time: string;
  end_time: string;
  max_alloc: number;
  isBooked: boolean;
  booked: number;
}

export default function Slots() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(''); // Added filter state

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        let url = '/api/getSlots'; // Base URL for slots

        // Apply filter if provided (date or time)
        if (filter === 'date' && date) {
          url += `?date=${date}`;
        } else if (filter === 'time' && time) {
          url += `?time=${time}`;
        }

        const res = await axios.get(url);
        if(res.status === 200) {
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
  }, [date, time, filter]); // Dependencies to refetch when filter, date, or time changes

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  return (
    <div className="container">
      {loading && <div className="loader"></div>}
      <h1 className="page-title">Slots</h1>
      <div className="filter-section">
        <button className="add-slot-btn">Add Slot</button>
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="" disabled>Filter</option>
          <option value="Any">All Slots</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>

        {filter === 'date' && (
          <input type="date" className="date-input" value={date || ''} onChange={handleDateChange} />
        )}

        {filter === 'time' && (
          <input type="time" className="time-input" value={time || ''} onChange={handleTimeChange} />
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
              <tr key={slot.sid} className={slot.isBooked ? "is-booked-slot" : ""}>
                <td>{slot.sid}</td>
                <td>{slot.date}</td>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>{slot.max_alloc}</td>
                <td>{slot.isBooked ? 'Yes' : 'No'}</td>
                <td>{slot.booked}</td>
                <td>
                  <button className ="delete-slot-btn">Delete Slot</button>
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
    </div>
  );
}
