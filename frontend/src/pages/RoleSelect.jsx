import { useNavigate } from 'react-router-dom';
import {
    Heart,
    HandHeart,
    ArrowRight,
    Shield,
    Zap,
    Globe,
    Sparkles,
    CheckCircle,
    Users,
    TrendingUp,
    Lock,
    Eye,
    Clock,
    BadgeCheck,
    ChevronRight,
    AlertTriangle
} from 'lucide-react';
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
        <div className="landing-page">
            {/* Testnet Banner */}
            <div className="testnet-banner">
                <AlertTriangle size={14} />
                <span>🧪 <strong>Testnet Mode</strong> — No real money is used. All transactions use free test ETH on Hardhat Network.</span>
            </div>

            {/* ─── NAVBAR ─── */}
            <nav className="landing-nav">
                <div className="nav-inner">
                    <div className="nav-logo">
                        <Heart size={24} className="logo-icon" />
                        <span>Fund<strong>Hope</strong></span>
                    </div>
                    <div className="nav-links">
                        <a href="#how-it-works">How It Works</a>
                        <a href="#why-fundhope">Why FundHope</a>
                        <a href="#get-started">Get Started</a>
                    </div>
                    <div className="nav-actions">
                        <button className="btn-nav-secondary" onClick={() => handleRoleSelect('donor')}>
                            Browse Campaigns
                        </button>
                        <button className="btn-nav-primary" onClick={() => handleRoleSelect('donee')}>
                            Start a Fundraiser
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="hero-section">
                <div className="hero-inner">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Shield size={14} />
                            <span>India's First Blockchain Crowdfunding Platform</span>
                        </div>
                        <h1>
                            Fund <span className="text-gradient">Hope</span>, Change Lives
                        </h1>
                        <p className="hero-subtitle">
                            A <strong>transparent crowdfunding system</strong> powered by blockchain.
                            Every donation is verified, every rupee is tracked, and every campaign
                            is secured by <strong>smart contract escrow</strong>. No middlemen. No hidden fees.
                            Just genuine giving.
                        </p>
                        <div className="hero-ctas">
                            <button className="btn-primary-lg" onClick={() => handleRoleSelect('donee')}>
                                <Sparkles size={18} />
                                <span>Start a Fundraiser — It's Free</span>
                                <ArrowRight size={18} />
                            </button>
                            <button className="btn-secondary-lg" onClick={() => handleRoleSelect('donor')}>
                                <Heart size={18} />
                                <span>Donate to a Cause</span>
                            </button>
                        </div>
                        <div className="hero-trust-chips">
                            <div className="trust-chip">
                                <CheckCircle size={14} />
                                <span>0% Platform Fee</span>
                            </div>
                            <div className="trust-chip">
                                <CheckCircle size={14} />
                                <span>Blockchain Verified</span>
                            </div>
                            <div className="trust-chip">
                                <CheckCircle size={14} />
                                <span>Instant Payouts</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-card hero-card-1">
                            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop" alt="Children smiling" />
                            <div className="hero-card-info">
                                <span className="hc-title">Help Arun's Heart Surgery</span>
                                <div className="hc-progress-bar"><div className="hc-fill" style={{ width: '76%' }}></div></div>
                                <span className="hc-stat">₹11.4 ETH raised of 15 ETH</span>
                            </div>
                        </div>
                        <div className="hero-card hero-card-2">
                            <img src="https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop" alt="School rebuild" />
                            <div className="hero-card-info">
                                <span className="hc-title">Rebuild Assam School</span>
                                <div className="hc-progress-bar"><div className="hc-fill" style={{ width: '62%' }}></div></div>
                                <span className="hc-stat">₹18.75 ETH raised of 25 ETH</span>
                            </div>
                        </div>
                        <div className="hero-floating-badge badge-verified">
                            <BadgeCheck size={18} />
                            <span>Blockchain Verified</span>
                        </div>
                        <div className="hero-floating-badge badge-live">
                            <div className="pulse-dot"></div>
                            <span>4 Campaigns Live</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── TRUST STRIP ─── */}
            <section className="trust-strip">
                <div className="trust-strip-inner">
                    <div className="trust-stat">
                        <strong>₹0</strong>
                        <span>Platform Fee</span>
                    </div>
                    <div className="trust-divider"></div>
                    <div className="trust-stat">
                        <strong>100%</strong>
                        <span>Blockchain Verified</span>
                    </div>
                    <div className="trust-divider"></div>
                    <div className="trust-stat">
                        <strong>Instant</strong>
                        <span>Smart Contract Payouts</span>
                    </div>
                    <div className="trust-divider"></div>
                    <div className="trust-stat">
                        <strong>24/7</strong>
                        <span>On-Chain Audit Trail</span>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section className="how-it-works" id="how-it-works">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Simple & Transparent</span>
                        <h2>How <span className="text-gradient">Decentralized Fundraising</span> Works</h2>
                        <p>Our <strong>blockchain crowdfunding platform</strong> makes raising and donating funds as simple as 1-2-3, with the added security of smart contracts.</p>
                    </div>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <div className="step-icon-wrap step-icon-1">
                                <Sparkles size={28} />
                            </div>
                            <h3>Create Your Campaign</h3>
                            <p>Share your story, set a goal, and publish your campaign. It's deployed as a <strong>smart contract</strong> on the blockchain — immutable and transparent.</p>
                        </div>
                        <div className="step-connector">
                            <ChevronRight size={20} />
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <div className="step-icon-wrap step-icon-2">
                                <Heart size={28} />
                            </div>
                            <h3>Receive Donations</h3>
                            <p>Donors contribute directly via <strong>crypto crowdfunding</strong>. Every donation is recorded on-chain — no middlemen, no hidden deductions.</p>
                        </div>
                        <div className="step-connector">
                            <ChevronRight size={20} />
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <div className="step-icon-wrap step-icon-3">
                                <Zap size={28} />
                            </div>
                            <h3>Withdraw Instantly</h3>
                            <p>Once your campaign succeeds, withdraw funds instantly through <strong>smart contract escrow</strong>. No bank delays, no processing queues.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY FUNDHOPE ─── */}
            <section className="why-fundhope" id="why-fundhope">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">The FundHope Advantage</span>
                        <h2>Why <span className="text-gradient">50,000+ Donors</span> Trust FundHope</h2>
                        <p>Traditional platforms charge fees, hold your money, and offer no real transparency. Our <strong>transparent crowdfunding system</strong> changes everything.</p>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-1"><Zap size={24} /></div>
                            <h3>0% Platform Fees</h3>
                            <p>Traditional platforms take 5-10% of every donation. With our <strong>decentralized fundraising</strong> model, 100% of your contribution reaches the cause. Only minimal network gas fees apply.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-2"><Lock size={24} /></div>
                            <h3>Smart Contract Security</h3>
                            <p>Funds are held in a tamper-proof <strong>smart contract escrow</strong> on the blockchain. No single entity can misuse or redirect your donations.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-3"><Eye size={24} /></div>
                            <h3>Full Transparency</h3>
                            <p>Every transaction is publicly verifiable on-chain. Our <strong>transparent crowdfunding system</strong> provides a permanent audit trail that anyone can inspect.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-4"><Globe size={24} /></div>
                            <h3>Global Access, Instant Payouts</h3>
                            <p>No regional restrictions or banking delays. <strong>Crypto crowdfunding</strong> enables instant cross-border donations and same-day withdrawals.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-5"><Shield size={24} /></div>
                            <h3>Donor Protection</h3>
                            <p>Built-in reentrancy guards and automated refund mechanisms protect donors. If a campaign fails, smart contracts handle refunds automatically.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon b-icon-6"><Clock size={24} /></div>
                            <h3>Real-Time Tracking</h3>
                            <p>Watch your impact in real-time. Every contribution updates the campaign progress bar instantly on our <strong>blockchain crowdfunding platform</strong>.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── COMPARISON ─── */}
            <section className="comparison-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">See the Difference</span>
                        <h2>FundHope vs <span className="text-gradient">Traditional Platforms</span></h2>
                    </div>
                    <div className="comparison-table-wrap">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th className="trad-col">Traditional Platforms</th>
                                    <th className="fh-col">FundHope (Web3)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="feature-label">Platform Fees</td>
                                    <td className="trad-cell">5% – 15% + payment processing</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> 0% — only gas fees</td>
                                </tr>
                                <tr>
                                    <td className="feature-label">Transparency</td>
                                    <td className="trad-cell">Private databases, no audit trail</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> Full on-chain audit trail</td>
                                </tr>
                                <tr>
                                    <td className="feature-label">Fund Security</td>
                                    <td className="trad-cell">Trust-based, middleman risk</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> Smart contract escrow</td>
                                </tr>
                                <tr>
                                    <td className="feature-label">Payout Speed</td>
                                    <td className="trad-cell">5-7 business days</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> Instant withdrawal</td>
                                </tr>
                                <tr>
                                    <td className="feature-label">Global Access</td>
                                    <td className="trad-cell">Regional restrictions, KYC delays</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> Borderless, 24/7</td>
                                </tr>
                                <tr>
                                    <td className="feature-label">Donor Protection</td>
                                    <td className="trad-cell">Manual dispute resolution</td>
                                    <td className="fh-cell"><CheckCircle size={16} /> Automated refunds</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ─── IMPACT NUMBERS ─── */}
            <section className="impact-section">
                <div className="section-container">
                    <div className="impact-grid">
                        <div className="impact-item">
                            <TrendingUp size={28} />
                            <strong>42.35 ETH</strong>
                            <span>Total Funds Raised</span>
                        </div>
                        <div className="impact-item">
                            <Users size={28} />
                            <strong>251+</strong>
                            <span>Happy Donors</span>
                        </div>
                        <div className="impact-item">
                            <Heart size={28} />
                            <strong>18</strong>
                            <span>Campaigns Funded</span>
                        </div>
                        <div className="impact-item">
                            <Shield size={28} />
                            <strong>100%</strong>
                            <span>On-Chain Verified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── GET STARTED (ROLE SELECT) ─── */}
            <section className="get-started-section" id="get-started">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-tag">Join the Movement</span>
                        <h2>How Would You Like to <span className="text-gradient">Participate</span>?</h2>
                        <p>Whether you want to support a cause or raise funds for one, FundHope's <strong>blockchain crowdfunding platform</strong> has you covered.</p>
                    </div>
                    <div className="role-cards">
                        <div className="role-card role-card-donor" onClick={() => handleRoleSelect('donor')}>
                            <div className="role-card-accent accent-donor"></div>
                            <div className="role-icon-wrap donor-icon-wrap">
                                <Heart size={36} />
                            </div>
                            <h3>I Want to <span>Donate</span></h3>
                            <p>Browse blockchain-verified campaigns, discover causes that matter, and donate directly to fundraisers with complete transparency.</p>
                            <ul className="role-features">
                                <li><CheckCircle size={16} /> Browse all active campaigns</li>
                                <li><CheckCircle size={16} /> Secure blockchain donations</li>
                                <li><CheckCircle size={16} /> Track every contribution on-chain</li>
                            </ul>
                            <button className="role-cta donor-cta">
                                <span>Enter as Donor</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="role-card role-card-donee" onClick={() => handleRoleSelect('donee')}>
                            <div className="role-card-accent accent-donee"></div>
                            <div className="role-icon-wrap donee-icon-wrap">
                                <HandHeart size={36} />
                            </div>
                            <h3>I Need <span>Funding</span></h3>
                            <p>Create a campaign, share your story with the world, and receive donations directly through smart contracts — no middlemen, no delays.</p>
                            <ul className="role-features">
                                <li><CheckCircle size={16} /> Create campaigns instantly</li>
                                <li><CheckCircle size={16} /> Verified on blockchain</li>
                                <li><CheckCircle size={16} /> Withdraw funds securely</li>
                            </ul>
                            <button className="role-cta donee-cta">
                                <span>Start a Fundraiser</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="landing-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Heart size={20} />
                            <span>Fund<strong>Hope</strong></span>
                        </div>
                        <p>India's first <strong>blockchain crowdfunding platform</strong>. Transparent, secure, and fee-free <strong>decentralized fundraising</strong> for everyone.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Platform</h4>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#why-fundhope">Why FundHope</a>
                        <a href="#get-started">Get Started</a>
                    </div>
                    <div className="footer-links">
                        <h4>Resources</h4>
                        <a href="#">Smart Contract Docs</a>
                        <a href="#">Blockchain Explorer</a>
                        <a href="#">FAQ</a>
                    </div>
                    <div className="footer-links">
                        <h4>Trust & Safety</h4>
                        <a href="#">Security Audit</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 FundHope. Built with ❤️ on Ethereum. Powered by smart contracts.</span>
                </div>
            </footer>
        </div>
    );
};

export default RoleSelect;
