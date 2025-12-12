import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  IconButton,
  Container,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { api } from "../services/api";
import TaskForm from "./TaskForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#0a0a0a',
                  paper: '#1a1a1a',
                },
                primary: {
                  main: '#3b82f6',
                },
              }
            : {
                background: {
                  default: '#ffffff',
                  paper: '#ffffff',
                },
                primary: {
                  main: '#3b82f6',
                },
              }),
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/user`, {
        data: { _id: id },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSave = async (taskData) => {
    if (!user) {
      alert("Please log in to save tasks");
      return;
    }

    try {
      if (editTask) {
        const body = { _id: editTask._id, ...taskData };
        await api.patch(`/tasks/user`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const newTask = {
          ...taskData,
          deadline: taskData.deadline || new Date().toISOString(),
          user: user._id,
        };
        await api.post("/tasks/user", newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return "error";
    if (priority >= 5) return "warning";
    return "info";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', position: 'relative' }}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1300,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              All Tasks
            </Typography>
          </Box>

          <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Total: {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={() => {
                setEditTask(null);
                setShowForm(true);
              }}
            >
              Add Task
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            {tasks.length > 0 ? (
              <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {tasks.map((task) => (
                  <Card key={task._id} elevation={2}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                            {task.title}
                          </Typography>
                          {task.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {task.description}
                            </Typography>
                          )}
                          {task.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
                              Notes: {task.notes}
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                            <Chip
                              label={`Status: ${task.status}`}
                              color={getStatusColor(task.status)}
                              size="small"
                            />
                            <Chip
                              label={`Priority: ${task.priority}`}
                              color={getPriorityColor(task.priority)}
                              size="small"
                            />
                            {task.deadline && (
                              <Chip
                                label={new Date(task.deadline).toLocaleString()}
                                variant="outlined"
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {
                              setEditTask(task);
                              setShowForm(true);
                            }}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDelete(task._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            ) : (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    No tasks yet. Click "Add Task" to create your first task!
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Form Dialog */}
          <Dialog
            open={showForm}
            onClose={() => {
              setShowForm(false);
              setEditTask(null);
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {editTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogContent>
              <TaskForm
                initialData={editTask}
                onSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditTask(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
