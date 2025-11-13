// src/components/TaskForm.jsx
import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

export default function TaskForm({ initialData = null, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    
    if (initialData) {
    setTitle(initialData.title || "");
    setNotes(initialData.notes || "");
    setPriority(initialData.priority ?? 0);
    setDeadline(initialData.deadline ?? "");
    setStatus(initialData.status || "pending");
    setDescription(initialData.description || "");
  } else {
    setTitle("");
    setNotes("");
    setPriority(0);
    setDeadline("");
    setStatus("pending");
    setDescription("");
  }
  }, [initialData]);

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!title.trim()) return;

  onSave({
    title,
    notes,
    priority,
    deadline,
    status,
    description,
  });
};

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
      <TextField label="Priority" value={priority} onChange={(e) => setPriority(Number(e.target.value))}  />      
      <TextField
        label="Deadline"
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />    
      <Select value={status} onChange={(e) => setStatus(e.target.value)}>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="in progress">In Progress</MenuItem>
        <MenuItem value="done">Done</MenuItem>
      </Select>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">Save</Button>
      </Box>
    </Box>
  );
}
