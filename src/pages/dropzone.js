import React, { useState } from 'react';
import axios from 'axios';
import { url } from '../config';

const DropZone = ({ onFileUpload }) => {
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
        onFileUpload(fileToUpload); // Pass fileToUpload to parent component
      } else if (fileType === 'pdf') {
        setPdfFiles([...pdfFiles, fileToUpload]);
        setMessage(`Uploaded PDF file: ${fileToUpload.name}`);

        const formData = new FormData();
        formData.append('file', fileToUpload);

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
          onFileUpload(fileToUpload); // Pass fileToUpload to parent component
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
        <p>Drop PDF files here</p>
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

export default DropZone;
