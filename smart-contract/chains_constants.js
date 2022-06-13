export const BSC_CHAIN_ID = "0x38";
export const BSC_NETWORK_ID = "56";
export const POLYGON_CHAIN_ID = "0x89";
export const POLYGON_NETWORK_ID = "137";
export const BSC_TEST_CHAIN_ID = "0x61";
export const BSC_TEST_NETWORK_ID = "97";
export const RINKEBY_CHAIN_ID = "0x4";
export const RINKEBY_NETWORK_ID = "4";
export const XDAI_CHAIN_ID = "0x64";
export const XDAI_NETWORK_ID = "100";
export const OPTIMISTIC_CHAIN_ID = "0xa";
export const OPTIMISTIC_NETWORK_ID = "10";
export const ARBITRUM_NETWORK_ID = "42161";
export const ARBITRUM_CHAIN_ID = "0xa4b1";

export const DEFAULT_CHAIN_ID = BSC_CHAIN_ID;

export const chains = {
    [BSC_CHAIN_ID]:{
        rpcUrl:"https://bsc-dataseed1.binance.org/",
        nativeCurrency:"BNB",
        factoryAddress:"0x254C5E26C53CF307FfE96fF92344e5c757A8472f",
        blockScanUrl:"https://bscscan.com/"
    },
    [BSC_NETWORK_ID]:{
        rpcUrl:"https://bsc-dataseed1.binance.org/",
        nativeCurrency:"BNB",
        factoryAddress:"0x254C5E26C53CF307FfE96fF92344e5c757A8472f",
        blockScanUrl:"https://bscscan.com/"
    },
    [POLYGON_CHAIN_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"MATIC",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://polygonscan.com/"
    },
    [POLYGON_NETWORK_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"MATIC",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://polygonscan.com/"
    },
    [OPTIMISTIC_CHAIN_ID]:{
        rpcUrl:"https://mainnet.optimism.io/",
        nativeCurrency:"ETH",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://optimistic.etherscan.io/"
    },
    [OPTIMISTIC_NETWORK_ID]:{
        rpcUrl:"https://mainnet.optimism.io/",
        nativeCurrency:"ETH",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://optimistic.etherscan.io/"
    },
    [XDAI_CHAIN_ID]:{
        rpcUrl:"https://rpc.gnosischain.com/",
        nativeCurrency:"xDai",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://blockscout.com/xdai/mainnet/"
    },
    [XDAI_NETWORK_ID]:{
        rpcUrl:"https://rpc.gnosischain.com/",
        nativeCurrency:"xDai",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://blockscout.com/xdai/mainnet/"
    },
    [ARBITRUM_CHAIN_ID]:{
        rpcUrl:"https://arb1.arbitrum.io/rpc",
        nativeCurrency:"ETH",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://arbiscan.io/"
    },
    [ARBITRUM_NETWORK_ID]:{
        rpcUrl:"https://arb1.arbitrum.io/rpc",
        nativeCurrency:"ETH",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://arbiscan.io/"
    },
    [BSC_TEST_CHAIN_ID]:{
        rpcUrl:"https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency:"BNB",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://testnet.bscscan.com/"
    },
    [BSC_TEST_NETWORK_ID]:{
        rpcUrl:"https://data-seed-prebsc-1-s1.binance.org:8545/",
        nativeCurrency:"BNB",
        factoryAddress:"0xFf28D45CcEbC110A24340d9de14D29d3A08AbDb8",
        blockScanUrl:"https://testnet.bscscan.com/"
    },
    [RINKEBY_CHAIN_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"ETH",
        factoryAddress:"0x08D73147270B35D48d0c42Bf4e6a8920aE5d8168",
        blockScanUrl:"https://rinkeby.etherscan.io/"
    },
    [RINKEBY_NETWORK_ID]:{
        rpcUrl:"https://rinkeby.infura.io/v3/08ac79d88b5d4aea961ca36af7ea6ee7",
        nativeCurrency:"ETH",
        factoryAddress:"0x08D73147270B35D48d0c42Bf4e6a8920aE5d8168",
        blockScanUrl:"https://rinkeby.etherscan.io/"
    }
}
