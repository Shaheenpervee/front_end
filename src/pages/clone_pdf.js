import React, { useState, useRef, useEffect } from "react";
import "./clone.css";
import axios from "axios";
import { url } from "../config";
import DOMPurify from "dompurify";

const Clone = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("Drop file here or click to browse");
  const [dragActive, setDragActive] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [htmlContents, setHtmlContents] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [subject, setSubject] = useState("science");
  const [noOfClone, setNoOfClone] = useState("1");
  const fileInputRef = useRef(null);
  

  useEffect(() => {
    const baseElement = document.createElement("base");
    baseElement.setAttribute("href", url);
    document.head.appendChild(baseElement);
    return () => {
      document.head.removeChild(baseElement);
    };
  }, []);

  const handleFileInput = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setFile(files[0]);
      setMessage(files[0].name);
      setResponseData(null); 
    }
    event.target.value = ""; 
  };

  const handleBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
  };

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

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      setMessage(event.dataTransfer.files[0].name);
    }
  };

  const handleUpload = async () => {
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

  const handleDownload = async () => {
    console.log("Clicked on download Button");
    if (!responseData || !responseData.file_name) {
      setMessage("No file to download. Please run the process first.");
      return;
    }
    setMessage("Preparing download...");
    console.log("API calling");
    axios
      .get(url + `clone/download?input_filename=${responseData.file_name}`, {
        responseType: "blob",
      })
      .then((response) => {
        const contentDisposition = response.headers["content-disposition"];
        let filename = responseData.file_name;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.*?)"/);
          if (match && match.length > 1) {
            filename = match[1];
          }
        }
        const clonedFilename = `${filename.split(".")[0]}_clone.zip`;
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", clonedFilename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setMessage("Download completed with filename: " + clonedFilename);
        console.log("download done");
      })
      .catch((error) => {
        console.error("Download error:", error);
        setMessage("Error during download. See console for details.");
      });
  };

  const resetState = () => {
    setFile(null);
    setMessage("Drop file here or click to browse");
    setDragActive(false);
    setResponseData(null);
    setHtmlContents([]);
    setSubject("science");
    setNoOfClone("1");
  };

  return (
    <div>
      <header className="App-header">
        <h3>Clone Question Generation</h3>
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {message}
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileInput}
            ref={fileInputRef}
          />
        </div>
        <div className="button-group">
          <button onClick={hi}>Hi</button>
          <button onClick={handleBrowse}>Browse</button>
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
      </header>
    </div>
  );
};
export default Clone;