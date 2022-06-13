import Head from "next/head";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getETHPrice, getETHPriceInUSD } from "../../../../lib/getETHPrice";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputRightAddon,
  InputGroup,
  Alert,
  AlertIcon,
  AlertDescription,
  FormErrorMessage,
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import createCampaignContract from "../../../../smart-contract/campaign";
import { useAsync } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../../../smart-contract";
import { chains } from "../../../../smart-contract/chains_constants";
import { setConnectedChainId } from "../../../../store/actions/auth.actions";

export default function NewRequest() {
  const router = useRouter();
  const { id } = router.query;
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const [error, setError] = useState("");
  const [inUSD, setInUSD] = useState();
  const [ETHPrice, setETHPrice] = useState(0);
  const connectedAccout = useSelector(state => state.auth.currentWallet);
  const connectedChainId = useSelector(state => state.auth.currentChainId);
  const walletStatus = useSelector(state => state.auth.walletStatus);
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);
  const dispatch = useDispatch();
  
  useAsync(async () => {
      try {
        const result = await getETHPrice();
        setETHPrice(result);
      } catch (error) {
        console.log(error);
      }
  }, []);

  async function onSubmit(data) {
    console.log(data);
    if(globalWeb3)
    {
      const campaign = createCampaignContract(id);
      if(campaign)
      {
        try {
          await campaign.methods
            .createRequest(
              data.description,
              globalWeb3.utils.toWei(data.value, "ether"),
              data.recipient
            )
            .send({ from: connectedAccout,
              gas: 3000000 });

          router.push(`/campaign/${id}/requests`);
        } catch (err) {
          setError(err.message);
          console.log(err);
        }
      }else{
        console.log("Creating request: Invalid campain instance");
      }
    }else{
      console.log("Invalid web3");
    }
  }

  const onClickConnect = async () => {
    let connection = await connectWallet();
    if(connection.success === true) dispatch(setConnectedWalletAddress(connection.address));
  }

  return (
    <div>
      <Head>
        <title>Create a Withdrawal Request</title>
        <meta name="description" content="Create a Withdrawal Request" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
          <Text fontSize={"lg"} color={"teal.400"} justifyContent="center">
            <ArrowBackIcon mr={2} />
            <div onClick={() => {router.push(`/campaign/${id}/requests`)}}>
              Back to Requests
            </div>
          </Text>
          <Stack>
            <Heading fontSize={"4xl"}>Create a Withdrawal Request 💸</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="description">
                  <FormLabel>Request Description</FormLabel>
                  <Textarea
                    {...register("description", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="value">
                  <FormLabel>Amount in Ether</FormLabel>
                  <InputGroup>
                    {" "}
                    <Input
                      type="number"
                      {...register("value", { required: true })}
                      isDisabled={isSubmitting}
                      onChange={(e) => {
                        setInUSD(Math.abs(e.target.value));
                      }}
                      step="any"
                    />{" "}
                    <InputRightAddon children={chains[connectedChainId?.toString()]?.nativeCurrency || "ETH"} />
                  </InputGroup>
                </FormControl>

                <FormControl id="recipient">
                  <FormLabel htmlFor="recipient">
                    Recipient Ethereum Wallet Address
                  </FormLabel>
                  <Input
                    name="recipient"
                    {...register("recipient", {
                      required: true,
                    })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                {errors.description || errors.value || errors.recipient ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {" "}
                      All Fields are Required
                    </AlertDescription>
                  </Alert>
                ) : null}
                {error ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}
                <Stack spacing={10}>
                  {walletStatus === true ? (
                    <Button
                      bg={"teal.400"}
                      color={"white"}
                      _hover={{
                        bg: "teal.500",
                      }}
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Create Withdrawal Request
                    </Button>
                  ) : (
                    <Stack spacing={3}>
                      <Button
                        color={"white"}
                        bg={"teal.400"}
                        _hover={{
                          bg: "teal.300",
                        }}
                        onClick={() => onClickConnect() }
                      >
                        Connect Wallet{" "}
                      </Button>
                      <Alert status="warning">
                        <AlertIcon />
                        <AlertDescription mr={2}>
                          Please Connect Your Wallet First to Create a Campaign
                        </AlertDescription>
                      </Alert>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </main>
    </div>
  );
}
