import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReleasesPage } from "./pages/ReleasesPage";
import { DetailPage } from "./pages/DetailPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<ReleasesPage />} />
          <Route path="/detail/:ocid" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
