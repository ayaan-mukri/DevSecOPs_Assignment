import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageUpload from './component/ImageUpload';
import Chatbot from './component/Chatbot';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use JSX to render the components */}
        <Route path="/" element={<ImageUpload />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
