import React from "react";
import abi from "../abi.json";
import { ethers } from "ethers";

export const contracts = () => {
  const contractAddress = "0xB8f1ed9Adca8c6863B3da364B1b332B51462BA06";
  if (window.ethereum && window.ethereum.isMetaMask) {
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    // setProvider(tempProvider);

    const tempSigner = tempProvider.getSigner();
    // setSigner(tempSigner);

    const tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
    return tempContract;
  }
};
