import { useNavigate } from 'react-router-dom';
import { Heart, HandHeart, ArrowRight, Shield, Zap, Globe, Sparkles } from 'lucide-react';
import './RoleSelect.css';

const RoleSelect = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        localStorage.setItem('fundhope_role', role);
        if (role === 'donor') {
            navigate('/donor');
        } else {
            navigate('/donee');
        }
    };

    return (
        <div className="role-select-page">
            {/* Testnet Banner */}
            <div className="testnet-banner">
                <Shield size={16} />
                <span>🧪 Testnet Mode — No real money is used. All transactions use free test ETH.</span>
            </div>

            <div className="role-select-container">
                {/* Hero Content */}
                <div className="role-hero">
                    <div className="role-hero-badge">
                        <Sparkles size={16} />
                        <span>Blockchain-Powered Crowdfunding</span>
                    </div>
                    <h1 className="role-hero-title">
                        Welcome to <span className="highlight">FundHope</span>
                    </h1>
                    <p className="role-hero-subtitle">
                        A transparent, blockchain-based crowdfunding platform where every transaction
                        is secure and verifiable. Choose how you'd like to participate today.
                    </p>
                </div>

                {/* Role Cards */}
                <div className="role-cards">
                    {/* Donor Card */}
                    <div
                        className="role-card role-card-donor"
                        onClick={() => handleRoleSelect('donor')}
                    >
                        <div className="role-card-glow donor-glow"></div>
                        <div className="role-card-icon donor-icon">
                            <Heart size={40} />
                        </div>
                        <h2 className="role-card-title">I want to <span>Donate</span></h2>
                        <p className="role-card-description">
                            Browse campaigns, discover causes that matter to you, and make a difference
                            with transparent blockchain-backed donations.
                        </p>
                        <ul className="role-card-features">
                            <li>
                                <Globe size={16} />
                                <span>Browse all active campaigns</span>
                            </li>
                            <li>
                                <Shield size={16} />
                                <span>Secure blockchain donations</span>
                            </li>
                            <li>
                                <Zap size={16} />
                                <span>Track your contributions</span>
                            </li>
                        </ul>
                        <button className="role-card-btn donor-btn">
                            <span>Enter as Donor</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Donee Card */}
                    <div
                        className="role-card role-card-donee"
                        onClick={() => handleRoleSelect('donee')}
                    >
                        <div className="role-card-glow donee-glow"></div>
                        <div className="role-card-icon donee-icon">
                            <HandHeart size={40} />
                        </div>
                        <h2 className="role-card-title">I need <span>Donations</span></h2>
                        <p className="role-card-description">
                            Create a fundraising campaign, share your story with the world, and receive
                            donations directly through smart contracts.
                        </p>
                        <ul className="role-card-features">
                            <li>
                                <Zap size={16} />
                                <span>Create campaigns instantly</span>
                            </li>
                            <li>
                                <Shield size={16} />
                                <span>Verified on blockchain</span>
                            </li>
                            <li>
                                <Globe size={16} />
                                <span>Withdraw funds securely</span>
                            </li>
                        </ul>
                        <button className="role-card-btn donee-btn">
                            <span>Enter as Fundraiser</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="role-bottom-info">
                    <div className="info-item">
                        <Shield size={20} />
                        <div>
                            <strong>100% Transparent</strong>
                            <span>All transactions recorded on blockchain</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <Zap size={20} />
                        <div>
                            <strong>Test Network</strong>
                            <span>Using Hardhat testnet — no real funds</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <Globe size={20} />
                        <div>
                            <strong>Decentralized</strong>
                            <span>No middlemen, direct peer-to-peer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelect;
