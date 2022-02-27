import { Button, ButtonGroup, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

function Buy({ connectedContract }) {
  const toast = useToast();
  const [totalTicketsCount, setTotalTicketsCount] = useState(null);
  const [availableTicketsCount, setAvailableTicketsCount] = useState(null);
  const [buyTicketTxnPending, setBuyTicketTxnPending] = useState(false);

  const getAvailableTicketsCount = async () => {
    try {
      const count = await connectedContract.availableTicketsCount();
      setAvailableTicketsCount(count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalTicketsCount = async () => {
    try {
      const count = await connectedContract.totalTicketsCount();
      setTotalTicketsCount(count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!connectedContract) return;

    getAvailableTicketsCount();
    getTotalTicketsCount();
  });

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;

      setBuyTicketTxnPending(true);
      let buyTicketTxn = await connectedContract.mint({
        value: ethers.utils.parseEther('0.08'),
      });

      await buyTicketTxn.wait();
      setBuyTicketTxnPending(false);

      toast({
        status: 'success',
        title: 'Success!',
        variant: 'subtle',
        description: (
          <a href={`https://rinkeby.etherscan.io/tx/${buyTicketTxn.hash}`} target="_blank" rel="nofollow noreferrer">
            Checkout the transaction on Etherscan
          </a>
        ),
      });
    } catch (error) {
      console.log(error);
      setBuyTicketTxnPending(false);
      toast({
        status: 'error',
        title: 'Failure',
        variant: 'subtle',
        description: error,
      });
    }
  };

  return (
    <>
      <Heading mb={4}>DevDAO Conference 2022</Heading>
      <Text fontSize="xl" mb={4}>
        Connect your wallet to mint your NFT. It'll be your ticket to get in!
      </Text>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" margin="0 auto" maxW="140px">
        <ButtonGroup mb={4}>
          <Button
            isDisabled={buyTicketTxnPending}
            onClick={buyTicket}
            isLoading={buyTicketTxnPending}
            loadingText="Pending"
            size="lg"
            colorScheme="teal"
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        {availableTicketsCount && totalTicketsCount && (
          <Text>
            {availableTicketsCount} of {totalTicketsCount} minted!
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
