// src/components/TaskItem.jsx
import React from "react";
import { ListItem, ListItemText, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskItem({ task, onEdit, onDelete }) {
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
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: 'background.paper',
        mb: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover',
        }
      }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        sx={{ 
          cursor: "grab", 
          "&:active": { cursor: "grabbing" }, 
          mr: 1,
          touchAction: 'none'
        }}
        size="small"
      >
        <DragIndicatorIcon />
      </IconButton>
      <ListItemText
        primary={task.title}
        secondary={new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      />
      <IconButton edge="end" aria-label="edit" onClick={onEdit} sx={{ ml: 1 }}>
        <EditIcon />
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
