import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/Navbar';
import { Toaster } from 'react-hot-toast'
import SummaryPage from './components/Summary';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
      return <Navigate to='/login' />
    }
    return children;
  }


  return (
    <>
<Routes>
  
  <Route path="/" element={<><ProtectedRoute><NavbarComponent/><Home/></ProtectedRoute></>} />
  <Route path="/dashboard" element={<><ProtectedRoute><NavbarComponent/><SummaryPage/></ProtectedRoute></>} />
  <Route path='/login' element={<Login   />} />
  <Route path='/signup' element={<Signup/>} />
</Routes>
<Toaster />
    </>
  );
}

export default App;
