import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarView from "./components/CalendarView";
import C3 from "./components/c3";
import Calendar from "./components/Calendar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        { /* the old calendar view  */ }
        <Route path="/calendar-view" element={<CalendarView />} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
