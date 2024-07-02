import React, { useState, useRef, useEffect } from "react";
import "./clone.css";
import axios from "axios";
import DOMPurify from "dompurify";
import { url } from "../config";

const DropZone = () => {
    const [docxFiles, setDocxFiles] = useState([]);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [message, setMessage] = useState('');
  
    const handleDragOver = (event) => {
      event.preventDefault();
    };
  
    const handleDrop = async (event, fileType) => {
      event.preventDefault();
      const files = [...event.dataTransfer.files];
      const fileToUpload = files.find((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return (fileType === 'docx' && extension === 'docx') ||
               (fileType === 'pdf' && extension === 'pdf');
      });
  
      if (fileToUpload) {
        if (fileType === 'docx') {
          setDocxFiles([...docxFiles, fileToUpload]);
          setMessage(`Uploaded DOCX file: ${fileToUpload.name}`);
          console.log("Docx file:", fileToUpload.name);
        } else if (fileType === 'pdf') {
          setPdfFiles([...pdfFiles, fileToUpload]);
          setMessage(`Uploaded PDF file: ${fileToUpload.name}`);
          console.log("Docx file:", fileToUpload.name);
          const formData = new FormData();
          formData.append('file', fileToUpload.name);
  
          try {
            console.log("Uploading PDF file using Axios...");
            const response = await axios.post(
              `${url}clone/upload_pdf`,
              formData,
              {
                headers: { "Content-Type": "application/pdf" },
              }
            );
            console.log("Upload successful:", response.data);
            setMessage(`Uploaded PDF file: ${fileToUpload.name}`); // Update message after successful upload
          } catch (error) {
            console.error("Error uploading PDF file:", error);
            setMessage(`Failed to upload PDF file: ${error.message}`);
          }
        }
      }
    };
  return (
    <div>
      <div
        className="drop-zone"
        onDrop={(e) => handleDrop(e, 'docx')}
        onDragOver={handleDragOver}
      >
        <p>Drop DOCX files here</p>
      </div>
      <div
        className="drop-zone"
        onDrop={(e) => handleDrop(e, 'pdf')}
        onDragOver={handleDragOver}
      >
        <p>Drop PDF file here</p>
      </div>
      {/* Display uploaded files */}
      <div>
        <h3>Uploaded DOCX file:</h3>
        <ul>
          {docxFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
        <h3>Uploaded PDF file:</h3>
        <ul>
          {pdfFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Clone = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [htmlContents, setHtmlContents] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [subject, setSubject] = useState("science");
  const [noOfClone, setNoOfClone] = useState("1");
  const [message, setMessage] = useState("Drop file here or click to browse");
  const fileInputRef = useRef(null);

  const hi = async () => {
    console.log("Sending request to server...");
    alert("Hi");
    setMessage("Sending request to server...");
    try {
      const response = await axios.get(url + `clone/hi`);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error during request. See console for details.");
    }
  };

  const handleDownload = () => {
    // Implement download functionality
  };

  const handleUpload = async () => {
    console.log("file",file)
    if (!file) {
      setMessage("No file selected. Please select a file to upload.");
      return;
    }
    setMessage("Processing...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${url}clone/upload?no_of_clone=${noOfClone}&subject=${subject}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponseData(response.data);
      setMessage("Process complete. Server Response: " + response.data.message);
      console.log("API data found");

      if (response.data.html) {
        const safeHTML = DOMPurify.sanitize(
          response.data.html + `?${Date.now()}`
        );
        setHtmlContents([safeHTML]);
        console.log("API data found and sanitized");
      } else {
        console.log("No HTML data found in the API response");
      }
      console.log(`${response}`);
      alert("Ready to download");
    } catch (error) {
      if (error.response) {
        setMessage(
          `Error during upload: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        setMessage("Error during upload: No response from server.");
      } else {
        setMessage("Error during upload: " + error.message);
      }
    }
  };

  const resetState = () => {
    setFile(null);
    setMessage("Drop file here or click to browse");
    setResponseData(null);
    setHtmlContents([]);
    setSubject("science");
    setNoOfClone("1");
  };

  return (
    <div>
      <DropZone />
      <div className="button-group">
        <button onClick={hi}>Hi</button>
        <button disabled={!file} onClick={handleUpload}>
          Start
        </button>
        <button disabled={!responseData} onClick={handleDownload}>
          Download
        </button>
        <button onClick={resetState}>Reset</button>
      </div>
      <div className="select-container">
        <label> Subject:</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="s">Science</option>
          <option value="m">Math</option>
        </select>
      </div>
      <div className="select-container">
        <label> No. of Clones:</label>
        <select
          value={noOfClone}
          onChange={(e) => setNoOfClone(e.target.value)}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      {/* Tabbed display of HTML contents */}
      {htmlContents.length > 0 && (
        <div className="tabs">
          {htmlContents.map((content, index) => (
            <button
              key={index}
              onClick={() => setCurrentTab(index)}
              className={currentTab === index ? "active" : ""}
            >
              Tab {index + 1}
            </button>
          ))}
          <div
            className="tab-content"
            dangerouslySetInnerHTML={{ __html: htmlContents[currentTab] }}
          />
        </div>
      )}
    </div>
  );
};

export default Clone;
