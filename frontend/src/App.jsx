import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./components/CalendarView";
import C3 from "./components/c3";
import Calendar from "./components/Calendar";
import Signup from "./components/Signup";
import Login from "./components/Login";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/c3" element={<C3 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        { /* the old calendar view  */ }
        <Route path="/calendar-view" element={<CalendarView />} />
        
      </Routes>
    </Router>
  );
}

export default App;
