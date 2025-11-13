// src/components/CalendarView.jsx
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { api } from "../services/api";
import DayControl from "./DayControl";
//localizer setup to enable date formatting in the calendar
const localizer = momentLocalizer(moment);

export default function CalendarView() {

  //states setting
  const [events, setEvents] = useState([]); //Stores the list of tasks/events to show on the calendar.
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // default view

  
  const [selectedDate, setSelectedDate] = useState(null); // ← State to control DayControl drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ← UseEffect & Fetch tasks when component mounts or drawer closes
  useEffect(() => {
    fetchTasks();
  }, [drawerOpen]); //fetchTasks() is called every time drawerOpen changes.

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      // Transform tasks into calendar events
      const formatted = res.data.map((task) => ({
        id: task._id,
        title: task.title,
        start: new Date(task.deadline),
        end: new Date(task.deadline),
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // ← Handle date clicks on calendar
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);  // Save clicked date It contains details about the selection.
    setDrawerOpen(true);              // Open DayControl drawer
  };

  return (
    <>
      <div className="app-container">
        <h1>📅 My Agenda</h1>
        <div className="calendar-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            view={view} // ← Set current view
            onView={(newView) => setView(newView)} // ← Update view state on view change
            selectable
            onSelectSlot={handleSelectSlot}  // ← Connect date click handler
            style={{ height: "600px" }}
          />
        </div>
      </div>

      {/* ← Render DayControl drawer */}
      <DayControl
      open={drawerOpen} // controls visibility
      onClose={() => setDrawerOpen(false)} // closes drawer
      selectedDate={selectedDate}
    />
    </>
  );
}