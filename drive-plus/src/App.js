import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Divisions/Login/Login';
import Signup from './Divisions/Signup/Signup';
import Home from './Divisions/Home/Home';
import Header from './Divisions/Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import CurrentUser from './API/CurrentUser';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function GetCurrentUser() {
            const response = await CurrentUser();
            setCurrentUser(response);
        }

        GetCurrentUser();
    }, [])
  return (
      <BrowserRouter>
          <Header setCurrentUser={setCurrentUser} />
          <Routes>
              <Route path='/home' element={<Home currentUser={currentUser} />} />
              <Route path='/' element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
              <Route path='/signup' element={<Signup currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
