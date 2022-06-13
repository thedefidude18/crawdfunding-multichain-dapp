import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useSelector, useDispatch} from "react-redux";
import { changeNetwork, checkNetwork, connectWallet } from "../smart-contract";
import NextLink from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { setConnectedWalletAddress } from "../store/actions/auth.actions";
import router from "next/router";
import { BSC_CHAIN_ID, POLYGON_CHAIN_ID, XDAI_CHAIN_ID, OPTIMISTIC_CHAIN_ID, ARBITRUM_CHAIN_ID } from "../smart-contract/chains_constants";

export default function NavBar() {
  const dispatch = useDispatch();
  const connectedChainId = useSelector(state => state.auth.currentChainId);
  const connectedAccount = useSelector(state => state.auth.currentWallet);
  const walletStatus = useSelector(state => state.auth.walletStatus);
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);

  const DisconnectWallet = () =>
  {
    if(globalWeb3) {
      globalWeb3.eth?.currentProvider?.disconnect();
    }
  }

  const onClickConnect = async () => {
    let connection = await connectWallet(); 
  }
  console.log("connectedChainId = ", connectedChainId);
  console.log("connectedAccount = ", connectedAccount);

  const onClickChangeNetwork = async(chainId) => {
    router.push("/");
    await changeNetwork(chainId).then(() => {
      router.reload();
    });
  }

  return (
    <Box>
      <Flex
        color={useColorModeValue("gray.600", "white")}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"sm"}
        zIndex="999"
        justify={"center"}
        css={{
          backdropFilter: "saturate(180%) blur(5px)",
          backgroundColor: useColorModeValue(
            "rgba(255, 255, 255, 0.8)",
            "rgba(26, 32, 44, 0.8)"
          ),
        }}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex flex={{ base: 1 }} justify="start" ml={{ base: -2, md: 0 }}>
            <Heading
              textAlign="left"
              fontFamily={"heading"}
              color={useColorModeValue("teal.800", "white")}
              as="h2"
              size="lg"
            >
              <Box
                as={"span"}
                color={useColorModeValue("teal.400", "teal.300")}
                position={"relative"}
                zIndex={10}
                _after={{
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  w: "full",
                  h: "30%",
                  bg: useColorModeValue("teal.100", "teal.900"),
                  zIndex: -1,
                }}
              >
                  <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} onClick={() => {router.push("/")}}>
                    <img src="/Givestation icon logo-01.png" style={{ width: "60px" }} />
                    Givestation
                  </div>
              </Box>
            </Heading>
          </Flex>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
            display={{ base: "flex", md: "flex" }}
          >
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              onClick={() => {
                router.push("/campaign/new");
              }}
            >
              Create Campaign
            </Button>
            <Button
              fontSize={"md"}
              fontWeight={600}
              variant={"link"}
              display={{ base: "none", md: "inline-flex" }}
              onClick={() => {
                router.push("/#howitworks");
              }}
            >
              How it Works
            </Button>

            {walletStatus === true ? (
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  {connectedAccount?.toString().substr(0, 10) + "..."}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => {
                    onClickChangeNetwork(BSC_CHAIN_ID);
                  }}>
                    <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} >
                      <img src="/bnb.png" style={{ width:"20px", height:"20px", marginRight:"5px" }} alt=""/>
                      Binance smart chain
                    </div>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onClickChangeNetwork(POLYGON_CHAIN_ID);
                  }}>
                    <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} >
                      <img src="/polygon-matic-logo.svg" style={{ width:"20px", height:"20px", marginRight:"5px"   }} alt="" />
                      Polygon network
                    </div>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onClickChangeNetwork(XDAI_CHAIN_ID);
                  }}>
                    <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} >
                      <img src="/xDai.png" style={{ width:"20px", height:"20px", marginRight:"5px"   }} alt="" />
                      Gnosis chain
                    </div>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onClickChangeNetwork(OPTIMISTIC_CHAIN_ID);
                  }}>
                    <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} >
                      <img src="/optimistic_ethereum.svg" style={{ width:"20px", height:"20px", marginRight:"5px"   }} alt="" />
                      Optimistic network
                    </div>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    onClickChangeNetwork(ARBITRUM_CHAIN_ID);
                  }}>
                    <div style={{ display:"flex", flexDirection: "row", userSelect: "none", cursor: "pointer" }} >                    
                      <img src="arbitrum_logo.svg" style={{ width:"20px", height:"20px", marginRight:"5px"  }} alt="" />
                      Arbitrum network
                    </div>
                  </MenuItem>
                  {/* <MenuItem onClick={() => {
                    DisconnectWallet()
                  }}>
                    Disconnect Wallet{" "}
                  </MenuItem> */}
                </MenuList>
              </Menu>
            ) : (
              <div>
                <Button
                  display={{ base: "flex", md: "inline-flex" }}
                  fontSize={"md"}
                  fontWeight={600}
                  color={"white"}
                  bg={"teal.400"}
                  href={"#"}
                  _hover={{
                    bg: "teal.300",
                  }}
                  onClick={() => {
                    onClickConnect()
                  }
                }
                >
                  Connect Wallet{" "}
                </Button>
              </div>
            )}

            {/* <DarkModeSwitch /> */}
          </Stack>

          <Flex display={{ base: "none", md: "flex"}} style={{marginLeft:"10px"}}>
            <DarkModeSwitch />
          </Flex>
        </Container>
      </Flex>
    </Box>
  );
}
