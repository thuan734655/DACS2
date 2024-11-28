import ForgottenUI from "./components/ui/ForgottenUI";
import FormCreatePostUI from "./components/ui/FormCreatePostUI";
import HomePageUI from "./components/ui/HomePageUI";
import LoginUI from "./components/ui/LoginUI";
import MessageUI from "./components/ui/MessageUI";
import ProfileUI from "./components/ui/ProfileUI";
import SignUp from "./components/ui/SignUp";
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfileUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
