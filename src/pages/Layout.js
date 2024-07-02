import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // Ensure your styles are correctly imported


const Layout = () => {
    return (
        <div className="container">
            <nav className="navbar">
                <ul>
                    <li><Link to="/" >Login</Link></li >
                    <li><Link to="/clone">Clone</Link></li>
                </ul>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
