import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        responseType: 'blob', // To handle file downloads
      });

      // Create a downloadable link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <div>
      <h1>CSV Cleansing Tool</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Clean</button>
      {downloadUrl && (
        <a href={downloadUrl} download="cleaned_data.csv">
          Download Cleaned File
        </a>
      )}
    </div>
  );
}

export default App;
