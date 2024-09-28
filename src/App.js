import "./App.css";
import "./App.scss";
import ForgottenUI from "./components/ui/ForgottenUI";
import HomePageUI from "./components/ui/HomePageUI";
import LoginUI from "./components/ui/LoginUI";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginUI />} />
          <Route path="/login" element={<LoginUI />} />
          <Route path="/forgotten" element={<ForgottenUI />} />
          <Route path="/homepage" element={<HomePageUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
