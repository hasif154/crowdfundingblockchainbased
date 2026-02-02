import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, Heart, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './Campaigns.css';

const Campaigns = () => {
    const { contract } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All', icon: TrendingUp },
        { id: 'active', name: 'Active', icon: Clock },
        { id: 'successful', name: 'Successful', icon: CheckCircle },
    ];

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

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        if (categoryId === 'all') {
            setStatusFilter('all');
        } else if (categoryId === 'active') {
            setStatusFilter('0');
        } else if (categoryId === 'successful') {
            setStatusFilter('2');
        }
    };

    return (
        <div className="campaigns-page">
            <div className="page-header">
                <div className="page-header-container">
                    <h1 className="page-title">Browse Fundraisers</h1>
                    <p className="page-subtitle">
                        Discover campaigns that need your support and make a difference today
                    </p>
                </div>
            </div>

            <div className="page-content">
                {/* Category Tags */}
                <div className="category-tags">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-tag ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(cat.id)}
                        >
                            <cat.icon size={14} style={{ marginRight: '6px' }} />
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search campaigns by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-buttons">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setActiveCategory(e.target.value === 'all' ? 'all' :
                                    e.target.value === '0' ? 'active' :
                                        e.target.value === '2' ? 'successful' : 'all');
                            }}
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
                        Found <strong>{filteredCampaigns.length}</strong> campaign{filteredCampaigns.length !== 1 ? 's' : ''}
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
                        <p>Try adjusting your search or filters to find what you're looking for</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
