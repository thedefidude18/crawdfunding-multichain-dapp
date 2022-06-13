import Head from "next/head";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { getETHPrice, getWEIPriceInUSD } from "../lib/getETHPrice";
import {
  Heading,
  useBreakpointValue,
  useColorModeValue,
  Text,
  Button,
  Flex,
  Container,
  SimpleGrid,
  Box,
  Divider,
  Skeleton,
  Img,
  Icon,
  chakra,
  Tooltip,
  Link,
  SkeletonCircle,
  HStack,
  Stack,
  Progress,
} from "@chakra-ui/react";

import getFactoryInstance from "../smart-contract/factory";
import { FaHandshake } from "react-icons/fa";
import { FcShare, FcDonate, FcMoneyTransfer } from "react-icons/fc";
import { chains, DEFAULT_CHAIN_ID } from "../smart-contract/chains_constants";
import createCampaignContract from "../smart-contract/campaign";
import { useDispatch, useSelector } from "react-redux";
import { loadWeb3 } from "../smart-contract";
import router from "next/router";

loadWeb3();

export async function getServerSideProps(chainId) {

  return {
    props: { 
    },
  };
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={"center"}
        justify={"center"}
        color={"white"}
        rounded={"full"}
        bg={useColorModeValue("gray.100", "gray.700")}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Stack>
  );
};

function CampaignCard({
  name,
  description,
  creatorId,
  imageURL,
  id,
  balance,
  target,
  ethPrice,
}) {
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);
  const connectedChainId = useSelector(state => state.auth.currentChainId);

  return (
    <div onClick={() => {router.push(`/campaign/${id}`); }}>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        maxW={{ md: "sm" }}
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition={"transform 0.3s ease"}
        _hover={{
          transform: "translateY(-8px)",
        }}
      >
        <Box height="18em">
          <Img
            src={imageURL}
            alt={`Picture of ${name}`}
            roundedTop="lg"
            objectFit="cover"
            w="full"
            h="full"
            display="block"
          />
        </Box>
        <Box p="6">
          <Flex
            mt="1"
            justifyContent="space-between"
            alignContent="center"
            py={2}
          >
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
            >
              {name}
            </Box>

            <Tooltip
              label="Contribute"
              bg={useColorModeValue("white", "gray.700")}
              placement={"top"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={"1.2em"}
            >
              <chakra.a display={"flex"}>
                <Icon
                  as={FaHandshake}
                  h={7}
                  w={7}
                  alignSelf={"center"}
                  color={"teal.400"}
                />{" "}
              </chakra.a>
            </Tooltip>
          </Flex>
          <Flex alignContent="center" py={2}>
            {" "}
            <Text color={"gray.500"} pr={2}>
              by
            </Text>{" "}
            <Heading size="base" isTruncated>
              {creatorId}
            </Heading>
          </Flex>
          <Flex direction="row" py={2}>
            <Box w="full">
              <Box
                fontSize={"2xl"}
                isTruncated
                maxW={{ base: "	15rem", sm: "sm" }}
                pt="2"
              >
                <Text as="span" fontWeight={"bold"}>
                  {balance > 0
                    ? globalWeb3?.utils.fromWei(balance, "ether")
                    : "0, Become a Donor 😄"}
                </Text>
                <Text
                  as="span"
                  display={balance > 0 ? "inline" : "none"}
                  pr={2}
                  fontWeight={"bold"}
                >
                  {" "}
                  {chains[connectedChainId?.toString()].nativeCurrency}
                </Text>
              </Box>

              <Text fontSize={"md"} fontWeight="normal">
                target of {globalWeb3?.utils.fromWei(target, "ether") || 0} {chains[connectedChainId?.toString()].nativeCurrency}
              </Text>
              <Progress
                colorScheme="teal"
                size="sm"
                value={globalWeb3?.utils.fromWei(balance, "ether") || 0}
                max={globalWeb3?.utils.fromWei(target, "ether") || 0}
                mt="2"
              />
            </Box>{" "}
          </Flex>
        </Box>
      </Box>
    </div>
  );
}

export default function Home({  }) {
  const [campaignList, setCampaignList] = useState([]);
  const [ethPrice, updateEthPrice] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const connectedChainId = useSelector(state => state.auth.currentChainId);
  // const connectAccount = useSelector(state => state.auth.currentWallet);

  async function getSummary() {
    try {      
      const factory = getFactoryInstance(connectedChainId || DEFAULT_CHAIN_ID);
      if(factory)
      {
        console.log("[index.js] factory.methods = ", factory.methods);

        let campaigns = await factory.methods.getDeployedCampaigns().call();

        console.log("[index.js] campaigns = ", campaigns);

        const summary = await Promise.all(
          campaigns.map((campaign, i) =>
            createCampaignContract(campaigns[i]).methods.getSummary().call()
          )
        );
        const ETHPrice = await getETHPrice();
        updateEthPrice(ETHPrice);
        console.log("summary ", summary);
        setCampaignList(summary);
        setCampaigns(campaigns);

        return summary;
      }else {
        console.log("fetching deployed campaigns : Invalid factory instance");
        return [];
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div>
      <Head>
        <title>Givestation</title>
        <meta
          name="description"
          content="Transparent Crowdfunding in Blockchain"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
          {" "}
          <Heading
            textAlign={useBreakpointValue({ base: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            as="h1"
            py={4}
          >
            Crowdfunding using the powers of <br /> Crypto & Blockchain 😄{" "}
          </Heading>
            <Button
              display={{ sm: "inline-flex" }}
              fontSize={"md"}
              fontWeight={600}
              color={"white"}
              bg={"teal.400"}
              _hover={{
                bg: "teal.300",
              }}
              onClick={() => {router.push("/campaign/new")}}
            >
              Create Campaign
            </Button>
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              Open Campaigns
            </Heading>
          </HStack>

          <Divider marginTop="4" />

          {campaignList?.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              {campaignList?.map((el, i) => {
                if(el)
                {
                  console.log("el = ", el);
                  return (
                    <div key={i}>
                      <CampaignCard
                        name={el[5]}
                        description={el[6]}
                        creatorId={el[4]}
                        imageURL={el[7]}
                        id={campaigns[i]}
                        target={el[8]}
                        balance={el[1]}
                        ethPrice={ethPrice}
                      />
                    </div>
                  );
                }else{
                  return <></>
                }
              })}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
              <Skeleton height="25rem" />
            </SimpleGrid>
          )}
        </Container>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              How Givestation Works
            </Heading>
          </HStack>
          <Divider marginTop="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
            <Feature
              icon={<Icon as={FcDonate} w={10} h={10} />}
              title={"Create a Campaign for Fundraising"}
              text={
                "It’ll take only 2 minutes. Just enter a few details about the funds you are raising for."
              }
            />
            <Feature
              icon={<Icon as={FcShare} w={10} h={10} />}
              title={"Share your Campaign"}
              text={
                "All you need to do is share the Campaign with your friends, family and others. In no time, support will start pouring in."
              }
            />
            <Feature
              icon={<Icon as={FcMoneyTransfer} w={10} h={10} />}
              title={"Request and Withdraw Funds"}
              text={
                "The funds raised can be withdrawn directly to the recipient when 50% of the contributors approve of the Withdrawal Request."
              }
            />
          </SimpleGrid>
          {/* <Heading as="h2" size="lg" mt="8">
            For any queries raise an issue on{" "}
            <Link
              color="teal.500"
              href="https://github.com/harsh242/Givestation-crowdfunding-in-blockchain/issues"
              isExternal
            >
              the Github Repo <ExternalLinkIcon mx="2px" />
            </Link>{" "}
          </Heading> */}
          <Divider marginTop="4" />
        </Container>
      </main>
    </div>
  );
}