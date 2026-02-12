import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { STATUS } from '../config/contract';
import {
    Heart,
    Plus,
    Shield,
    Wallet,
    LogOut,
    AlertCircle,
    CheckCircle,
    Clock,
    Target,
    TrendingUp,
    Image,
    Type,
    FileText,
    Calendar,
    Loader,
    Lightbulb,
    Check,
    ArrowRight,
    Eye,
    Trash2,
    Download,
    Sparkles,
    HandHeart
} from 'lucide-react';
import './DoneeDashboard.css';

const DoneeDashboard = () => {
    const { contract, isConnected, connectWallet, account, disconnectWallet, wrongNetwork, switchToLocalNetwork, error: web3Error } = useWeb3();
    const [myCampaigns, setMyCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageURI: '',
        goal: '',
        duration: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(null);
    const [withdrawingId, setWithdrawingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    const fetchMyCampaigns = async () => {
        if (!contract || !account) {
            setLoading(false);
            return;
        }

        try {
            const allCampaigns = await contract.getAllCampaigns();
            const mine = allCampaigns.filter(
                (c) => c.creator.toLowerCase() === account.toLowerCase()
            );
            setMyCampaigns([...mine].reverse());
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCampaigns();
    }, [contract, account]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!contract) {
            setFormError('Please connect your wallet first');
            return;
        }

        const { title, description, imageURI, goal, duration } = formData;
        if (!title || !description || !imageURI || !goal || !duration) {
            setFormError('Please fill in all fields');
            return;
        }

        try {
            setIsSubmitting(true);
            const goalInWei = ethers.parseEther(goal);
            const durationDays = parseInt(duration);
            const endsAt = Math.floor(Date.now() / 1000) + (durationDays * 24 * 60 * 60);

            const tx = await contract.createCampaign(title, description, imageURI, goalInWei, endsAt);
            await tx.wait();

            setFormSuccess(true);
            setFormData({ title: '', description: '', imageURI: '', goal: '', duration: '' });

            setTimeout(() => {
                setFormSuccess(false);
                setShowCreateForm(false);
                fetchMyCampaigns();
            }, 2000);
        } catch (err) {
            console.error('Error creating campaign:', err);
            const errorMessage = err.message || 'Failed to create campaign';
            if (errorMessage.includes('user rejected')) {
                setFormError('Transaction was rejected');
            } else {
                setFormError('Failed to create campaign. Make sure Hardhat is running.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdraw = async (campaignId) => {
        if (!contract) return;
        try {
            setWithdrawingId(campaignId);
            const tx = await contract.withdraw(campaignId);
            await tx.wait();
            fetchMyCampaigns();
        } catch (err) {
            console.error('Withdraw failed:', err);
            alert('Withdraw failed: ' + (err.reason || err.message));
        } finally {
            setWithdrawingId(null);
        }
    };

    const handleDelete = async (campaignId) => {
        if (!contract) return;
        if (!window.confirm('Are you sure you want to delete this campaign? Donors will be able to claim refunds.')) return;
        try {
            setDeletingId(campaignId);
            const tx = await contract.deleteCampaign(campaignId);
            await tx.wait();
            fetchMyCampaigns();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Delete failed: ' + (err.reason || err.message));
        } finally {
            setDeletingId(null);
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const totalRaised = myCampaigns.reduce((acc, c) => acc + Number(ethers.formatEther(c.totalRaised)), 0);
    const activeCampaigns = myCampaigns.filter(c => Number(c.status) === 0).length;
    const successfulCampaigns = myCampaigns.filter(c => Number(c.status) === 2).length;

    return (
        <div className="donee-dashboard">
            {/* Testnet Banner */}
            <div className="testnet-banner-dash donee-testnet">
                <Shield size={14} />
                <span>🧪 Testnet Mode — No real money is charged. All ETH is free test currency.</span>
            </div>

            {/* Top Bar */}
            <header className="donee-topbar">
                <div className="topbar-left">
                    <Link to="/" className="topbar-logo">
                        <Heart size={22} />
                        <span className="logo-text">Fund<span>Hope</span></span>
                    </Link>
                    <span className="role-badge donee-role-badge">
                        <HandHeart size={12} />
                        Fundraiser
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
                        <button className="btn-connect-donee" onClick={connectWallet}>
                            <Wallet size={16} />
                            <span>Connect Wallet</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="donee-content">
                {/* Stats */}
                <div className="donee-stats-bar">
                    <div className="stat-card-donee">
                        <div className="stat-icon-donee si-1"><Target size={20} /></div>
                        <div className="stat-info-donee">
                            <span className="stat-num">{myCampaigns.length}</span>
                            <span className="stat-lbl">My Campaigns</span>
                        </div>
                    </div>
                    <div className="stat-card-donee">
                        <div className="stat-icon-donee si-2"><Clock size={20} /></div>
                        <div className="stat-info-donee">
                            <span className="stat-num">{activeCampaigns}</span>
                            <span className="stat-lbl">Active</span>
                        </div>
                    </div>
                    <div className="stat-card-donee">
                        <div className="stat-icon-donee si-3"><CheckCircle size={20} /></div>
                        <div className="stat-info-donee">
                            <span className="stat-num">{successfulCampaigns}</span>
                            <span className="stat-lbl">Funded</span>
                        </div>
                    </div>
                    <div className="stat-card-donee">
                        <div className="stat-icon-donee si-4"><TrendingUp size={20} /></div>
                        <div className="stat-info-donee">
                            <span className="stat-num">{totalRaised.toFixed(2)} ETH</span>
                            <span className="stat-lbl">Total Raised</span>
                        </div>
                    </div>
                </div>

                {/* Header + Create Button */}
                <div className="donee-page-header">
                    <div>
                        <h1>My Campaigns</h1>
                        <p>Create and manage your fundraising campaigns</p>
                    </div>
                    <div className="donee-header-actions">
                        {wrongNetwork && (
                            <button className="btn-wrong-network" onClick={switchToLocalNetwork}>
                                <AlertCircle size={16} />
                                Switch to Testnet
                            </button>
                        )}
                        {isConnected && (
                            <button
                                className="btn-create-new"
                                onClick={() => setShowCreateForm(!showCreateForm)}
                            >
                                <Plus size={18} />
                                <span>{showCreateForm ? 'Cancel' : 'Create Campaign'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {web3Error && (
                    <div className="error-banner-donee">
                        <AlertCircle size={18} />
                        <span>{web3Error}</span>
                    </div>
                )}

                {/* Create Form */}
                {showCreateForm && isConnected && (
                    <div className="create-form-section">
                        {formSuccess ? (
                            <div className="form-success-donee">
                                <CheckCircle size={48} />
                                <h3>Campaign Created! 🎉</h3>
                                <p>Your campaign has been recorded on the blockchain and is now live.</p>
                                <div className="verification-badge">
                                    <Shield size={16} />
                                    <span>Blockchain Verified</span>
                                </div>
                            </div>
                        ) : (
                            <form className="donee-create-form" onSubmit={handleCreateSubmit}>
                                <div className="form-header-donee">
                                    <Sparkles size={24} />
                                    <div>
                                        <h2>Create New Campaign</h2>
                                        <p>Fill in the details below. Your campaign will be stored on the blockchain.</p>
                                    </div>
                                </div>

                                {formError && (
                                    <div className="form-error-donee">
                                        <AlertCircle size={18} />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="form-grid-donee">
                                    <div className="form-group-donee full-width">
                                        <label>
                                            <Type size={16} />
                                            <span>Campaign Title</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="E.g., Help Ravi fight cancer"
                                            maxLength={100}
                                        />
                                        <span className="char-ct">{formData.title.length}/100</span>
                                    </div>

                                    <div className="form-group-donee full-width">
                                        <label>
                                            <FileText size={16} />
                                            <span>Your Story</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Share your story — why you're raising funds and how it will help..."
                                            rows={4}
                                            maxLength={1000}
                                        />
                                        <span className="char-ct">{formData.description.length}/1000</span>
                                    </div>

                                    <div className="form-group-donee full-width">
                                        <label>
                                            <Image size={16} />
                                            <span>Cover Image URL</span>
                                        </label>
                                        <input
                                            type="url"
                                            name="imageURI"
                                            value={formData.imageURI}
                                            onChange={handleChange}
                                            placeholder="https://example.com/your-image.jpg"
                                        />
                                        {formData.imageURI && (
                                            <div className="img-preview-donee">
                                                <img
                                                    src={formData.imageURI}
                                                    alt="Preview"
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group-donee">
                                        <label>
                                            <Target size={16} />
                                            <span>Goal (ETH) — Test ETH</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="goal"
                                            value={formData.goal}
                                            onChange={handleChange}
                                            placeholder="10"
                                            min="0.001"
                                            step="0.001"
                                        />
                                    </div>

                                    <div className="form-group-donee">
                                        <label>
                                            <Calendar size={16} />
                                            <span>Duration (Days)</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="30"
                                            min="1"
                                            max="365"
                                        />
                                    </div>
                                </div>

                                <div className="form-actions-donee">
                                    <button
                                        type="submit"
                                        className="btn-submit-donee"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader className="spin" size={18} />
                                                <span>Creating on Blockchain...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Heart size={18} />
                                                <span>Launch Campaign</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="form-tips-donee">
                                    <Lightbulb size={16} />
                                    <span><strong>Note:</strong> Creating a campaign costs a small amount of gas (test ETH). No real money is used.</span>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* My Campaigns List */}
                {loading ? (
                    <div className="donee-campaigns-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card-donee">
                                <div className="skeleton-img-donee"></div>
                                <div className="skeleton-body-donee">
                                    <div className="skeleton-line-d"></div>
                                    <div className="skeleton-line-d short"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isConnected ? (
                    <div className="connect-prompt-donee">
                        <Wallet size={48} />
                        <h3>Connect Your Wallet</h3>
                        <p>Connect MetaMask to create and manage your campaigns on the testnet.</p>
                        <button className="btn-connect-big-donee" onClick={connectWallet}>
                            <Wallet size={20} />
                            <span>Connect Wallet</span>
                        </button>
                        <span className="connect-hint-donee">Run <code>npx hardhat node</code> first</span>
                    </div>
                ) : myCampaigns.length > 0 ? (
                    <div className="donee-campaigns-list">
                        {myCampaigns.map((campaign) => {
                            const goalEth = ethers.formatEther(campaign.goal);
                            const raisedEth = ethers.formatEther(campaign.totalRaised);
                            const progress = (Number(raisedEth) / Number(goalEth)) * 100;
                            const daysLeft = Math.max(0, Math.floor((Number(campaign.endsAt) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
                            const statusNum = Number(campaign.status);
                            const isActive = statusNum === 0;
                            const isSuccessful = statusNum === 2;

                            return (
                                <div key={Number(campaign.id)} className="my-campaign-card">
                                    <div className="mc-image">
                                        <img
                                            src={campaign.imageURI || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'}
                                            alt={campaign.title}
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'; }}
                                        />
                                        <span className={`mc-status ${isActive ? 'active' : isSuccessful ? 'successful' : 'ended'}`}>
                                            {STATUS[campaign.status]}
                                        </span>
                                    </div>
                                    <div className="mc-body">
                                        <h3 className="mc-title">{campaign.title}</h3>
                                        <p className="mc-desc">{campaign.description}</p>

                                        <div className="mc-progress">
                                            <div className="mc-progress-bar">
                                                <div className="mc-progress-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
                                            </div>
                                            <div className="mc-progress-info">
                                                <span><strong>{raisedEth} ETH</strong> raised of {goalEth} ETH</span>
                                                <span>{Math.min(100, progress).toFixed(0)}%</span>
                                            </div>
                                        </div>

                                        <div className="mc-meta">
                                            <span className="mc-meta-item">
                                                <Clock size={14} />
                                                {daysLeft} days left
                                            </span>
                                            <span className="mc-meta-item mc-verified">
                                                <Shield size={14} />
                                                On-Chain Verified
                                            </span>
                                        </div>

                                        <div className="mc-actions">
                                            {isSuccessful && (
                                                <button
                                                    className="btn-mc-withdraw"
                                                    onClick={() => handleWithdraw(campaign.id)}
                                                    disabled={withdrawingId === campaign.id}
                                                >
                                                    <Download size={16} />
                                                    <span>{withdrawingId === campaign.id ? 'Withdrawing...' : 'Withdraw Funds'}</span>
                                                </button>
                                            )}
                                            {isActive && (
                                                <button
                                                    className="btn-mc-delete"
                                                    onClick={() => handleDelete(campaign.id)}
                                                    disabled={deletingId === campaign.id}
                                                >
                                                    <Trash2 size={16} />
                                                    <span>{deletingId === campaign.id ? 'Deleting...' : 'Cancel Campaign'}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="donee-empty">
                        <HandHeart size={56} />
                        <h3>No campaigns yet</h3>
                        <p>Create your first fundraiser and start receiving donations!</p>
                        <button className="btn-create-first" onClick={() => setShowCreateForm(true)}>
                            <Plus size={18} />
                            <span>Create Your First Campaign</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoneeDashboard;
