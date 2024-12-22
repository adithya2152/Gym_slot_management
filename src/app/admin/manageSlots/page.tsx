// "use client";

// import React, { useState } from "react";
// import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";

// // Sample slots data for demonstration
// const sampleSlots = [
//   { slot_id: 1, date: "2024-12-23", start_time: "08:00", end_time: "09:00", max_users: 10, booked_users: 10, status: true },
//   { slot_id: 2, date: "2024-12-23", start_time: "09:00", end_time: "10:00", max_users: 15, booked_users: 8, status: false },
// ];

// export default function ManageSlots() {
//   const [slots, setSlots] = useState(sampleSlots); // State to hold slots
//   const [filterDate, setFilterDate] = useState(""); // State for filtering by date
//   const [openModal, setOpenModal] = useState(false); // State for modal
//   const [newSlot, setNewSlot] = useState({
//     date: "",
//     start_time: "",
//     end_time: "",
//     max_users: "",
//   });

//   // Filter slots by date
//   const filteredSlots = filterDate
//     ? slots.filter((slot) => slot.date === filterDate)
//     : slots;

//   // Handle modal open/close
//   const handleOpenModal = () => setOpenModal(true);
//   const handleCloseModal = () => setOpenModal(false);

//   // Add new slot
//   const handleAddSlot = () => {
//     const slotId = slots.length ? slots[slots.length - 1].slot_id + 1 : 1;
//     const newSlotData = {
//       slot_id: slotId,
//       date: newSlot.date,
//       start_time: newSlot.start_time,
//       end_time: newSlot.end_time,
//       max_users: parseInt(newSlot.max_users),
//       booked_users: 0,
//       status: false,
//     };
//     setSlots([...slots, newSlotData]);
//     handleCloseModal();
//   };

//   // Delete a slot
//   const handleDeleteSlot = (slotId:number) => {
//     const updatedSlots = slots.filter((slot) => slot.slot_id !== slotId);
//     setSlots(updatedSlots);
//   };

//   // Update a slot (stub for editing functionality)
//   const handleEditSlot = (slotId: number) => {
//     alert(`Edit functionality for slot ID ${slotId} is not implemented yet.`);
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Manage Slots
//       </Typography>

//       {/* Filter by Date */}
//       <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
//         <TextField
//           type="date"
//           label="Filter by Date"
//           InputLabelProps={{ shrink: true }}
//           value={filterDate}
//           onChange={(e) => setFilterDate(e.target.value)}
//         />
//         <Button variant="contained" onClick={() => setFilterDate("")}>
//           Show All
//         </Button>
//       </Box>

//       {/* Display Slots */}
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Slot ID</TableCell>
//             <TableCell>Date</TableCell>
//             <TableCell>Start Time</TableCell>
//             <TableCell>End Time</TableCell>
//             <TableCell>Max Users</TableCell>
//             <TableCell>Booked Users</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {filteredSlots.map((slot) => (
//             <TableRow
//               key={slot.slot_id}
//               sx={{
//                 backgroundColor: slot.status ? "rgba(255, 0, 0, 0.2)" : "transparent",
//               }}
//             >
//               <TableCell>{slot.slot_id}</TableCell>
//               <TableCell>{slot.date}</TableCell>
//               <TableCell>{slot.start_time}</TableCell>
//               <TableCell>{slot.end_time}</TableCell>
//               <TableCell>{slot.max_users}</TableCell>
//               <TableCell>{slot.booked_users}</TableCell>
//               <TableCell>{slot.status ? "Full" : "Available"}</TableCell>
//               <TableCell>
//                 <Button onClick={() => handleEditSlot(slot.slot_id)} color="primary">
//                   Edit
//                 </Button>
//                 <Button onClick={() => handleDeleteSlot(slot.slot_id)} color="error">
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Add Slot Button */}
//       <Box sx={{ mt: 4 }}>
//         <Button variant="contained" onClick={handleOpenModal}>
//           Add New Slot
//         </Button>
//       </Box>

//       {/* Add Slot Modal */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             p: 4,
//             borderRadius: 2,
//             boxShadow: 24,
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Add New Slot
//           </Typography>
//           <TextField
//             fullWidth
//             label="Date"
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             value={newSlot.date}
//             onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Start Time"
//             type="time"
//             InputLabelProps={{ shrink: true }}
//             value={newSlot.start_time}
//             onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="End Time"
//             type="time"
//             InputLabelProps={{ shrink: true }}
//             value={newSlot.end_time}
//             onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Max Users"
//             type="number"
//             value={newSlot.max_users}
//             onChange={(e) => setNewSlot({ ...newSlot, max_users: e.target.value })}
//             sx={{ mb: 2 }}
//           />
//           <Button variant="contained" onClick={handleAddSlot} fullWidth>
//             Add Slot
//           </Button>
//         </Box>
//       </Modal>
//     </Box>
//   );
// }
