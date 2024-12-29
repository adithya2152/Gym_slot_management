"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "@/styles/manage_slots.css";

interface SLOTS {
  sid: number;
  date: string;
  start_time: string;
  end_time: string;
  max_alloc: number;
  isBooked: boolean;
  booked: number;
}

interface Dates {
  start_date: string;
  end_date: string;
}

export default function BookSlots() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [date, setDate] = useState<Dates>({
    start_date: "",
    end_date: "",
  });
  const [time, setTime] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(""); // Added filter state
  const [isBooking, setIsBooking] = useState<number | null>(null); // Track booking status for each slot
  const [selectedSlot, setSelectedSlot] = useState<number[]>([]);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        console.log("selected slot",selectedSlot);
        let url = "/api/getSpecificSlots"; // Base URL for slots

        // Apply filter only for valid cases
        if (filter === "date" && date.start_date) {
          url += `?start_date=${date.start_date}&end_date=${date.end_date}`;
        } else if (filter === "time" && time) {
          url += `?time=${time}`;
        } else if (filter === "Any" || !filter) {
          // Fetch all slots
        } else {
          return;
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
  }, [date, time, filter , selectedSlot]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, key: "start_date" | "end_date") => {
    setDate({ ...date, [key]: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleselectSlot = (sid: number) => {
    setSelectedSlot((prev) =>
      prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid]
    );
    console.log("Selected Slot IDs:", selectedSlot);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allAvailableSlotIds = slots.filter((slot) => !slot.isBooked).map((slot) => slot.sid);
      setSelectedSlot(allAvailableSlotIds);
    } else {
      setSelectedSlot([]);
    }
    console.log("Selected Slot IDs:", selectedSlot);
  };

  const handleSelectedSlotsBook = async() =>
  {
    setLoading(true);
    try {
      
      const res = await axios.post("/api/bookmultislot" , selectedSlot,{
        headers: {
          'Content-Type': 'application/json'
        }

      })

      if (res.status === 200) {
        toast.success(res.data.message);
        window.location.reload();
      }

      else
      {
        toast.error(res.data.error || "Failed to book slot");
        throw new Error(res.data.error || "Failed to book slot");
      }
    } catch (error) {
      
      if(axios.isAxiosError(error))
      {
        toast.error(error.message);
        console.error(error);
        
      }
    }
    finally {
      setLoading(false);
    }
  }


  const handleBookSlots = async (sid: number) => {
    if (isBooking === sid) {
      return;
    }

    setIsBooking(sid); // Mark the slot as being booked
    try {
      
      const res  = await axios.post("/api/bookslot" , sid , {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.status === 200) {
        toast.success(res.data.message);
        window.location.reload();
      }
      else
      {
        toast.error(res.data.error || "Failed to book slot");
        throw new Error(res.data.error || "Failed to book slot");
      }

  
    } catch (error) {
      
      if(axios.isAxiosError(error))
      {
        toast.error(error.message);
        console.error(error);
        
      }
    }
    finally {
      setIsBooking(null);
    }
  };

  return (
    <div className="container">
      {loading && <div className="loader"></div>}
      <h1 className="page-title">Slots</h1>
      <div className="filter-section">
        <button className="add-slot-btn" onClick={handleSelectedSlotsBook}>{loading ? "Booking..." : "Book Selected Slots"}</button>
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="" disabled>
            Filter
          </option>
          <option value="Any">All Slots</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>

        {filter === "date" && (
          <div>
            <label htmlFor="start_date"> Start Date </label>
            <input
              type="date"
              className="date-input"
              value={date.start_date}
              onChange={(e) => handleDateChange(e, "start_date")}
            />
            <label htmlFor="end_date"> End Date </label>
            <input
              type="date"
              className="date-input"
              value={date.end_date}
              onChange={(e) => handleDateChange(e, "end_date")}
            />
          </div>
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
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    id="select-all-checkbox"
                    checked={
                      selectedSlot.length ===
                      slots.filter((slot) => !slot.isBooked).length
                    }
                  />
                  <label htmlFor="select-all-checkbox"></label>
                </th>
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
                  <td>
                    <input
                      type="checkbox"
                      id={`slot-checkbox-${slot.sid}`} // Unique id
                      checked={selectedSlot.includes(slot.sid)}
                      disabled={slot.isBooked}
                      onChange={() => handleselectSlot(slot.sid)}
                    />
                    <label htmlFor={`slot-checkbox-${slot.sid}`}></label> {/* Link with input */}
                  </td>
                  <td>{slot.sid}</td>
                  <td>{slot.date}</td>
                  <td>{slot.start_time}</td>
                  <td>{slot.end_time}</td>
                  <td>{slot.max_alloc}</td>
                  <td>{slot.isBooked ? "Yes" : "No"}</td>
                  <td>{slot.booked}</td>
                  <td>
                    <button
                      className="edit-slot-btn"
                      onClick={() => handleBookSlots(slot.sid)}
                      disabled={isBooking === slot.sid || slot.isBooked}
                    >
                      {isBooking === slot.sid ? "Booking..." : "Book Slot"}
                    </button>
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
