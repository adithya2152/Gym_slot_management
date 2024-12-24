"use client"
import { useState } from 'react';

// Define types for the slots and bookings
type Slot = {
  date: string;
  time: string;
};

const SlotBookingPage = () => {
  // State for selected slot, booked slots, and multi-day bookings
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Slot[]>([]);
  const [multiDay, setMultiDay] = useState<boolean>(false);

  // Sample available slots (you can replace this with your API data)
  const availableSlots: Slot[] = [
    { date: "2024-12-25", time: "9:00 AM - Yoga Class" },
    { date: "2024-12-25", time: "11:00 AM - Treadmill" },
    { date: "2024-12-26", time: "9:00 AM - Yoga Class" },
    { date: "2024-12-26", time: "12:00 PM - Weight Room" },
    { date: "2024-12-27", time: "3:00 PM - Cardio" }
  ];

  // Handle slot selection
  const handleSlotSelection = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  // Handle booking the slot
  const handleBookSlot = () => {
    if (selectedSlot) {
      setBookedSlots([...bookedSlots, selectedSlot]);
      alert(`Booked: ${selectedSlot.time} on ${selectedSlot.date}`);
      setSelectedSlot(null); // Reset selected slot after booking
    } else {
      alert("Please select a slot first!");
    }
  };

  // Handle canceling a booking
  const handleCancelBooking = (index: number) => {
    const newBookedSlots = [...bookedSlots];
    newBookedSlots.splice(index, 1);
    setBookedSlots(newBookedSlots);
  };

  // Handle multi-day booking
  const handleMultiDayBooking = () => {
    if (multiDay && selectedSlot) {
      const multiDayBookings = availableSlots.filter(slot => slot.time === selectedSlot.time);
      setBookedSlots([...bookedSlots, ...multiDayBookings]);
      alert(`Booked ${selectedSlot.time} for multiple days.`);
      setMultiDay(false);
      setSelectedSlot(null);
    }
  };

  return (
    <div className="container">
      <h1>Slot Booking</h1>

      {/* Slot List (Upcoming Dates and Times) */}
      <div className="slot-list">
        <h3>Available Slots</h3>
        {availableSlots.map((slot, index) => (
          <div
            key={index}
            className={`slot-item ${selectedSlot?.time === slot.time && selectedSlot?.date === slot.date ? "selected" : ""}`}
            onClick={() => handleSlotSelection(slot)}
          >
            <p>{slot.date} - {slot.time}</p>
          </div>
        ))}
      </div>

      {/* Book or Cancel Slot */}
      {selectedSlot && !bookedSlots.includes(selectedSlot) && (
        <button onClick={handleBookSlot}>Book Slot</button>
      )}

      {/* Multi-day Booking Option */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={multiDay}
            onChange={() => setMultiDay(!multiDay)}
          />
          Book for Multiple Days (same slot)
        </label>
        {multiDay && (
          <button onClick={handleMultiDayBooking}>Confirm Multi-Day Booking</button>
        )}
      </div>

      {/* Your Booked Slots */}
      <h3>Your Bookings</h3>
      {bookedSlots.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookedSlots.map((booking, index) => (
            <li key={index}>
              {booking.time} on {booking.date}
              <button onClick={() => handleCancelBooking(index)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SlotBookingPage;
