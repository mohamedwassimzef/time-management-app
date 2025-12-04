import { useState, useEffect } from "react";
import "./c3.css";
import DayControl from "./DayControl";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Calendar({ onDrawerChange }) {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const month = date.getMonth();
  const year = date.getFullYear();
  const { user, token } = useAuth();
  useEffect(() => {
    fetchTasks();
  }, [drawerOpen]);

  useEffect(() => {
    if (onDrawerChange) {
      onDrawerChange(drawerOpen);
    }
  }, [drawerOpen, onDrawerChange]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/user");
      setEvents(res.data);
    } catch (err) {
      console.error(`Error fetching tasks:`, err);
      console.error(`Error response:`, err.response);
    }
  };

  const monthName = date.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const daysArray = [];

  // empty boxes before day 1
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }

  // actual days
  for (let d = 1; d <= lastDate; d++) {
    daysArray.push(d);
  }

  const goToPrevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="calendar-container">
        
        {/* Header */}
        <div className="calendar-header">
          <button
            onClick={goToPrevMonth}
            className="nav-button"
          >
            ‹
          </button>

          <h2 className="month-title">
            {monthName} {year}
          </h2>

          <button
            onClick={goToNextMonth}
            className="nav-button"
          >
            ›
          </button>
        </div>

        {/* Weekday Names */}
        <div className="weekday-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="weekday-name">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="days-grid">
          {daysArray.map((d, index) => {
            if (d === null) return <div key={index} className="day-cell empty"></div>;

            const isToday =
              d === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            // Get events for this day
            const dayEvents = events.filter((event) => {
              const eventDate = new Date(event.deadline);
              return (
                eventDate.getDate() === d &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
              );
            });

            return (
              <div
                key={index}
                className={`day-cell ${isToday ? "today" : ""}`}
                onClick={() => handleDateClick(d)}
              >
                <div className="day-number">{d}</div>
                <div className="events-list">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className={`event-item status-${event.status.replace(/\s+/g, '-')}`}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="more-events">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DayControl
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  );
}
