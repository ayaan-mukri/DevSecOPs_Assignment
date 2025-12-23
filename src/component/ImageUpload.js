import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ImageUpload = () => {
  const [uploadMethod, setUploadMethod] = useState('device'); // Device or URL
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useNavigate();

  // Handle method selection
  const handleMethodChange = (e) => {
    setUploadMethod(e.target.value);
    setSelectedImage(null);
    setImageUrl('');
    setPreviewUrl(null);
    setPrediction('');
    setInfo('');
    setErrorMessage('');
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image (JPEG or PNG).');
        setSelectedImage(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrorMessage('Image size should be less than 5MB.');
        setSelectedImage(null);
        setPreviewUrl(null);
        return;
      }
      setErrorMessage(""); // Clear error message
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction("");
      setInfo("");
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value); // Update preview with the URL
  };

  // Handle prediction upload
  const handleUpload = async () => {
    if (!(selectedImage || imageUrl)) return;

    const formData = new FormData();
    if (selectedImage) {
      formData.append('file', selectedImage);
    } else {
      formData.append('url', imageUrl);
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://35.170.76.112:5000/predict",
        formData
      );
      setPrediction(res.data.prediction);
      setInfo(res.data.info);
    } catch (err) {
      console.error("Error uploading image:", err);
      setInfo("Something went wrong while fetching prediction details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setSelectedImage(null);
    setImageUrl('');
    setPreviewUrl(null);
    setPrediction("");
    setInfo("");
    setErrorMessage("");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">🍃 Potato Leaf Disease Detector</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/chat">Chat</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-5 flex-grow-1">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4 text-success">🍃 Upload Potato Leaf Image</h2>

          {/* Dropdown for selecting upload method */}
          <div className="mb-4">
            <label className="form-label">Choose upload method:</label>
            <select className="form-select" onChange={handleMethodChange} value={uploadMethod}>
              <option value="device">Upload from Device</option>
              <option value="url">Upload from URL</option>
            </select>
          </div>

          {/* Display the relevant input field based on the selected method */}
          {uploadMethod === 'device' ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control mb-4"
              />
            </div>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={handleUrlChange}
                className="form-control mb-4"
              />
            </div>
          )}

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {/* Preview Image */}
          {previewUrl && (
            <div className="text-center mb-3">
              <img
                src={previewUrl}
                alt="Preview"
                className="img-thumbnail"
                style={{ width: '300px', height: '300px', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="text-center">
            <button
              onClick={handleUpload}
              className="btn btn-success btn-lg"
              disabled={loading}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
            <button
              onClick={handleClear}
              className="btn btn-danger btn-lg ms-2"
            >
              Clear
            </button>
          </div>

          {/* Display Prediction */}
          {prediction && (
            <div className="alert alert-info mt-4">
              <h5>Prediction:</h5>
              <p><strong>{prediction}</strong></p>
            </div>
          )}

          {/* Display Information */}
          {info && (
            <div
              className="alert alert-light border mt-3"
              style={{ whiteSpace: 'pre-line', textAlign: 'left' }}
            >
              <h5 className="text-success mb-3">Detailed Information</h5>
              <div>{info}</div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => history('/chat')}
              >
                Chat with the Bot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="navbar navbar-dark bg-success shadow-sm mt-auto">
        <div className="container-fluid justify-content-center text-white py-2">
          <div className="text-center">
            <p className="mb-0 fw-semibold">© 2025 Potato Leaf Disease Detection. All Rights Reserved.</p>
            <p className="mb-0">Developed by Your Name</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ImageUpload;
