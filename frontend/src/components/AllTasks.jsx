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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "../services/api";
import TaskForm from "./TaskForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Sortable Task Item Component
function SortableTaskItem({ task, onEdit, onDelete, getStatusColor, getPriorityColor }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      elevation={2}
      sx={{ mb: 2 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", flex: 1 }}>
            <IconButton
              {...attributes}
              {...listeners}
              sx={{ cursor: "grab", "&:active": { cursor: "grabbing" }, mt: -1 }}
            >
              <DragIndicatorIcon />
            </IconButton>
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
          </Box>
          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(task)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(task._id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      const tasksData = Array.isArray(res.data) ? res.data : [];
      // Sort by priority ascending (0 is most urgent, at the top)
      const sortedTasks = tasksData.sort((a, b) => a.priority - b.priority);
      setTasks(sortedTasks);
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
    // Lower priority numbers = more urgent (0 is most urgent)
    if (priority <= 2) return "error";      // Red for high urgency (0-2)
    if (priority <= 4) return "warning";    // Orange/yellow for medium urgency (3-4)
    return "info";                          // Blue for low urgency (5+)
  };

  const calculateNewPriority = (abovePriority, belowPriority) => {
    const n = abovePriority;
    const m = belowPriority;
    const diff = n - m;

    if (diff === 0) {
      return n;
    } else if (diff === 1) {
      return m;
    } else if (diff > 1) {
      return n - 1;
    } else {
      // If diff is negative (shouldn't happen if sorted correctly), return average
      return Math.floor((n + m) / 2);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task._id === active.id);
    const newIndex = tasks.findIndex((task) => task._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder tasks array
    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reorderedTasks);

    // Calculate new priority based on position
    // Note: Tasks are sorted in ascending order (0 at top, higher numbers at bottom)
    const movedTask = reorderedTasks[newIndex];
    let newPriority;

    if (newIndex === 0) {
      // Moved to top (most urgent position)
      if (reorderedTasks.length === 1) {
        newPriority = 0; // Only task, make it priority 0
      } else {
        const belowTask = reorderedTasks[1];
        // Dragging to top should get priority 0 or lower than the task below
        if (belowTask.priority === 0) {
          newPriority = 0;
        } else {
          // Set priority lower than the task below (more urgent)
          newPriority = Math.max(0, belowTask.priority - 1);
        }
      }
    } else if (newIndex === reorderedTasks.length - 1) {
      // Moved to bottom (least urgent position)
      const aboveTask = reorderedTasks[newIndex - 1];
      // Set priority higher than the task above (less urgent)
      newPriority = aboveTask.priority + 1;
    } else {
      // Moved between two tasks
      const aboveTask = reorderedTasks[newIndex - 1];
      const belowTask = reorderedTasks[newIndex + 1];
      
      // Special cases for priority 0 tasks
      if (aboveTask.priority === 0 && belowTask.priority === 0) {
        // Between two priority 0 tasks
        newPriority = 0;
      } else if (aboveTask.priority === 0 && belowTask.priority > 0) {
        // Between priority 0 and priority m (where m > 0)
        newPriority = 1;
      } else {
        // Normal case - calculate priority between above and below
        const diff = belowTask.priority - aboveTask.priority;
        if (diff === 0) {
          newPriority = aboveTask.priority;
        } else if (diff === 1) {
          newPriority = belowTask.priority;
        } else if (diff > 1) {
          newPriority = aboveTask.priority + 1;
        } else {
          // Shouldn't happen if sorted correctly
          newPriority = Math.floor((aboveTask.priority + belowTask.priority) / 2);
        }
        // Ensure minimum priority is 0
        newPriority = Math.max(0, newPriority);
      }
    }

    // Update priority in backend
    try {
      await api.patch(`/tasks/user`, {
        _id: movedTask._id,
        priority: newPriority,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh tasks to get updated data
      fetchTasks();
    } catch (error) {
      console.error("Error updating task priority:", error);
      // Revert on error
      setTasks(tasks);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext
                  items={tasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.map((task) => (
                    <SortableTaskItem
                      key={task._id}
                      task={task}
                      onEdit={(task) => {
                        setEditTask(task);
                        setShowForm(true);
                      }}
                      onDelete={handleDelete}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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
