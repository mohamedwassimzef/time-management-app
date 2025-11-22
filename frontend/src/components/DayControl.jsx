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
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '100%', md: 400 },
          maxWidth: '100%'
        }
      }}
    >
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        p: { xs: 2, sm: 3 },
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '18px', sm: '20px' }, flex: 1 }}>
            Tasks — {new Date(selectedDate).toDateString()}
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              minWidth: 44, 
              minHeight: 44,
              bgcolor: 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              }
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          mb: 2,
          display: { xs: showForm ? 'none' : 'block', md: 'block' }
        }}>
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
              <Typography sx={{ mt: 2, color: "gray", fontSize: { xs: '14px', sm: '16px' } }}>
                No tasks for this day.
              </Typography>
            )}
          </List>
        </Box>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ 
            minHeight: { xs: 48, sm: 44 },
            fontSize: { xs: '15px', sm: '16px' },
            mb: showForm ? 2 : 0,
            display: { xs: showForm ? 'none' : 'flex', md: 'flex' }
          }}
          onClick={() => {
            setEditTask(null);
            setShowForm(true);
          }}
        >
          Add Task
        </Button>

        {showForm && (
          <Box sx={{ 
            borderTop: { xs: 'none', md: '1px solid #e0e0e0' },
            pt: { xs: 0, md: 2 },
            maxHeight: { xs: '100%', md: 'auto' },
            overflowY: 'auto',
            flex: { xs: 1, md: 'initial' }
          }}>
            <TaskForm
              initialData={editTask}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
