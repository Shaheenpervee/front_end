import React, { useState, useRef, useEffect } from "react";
import "./clone.css";
import axios from "axios";
import DOMPurify from "dompurify";
import { url } from "../config";
let resp='';
const DropZone = ({ onFileSelect }) => {
  
  const [docxFiles, setDocxFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [message, setMessage] = useState("INFO:");

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
      onFileSelect(fileToUpload);
      if (fileType === 'docx') {
        setDocxFiles([...docxFiles, fileToUpload]);
        setMessage(`Uploaded DOCX file: ${fileToUpload.name}`);
        console.log("Docx file:", fileToUpload.name);
      } else if (fileType === 'pdf') {
        setPdfFiles([...pdfFiles, fileToUpload]);
        setMessage(`Uploaded PDF file: ${fileToUpload.name}`);
        console.log("PDF file:", fileToUpload.name);
        const formData = new FormData();
        formData.append('file', fileToUpload);

        try {
          console.log("Uploading PDF file using Axios...");
          resp = await axios.post(
            `${url}clone/pdf`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          
          console.log("Upload successful:", resp.data);
          
          setMessage(`Uploaded PDF file: ${fileToUpload.name}`);
        } catch (error) {
          console.error("Error uploading PDF file:", error);
          setMessage(`Failed to upload PDF file: ${error.message}`);
        }
      }
    }
  };

  return (
    <div>
      <div className="message-container">
            <h1>INFO Box </h1>
            <div className="message-box">
                {message}
      </div>
      </div>
      <div
        className="drop-zone"
        onDrop={(e) => handleDrop(e, 'pdf')}
        onDragOver={handleDragOver}
      >
        <p>Drop PDF file here</p>
      </div>
      <div
        className="drop-zone"
        onDrop={(e) => handleDrop(e, 'docx')}
        onDragOver={handleDragOver}
      >
        <p>Drop Docx file here</p>
      </div>
      {/* Display uploaded files */}
      <div>
 
        <h3>Uploaded PDF file:</h3>
        <ul>
          {pdfFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
        <h3>Uploaded DOCX files:</h3>
        <ul>
          {docxFiles.map((file, index) => (
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
  const [grade, setgrade] = useState("8");
  const[chapter,setChapter]=useState('Sound')
  const [message, setMessage] = useState("Message Box");
  const fileInputRef = useRef(null);

  const hi = async () => {
    console.log("Sending request to server...");
    alert("Hi");
    setMessage("Sending request to server...");
    try {
      const response = await axios.get(url + `clone/hi`);
      setMessage(response.data.message);
      console.log(response.data.message)
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error during request. See console for details.");
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


  const handleUpload = async () => {
    console.log("file", file);
    if (!file) {
      setMessage("No file selected. Please select a file to upload.");
      return;
    }
    setMessage("Processing...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${url}clone/upload?no_of_clone=${noOfClone}&subject=${subject}&grade=${grade}&chapter=${chapter}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponseData(response.data);
      setMessage("Process complete. Server Response: " + response.data.message);

      console.log("API data found");

      if (response.data.html) {
        const safeHTML = DOMPurify.sanitize(response.data.html);
        setHtmlContents((prevContents) => [...prevContents, safeHTML]);
        console.log("API data found and sanitized");
      } else {
        console.log("No HTML data found in the API response");
      }
      console.log(`${response}`);
      alert("Ready to download");
    } catch (error) {
      console.log(error)
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
      <DropZone onFileSelect={(file) => setFile(file)} />
      <div className="message-container">
            <h1>Message Box </h1>
            <div className="message-box">
                {message}
      </div>
      </div>
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
          <option value="science">Science</option>
          <option value="math">Math</option>
        </select>
      </div>
      <div className="select-container">
        <label> Grade:</label>
        <select value={grade} onChange={(e) => setgrade(e.target.value)}>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <div className="select-container">
        <label> Chapter:</label>
        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="Enter chapter name"
        />
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
