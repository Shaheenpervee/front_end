import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9000/kg/info');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error here, e.g., display an error message to the user
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper function to check and render data
    const renderData = (value) => {
        // Check if the value is an object and not null
        if (typeof value === 'object' && value !== null) {
            // Convert object to string or render as JSON
            return JSON.stringify(value);
        }
        // Return value if not an object
        return value;
    };

    return (
        <div>
            <p>Hi from Home</p>
            <div className="content">
                <Outlet />
                <table>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && Object.entries(data['data']).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key.replace(/_/g, ' ')}</td>
                                <td>{renderData(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={fetchData} style={{ position: 'fixed', bottom: 20, right: 20 }}>
                    Refresh Data
                </button>
            </div>
        </div>
    );
};

export default Home;

