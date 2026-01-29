export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this after deployment

export const CONTRACT_ABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "creator", type: "address" }
        ],
        name: "CampaignCreated",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" }
        ],
        name: "CampaignDeleted",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "contributor", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "ContributionMade",
        type: "event"
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: true, internalType: "address", name: "user", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "FundsWithdrawn",
        type: "event"
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "campaigns",
        outputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "address", name: "creator", type: "address" },
            { internalType: "string", name: "title", type: "string" },
            { internalType: "string", name: "description", type: "string" },
            { internalType: "string", name: "imageURI", type: "string" },
            { internalType: "uint256", name: "goal", type: "uint256" },
            { internalType: "uint256", name: "startsAt", type: "uint256" },
            { internalType: "uint256", name: "endsAt", type: "uint256" },
            { internalType: "enum CrowdFunding.STATUS", name: "status", type: "uint8" },
            { internalType: "uint256", name: "totalRaised", type: "uint256" }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "uint256", name: "campaignId", type: "uint256" }],
        name: "contribute",
        outputs: [],
        stateMutability: "payable",
        type: "function"
    },
    {
        inputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "address", name: "", type: "address" }
        ],
        name: "contributions",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [
            { internalType: "string", name: "title", type: "string" },
            { internalType: "string", name: "description", type: "string" },
            { internalType: "string", name: "imageURI", type: "string" },
            { internalType: "uint256", name: "goal", type: "uint256" },
            { internalType: "uint256", name: "endsAt", type: "uint256" }
        ],
        name: "createCampaign",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "currentTime",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "uint256", name: "campaignId", type: "uint256" }],
        name: "deleteCampaign",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [],
        name: "getAllCampaigns",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "id", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    { internalType: "string", name: "title", type: "string" },
                    { internalType: "string", name: "description", type: "string" },
                    { internalType: "string", name: "imageURI", type: "string" },
                    { internalType: "uint256", name: "goal", type: "uint256" },
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "enum CrowdFunding.STATUS", name: "status", type: "uint8" },
                    { internalType: "uint256", name: "totalRaised", type: "uint256" }
                ],
                internalType: "struct CrowdFunding.Campaign[]",
                name: "",
                type: "tuple[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "getLatestCampaigns",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "id", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    { internalType: "string", name: "title", type: "string" },
                    { internalType: "string", name: "description", type: "string" },
                    { internalType: "string", name: "imageURI", type: "string" },
                    { internalType: "uint256", name: "goal", type: "uint256" },
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "enum CrowdFunding.STATUS", name: "status", type: "uint8" },
                    { internalType: "uint256", name: "totalRaised", type: "uint256" }
                ],
                internalType: "struct CrowdFunding.Campaign[]",
                name: "latest",
                type: "tuple[]"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ internalType: "uint256", name: "campaignId", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
];

export const STATUS = {
    0: "Active",
    1: "Deleted",
    2: "Successful",
    3: "Unsucceeded"
};

export const STATUS_COLORS = {
    0: "#22c55e", // Active - green
    1: "#ef4444", // Deleted - red
    2: "#8b5cf6", // Successful - purple
    3: "#f59e0b"  // Unsucceeded - amber
};
