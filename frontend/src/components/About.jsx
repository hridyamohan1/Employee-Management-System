import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./components/Register";
// import Register from "./components/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Login Page</div>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;