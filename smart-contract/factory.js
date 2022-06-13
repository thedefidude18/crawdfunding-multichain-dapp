// import Web3 from "web3";
import {  chains } from "./chains_constants";
import isEmpty from "../utilities/isEmpty";
import {store} from "../store";
import { getGlobalWeb3 } from "../store/reducers/auth.reducers";
const CampaignFactory = require("./build/CampaignFactory.json");

const getFactoryInstance = (chainId) => {
  console.log("[factory.js] chainId = ", chainId);
  console.log("[factory.js] typeof chainId = ", typeof chainId);
  if(isEmpty(chains[chainId?.toString()]) === false && isEmpty(chains[chainId?.toString()].factoryAddress) === false)
  {
    console.log("[factory.js] chains[chainId.toString()].factoryAddress = ", chains[chainId?.toString()].factoryAddress);
    let state = store.getState();
    let web3 = getGlobalWeb3(state);
    return web3? new web3.eth.Contract(
      CampaignFactory,
      chains[chainId?.toString()].factoryAddress
    ) : null;
  }else{
    console.log("[factory.js] We don't have factory smart contract on ", chainId, " network.");
    return null;
  }
};

export default getFactoryInstance;
