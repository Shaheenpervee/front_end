import React from 'react';
import './Download.css';
import axios from 'axios';

const downloadItems = [
    { id: 1, title: "LU", description: "List of all LU.", buttonText: "Download" },
    { id: 2, title: "LO", description: "List of all LO.", buttonText: "Download" },
    { id: 3, title: "Q", description: "List of all Q", buttonText: "Download" }
];

const callApi = async (apiUrl) => {
    try {
        const response = await axios.get(apiUrl)
        if(response.status !== 200) throw Error("Failed to download");
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("Failed to fetch data: " + error.message); // User-friendly error message
        return null; // Return null on error to handle it gracefully downstream
    }
};

const Download = () => {
    const handleDownloadClick = async (itemId) => {
        let apiUrl;
        switch (itemId) {
            case 1: apiUrl = "http://localhost:9000/kg/download/LU"; break;
            case 2: apiUrl = "https://git.com/button2"; break; // Ensure these URLs are correct and accessible
            case 3: apiUrl = "https://git.com/button3"; break;
            default: apiUrl = ""; break;
        }
        if (apiUrl) {
            try {
                const response = await axios.get(apiUrl, {
                    responseType: 'blob' // Ensure the response type is set to 'blob'
                });
                // Create a URL for the blob data
                const url = window.URL.createObjectURL(new Blob([response.data]));
                // Create a temporary anchor element to initiate the download
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'downloaded_file'); // Set the desired file name
                document.body.appendChild(link);
                link.click(); // Trigger the click event to start the download
                document.body.removeChild(link); // Clean up
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error here
            }
        }
    };

    return (
        <div>
            <p>Hi from Download</p>
            <div className="download-list">
                {downloadItems.map(item => (
                    <div key={item.id} className="download-item">
                        <button className="item-button" onClick={() => handleDownloadClick(item.id)}>
                            {item.buttonText}
                        </button>
                        <div className="item-info">
                            <h4 className="item-title">{item.title}</h4>
                            <p className="item-description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Download;
