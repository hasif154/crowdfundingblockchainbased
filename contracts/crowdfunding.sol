// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdFunding {
    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    address public immutable owner;
    uint256 private nextCampaignId = 1;
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "Reentrancy blocked");
        locked = true;
        _;
        locked = false;
    }

    enum STATUS {
        ACTIVE,
        DELETED,
        SUCCESSFUL,
        UNSUCCEEDED
    }

    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        string imageURI;
        uint256 goal;
        uint256 startsAt;
        uint256 endsAt;
        STATUS status;
        uint256 totalRaised;
    }

    Campaign[] public campaigns;

    // campaignId => contributor => amount
    mapping(uint256 => mapping(address => uint256)) public contributions;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event CampaignCreated(uint256 indexed id, address indexed creator);
    event ContributionMade(
        uint256 indexed id,
        address indexed contributor,
        uint256 amount
    );
    event CampaignDeleted(uint256 indexed id);
    event FundsWithdrawn(
        uint256 indexed id,
        address indexed user,
        uint256 amount
    );

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                          CAMPAIGN LOGIC
    //////////////////////////////////////////////////////////////*/

    function createCampaign(
        string calldata title,
        string calldata description,
        string calldata imageURI,
        uint256 goal,
        uint256 endsAt
    ) external {
        require(bytes(title).length > 0, "Empty title");
        require(bytes(description).length > 0, "Empty description");
        require(bytes(imageURI).length > 0, "Empty image");
        require(goal > 0, "Invalid goal");
        require(endsAt > block.timestamp, "Invalid end time");

        campaigns.push(
            Campaign({
                id: nextCampaignId,
                creator: msg.sender,
                title: title,
                description: description,
                imageURI: imageURI,
                goal: goal,
                startsAt: block.timestamp,
                endsAt: endsAt,
                status: STATUS.ACTIVE,
                totalRaised: 0
            })
        );

        emit CampaignCreated(nextCampaignId, msg.sender);
        nextCampaignId++;
    }

    function contribute(uint256 campaignId) external payable nonReentrant {
        Campaign storage campaign = campaigns[campaignId - 1];

        require(campaign.status == STATUS.ACTIVE, "Campaign inactive");
        require(block.timestamp < campaign.endsAt, "Campaign ended");
        require(msg.value > 0, "Zero contribution");

        uint256 remaining = campaign.goal - campaign.totalRaised;
        uint256 accepted = msg.value > remaining ? remaining : msg.value;
        uint256 refund = msg.value - accepted;

        campaign.totalRaised += accepted;
        contributions[campaignId][msg.sender] += accepted;

        if (campaign.totalRaised >= campaign.goal) {
            campaign.status = STATUS.SUCCESSFUL;
        }

        if (refund > 0) {
            (bool success, ) = payable(msg.sender).call{value: refund}("");
            require(success, "Refund failed");
        }

        emit ContributionMade(campaignId, msg.sender, accepted);
    }

    function deleteCampaign(uint256 campaignId) external {
        Campaign storage campaign = campaigns[campaignId - 1];

        require(msg.sender == campaign.creator, "Not creator");
        require(campaign.status == STATUS.ACTIVE, "Already closed");

        campaign.status = STATUS.DELETED;

        emit CampaignDeleted(campaignId);
    }

    /*//////////////////////////////////////////////////////////////
                          WITHDRAWAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function withdraw(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId - 1];
        uint256 amount = contributions[campaignId][msg.sender];

        require(amount > 0, "Nothing to withdraw");

        if (campaign.status == STATUS.SUCCESSFUL) {
            require(msg.sender == campaign.creator, "Only creator");
        } else {
            require(
                campaign.status == STATUS.DELETED ||
                    block.timestamp > campaign.endsAt,
                "Not refundable"
            );
        }

        contributions[campaignId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");

        emit FundsWithdrawn(campaignId, msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                              VIEWS
    //////////////////////////////////////////////////////////////*/

    function getAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function getLatestCampaigns()
        external
        view
        returns (Campaign[] memory latest)
    {
        uint256 count = campaigns.length;
        uint256 size = count > 4 ? 4 : count;

        latest = new Campaign[](size);
        for (uint256 i = 0; i < size; i++) {
            latest[i] = campaigns[count - 1 - i];
        }
    }

    function currentTime() external view returns (uint256) {
        return block.timestamp;
    }
}
