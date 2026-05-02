import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/:username" element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
