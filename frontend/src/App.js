import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./pages/Home/Home.js";
import Intro from "./pages/Intro/Intro.js";
import UserGuide from "./pages/UserGuide/UserGuide.js";
import Create from "./pages/Create/Create.js";
import Result from "./pages/Result/Result.js";
import Creating from "./pages/Creating/Creating.js";
import User from "./pages/User/User.js";
import Auth from "./contexts/Auth.js";
import Nav from "./components/Nav/Nav.js";
import Footer from "./components/Footer/Footer.js";
import AuthProvider from "../src/contexts/Auth.js";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/userguide" element={<UserGuide />} />
          <Route path="/create" element={<Create />} />
          <Route path="/creating" element={<Creating />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/user" element={<User />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
