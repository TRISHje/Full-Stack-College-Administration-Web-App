// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import SignUp from './components/SignUp/SignUp';
import HomePage from './pages/HomePage/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LoginPage from './components/Login/LoginPage'
import AdminLoginPage from './components/Login/AdminLoginPage'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/adminLogin" element={<AdminLoginPage/>} /> 

        <Route path="/admin/*" element={<AdminDashboard/>}></Route>
        <Route path="/student/*" element={<StudentDashboard/>}></Route>
      </Routes>
    </div>
  );
}

export default App;