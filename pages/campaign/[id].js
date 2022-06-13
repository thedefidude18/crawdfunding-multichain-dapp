import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useWindowSize } from "react-use";
import {
  getETHPrice,
  getETHPriceInUSD,
  getWEIPriceInUSD,
} from "../../lib/getETHPrice";
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  InputRightAddon,
  InputGroup,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  CloseButton,
  FormHelperText,
  Link,
} from "@chakra-ui/react";

import { InfoIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import Confetti from "react-confetti";
import createCampaignContract from "../../smart-contract/campaign";
import { chains } from "../../smart-contract/chains_constants";
import { useSelector } from "react-redux";

export async function getServerSideProps({ params, chainId }) {

  return {
    props: {
    },
  };
}

function StatsCard(props) {
  const { title, stat, info } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={"5"}
      shadow={"sm"}
      border={"1px solid"}
      borderColor={"gray.500"}
      rounded={"lg"}
      transition={"transform 0.3s ease"}
      _hover={{
        transform: "translateY(-5px)",
      }}
    >
      <Tooltip
        label={info}
        bg={useColorModeValue("white", "gray.700")}
        placement={"top"}
        color={useColorModeValue("gray.800", "white")}
        fontSize={"1em"}
      >
        <Flex justifyContent={"space-between"}>
          <Box pl={{ base: 2, md: 4 }}>
            <StatLabel fontWeight={"medium"} isTruncated>
              {title}
            </StatLabel>
            <StatNumber
              fontSize={"base"}
              fontWeight={"bold"}
              isTruncated
              maxW={{ base: "	10rem", sm: "sm" }}
            >
              {stat}
            </StatNumber>
          </Box>
        </Flex>
      </Tooltip>
    </Stat>
  );
}

export default function CampaignSingle({
  
}) {
  const { handleSubmit, register, formState, reset, getValues } = useForm({
    mode: "onChange",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [amountInUSD, setAmountInUSD] = useState();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const [id, setId] = useState(0);
  const [minimumContribution, setMinimumContribution] = useState("0");
  const [balance, setBalance] = useState("0");
  const [requestsCount, setRequestsCount] = useState(0);
  const [approversCount, setApproversCount] = useState(0);
  const [manager, setManager] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [target, setTarget] = useState("");
  const [ETHPrice, setEthPrice] = useState(0);
  const connectedChainId = useSelector(state => state.auth.currentChainId);
  const connectedAccount = useSelector(state => state.auth.currentWallet);
  const walletStatus = useSelector(state => state.auth.walletStatus);
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);

  useEffect(() => {
      const loadCampaign = async () => {   
        console.log("[[id].js] router.query = ", router.query);
        const campaignId = router.query.id;
        console.log("[[id].js] campaignId = ", campaignId);
        const campaign = createCampaignContract(campaignId);
        console.log("[[id].js] campaign = ", campaign);
        const summary = await campaign.methods.getSummary().call();
        console.log("[[id].js] summary = ", summary);
        const ETHPrice = await getETHPrice();

        setId( campaignId );
        setMinimumContribution( summary[0] );
        setBalance( summary[1] );
        setRequestsCount( Number(summary[2]) );
        setApproversCount( Number(summary[3]) );
        setManager( summary[4] );
        setName( summary[5] );
        setDescription( summary[6] );
        setImage( summary[7] );
        setTarget( summary[8] );
        setEthPrice( ETHPrice );
      }

      loadCampaign();
  }, []);

  async function onSubmit(data) {
    console.log(data);
    try {      
      const campaign = createCampaignContract(id);
      await campaign.methods.contibute().send({
        from: connectedAccount,
        gas: 3000000,
        value: globalWeb3.utils.toWei(data.value, "ether"),
      });
      // router.push(`/campaign/${id}`);
      setAmountInUSD(null);
      reset("", {
        keepValues: false,
      });
      const loadCampaign = async () => {   
        console.log("[[id].js] router.query = ", router.query);
        const campaignId = router.query.id;
        console.log("[[id].js] campaignId = ", campaignId);
        const campaign = createCampaignContract(campaignId);
        console.log("[[id].js] campaign = ", campaign);
        const summary = await campaign.methods.getSummary().call();
        console.log("[[id].js] summary = ", summary);
        const ETHPrice = await getETHPrice();

        setId( campaignId );
        setMinimumContribution( summary[0] );
        setBalance( summary[1] );
        setRequestsCount( Number(summary[2]) );
        setApproversCount( Number(summary[3]) );
        setManager( summary[4] );
        setName( summary[5] );
        setDescription( summary[6] );
        setImage( summary[7] );
        setTarget( summary[8] );
        setEthPrice( ETHPrice );
      }

      loadCampaign();
      setIsSubmitted(true);
      setError(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>Campaign Details</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {isSubmitted ? <Confetti width={width} height={height} /> : null}
      <main>
        {" "}
        <Box position={"relative"}>
          {isSubmitted ? (
            <Container
              maxW={"7xl"}
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 10, lg: 32 }}
              py={{ base: 6 }}
            >
              <Alert status="success" mt="2">
                <AlertIcon />
                <AlertDescription mr={2}>
                  {" "}
                  Thank You for your Contribution 🙏
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setIsSubmitted(false)}
                />
              </Alert>
            </Container>
          ) : null}
          <Container
            as={SimpleGrid}
            maxW={"7xl"}
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 32 }}
            py={{ base: 6 }}
          >
            <Stack spacing={{ base: 6 }}>
              <Heading
                lineHeight={1.1}
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              >
                {name}
              </Heading>
              <Text
                color={useColorModeValue("gray.500", "gray.200")}
                fontSize={{ base: "lg" }}
              >
                {description}
              </Text>
              <Link
                color="teal.500"
                href={`${chains[connectedChainId?.toString()]?.blockScanUrl}/address/${id}`}
                isExternal
              >
                View on block scan website <ExternalLinkIcon mx="2px" />
              </Link>
              <Box mx={"auto"} w={"full"}>
                <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5 }}>
                  <StatsCard
                    title={"Minimum Contribution"}
                    stat={`${globalWeb3.utils.fromWei(
                      minimumContribution,
                      "ether"
                    )} ${chains[connectedChainId?.toString()].nativeCurrency} `}
                    info={
                      "You must contribute at least this much in Wei ( 1 ETH = 10 ^ 18 Wei) to become an approver"
                    }
                  />
                  <StatsCard
                    title={"Wallet Address of Campaign Creator"}
                    stat={manager}
                    info={
                      "The Campaign Creator created the campaign and can create requests to withdraw money."
                    }
                  />
                  <StatsCard
                    title={"Number of Requests"}
                    stat={requestsCount}
                    info={
                      "A request tries to withdraw money from the contract. Requests must be approved by approvers"
                    }
                  />
                  <StatsCard
                    title={"Number of Approvers"}
                    stat={approversCount}
                    info={
                      "Number of people who have already donated to this campaign"
                    }
                  />
                </SimpleGrid>
              </Box>
            </Stack>
            <Stack spacing={{ base: 4 }}>
              <Box>
                <Stat
                  bg={useColorModeValue("white", "gray.700")}
                  boxShadow={"lg"}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  spacing={{ base: 8 }}
                >
                  <StatLabel fontWeight={"medium"}>
                    <Text as="span" isTruncated mr={2}>
                      {" "}
                      Campaign Balance
                    </Text>
                    <Tooltip
                      label="The balance is how much money this campaign has left to
                  spend."
                      bg={useColorModeValue("white", "gray.700")}
                      placement={"top"}
                      color={useColorModeValue("gray.800", "white")}
                      fontSize={"1em"}
                      px="4"
                    >
                      <InfoIcon
                        color={useColorModeValue("teal.800", "white")}
                      />
                    </Tooltip>
                  </StatLabel>
                  <StatNumber>
                    <Box
                      fontSize={"2xl"}
                      isTruncated
                      maxW={{ base: "	15rem", sm: "sm" }}
                      pt="2"
                    >
                      <Text as="span" fontWeight={"bold"}>
                        {balance > 0
                          ? globalWeb3.utils.fromWei(balance, "ether")
                          : "0, Become a Donor 😄"}
                      </Text>
                      <Text
                        as="span"
                        display={balance > 0 ? "inline" : "none"}
                        pr={2}
                        fontWeight={"bold"}
                      >
                        {" "}
                        {chains[connectedChainId?.toString()]?.nativeCurrency}
                      </Text>
                    </Box>

                    <Text fontSize={"md"} fontWeight="normal">
                      target of {globalWeb3.utils.fromWei(target, "ether") || 0} {chains[connectedChainId?.toString()]?.nativeCurrency}
                    </Text>
                    <Progress
                      colorScheme="teal"
                      size="sm"
                      value={globalWeb3.utils.fromWei(balance, "ether") || 0}
                      max={globalWeb3.utils.fromWei(target, "ether") || 0} 
                      mt={4}
                    />
                  </StatNumber>
                </Stat>
              </Box>
              <Stack
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={{ base: 6 }}
              >
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  color={useColorModeValue("teal.600", "teal.200")}
                >
                  Contribute Now!
                </Heading>

                <Box mt={10}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl id="value">
                      <FormLabel>
                        Amount in Ether you want to contribute
                      </FormLabel>
                      <InputGroup>
                        {" "}
                        <Input
                          {...register("value", { required: true })}
                          type="number"
                          isDisabled={formState.isSubmitting}
                          onChange={(e) => {
                            setAmountInUSD(Math.abs(e.target.value));
                          }}
                          step="any"
                          min="0"
                        />{" "}
                        <InputRightAddon children={chains[connectedChainId?.toString()]?.nativeCurrency || "ETH"} />
                      </InputGroup>
                    </FormControl>

                    {error ? (
                      <Alert status="error" mt="2">
                        <AlertIcon />
                        <AlertDescription mr={2}> {error}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Stack spacing={10}>
                      {walletStatus === true ? (
                        <Button
                          fontFamily={"heading"}
                          mt={4}
                          w={"full"}
                          bgGradient="linear(to-r, teal.400,green.400)"
                          color={"white"}
                          _hover={{
                            bgGradient: "linear(to-r, teal.400,blue.400)",
                            boxShadow: "xl",
                          }}
                          isLoading={formState.isSubmitting}
                          isDisabled={amountInUSD ? false : true}
                          type="submit"
                        >
                          Contribute
                        </Button>
                      ) : (
                        <Alert status="warning" mt={4}>
                          <AlertIcon />
                          <AlertDescription mr={2}>
                            Please Connect Your Wallet to Contribute
                          </AlertDescription>
                        </Alert>
                      )}
                    </Stack>
                  </form>
                </Box>
              </Stack>

              <Stack
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                rounded={"xl"}
                p={{ base: 4, sm: 6, md: 8 }}
                spacing={4}
              >
                  <Button
                    fontFamily={"heading"}
                    w={"full"}
                    bgGradient="linear(to-r, teal.400,green.400)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, teal.400,blue.400)",
                      boxShadow: "xl",
                    }}
                    onClick={() => {
                      router.push(`/campaign/${id}/requests`);
                    }}
                  >
                    View Withdrawal Requests
                  </Button>
                <Text fontSize={"sm"}>
                  * You can see where these funds are being used & if you have
                  contributed you can also approve those Withdrawal Requests :)
                </Text>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </main>
    </div>
  );
}
