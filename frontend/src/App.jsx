import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About"; 
import Booking from "./routes/Booking";
import Header from "./components/Header"; 
import Contact from "./routes/Contact";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Service from "./routes/Services";
import ViewRoom from "./routes/ViewRoom";
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Service />} />
          <Route path="/roomdetails" element={<ViewRoom />} />
          {/* <Route path="/roomdetails/:roomId" element={<ViewRoom />} /> */}
        </Routes>
        <Newsletter />
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
