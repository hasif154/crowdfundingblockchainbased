import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/CampaignCard';
import { Rocket, Zap, Shield, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { contract, isConnected } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        if (!contract) {
            setLoading(false);
            return;
        }

        try {
            const allCampaigns = await contract.getAllCampaigns();
            setCampaigns(allCampaigns.slice(-4).reverse());
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [contract]);

    const stats = [
        { label: 'Total Campaigns', value: '150+', icon: Rocket },
        { label: 'ETH Raised', value: '2,450', icon: TrendingUp },
        { label: 'Backers', value: '12K+', icon: Zap },
    ];

    const features = [
        {
            icon: Shield,
            title: 'Secure & Transparent',
            description: 'All transactions are recorded on the blockchain, ensuring complete transparency and security.'
        },
        {
            icon: Zap,
            title: 'Instant Funding',
            description: 'Smart contracts enable immediate fund transfers without intermediaries.'
        },
        {
            icon: Sparkles,
            title: 'Decentralized',
            description: 'No single point of failure. Your campaign lives on the blockchain forever.'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient-1"></div>
                    <div className="hero-gradient-2"></div>
                    <div className="hero-grid"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>Powered by Ethereum</span>
                    </div>

                    <h1 className="hero-title">
                        Fund the Future with
                        <span className="gradient-text"> Blockchain</span>
                    </h1>

                    <p className="hero-subtitle">
                        Launch your crowdfunding campaign on the blockchain.
                        Transparent, secure, and borderless fundraising for everyone.
                    </p>

                    <div className="hero-actions">
                        <a href="/create" className="btn-primary">
                            <span>Start Campaign</span>
                            <ArrowRight size={18} />
                        </a>
                        <a href="/campaigns" className="btn-secondary">
                            Explore Projects
                        </a>
                    </div>

                    <div className="hero-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <stat.icon className="stat-icon" size={24} />
                                <div className="stat-content">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Why Choose Us</span>
                        <h2 className="section-title">Built for the Future</h2>
                        <p className="section-subtitle">
                            Leverage blockchain technology for transparent and efficient crowdfunding
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Campaigns Section */}
            <section className="campaigns-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Latest Projects</span>
                        <h2 className="section-title">Trending Campaigns</h2>
                        <p className="section-subtitle">
                            Discover innovative projects seeking funding right now
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="skeleton-card">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-content">
                                        <div className="skeleton-line"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : campaigns.length > 0 ? (
                        <div className="campaigns-grid">
                            {campaigns.map((campaign, index) => (
                                <CampaignCard
                                    key={index}
                                    campaign={campaign}
                                    onContribute={fetchCampaigns}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Rocket size={64} className="empty-icon" />
                            <h3>No campaigns yet</h3>
                            <p>Be the first to create a campaign!</p>
                            <a href="/create" className="btn-primary">
                                Create Campaign
                            </a>
                        </div>
                    )}

                    {campaigns.length > 0 && (
                        <div className="section-footer">
                            <a href="/campaigns" className="btn-view-all">
                                View All Campaigns
                                <ArrowRight size={18} />
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Start Your Journey?</h2>
                        <p className="cta-subtitle">
                            Create your campaign in minutes and start receiving funds from backers worldwide.
                        </p>
                        <a href="/create" className="btn-cta">
                            Launch Your Campaign
                            <ArrowRight size={20} />
                        </a>
                    </div>
                    <div className="cta-decoration">
                        <div className="cta-circle"></div>
                        <div className="cta-circle-2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
