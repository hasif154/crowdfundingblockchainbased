import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import RoleSelect from './pages/RoleSelect';
import DonorDashboard from './pages/DonorDashboard';
import DoneeDashboard from './pages/DoneeDashboard';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/donee" element={<DoneeDashboard />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
