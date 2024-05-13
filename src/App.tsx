import './App.css';
import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Flights from './components/Flights';
import Menu from './components/Menu';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <h1 className='head1'>Welcome to SeatSwap!</h1>
      <div>
        {isLoggedIn ? (
          <>
            <Flights />
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
      <Menu></Menu>
      <HashRouter basename='/'>
        {/* <NavBar /> */}
        <Routes>
          <Route path='/' element={<h1>Home</h1>} />
          <Route path='/login' element={<h1>Home</h1>} />
          <Route path='/signup' element={<h1>Home</h1>} />
          <Route path='/main' element={<h1>Home</h1>} />
          <Route path='/seats' element={<h1>Home</h1>} />
          <Route path='/flight' element={<h1>Home</h1>} />
          <Route path='/account' element={<h1>Account</h1>} />
          <Route path='/preferences' element={<h1>Home</h1>} />
          <Route path='/defaultpreferences' element={<h1>Default Pref</h1>} />
          <Route path='/review' element={<h1>Home</h1>} />
          <Route path='/reviews' element={<h1>Reviews</h1>} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
