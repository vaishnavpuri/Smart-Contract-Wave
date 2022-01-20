const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.0001"),
    });
    await waveContract.deployed();
    console.log("WavePortal address:", waveContract.address);


    /* Get contract balance */
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract Balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    /*
    send waves
    */

   /* get updated contract balance to see what occured */
   contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
   console.log(
       "Contract Balance:",
       hre.ethers.utils.formatEther(contractBalance)
   );

   let allWaves = await waveContract.getAllWaves();
   console.log(allWaves);
   let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();