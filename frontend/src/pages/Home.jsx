import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/CampaignCard';
import {
    Heart,
    ArrowRight,
    Shield,
    Zap,
    Globe,
    TrendingUp,
    Users,
    CheckCircle,
    Sparkles,
    Target,
    Clock,
    Award
} from 'lucide-react';
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
        { value: '₹150Cr+', label: 'Funds Raised' },
        { value: '10,000+', label: 'Campaigns' },
        { value: '1M+', label: 'Donors' },
    ];

    const categories = [
        { icon: '🏥', name: 'Medical', count: '2,450 campaigns' },
        { icon: '📚', name: 'Education', count: '1,230 campaigns' },
        { icon: '🏠', name: 'Emergency', count: '890 campaigns' },
        { icon: '🤝', name: 'NGO', count: '650 campaigns' },
        { icon: '🎭', name: 'Creative', count: '420 campaigns' },
        { icon: '🌱', name: 'Environment', count: '380 campaigns' },
    ];

    const steps = [
        { number: 1, title: 'Start Your Fundraiser', description: 'Create your campaign in just 2 minutes with our easy-to-use form.' },
        { number: 2, title: 'Share Your Story', description: 'Share your fundraiser with friends, family, and on social media.' },
        { number: 3, title: 'Receive Donations', description: 'Collect funds securely via blockchain with complete transparency.' },
    ];

    const features = [
        {
            icon: Shield,
            title: 'Blockchain Secured',
            description: 'Every transaction is recorded on the Ethereum blockchain for complete transparency and security.'
        },
        {
            icon: Zap,
            title: 'Instant Transfers',
            description: 'No waiting period. Funds are transferred instantly through smart contracts.'
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Accept donations from anywhere in the world without currency conversion issues.'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Heart size={16} />
                            <span>Trusted by 1 Million+ Donors</span>
                        </div>

                        <h1 className="hero-title">
                            Empowering Dreams Through <span className="highlight">Crowdfunding</span>
                        </h1>

                        <p className="hero-subtitle">
                            Start your fundraiser in minutes. Join thousands of people raising funds for
                            medical emergencies, education, NGOs, and more with blockchain transparency.
                        </p>

                        <div className="hero-actions">
                            <Link to="/create" className="btn-primary">
                                <span>Start a Fundraiser</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/campaigns" className="btn-secondary">
                                Browse Campaigns
                            </Link>
                        </div>

                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-value">
                                        {stat.value}
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="hero-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop"
                                alt="People helping each other"
                            />
                        </div>
                        <div className="hero-floating-card card-1">
                            <div className="floating-icon">
                                <CheckCircle size={20} />
                            </div>
                            <div className="floating-content">
                                <span className="floating-value">₹5,00,000</span>
                                <span className="floating-label">Just funded!</span>
                            </div>
                        </div>
                        <div className="hero-floating-card card-2">
                            <div className="floating-content">
                                <span className="floating-value">+125</span>
                                <span className="floating-label">New donors today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="trust-section">
                <div className="trust-container">
                    <span className="trust-text">Trusted & Verified Platform</span>
                    <div className="trust-logos">
                        <div className="trust-logo">
                            <Shield size={20} />
                            <span>Blockchain Secured</span>
                        </div>
                        <div className="trust-logo">
                            <Award size={20} />
                            <span>Verified Campaigns</span>
                        </div>
                        <div className="trust-logo">
                            <Users size={20} />
                            <span>1M+ Happy Donors</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Categories</span>
                        <h2 className="section-title">Browse by Category</h2>
                        <p className="section-subtitle">
                            Find campaigns that matter to you and make a difference
                        </p>
                    </div>

                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <Link to="/campaigns" key={index} className="category-card">
                                <div className="category-icon">{category.icon}</div>
                                <h3 className="category-name">{category.name}</h3>
                                <span className="category-count">{category.count}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Campaigns Section */}
            <section className="campaigns-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Featured Campaigns</span>
                        <h2 className="section-title">Trending Fundraisers</h2>
                        <p className="section-subtitle">
                            These campaigns need your support right now
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
                            <Heart size={64} className="empty-icon" />
                            <h3>No campaigns yet</h3>
                            <p>Be the first to create a campaign and start making a difference!</p>
                            <Link to="/create" className="btn-primary">
                                Start a Fundraiser
                            </Link>
                        </div>
                    )}

                    {campaigns.length > 0 && (
                        <div className="section-footer">
                            <Link to="/campaigns" className="btn-view-all">
                                View All Campaigns
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">How It Works</span>
                        <h2 className="section-title">Start Fundraising in 3 Easy Steps</h2>
                        <p className="section-subtitle">
                            It's simple, secure, and takes just a few minutes
                        </p>
                    </div>

                    <div className="steps-grid">
                        {steps.map((step) => (
                            <div key={step.number} className="step-card">
                                <div className="step-number">{step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Why FundHope</span>
                        <h2 className="section-title">Built for Trust & Transparency</h2>
                        <p className="section-subtitle">
                            We leverage blockchain technology to make crowdfunding more secure and transparent
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

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to Make a Difference?</h2>
                    <p className="cta-subtitle">
                        Start your fundraiser today and join thousands of people who have
                        successfully raised funds for causes they care about.
                    </p>
                    <Link to="/create" className="btn-cta">
                        Start Your Fundraiser Now
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
