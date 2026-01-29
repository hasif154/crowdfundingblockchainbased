import { useState } from 'react';
import { ethers } from 'ethers';
import { STATUS, STATUS_COLORS } from '../config/contract';
import { useWeb3 } from '../context/Web3Context';
import { Clock, Target, Users, TrendingUp, ExternalLink } from 'lucide-react';
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
                    <span
                        className="status-badge"
                        style={{ backgroundColor: STATUS_COLORS[status] }}
                    >
                        {STATUS[status]}
                    </span>
                    {isCreator && (
                        <span className="creator-badge">Your Campaign</span>
                    )}
                </div>
            </div>

            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                <div className="card-stats">
                    <div className="stat">
                        <Target size={16} />
                        <span>{goalEth} ETH</span>
                    </div>
                    <div className="stat">
                        <Clock size={16} />
                        <span>{daysLeft} days left</span>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-header">
                        <span className="raised-amount">
                            <TrendingUp size={14} />
                            {raisedEth} ETH raised
                        </span>
                        <span className="progress-percent">{Math.min(100, progress).toFixed(1)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                </div>

                <div className="card-footer">
                    <div className="creator-info">
                        <div className="creator-avatar">
                            {creator.slice(2, 4).toUpperCase()}
                        </div>
                        <span className="creator-address">{formatAddress(creator)}</span>
                    </div>

                    {isActive && isConnected && !isCreator && (
                        <button
                            className="btn-contribute"
                            onClick={() => setShowContribute(!showContribute)}
                        >
                            Fund Project
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
                                placeholder="Amount in ETH"
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
                            {isContributing ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignCard;
