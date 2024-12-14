import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/Navbar';
import { Toaster } from 'react-hot-toast'
import SummaryPage from './components/Summary';

function App() {



  return (
    <>
<Routes>
  
  <Route path="/" element={<><NavbarComponent/><Home/></>} />
  <Route path="/dashboard" element={<><NavbarComponent/><SummaryPage/></>} />
  <Route path='/login' element={<Login   />} />
  <Route path='/signup' element={<Signup/>} />
</Routes>
<Toaster />
    </>
  );
}

export default App;
