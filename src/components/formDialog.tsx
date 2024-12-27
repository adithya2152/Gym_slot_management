import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";

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

interface formdata {
  date: string;
  start_time: string;
  end_time: string;
  max_alloc: number;
}

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
  Submit: (data: formdata) => void;
}

export default function FormDialog({
  open,
  handleClose,
  Submit,
}: FormDialogProps) {
  const [data, setData] = useState<formdata>({
    date: "",
    start_time: "",
    end_time: "",
    max_alloc: 0,
  });

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("from comp" , data)
    event.preventDefault();
    Submit(data);  
    handleClose();  
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleFormSubmit, // Handle form submission
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
          Add Slot
        </DialogTitle>
        <DialogContent
          sx={{
            color: "text.secondary",
          }}
        >
          <DialogContentText
            sx={{
              mb: 2,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Fill the slot details
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="date"
            name="date"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setData({ ...data, date: e.target.value })}
          />
          <TextField
            required
            margin="dense"
            id="start_time"
            name="start_time"
            label="Start Time"
            type="time"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setData({ ...data, start_time: e.target.value })}
          />
          <TextField
            required
            margin="dense"
            id="end_time"
            name="end_time"
            label="End Time"
            type="time"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setData({ ...data, end_time: e.target.value })}
          />
          <TextField
            required
            margin="dense"
            id="max_alloc"
            name="max_alloc"
            label="Maximum Allocation"
            type="number"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: "#2c2c2c",
                borderRadius: "6px",
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setData({ ...data, max_alloc: parseInt(e.target.value) })}
          />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleClose}
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
            type="submit" // No need for onClick here; submission is handled by the form
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
