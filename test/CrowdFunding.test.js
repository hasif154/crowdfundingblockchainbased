const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
    let crowdfunding;
    let owner, contributor1, contributor2;

    beforeEach(async function () {
        [owner, contributor1, contributor2] = await ethers.getSigners();
        const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
        crowdfunding = await CrowdFunding.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await crowdfunding.owner()).to.equal(owner.address);
        });

        it("Should start with no campaigns", async function () {
            const campaigns = await crowdfunding.getAllCampaigns();
            expect(campaigns.length).to.equal(0);
        });
    });

    describe("Campaign Creation", function () {
        it("Should create a campaign successfully", async function () {
            const title = "Test Campaign";
            const description = "A test crowdfunding campaign";
            const imageURI = "https://example.com/image.png";
            const goal = ethers.parseEther("10");
            const endsAt = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

            await expect(
                crowdfunding.createCampaign(title, description, imageURI, goal, endsAt)
            ).to.emit(crowdfunding, "CampaignCreated");

            const campaigns = await crowdfunding.getAllCampaigns();
            expect(campaigns.length).to.equal(1);
            expect(campaigns[0].title).to.equal(title);
            expect(campaigns[0].goal).to.equal(goal);
        });

        it("Should reject empty title", async function () {
            const endsAt = Math.floor(Date.now() / 1000) + 86400;
            await expect(
                crowdfunding.createCampaign("", "desc", "img", ethers.parseEther("1"), endsAt)
            ).to.be.revertedWith("Empty title");
        });
    });

    describe("Contributions", function () {
        beforeEach(async function () {
            const endsAt = Math.floor(Date.now() / 1000) + 86400;
            await crowdfunding.createCampaign(
                "Test",
                "Description",
                "image.png",
                ethers.parseEther("10"),
                endsAt
            );
        });

        it("Should accept contributions", async function () {
            const amount = ethers.parseEther("1");

            await expect(
                crowdfunding.connect(contributor1).contribute(1, { value: amount })
            ).to.emit(crowdfunding, "ContributionMade");

            const contribution = await crowdfunding.contributions(1, contributor1.address);
            expect(contribution).to.equal(amount);
        });

        it("Should update totalRaised", async function () {
            const amount = ethers.parseEther("2");
            await crowdfunding.connect(contributor1).contribute(1, { value: amount });

            const campaigns = await crowdfunding.getAllCampaigns();
            expect(campaigns[0].totalRaised).to.equal(amount);
        });

        it("Should mark campaign as SUCCESSFUL when goal reached", async function () {
            const goal = ethers.parseEther("10");
            await crowdfunding.connect(contributor1).contribute(1, { value: goal });

            const campaigns = await crowdfunding.getAllCampaigns();
            expect(campaigns[0].status).to.equal(2n); // STATUS.SUCCESSFUL
        });
    });

    describe("Campaign Deletion", function () {
        beforeEach(async function () {
            const endsAt = Math.floor(Date.now() / 1000) + 86400;
            await crowdfunding.createCampaign(
                "Test",
                "Description",
                "image.png",
                ethers.parseEther("10"),
                endsAt
            );
        });

        it("Should allow creator to delete campaign", async function () {
            await expect(crowdfunding.deleteCampaign(1))
                .to.emit(crowdfunding, "CampaignDeleted")
                .withArgs(1n);
        });

        it("Should reject deletion by non-creator", async function () {
            await expect(
                crowdfunding.connect(contributor1).deleteCampaign(1)
            ).to.be.revertedWith("Not creator");
        });
    });
});
