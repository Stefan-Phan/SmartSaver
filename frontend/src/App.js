import LoginSignup from "./components/LoginSignup/LoginSignup";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/register"
            element={<LoginSignup action="Sign Up" />}
          ></Route>
          <Route path="/login" element={<LoginSignup action="Login" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
