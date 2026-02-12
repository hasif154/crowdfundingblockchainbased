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
    Zap,
    Users,
    Eye
} from 'lucide-react';
import './DonorDashboard.css';

// ── 4 Realistic Demo Campaigns ──
const DEMO_CAMPAIGNS = [
    {
        id: 'demo-1',
        title: 'Help Arun Get a Heart Surgery',
        description: 'Arun, a 7-year-old from Chennai, was diagnosed with a congenital heart defect. His family cannot afford the ₹12 lakh surgery. Every small contribution brings him closer to a healthy life.',
        imageURI: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
        goalEth: '15',
        raisedEth: '11.4',
        daysLeft: 12,
        status: 'active',
        creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        backers: 47,
    },
    {
        id: 'demo-2',
        title: 'Rebuild Flood-Damaged School in Assam',
        description: 'The devastating floods in Assam destroyed the only school in Majuli village, leaving 200+ children without education. Help us rebuild classrooms and provide learning materials.',
        imageURI: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600',
        goalEth: '25',
        raisedEth: '18.75',
        daysLeft: 22,
        status: 'active',
        creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        backers: 112,
    },
    {
        id: 'demo-3',
        title: 'Fund Priya\'s Computer Science Degree',
        description: 'Priya scored 98% in her 12th boards and earned admission to IIT Bombay. Coming from a single-parent household, she needs financial support for tuition, hostel, and books.',
        imageURI: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
        goalEth: '8',
        raisedEth: '8.0',
        daysLeft: 0,
        status: 'funded',
        creator: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        backers: 63,
    },
    {
        id: 'demo-4',
        title: 'Clean Water for Rajasthan Villages',
        description: 'Three villages in Rajasthan rely on contaminated water sources. This campaign funds borewells and water purification units to serve 1,500 families with clean drinking water.',
        imageURI: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=600',
        goalEth: '20',
        raisedEth: '4.2',
        daysLeft: 3,
        status: 'active',
        creator: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        backers: 29,
        urgent: true,
    }
];

// ── Demo Campaign Card Component ──
const DemoCampaignCard = ({ campaign }) => {
    const progress = (parseFloat(campaign.raisedEth) / parseFloat(campaign.goalEth)) * 100;
    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const isFunded = campaign.status === 'funded';
    const isUrgent = campaign.urgent || campaign.daysLeft <= 5;

    return (
        <div className="campaign-card">
            <div className="card-image">
                <img
                    src={campaign.imageURI}
                    alt={campaign.title}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400';
                    }}
                />
                <div className="card-overlay">
                    <span className={`status-badge ${isFunded ? 'successful' : 'active'}`}>
                        {isFunded ? 'Funded ✓' : 'Active'}
                    </span>
                    <span className="demo-badge-tag">Demo</span>
                </div>
                {isUrgent && !isFunded && (
                    <div className="urgent-badge">
                        <AlertCircle size={12} />
                        <span>Ending Soon</span>
                    </div>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{campaign.title}</h3>
                <p className="card-description">{campaign.description}</p>

                <div className="progress-section">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                    <div className="progress-stats">
                        <div className="raised-info">
                            <span className="raised-amount">{campaign.raisedEth} ETH</span>
                            <span className="raised-label">raised of {campaign.goalEth} ETH</span>
                        </div>
                        <div className="goal-info">
                            <span className="goal-amount">{Math.min(100, progress).toFixed(0)}%</span>
                            <span className="goal-label">funded</span>
                        </div>
                    </div>
                </div>

                <div className="card-stats">
                    <div className="stat">
                        <Clock size={14} />
                        <span>{campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Ended'}</span>
                    </div>
                    <div className="stat">
                        <Users size={14} />
                        <span>{campaign.backers} Backers</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="creator-info">
                        <div className="creator-avatar">
                            {campaign.creator.slice(2, 4).toUpperCase()}
                        </div>
                        <div className="creator-details">
                            <span className="creator-label">Created by</span>
                            <span className="creator-address">{formatAddress(campaign.creator)}</span>
                        </div>
                    </div>

                    {!isFunded && (
                        <button className="btn-donate btn-donate-demo" disabled>
                            <Heart size={16} />
                            <span>Donate Now</span>
                        </button>
                    )}
                </div>

                {/* Demo notice */}
                <div className="demo-notice">
                    <Eye size={12} />
                    <span>Demo campaign — Connect wallet to donate to real campaigns</span>
                </div>
            </div>
        </div>
    );
};

// ── Main Donor Dashboard ──
const DonorDashboard = () => {
    const { contract, isConnected, connectWallet, account, disconnectWallet, wrongNetwork, switchToLocalNetwork, error: web3Error } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
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

    // Filter demo campaigns by search
    const filteredDemos = DEMO_CAMPAIGNS.filter((d) => {
        if (searchTerm) {
            const st = searchTerm.toLowerCase();
            if (!d.title.toLowerCase().includes(st) && !d.description.toLowerCase().includes(st)) return false;
        }
        if (activeFilter === 'active') return d.status === 'active';
        if (activeFilter === 'successful') return d.status === 'funded';
        if (activeFilter === 'urgent') return d.status === 'active' && d.daysLeft <= 7;
        return true;
    });

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

    // Add demo stats
    const demoRaised = DEMO_CAMPAIGNS.reduce((acc, d) => acc + parseFloat(d.raisedEth), 0);
    const totalDisplayRaised = totalRaised + demoRaised;
    const activeCampaigns = campaigns.filter(c => Number(c.status) === 0).length;
    const demoActive = DEMO_CAMPAIGNS.filter(d => d.status === 'active').length;
    const totalCount = campaigns.length + DEMO_CAMPAIGNS.length;
    const totalActive = activeCampaigns + demoActive;
    const totalShowing = filteredCampaigns.length + filteredDemos.length;

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
                            <span className="stat-number">{totalCount}</span>
                            <span className="stat-label">Total Campaigns</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-2"><Clock size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">{totalActive}</span>
                            <span className="stat-label">Active Now</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-3"><Zap size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-number">{totalDisplayRaised.toFixed(2)} ETH</span>
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
                        Showing <strong>{totalShowing}</strong> campaign{totalShowing !== 1 ? 's' : ''}
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
                ) : (
                    <div className="campaigns-grid">
                        {/* Real blockchain campaigns first */}
                        {filteredCampaigns.map((campaign, index) => (
                            <CampaignCard
                                key={`real-${index}`}
                                campaign={campaign}
                                onContribute={fetchCampaigns}
                            />
                        ))}

                        {/* Demo campaigns */}
                        {filteredDemos.map((demo) => (
                            <DemoCampaignCard key={demo.id} campaign={demo} />
                        ))}

                        {/* No results at all */}
                        {filteredCampaigns.length === 0 && filteredDemos.length === 0 && (
                            <div className="empty-state-dash" style={{ gridColumn: '1 / -1' }}>
                                <Heart size={56} />
                                <h3>No campaigns found</h3>
                                <p>Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Connect wallet prompt at the bottom if not connected */}
                {!isConnected && (
                    <div className="connect-prompt-bottom">
                        <Wallet size={24} />
                        <div>
                            <h4>Want to donate to real campaigns?</h4>
                            <p>Connect your MetaMask wallet to interact with blockchain-verified fundraisers.</p>
                        </div>
                        <button className="btn-connect-bottom" onClick={connectWallet}>
                            <Wallet size={16} />
                            <span>Connect Wallet</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorDashboard;
