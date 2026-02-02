import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, LogOut, Heart, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <div className="logo-icon">
                        <Heart size={24} />
                    </div>
                    <span className="logo-text">Fund<span>Hope</span></span>
                </Link>

                <nav className="header-nav">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/campaigns" className={`nav-link ${isActive('/campaigns') ? 'active' : ''}`}>
                        Browse Fundraisers
                    </Link>
                    <Link to="/create" className={`nav-link ${isActive('/create') ? 'active' : ''}`}>
                        Start a Fundraiser
                    </Link>
                </nav>

                <div className="header-actions">
                    <Link to="/create" className="btn-start-fundraiser">
                        <Heart size={18} />
                        <span>Start Fundraising</span>
                    </Link>

                    {isConnected ? (
                        <div className="wallet-connected">
                            <div className="wallet-info">
                                <div className="wallet-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">Connected</span>
                                </div>
                                <span className="wallet-address">{formatAddress(account)}</span>
                            </div>
                            <button className="btn-disconnect" onClick={disconnectWallet} title="Disconnect">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn-connect"
                            onClick={connectWallet}
                            disabled={isConnecting}
                        >
                            <Wallet size={18} />
                            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                        </button>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
