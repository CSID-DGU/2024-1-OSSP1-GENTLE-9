import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Intro from "./pages/Intro/Intro.js";
import UserGuide from "./pages/UserGuide/UserGuide.js";
import Create from "./pages/Create/Create.js";
import Nav from "./components/Nav/Nav.js";
import Footer from "./components/Footer/Footer.js";
function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/userguide" element={<UserGuide />} />
        <Route path="/create" element={<Create />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
