import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.js";
import Intro from "./pages/Intro/Intro.js";
import UserGuide from "./pages/UserGuide/UserGuide.js";
import Create from "./pages/Create/Create.js";
import Result from "./pages/Result/Result.js";
import Creating from "./pages/Creating/Creating.js";
import User from "./pages/User/User.js";
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
        <Route path="/creating" element={<Creating />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/user" element={<User />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
