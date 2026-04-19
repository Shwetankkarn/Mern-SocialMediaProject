import { Routes, Route } from "react-router-dom";
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/loginPage";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App;