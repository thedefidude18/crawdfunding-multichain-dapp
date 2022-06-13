// import Web3 from "web3";
import {store} from "../store";
import { getGlobalWeb3 } from "../store/reducers/auth.reducers";
const Campaign = require("./build/Campaign.json");

const createCampaignContract = (address) => {  
  let state = store.getState();
  let web3 = getGlobalWeb3(state);
  return web3? new web3.eth.Contract(Campaign, address) : null;
};

export default createCampaignContract;