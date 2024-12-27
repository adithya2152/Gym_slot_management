"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
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
import "@/styles/manage_user.css";
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


interface TRAINERS {
  id: string;
  Trainer_name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  status: string;
}

export default function Trainers() {
  const [trainers, setTrainers] = useState<TRAINERS[]>([]);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    Trainer_name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    max_mem: "",
  });
  
  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getTrainer");
        if (res.status === 200) {
          setTrainers(res.data);
        } else {
          toast.error("Failed to fetch trainers");
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
    fetchTrainers();
  }, []);

  const deleteTrainer = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.delete(`/api/deleteTrainer/${id}`);
      if (res.status === 200) {
        toast.success("Trainer deleted successfully");
        setTrainers((prevTrainers) =>
          prevTrainers.filter((trainer) => trainer.id !== id)
        );
      } else {
        toast.error("Failed to delete trainer");
        throw new Error("Failed to delete trainer");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Delete Error:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const addTrainer = async() =>
  {
    setLoading(true);
    try {
      const res = await axios.post("/api/insertTrainer", newTrainer);
      if (res.status === 201) {
        toast.success("Trainer added successfully");
        window.location.reload();
        setDialogOpen(false);
        setNewTrainer({
          Trainer_name: "",
          email: "",
          age: "",
          weight: "",
          height: "",
          max_mem: "",
        });
      } else {
        toast.error("Failed to add trainer");
        setDialogOpen(false);
        setNewTrainer({
          Trainer_name: "",
          email: "",
          age: "",
          weight: "",
          height: "",
          max_mem: "",
        });

        throw new Error(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Add Error:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }

  }
  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline/>
    
    <div>
      {loading && <div className="loader"></div>}
      <h1 className="title">Trainers</h1>
      <button className="add-user-btn" onClick={() => setDialogOpen(true)}>Add Trainer</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Trainer Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Weight</th>
            <th>Height</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer) => (
            <tr key={trainer.id}>
              <td>{trainer.Trainer_name}</td>
              <td>{trainer.email}</td>
              <td>{trainer.age}</td>
              <td>{trainer.weight}</td>
              <td>{trainer.height}</td>
              <td>{trainer.status}</td>
              <td>
                {/* <button className="edit-btn">Edit</button> */}
                <button
                  className="delete-btn"
                  onClick={() => deleteTrainer(trainer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
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
        >Add Trainer</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              mb:2,
              textAlign: "center",
              color: "text.secondary",
            }}
            >
              Fill in the details of the new trainer below.
            </DialogContentText>

            <TextField
              autoFocus
              required
              margin="dense"
              label="Trainer Name"
              fullWidth
              variant="outlined"
              value={newTrainer.Trainer_name}
              onChange={(e) =>
                setNewTrainer({...newTrainer, Trainer_name: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              value={newTrainer.email}
              onChange={(e) =>
                setNewTrainer({ ...newTrainer, email: e.target.value })
              }
            />
            <TextField
              required
              margin="dense"
              label="Age"
              fullWidth
              variant="outlined"
              value={newTrainer.age}
              onChange={(e) =>
                setNewTrainer({ ...newTrainer, age: e.target.value })
              }
              type="number"
            />

            <TextField
              required
              margin="dense"
              label="Weight"
              fullWidth
              variant="outlined"
              value={newTrainer.weight}
              onChange={(e) =>
                setNewTrainer({ ...newTrainer, weight: e.target.value })
              }
              type="number"
            />

            <TextField
              required
              margin="dense"
              label="Height"
              fullWidth
              variant="outlined"
              value={newTrainer.height}
              onChange={(e) =>
                setNewTrainer({...newTrainer, height: e.target.value })
              }
              type="number"
            />
             
            <TextField
              required
              margin="dense"
              label="Max. Members"
              fullWidth
              variant="outlined"
              value={newTrainer.max_mem}
              onChange={(e) =>
                setNewTrainer({...newTrainer, max_mem: e.target.value })
              }
              type="number"
            />
        </DialogContent>
        <DialogActions
        sx={{
          justifyContent: "center",
        }}
        >
         <Button
              onClick={() => setDialogOpen(false)}
              sx={{
                color: "text.secondary",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                padding: "6px 16px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addTrainer}
              sx={{
                color: "#ffffff",
                backgroundColor: "#3f51b5",
                borderRadius: "8px",
                padding: "6px 16px",
                "&:hover": {
                  backgroundColor: "#2c387e",
                },
              }}
            >
              {loading?"Adding...": "Add"}
            </Button>
        </DialogActions>

      </Dialog>
      <Toaster />
    </div>
    </ThemeProvider>
  );
}
