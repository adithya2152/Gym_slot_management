"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "@/styles/manage_user.css";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface Trainer {
  id: string;
  Trainer_name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
}

export default function BookTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getTrainer");

        if (res.status === 200) {
          setTrainers(res.data);
        } else {
          console.error("Failed to fetch trainers", res.data.error);
          setError(res.data.error);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const isTrainerBooked = async () => {
      try {
        const res = await axios.get("/api/isTrainerBooked");

        if (res.status === 200) {
          // Set disabled to true if a trainer is already booked
          setDisabled(res.data.tid !== null);
        } else {
          throw new Error(res.data.message || "An error occurred");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error);
          toast.error(error.response?.data?.message || "An error occurred");
        }
      }
    };

    fetchTrainers();
    isTrainerBooked();
  }, []);

  const handleBookTrainer = async (tid: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/bookTrainer",
        { tid },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        window.location.reload();
      } else {
        toast.error(res.data.error);
        throw new Error(res.data.error);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => setOpenDialog(false);

  return (
    <div>
      <h1 className="title">Book a Trainer</h1>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {disabled && (
            <p
              className="info-message"
              onClick={() => setOpenDialog(true)}
              style={{ cursor: "pointer", color: "#f00", fontWeight: "bold" }}
            >
              You can only book one trainer. Click for more info.
            </p>
          )}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Trainer Already Booked</DialogTitle>
            <DialogContent>
              <p>You have already booked a trainer. You can only book one trainer at a time.</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Trainer Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Weight</th>
                  <th>Height</th>
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
                    <td>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookTrainer(trainer.id)}
                        disabled={disabled}
                        style={{
                          backgroundColor: disabled ? "#ccc" : "#3f51b5",
                          color: disabled ? "#666" : "#fff",
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      >
                        Book
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
