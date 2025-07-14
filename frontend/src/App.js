import './App.css';
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import MainPage from './components/MainPage';
import Layout from './components/Layout';
import Logout from './components/Logout';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Layout><MainPage /></Layout>} />
        <Route path="/register" element={ <Layout><Register /></Layout> } />
        <Route path="/login" element={ <Layout><LoginForm /></Layout> } />
        <Route path="/user/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path='/logout' element={<Logout/>}/>
      </Routes>
  
  );
}

export default App;
