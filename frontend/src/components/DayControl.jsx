import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../services/api";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";


// states
export default function DayControl({ open, onClose, selectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
// useEffect to fetch tasks when drawer opens or selectedDate changes
  useEffect(() => {
    if (open && selectedDate) fetchTasks();
  }, [open, selectedDate]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const sameDay = res.data.filter(
        (t) =>
          new Date(t.deadline).toDateString() ===
          new Date(selectedDate).toDateString()
      );
      setTasks(sameDay);
    } catch (err) {
      console.error(err);
    }
  };
// Events handlers
  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleSave = async (task) => {
    if (editTask) {
      await api.patch(`/tasks/${editTask._id}`, task);
    } else {
      await api.post("/tasks", { ...task, deadline: selectedDate });
    }
    setShowForm(false);
    setEditTask(null);
    fetchTasks();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Tasks — {new Date(selectedDate).toDateString()}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                
                onEdit={() => {
                  console.log("Editing task:", task);
                  setEditTask(task);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(task._id)}
              />
            ))
          ) : (
            <Typography sx={{ mt: 2, color: "gray" }}>
              No tasks for this day.
            </Typography>
          )}
        </List>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
        >
          Add Task
        </Button>

        {showForm && (
          <TaskForm
            initialData={editTask}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </Box>
    </Drawer>
  );
}
