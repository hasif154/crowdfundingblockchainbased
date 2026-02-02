import { Link } from 'react-router-dom';
import { Heart, Shield, Lock, CheckCircle, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="footer-logo-icon">
                                <Heart size={24} />
                            </div>
                            <span className="footer-logo-text">Fund<span>Hope</span></span>
                        </div>
                        <p className="footer-description">
                            Empowering dreams through transparent blockchain-based crowdfunding.
                            Join millions of donors making a difference every day.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Fundraise */}
                    <div className="footer-links">
                        <h4>Fundraise for</h4>
                        <ul>
                            <li><Link to="/campaigns">Medical</Link></li>
                            <li><Link to="/campaigns">Education</Link></li>
                            <li><Link to="/campaigns">Emergency</Link></li>
                            <li><Link to="/campaigns">NGO & Charity</Link></li>
                            <li><Link to="/campaigns">Creative Projects</Link></li>
                        </ul>
                    </div>

                    {/* Learn More */}
                    <div className="footer-links">
                        <h4>Learn More</h4>
                        <ul>
                            <li><Link to="/">How It Works</Link></li>
                            <li><Link to="/create">Start a Fundraiser</Link></li>
                            <li><Link to="/campaigns">Browse Campaigns</Link></li>
                            <li><a href="#">Success Stories</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Trust & Safety</a></li>
                            <li><a href="#">Report a Campaign</a></li>
                        </ul>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="footer-trust">
                    <div className="trust-badge">
                        <Shield size={16} />
                        <span>Blockchain Secured</span>
                    </div>
                    <div className="trust-badge">
                        <Lock size={16} />
                        <span>100% Secure Donations</span>
                    </div>
                    <div className="trust-badge">
                        <CheckCircle size={16} />
                        <span>Verified Campaigns</span>
                    </div>
                </div>

                {/* Bottom */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2026 FundHope. All rights reserved. Built on Ethereum.
                    </p>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
