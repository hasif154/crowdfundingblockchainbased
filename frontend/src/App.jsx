import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Header from './components/Header';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import './App.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/create" element={<CreateCampaign />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
