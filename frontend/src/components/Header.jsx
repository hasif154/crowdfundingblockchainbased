import { useWeb3 } from '../context/Web3Context';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-icon">
                        <span className="logo-emoji">🚀</span>
                    </div>
                    <span className="logo-text">CrowdFund</span>
                    <span className="logo-badge">Web3</span>
                </div>

                <nav className="header-nav">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/campaigns" className="nav-link">Campaigns</a>
                    <a href="/create" className="nav-link">Create</a>
                </nav>

                <div className="header-actions">
                    {isConnected ? (
                        <div className="wallet-connected">
                            <div className="wallet-info">
                                <div className="wallet-status">
                                    <span className="status-dot"></span>
                                    <span className="status-text">Connected</span>
                                </div>
                                <span className="wallet-address">{formatAddress(account)}</span>
                            </div>
                            <button className="btn-disconnect" onClick={disconnectWallet}>
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
                </div>
            </div>
        </header>
    );
};

export default Header;
