import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const App = () => {
  /*
  state variable to store users public wallet
  */
  const [currentAccount, setCurrentAccount] = useState("");
  /* 
  holds the contract address after we deploy
  */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "enter your contract address here";
  const contractABI = abi.abi
  /*
  get all waves from contract
  */
   const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
        call the getAllWaves method 
        */
        const waves = await wavesPortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
           };
          });

        /*
        store data in react
        */
        setAllWaves(wavesClean);
      } else {
        console.log("Ethereum object doesn't exists!");
      }
    } catch (error) {
      console.log(error);
    }
   };
   useEffect(() => {
     let wavePortalContract;

     const onNewWave = (from, timestamp, message) => {
       console.log("NewWave", from, timestamp, message);
       setAllWaves(prevState => [
         ...prevState,
         {
           address: wave.waver,
           timestamp: new Date(wave.timestamp * 1000),
           message: wave.message,
          },
        ]);
       };

       if (window.ethereum) {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();
         wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
         wavePortalContract.on("NewWave", onNewWave);
       }
       return () => {
         if (wavePortalContract) {
           wavePortalContract.off("NewWave", onNewWave);
         }
       };
   }, []);
   const checkIfWalletIsConnected = async () => {
    /*
    check for access to window.ethereum
    */
    try {

      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      check if we are authorized to access users wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  /*
  This is the connectWallet part
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        /*
        Execute the wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error) {
      console.log(error);
    }
  }
  /* 
  * This will run our function when the page loads
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          My name is Vaish Puri and I love web3. Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/*
        if there is no currentAccount render this button}
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {/*}
        {allWaves.map((wave, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        */}
        </div>
      </div>
  );
}

export default App;