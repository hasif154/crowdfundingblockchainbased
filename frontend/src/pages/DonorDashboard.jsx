import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/CampaignCard';
import {
    Search,
    TrendingUp,
    Clock,
    CheckCircle,
    Heart,
    Shield,
    Wallet,
    AlertCircle,
    LogOut,
    Filter,
    LayoutGrid,
    List,
    Zap,
    Globe,
    ArrowRight,
    Eye
} from 'lucide-react';
import './DonorDashboard.css';

const DonorDashboard = () => {
    const { contract, isConnected, connectWallet, account, disconnectWallet, wrongNetwork, switchToLocalNetwork, error: web3Error } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const navigate = useNavigate();

    const filters = [
        { id: 'all', name: 'All Campaigns', icon: TrendingUp },
        { id: 'active', name: 'Active', icon: Clock },
        { id: 'successful', name: 'Funded', icon: CheckCircle },
        { id: 'urgent', name: 'Ending Soon', icon: AlertCircle },
    ];

    const fetchCampaigns = async () => {
        if (!contract) {
            setLoading(false);
            return;
        }

        try {
            const allCampaigns = await contract.getAllCampaigns();
            setCampaigns([...allCampaigns].reverse());
            setFilteredCampaigns([...allCampaigns].reverse());
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [contract]);

    useEffect(() => {
        let result = [...campaigns];

        if (searchTerm) {
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeFilter === 'active') {
            result = result.filter((c) => Number(c.status) === 0);
        } else if (activeFilter === 'successful') {
            result = result.filter((c) => Number(c.status) === 2);
        } else if (activeFilter === 'urgent') {
            result = result.filter((c) => {
                const daysLeft = Math.max(0, Math.floor((Number(c.endsAt) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
                return Number(c.status) === 0 && daysLeft <= 7;
            });
        }

        setFilteredCampaigns(result);
    }, [searchTerm, activeFilter, campaigns]);

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const totalRaised = campaigns.reduce((acc, c) => {
        try {
            const { ethers } = require('ethers');
            return acc + Number(ethers.formatEther(c.totalRaised));
        } catch { return acc; }
    }, 0);

    const activeCampaigns = campaigns.filter(c => Number(c.status) === 0).length;

    return (
        <div className="donor-dashboard">
            {/* Testnet Banner */}
            <div className="testnet-banner-dash">
                <Shield size={14} />
                <span>🧪 Testnet Mode — All transactions use free test ETH. No real money involved.</span>
            </div>

            {/* Top Bar */}
            <header className="donor-topbar">
                <div className="topbar-left">
                    <Link to="/" className="topbar-logo">
                        <Heart size={22} />
                        <span className="logo-text">Fund<span>Hope</span></span>
                    </Link>
                    <span className="role-badge donor-role-badge">
                        <Heart size={12} />
                        Donor
                    </span>
                </div>
                <div className="topbar-right">
                    {isConnected ? (
                        <div className="wallet-section">
                            <div className="wallet-pill">
                                <span className="wallet-dot"></span>
                                <span className="wallet-addr">{formatAddress(account)}</span>
                            </div>
                            <button className="btn-switch-role" onClick={() => navigate('/')}>
                                Switch Role
                            </button>
                            <button className="btn-disconnect-sm" onClick={disconnectWallet}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="btn-connect-dash" onClick={connectWallet}>
                            <Wallet size={16} />
                            <span>Connect Wallet</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="donor-content">
                {/* Stats Bar */}
                <div className="donor-stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-1"><TrendingUp size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">{campaigns.length}</span>
                            <span className="stat-label">Total Campaigns</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-2"><Clock size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">{activeCampaigns}</span>
                            <span className="stat-label">Active Now</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-3"><Zap size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">{totalRaised.toFixed(2)} ETH</span>
                            <span className="stat-label">Total Raised</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-4"><Shield size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">Blockchain</span>
                            <span className="stat-label">Verified ✓</span>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                <div className="donor-page-header">
                    <div>
                        <h1>Discover Campaigns</h1>
                        <p>Browse verified fundraisers and make a difference with your donation</p>
                    </div>
                    {wrongNetwork && (
                        <button className="btn-wrong-network" onClick={switchToLocalNetwork}>
                            <AlertCircle size={16} />
                            Switch to Testnet
                        </button>
                    )}
                </div>

                {web3Error && (
                    <div className="error-banner-dash">
                        <AlertCircle size={18} />
                        <span>{web3Error}</span>
                    </div>
                )}

                {/* Filters */}
                <div className="donor-filters">
                    <div className="filter-tabs">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                className={`filter-tab ${activeFilter === f.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(f.id)}
                            >
                                <f.icon size={14} />
                                <span>{f.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="filter-right">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search campaigns..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="results-header">
                    <span className="results-count">
                        Showing <strong>{filteredCampaigns.length}</strong> campaign{filteredCampaigns.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Campaign Grid */}
                {loading ? (
                    <div className="campaigns-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton-card-dash">
                                <div className="skeleton-image-dash"></div>
                                <div className="skeleton-content-dash">
                                    <div className="skeleton-line-dash"></div>
                                    <div className="skeleton-line-dash short"></div>
                                    <div className="skeleton-line-dash shorter"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isConnected ? (
                    <div className="connect-prompt-dash">
                        <Wallet size={48} />
                        <h3>Connect Your Wallet</h3>
                        <p>Connect your MetaMask wallet to browse and donate to campaigns on the testnet.</p>
                        <button className="btn-connect-big" onClick={connectWallet}>
                            <Wallet size={20} />
                            <span>Connect Wallet</span>
                        </button>
                        <span className="connect-hint">Make sure Hardhat node is running: <code>npx hardhat node</code></span>
                    </div>
                ) : filteredCampaigns.length > 0 ? (
                    <div className="campaigns-grid">
                        {filteredCampaigns.map((campaign, index) => (
                            <CampaignCard
                                key={index}
                                campaign={campaign}
                                onContribute={fetchCampaigns}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-dash">
                        <Heart size={56} />
                        <h3>No campaigns found</h3>
                        <p>
                            {searchTerm || activeFilter !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'No campaigns have been created yet. Check back soon!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;
