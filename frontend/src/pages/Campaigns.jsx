import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, Grid, List } from 'lucide-react';
import './Campaigns.css';

const Campaigns = () => {
    const { contract } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchCampaigns = async () => {
        if (!contract) {
            setLoading(false);
            return;
        }

        try {
            const allCampaigns = await contract.getAllCampaigns();
            setCampaigns([...allCampaigns].reverse());
            setFilteredCampaigns([...allCampaigns].reverse());
        } catch (err) {
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [contract]);

    useEffect(() => {
        let result = [...campaigns];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter((c) => Number(c.status) === Number(statusFilter));
        }

        setFilteredCampaigns(result);
    }, [searchTerm, statusFilter, campaigns]);

    return (
        <div className="campaigns-page">
            <div className="page-header">
                <h1 className="page-title">Explore Campaigns</h1>
                <p className="page-subtitle">
                    Discover innovative projects and help bring ideas to life
                </p>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-buttons">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-select"
                    >
                        <option value="all">All Status</option>
                        <option value="0">Active</option>
                        <option value="2">Successful</option>
                        <option value="3">Ended</option>
                    </select>
                </div>
            </div>

            <div className="results-info">
                <span className="results-count">
                    {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
                </span>
            </div>

            {loading ? (
                <div className="loading-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="skeleton-card">
                            <div className="skeleton-image"></div>
                            <div className="skeleton-content">
                                <div className="skeleton-line"></div>
                                <div className="skeleton-line short"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredCampaigns.length > 0 ? (
                <div className="campaigns-grid">
                    {filteredCampaigns.map((campaign, index) => (
                        <CampaignCard
                            key={index}
                            campaign={campaign}
                            onContribute={fetchCampaigns}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Search size={64} className="empty-icon" />
                    <h3>No campaigns found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default Campaigns;
