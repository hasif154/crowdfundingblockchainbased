const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying CrowdFunding contract...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log(`📋 Deploying with account: ${deployer.address}`);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH\n`);

    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    const crowdfunding = await CrowdFunding.deploy();

    await crowdfunding.waitForDeployment();

    const address = await crowdfunding.getAddress();
    console.log(`✅ CrowdFunding deployed to: ${address}`);
    console.log(`\n📌 Save this address for frontend integration!`);

    // Wait for block confirmations before verifying
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("\n⏳ Waiting for block confirmations...");
        await crowdfunding.deploymentTransaction().wait(6);

        console.log("🔍 Verifying contract on Etherscan...");
        try {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: []
            });
            console.log("✅ Contract verified on Etherscan!");
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log("Contract already verified!");
            } else {
                console.error("Verification failed:", error.message);
            }
        }
    }

    // Output for easy copy-paste to frontend
    console.log("\n" + "=".repeat(60));
    console.log("📝 Update your frontend contract config with:");
    console.log("=".repeat(60));
    console.log(`\nCONTRACT_ADDRESS = "${address}"\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
