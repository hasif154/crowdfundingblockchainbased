import { useState } from 'react';
import { ethers } from 'ethers';
import { STATUS, STATUS_COLORS } from '../config/contract';
import { useWeb3 } from '../context/Web3Context';
import { Clock, Target, Heart, TrendingUp, Users, AlertCircle, Send } from 'lucide-react';
import './CampaignCard.css';

const CampaignCard = ({ campaign, onContribute }) => {
    const { isConnected, contract, account } = useWeb3();
    const [amount, setAmount] = useState('');
    const [isContributing, setIsContributing] = useState(false);
    const [showContribute, setShowContribute] = useState(false);

    const {
        id,
        creator,
        title,
        description,
        imageURI,
        goal,
        startsAt,
        endsAt,
        status,
        totalRaised
    } = campaign;

    const goalEth = ethers.formatEther(goal);
    const raisedEth = ethers.formatEther(totalRaised);
    const progress = (Number(raisedEth) / Number(goalEth)) * 100;
    const daysLeft = Math.max(0, Math.floor((Number(endsAt) * 1000 - Date.now()) / (1000 * 60 * 60 * 24)));
    const isActive = Number(status) === 0;
    const isCreator = account?.toLowerCase() === creator.toLowerCase();
    const isUrgent = daysLeft <= 5 && isActive;

    const handleContribute = async () => {
        if (!amount || !contract) return;

        try {
            setIsContributing(true);
            const tx = await contract.contribute(id, {
                value: ethers.parseEther(amount)
            });
            await tx.wait();
            setAmount('');
            setShowContribute(false);
            if (onContribute) onContribute();
        } catch (err) {
            console.error('Contribution failed:', err);
            alert('Contribution failed: ' + err.message);
        } finally {
            setIsContributing(false);
        }
    };

    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const getStatusClass = () => {
        switch (Number(status)) {
            case 0: return 'active';
            case 2: return 'successful';
            default: return 'ended';
        }
    };

    return (
        <div className="campaign-card">
            <div className="card-image">
                <img
                    src={imageURI || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'}
                    alt={title}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400';
                    }}
                />
                <div className="card-overlay">
                    <span className={`status-badge ${getStatusClass()}`}>
                        {STATUS[status]}
                    </span>
                    {isCreator && (
                        <span className="creator-badge">Your Campaign</span>
                    )}
                </div>
                {isUrgent && (
                    <div className="urgent-badge">
                        <AlertCircle size={12} />
                        <span>Ending Soon</span>
                    </div>
                )}
            </div>

            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                <div className="progress-section">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                    <div className="progress-stats">
                        <div className="raised-info">
                            <span className="raised-amount">{raisedEth} ETH</span>
                            <span className="raised-label">raised of {goalEth} ETH</span>
                        </div>
                        <div className="goal-info">
                            <span className="goal-amount">{Math.min(100, progress).toFixed(0)}%</span>
                            <span className="goal-label">funded</span>
                        </div>
                    </div>
                </div>

                <div className="card-stats">
                    <div className="stat">
                        <Clock />
                        <span>{daysLeft} days left</span>
                    </div>
                    <div className="stat">
                        <Users />
                        <span>Backers</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="creator-info">
                        <div className="creator-avatar">
                            {creator.slice(2, 4).toUpperCase()}
                        </div>
                        <div className="creator-details">
                            <span className="creator-label">Created by</span>
                            <span className="creator-address">{formatAddress(creator)}</span>
                        </div>
                    </div>

                    {isActive && isConnected && !isCreator && (
                        <button
                            className="btn-donate"
                            onClick={() => setShowContribute(!showContribute)}
                        >
                            <Heart size={16} />
                            <span>Donate Now</span>
                        </button>
                    )}
                </div>

                {showContribute && (
                    <div className="contribute-section">
                        <div className="contribute-input-wrapper">
                            <input
                                type="number"
                                step="0.001"
                                min="0"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="contribute-input"
                            />
                            <span className="eth-label">ETH</span>
                        </div>
                        <button
                            className="btn-send"
                            onClick={handleContribute}
                            disabled={isContributing || !amount}
                        >
                            <Send size={16} />
                            <span>{isContributing ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignCard;
