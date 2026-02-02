import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import {
    Heart,
    Image,
    Type,
    FileText,
    Target,
    Calendar,
    AlertCircle,
    CheckCircle,
    Loader,
    Lightbulb,
    Check,
    Wallet
} from 'lucide-react';
import './CreateCampaign.css';

const CreateCampaign = () => {
    const { contract, isConnected, connectWallet, wrongNetwork, error: web3Error, switchToLocalNetwork } = useWeb3();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageURI: '',
        goal: '',
        duration: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!contract) {
            setError('Please connect your wallet first');
            return;
        }

        const { title, description, imageURI, goal, duration } = formData;

        if (!title || !description || !imageURI || !goal || !duration) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setIsSubmitting(true);

            const goalInWei = ethers.parseEther(goal);
            const durationDays = parseInt(duration);
            const endsAt = Math.floor(Date.now() / 1000) + (durationDays * 24 * 60 * 60);

            const tx = await contract.createCampaign(
                title,
                description,
                imageURI,
                goalInWei,
                endsAt
            );

            await tx.wait();
            setSuccess(true);
            setFormData({
                title: '',
                description: '',
                imageURI: '',
                goal: '',
                duration: ''
            });

            setTimeout(() => {
                window.location.href = '/campaigns';
            }, 2000);
        } catch (err) {
            console.error('Error creating campaign:', err);

            // Handle specific error types
            const errorMessage = err.message || 'Failed to create campaign';
            if (errorMessage.includes('403') || errorMessage.includes('RPC endpoint') || errorMessage.includes('coalesce')) {
                setError('Network error: Please make sure Hardhat node is running (npx hardhat node) and MetaMask is connected to localhost:8545');
            } else if (errorMessage.includes('user rejected')) {
                setError('Transaction was rejected by user');
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isConnected || wrongNetwork) {
        return (
            <div className="create-page">
                <div className="connect-prompt">
                    <div className="prompt-icon">
                        <Wallet size={40} />
                    </div>
                    <h2>{wrongNetwork ? 'Wrong Network' : 'Connect Your Wallet'}</h2>
                    <p>
                        {wrongNetwork
                            ? 'Please switch to Hardhat Local network (Chain ID: 31337) to continue'
                            : 'You need to connect your wallet to create a fundraiser'
                        }
                    </p>
                    {web3Error && (
                        <div className="error-banner" style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <AlertCircle size={20} />
                            <span>{web3Error}</span>
                        </div>
                    )}
                    {wrongNetwork ? (
                        <button className="btn-connect-prompt" onClick={switchToLocalNetwork}>
                            <AlertCircle size={20} />
                            Switch to Hardhat Network
                        </button>
                    ) : (
                        <button className="btn-connect-prompt" onClick={connectWallet}>
                            <Wallet size={20} />
                            Connect Wallet
                        </button>
                    )}
                    <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Make sure Hardhat node is running: <code style={{ background: 'var(--color-bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>npx hardhat node</code>
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="create-page">
                <div className="success-message">
                    <div className="success-icon">
                        <CheckCircle size={48} />
                    </div>
                    <h2>Fundraiser Created! 🎉</h2>
                    <p>Your fundraiser has been successfully created on the blockchain.</p>
                    <p className="redirect-text">Redirecting to campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-page">
            <div className="create-header">
                <div className="create-header-container">
                    <div className="header-icon">
                        <Heart size={36} />
                    </div>
                    <h1 className="create-page-title">Start Your Fundraiser</h1>
                    <p className="create-page-subtitle">
                        Create a campaign in minutes and start receiving donations from supporters worldwide
                    </p>
                </div>
            </div>

            <div className="create-container">
                <form className="create-form" onSubmit={handleSubmit}>
                    {/* Progress Steps */}
                    <div className="form-steps">
                        <div className="step-dot active"></div>
                        <div className="step-dot"></div>
                        <div className="step-dot"></div>
                    </div>

                    {error && (
                        <div className="error-banner">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">
                            <Type size={18} />
                            <span>Campaign Title</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="E.g., Help Ravi fight cancer"
                            maxLength={100}
                        />
                        <span className="char-count">{formData.title.length}/100</span>
                        <p className="form-hint">Write a clear, specific title that explains your fundraiser</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <FileText size={18} />
                            <span>Your Story</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Share your story - why you're raising funds, how it will help, and what impact donors will make..."
                            rows={6}
                            maxLength={1000}
                        />
                        <span className="char-count">{formData.description.length}/1000</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageURI">
                            <Image size={18} />
                            <span>Cover Image URL</span>
                        </label>
                        <input
                            type="url"
                            id="imageURI"
                            name="imageURI"
                            value={formData.imageURI}
                            onChange={handleChange}
                            placeholder="https://example.com/your-image.jpg"
                        />
                        <p className="form-hint">Add a compelling image that represents your cause</p>
                        {formData.imageURI && (
                            <div className="image-preview">
                                <img
                                    src={formData.imageURI}
                                    alt="Preview"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="goal">
                                <Target size={18} />
                                <span>Funding Goal (ETH)</span>
                            </label>
                            <input
                                type="number"
                                id="goal"
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                placeholder="10"
                                min="0.001"
                                step="0.001"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duration">
                                <Calendar size={18} />
                                <span>Duration (Days)</span>
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="30"
                                min="1"
                                max="365"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader className="spin" size={20} />
                                <span>Creating Your Fundraiser...</span>
                            </>
                        ) : (
                            <>
                                <Heart size={20} />
                                <span>Launch Fundraiser</span>
                            </>
                        )}
                    </button>

                    {/* Tips Card */}
                    <div className="tips-card">
                        <div className="tips-title">
                            <Lightbulb size={18} />
                            <span>Tips for a successful fundraiser</span>
                        </div>
                        <ul className="tips-list">
                            <li>
                                <Check size={16} />
                                <span>Use a clear, emotional title that explains your cause</span>
                            </li>
                            <li>
                                <Check size={16} />
                                <span>Share your story with specific details and how funds will be used</span>
                            </li>
                            <li>
                                <Check size={16} />
                                <span>Add a high-quality, relevant image</span>
                            </li>
                            <li>
                                <Check size={16} />
                                <span>Set a realistic goal and timeline</span>
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;
