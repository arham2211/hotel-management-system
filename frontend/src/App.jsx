import Home from "./routes/Home";
import "./App.css";
import "./components/Header"
import {AuthProvider} from "./context/UserContext"

function App() {


  return (
    <>
      <AuthProvider>
        <Home />
      </AuthProvider>

    </>
  );
}

export default App;
