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

export default function BookSlots() {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<SLOTS[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>(''); // Added filter state
  const [isBooking, setIsBooking] = useState<number | null>(null); // Track booking status for each slot

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        let url = "/api/getSpecificSlots"; // Base URL for slots
  
        // Apply filter only for valid cases
        if (filter === "date" && date) {
          url += `?date=${date}`;
        } else if (filter === "time" && time) {
          url += `?time=${time}`;
        } else if (filter === "Any" || !filter) {
          // Do nothing to the URL; fetch all slots
          console.log("Fetching all slots with no filters");
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

  const handleBookSlots = async (sid: number) => {
    if (isBooking === sid) {
      return;  
    }

    setIsBooking(sid); // Mark the slot as being booked
    try {
      const res = await axios.put("/api/updateSlotBook", sid, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) 
      {
        try {
          
          const resp = await axios.post("/api/insertBooking" , sid , {
            headers: {
              "Content-Type": "application/json",
            },
          })

          if(resp.status === 201)
          {
            toast.success("Slot Booked Successfully");
            window.location.reload();
          }

          else{
            throw new Error("Failed to book slot");
          }
        } catch (error) {
          
          if(axios.isAxiosError(error))
          {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
          }
        }
      } else {
        toast.error("Failed to book slot");
        throw new Error("Failed to book slot");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsBooking(null); // Reset the booking status
    }
  };

  return (
    <div className="container">
      {loading && <div className="loader"></div>}
      <h1 className="page-title">Slots</h1>
      <div className="filter-section">
        <button className="add-slot-btn">Book Multiple Slot</button>
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
                <tr key={slot.sid} className={slot.isBooked ? "disable" : ""}>
                  <td>{slot.sid}</td>
                  <td>{slot.date}</td>
                  <td>{slot.start_time}</td>
                  <td>{slot.end_time}</td>
                  <td>{slot.max_alloc}</td>
                  <td>{slot.isBooked ? 'Yes' : 'No'}</td>
                  <td>{slot.booked}</td>
                  <td>
                    <button
                      className="edit-slot-btn"
                      onClick={() => handleBookSlots(slot.sid)}
                      disabled={isBooking === slot.sid || slot.isBooked} // Disable button if already being booked or booked
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
