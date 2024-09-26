import "./App.css";
import "./App.scss";
import ForgottenUI from "./components/ui/ForgottenUI";
import LoginUI from "./components/ui/LoginUI";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginUI />} />
          <Route path="/login" element={<LoginUI />} />
          <Route path="/ForgottenUI" element={<ForgottenUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
