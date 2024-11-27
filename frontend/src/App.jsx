import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import Booking from "./routes/Booking";
import Header from "./components/Header";
import Contact from "./routes/Contact";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Service from "./routes/Services";
import ViewRoom from "./routes/ViewRoom";
import Event from "./routes/Event";
import Tour from "./routes/Tour";
import Profile from "./routes/Profile";
import ScrollToTop from "./context/ScrollToTop";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./context/UserContext";
import Users from "./components/adminComponents/User"
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Service />} />
          <Route path="/roomdetails/:roomType" element={<ViewRoom />} />
          <Route path="/events" element={<Event />} />
          <Route path="/tours" element={<Tour />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<Users />} />

        </Routes>
        {/* Conditionally render the Newsletter */}
        {location.pathname !== "/admin" && location.pathname !== "/profile/users" && <Newsletter />}
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
