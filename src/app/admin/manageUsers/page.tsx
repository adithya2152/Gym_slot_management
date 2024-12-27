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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@/styles/manage_user.css";

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

interface MEMBERS {
  id: string;
  username: string;
  email: string;
  age: number;
  weight: number;
  height: number;
}

export default function ManageUsers() {
  const [members, setMembers] = useState<MEMBERS[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    username: "",
    email: "",
    age: "",
    weights: "",
    height: "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getMembers");
        if (res.status === 200) {
          setMembers(res.data);
        } else {
          toast.error("Failed to fetch members");
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
    fetchMembers();
  }, []);

  const deleteMember = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.delete("/api/deleteMember/" + id);
      if (res.status === 200) {
        toast.success("Member deleted successfully");
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );
      } else {
        toast.error("Failed to delete member");
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

  const addMember = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/insertMember", newMember);
      if (res.status === 201) {
        toast.success("Member added successfully");
        window.location.reload();
        setDialogOpen(false);
        setNewMember({
          username: "",
          email: "",
          age: "",
          weights: "",
          height: "",
        });
      } else {
        toast.error("Failed to add member");
        setDialogOpen(false);
        setNewMember({
            username: "",
            email: "",
            age: "",
            weights: "",
            height: "",
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
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="container">
        <Toaster />
        {loading && <div className="loader"></div>}
        <h1 className="title">Manage Users</h1>
        <button
          className="add-user-btn"
          onClick={() => setDialogOpen(true)}
        >
          Add User
        </button>
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Age</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.username}</td>
                <td>{member.email}</td>
                <td>{member.age}</td>
                <td>{member.weight}</td>
                <td>{member.height}</td>
                <td>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="delete-btn"
                  >
                    {loading ? "Deleting..." : "Delete"}
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
          >
            Add User
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                mb: 2,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              Fill in the details of the new user below.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              label="Username"
              fullWidth
              variant="outlined"
              value={newMember.username}
              onChange={(e) =>
                setNewMember({ ...newMember, username: e.target.value })
              }
            
            />
            <TextField
              required
              margin="dense"
              label="Email"
              fullWidth
              variant="outlined"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              
            />
            <TextField
              required
              margin="dense"
              label="Age"
              type="number"
              fullWidth
              variant="outlined"
              value={newMember.age}
              onChange={(e) =>
                setNewMember({ ...newMember, age: e.target.value })
              }
            
            />
            <TextField
              required
              margin="dense"
              label="Weight "
              type="number"
              fullWidth
              variant="outlined"
              value={newMember.weights}
              onChange={(e) =>
                setNewMember({ ...newMember, weights: e.target.value })
              }
               
            />
            <TextField
              required
              margin="dense"
              label="Height"
              type="number"
              fullWidth
              variant="outlined"
              value={newMember.height}
              onChange={(e) =>
                setNewMember({ ...newMember, height: e.target.value })
              }
             
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
              onClick={addMember}
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
      </div>
    </ThemeProvider>
  );
}

