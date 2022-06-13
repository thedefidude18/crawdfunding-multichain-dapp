import React, { useState } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Flex,
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
  FormHelperText,
  Textarea,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getETHPrice, getETHPriceInUSD } from "../../lib/getETHPrice";

import getFactoryInstance from "../../smart-contract/factory";
import { chains } from "../../smart-contract/chains_constants";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../../smart-contract";
import { setConnectedWalletAddress } from "../../store/actions/auth.actions";

export default function NewCampaign() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [minContriInUSD, setMinContriInUSD] = useState();
  const [targetInUSD, setTargetInUSD] = useState();
  const [ETHPrice, setETHPrice] = useState(0);
  const dispatch = useDispatch();
  const connectedAccount = useSelector(state => state.auth.currentWallet);
  const connectedChainId = useSelector(state => state.auth.currentChainId);
  const walletStatus = useSelector(state => state.auth.walletStatus);
  const globalWeb3 = useSelector(state => state.auth.globalWeb3);

  useAsync(async () => {
    try {
      const result = await getETHPrice();
      setETHPrice(result);
    } catch (error) {
      console.log(error);
    }
  }, []);
  async function onSubmit(data) {
    console.log(
      data.minimumContribution,
      data.campaignName,
      data.description,
      data.imageUrl,
      data.target
    );
    if(globalWeb3)
    {
      try {
        const factory = getFactoryInstance(connectedChainId);
        if(factory)
        {
          await factory.methods
            .createCampaign(
              globalWeb3.utils.toWei(data.minimumContribution, "ether"),
              data.campaignName,
              data.description,
              data.imageUrl,
              globalWeb3.utils.toWei(data.target, "ether")
            )
            .send({
              from: connectedAccount, 
              gas: 3000000
            });
        }else{
          console.log("creating new campaign : Invalid factoy instance.");
        }
        router.push("/");
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    }else{
      console.log("Invalid  web3");
    }
  }

  const onClickConnect = async () => {
    let connection = await connectWallet();
    if(connection.success === true) dispatch(setConnectedWalletAddress(connection.address));
  }

  return (
    <div>
      <Head>
        <title>New Campaign</title>
        <meta name="description" content="Create New Campaign" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
          <Text fontSize={"lg"} color={"teal.400"}>
            <ArrowBackIcon mr={2} />
            <div onClick={() => {router.push("/");}}> Back to Home</div>
          </Text>
          <Stack>
            <Heading fontSize={"4xl"}>Create a New Campaign 📢</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl id="minimumContribution">
                  <FormLabel>Minimum Contribution Amount</FormLabel>
                  <InputGroup>
                    {" "}
                    <Input
                      type="number"
                      step="any"
                      {...register("minimumContribution", { required: true })}
                      isDisabled={isSubmitting}
                      onChange={(e) => {
                        setMinContriInUSD(Math.abs(e.target.value));
                      }}
                    />{" "}
                    <InputRightAddon children={chains[connectedChainId?.toString()]?.nativeCurrency || "ETH"} />
                  </InputGroup>
                </FormControl>
                <FormControl id="campaignName">
                  <FormLabel>Campaign Name</FormLabel>
                  <Input
                    {...register("campaignName", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Campaign Description</FormLabel>
                  <Textarea
                    {...register("description", { required: true })}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl id="imageUrl">
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    {...register("imageUrl", { required: true })}
                    isDisabled={isSubmitting}
                    type="url"
                  />
                </FormControl>
                <FormControl id="target">
                  <FormLabel>Target Amount</FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      step="any"
                      {...register("target", { required: true })}
                      isDisabled={isSubmitting}
                      onChange={(e) => {
                        setTargetInUSD(Math.abs(e.target.value));
                      }}
                    />
                    <InputRightAddon children={chains[connectedChainId?.toString()]?.nativeCurrency || "ETH"} />
                  </InputGroup>
                </FormControl>

                {error ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}> {error}</AlertDescription>
                  </Alert>
                ) : null}
                {errors.minimumContribution ||
                errors.name ||
                errors.description ||
                errors.imageUrl ||
                errors.target ? (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertDescription mr={2}>
                      {" "}
                      All Fields are Required
                    </AlertDescription>
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
                      Create
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
