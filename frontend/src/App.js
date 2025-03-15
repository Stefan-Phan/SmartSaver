import LoginSignup from "./components/LoginSignup/LoginSignup";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import TransactionPage from "./components/Transaction/Transaction";
import CategoryPage from "./components/Category/Category";
import DashboardPage from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";
import AskAI from "./components/AskAI/AskAI";
import IncomePage from "./components/Income/Income";

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
          <Route path="/transaction" element={<TransactionPage />}></Route>
          <Route path="/category" element={<CategoryPage />}></Route>
          <Route path="/dashboard" element={<DashboardPage />}></Route>
          <Route path="/user-profile" element={<UserProfile />}></Route>
          <Route path="/ask-ai" element={<AskAI />}></Route>
          <Route path="/income" element={<IncomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
