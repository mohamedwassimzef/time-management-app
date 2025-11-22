import React, { useState } from "react";
import "./SimpleCalendar.css";

export default function SimpleCalendar({ events, onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = startOfMonth.getDay(); // 0 = Sunday

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getEventsForDay = (day) => {
    if (!day || !events) return [];
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentMonth.getMonth() &&
             eventDate.getFullYear() === currentMonth.getFullYear();
    });
  };

  const isToday = (day) => {
    if (!day) return false;
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day) => {
    if (day && onDateClick) {
      const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onDateClick(clickedDate);
    }
  };

  return (
    <div className="google-calendar">
      <div className="calendar-toolbar">
        <button className="today-btn" onClick={goToToday}>Today</button>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={goToPreviousMonth}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button className="nav-btn" onClick={goToNextMonth}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
        <h2 className="month-title">
          {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
      </div>

      <div className="calendar-grid">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="day-header">{d}</div>
        ))}
        {calendarDays.map((day, idx) => (
          <div 
            key={idx} 
            className={`day-cell ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {day && (
              <>
                <div className="day-number">{day}</div>
                <div className="events-container">
                  {getEventsForDay(day).map((e, i) => (
                    <div key={i} className="event-badge" style={{ backgroundColor: e.color || '#1a73e8' }}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
