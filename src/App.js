// import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Clone from './pages/clone';
import RequireAuth from './components/RequireAuth';
import NoPage from './pages/NoPage';
import './App.css';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />
            <Route element={<RequireAuth />}>              
              <Route path="clone" element={<Clone />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
