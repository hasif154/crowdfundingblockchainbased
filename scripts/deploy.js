const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying CrowdFunding contract...\n");

    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    const crowdfunding = await CrowdFunding.deploy();

    await crowdfunding.waitForDeployment();

    const address = await crowdfunding.getAddress();
    console.log(`✅ CrowdFunding deployed to: ${address}`);
    console.log(`📋 Owner: ${(await hre.ethers.getSigners())[0].address}`);
    console.log(`\n📌 Save this address for frontend integration!`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
