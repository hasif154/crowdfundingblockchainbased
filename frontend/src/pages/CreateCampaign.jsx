import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import {
    Rocket,
    Image,
    Type,
    FileText,
    Target,
    Calendar,
    AlertCircle,
    CheckCircle,
    Loader
} from 'lucide-react';
import './CreateCampaign.css';

const CreateCampaign = () => {
    const { contract, isConnected, connectWallet } = useWeb3();
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
            setError(err.message || 'Failed to create campaign');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="create-page">
                <div className="connect-prompt">
                    <div className="prompt-icon">
                        <Rocket size={48} />
                    </div>
                    <h2>Connect Your Wallet</h2>
                    <p>You need to connect your wallet to create a campaign</p>
                    <button className="btn-connect-prompt" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="create-page">
                <div className="success-message">
                    <div className="success-icon">
                        <CheckCircle size={64} />
                    </div>
                    <h2>Campaign Created!</h2>
                    <p>Your campaign has been successfully created on the blockchain.</p>
                    <p className="redirect-text">Redirecting to campaigns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="create-page">
            <div className="create-container">
                <div className="create-header">
                    <div className="header-icon">
                        <Rocket size={32} />
                    </div>
                    <h1>Launch Your Campaign</h1>
                    <p>Create a new crowdfunding campaign on the blockchain</p>
                </div>

                <form className="create-form" onSubmit={handleSubmit}>
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
                            placeholder="Enter a compelling title for your campaign"
                            maxLength={100}
                        />
                        <span className="char-count">{formData.title.length}/100</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <FileText size={18} />
                            <span>Description</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your project, its goals, and why people should support it..."
                            rows={5}
                            maxLength={1000}
                        />
                        <span className="char-count">{formData.description.length}/1000</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageURI">
                            <Image size={18} />
                            <span>Image URL</span>
                        </label>
                        <input
                            type="url"
                            id="imageURI"
                            name="imageURI"
                            value={formData.imageURI}
                            onChange={handleChange}
                            placeholder="https://example.com/your-image.jpg"
                        />
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
                                <span>Creating Campaign...</span>
                            </>
                        ) : (
                            <>
                                <Rocket size={20} />
                                <span>Launch Campaign</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaign;
