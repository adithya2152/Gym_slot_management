  "use client";
  import React, { useState, useEffect } from "react";

  import axios from "axios";
  import toast, { Toaster } from "react-hot-toast";
  import "@/styles/manage_slots.css";
  import FormDialog from "@/components/formDialog";
  import {
    Button,
    Dialog,
    DialogActions,  
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    CssBaseline,
  } from "@mui/material";
  import {createTheme , ThemeProvider} from "@mui/material/styles"

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#aaaaaa",
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
    },
  });
  
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


    const [multipleSlotDialog , setMultipleSlotDialog] = useState(false)
    const [multiSlotData, setMultiSlotData] = useState({
      start_date: "",
      end_date: "",
      slot_count: 1,
      first_start_time: "",
      slot_duration: "01:00:00",
      max_alloc: 1,
    });

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
    const handleMultipleSlotOpen = () => {
      setMultipleSlotDialog(true);
    }

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleMultipleSlotClose = () => {
      setMultipleSlotDialog(false);
    }

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

    const handleMultislotEntry = async()=>
    {
      setLoading(true);
      try {
        
        const res  = await axios.post("/api/insertmultislot",multiSlotData,{
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if(res.status === 201)
          {
            toast.success("Multiple slots added successfully")
            window.location.reload()
            setMultiSlotData({
              start_date: "",
              end_date: "",
              slot_count: 1,
              first_start_time: "",
              slot_duration: "01:00:00",
              max_alloc: 1,
            })
            handleMultipleSlotClose()
          } else {
            toast.error("Failed to add multiple slots")
            handleMultipleSlotClose()
            setMultiSlotData({
              start_date: "",
              end_date: "",
              slot_count: 1,
              first_start_time: "",
              slot_duration: "01:00:00",
              max_alloc: 1,
            })
            throw new Error("Failed to add multiple slots")
          }


      } catch (error) {
        
        if(axios.isAxiosError(error))
          {
            toast.error(error.response?.data?.message || "An error occurred")
            console.error(error)
          }

      }
      finally {
        setLoading(false)
      }

    }

    return (
      <div className="container">
        {loading && <div className="loader"></div>}
        <h1 className="page-title">Slots</h1>
        <div className="filter-section">
          <Button className="add-slot-btn" onClick={handleDialogOpen}>
            Add Slot
          </Button>
          <Button className="add-slot-btn" onClick={handleMultipleSlotOpen}>Add Multiple Slots</Button>
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
            <div className="table-container">
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
            </div>
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

        <ThemeProvider theme={darkTheme}>
          <CssBaseline/>
        
        <Dialog 
          open={multipleSlotDialog}
          onClose={() => setMultipleSlotDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: "background.paper",
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              padding: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Add Multiple Slots
          </DialogTitle>
          
          <DialogContent>
            <DialogContentText
              sx={{
                mb: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              Fill in the details for adding multiple slots.
            </DialogContentText>
            
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={multiSlotData.start_date}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, start_date: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={multiSlotData.end_date}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, end_date: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Number of Slots Per Day"
              type="number"
              value={multiSlotData.slot_count}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, slot_count: Number(e.target.value) })
              }
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="First Slot Start Time"
              type="time"
              value={multiSlotData.first_start_time}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, first_start_time: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Slot Duration (HH:MM:SS)"
              type="text"
              value={multiSlotData.slot_duration}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, slot_duration: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Max Allocations Per Slot"
              type="number"
              value={multiSlotData.max_alloc}
              onChange={(e) =>
                setMultiSlotData({ ...multiSlotData, max_alloc: Number(e.target.value) })
              }
              sx={{ mb: 2 }}
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleMultipleSlotClose}>Cancel</Button>
            <Button
              onClick={handleMultislotEntry}
            >
              {loading?"Adding...":"Add"}
            </Button>
          </DialogActions>
        </Dialog>
        </ThemeProvider>
      </div>
    );
  }
