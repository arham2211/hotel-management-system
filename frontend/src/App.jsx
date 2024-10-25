import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About"; 
import Booking from "./routes/Booking";
import Header from "./components/Header"; 
import { AuthProvider } from "./context/UserContext";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
