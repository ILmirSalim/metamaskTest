import { Button, TextField, Typography, Box, Grid, SvgIcon } from '@mui/material';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';

interface AccountType {
  address?: string;
  balance?: string;
  chainId?: string;
  network?: string;
}
export default function Home() {
  const [accountData, setAccountData] = useState<AccountType>({});
  const [message, setMessage] = useState<string>("");

  const _connectToMetaMask = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      try {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const address = accounts[0];
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        setAccountData({
          address,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString(),
          network: network.name,
        });
        
      } catch (error: Error | any) {
        alert(`Error connecting to MetaMask: ${error.message}`);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  }, []);

  const _sendTransaction = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      try {
        const transactionAddress = (document.getElementById('transaction-address') as HTMLInputElement).value;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const transaction = {
          to: transactionAddress,
          value: ethers.parseEther('0.01'),
        };
        const tx = await signer.sendTransaction(transaction);
        setMessage(`Transaction sent: ${tx.hash}`);
      } catch (error: Error | any) {
        alert(`Error sending transaction: ${error.message}`);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  }, []);

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 360,
      width: '100%',
      maxWidth: 600,
      margin: '0 auto',
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          MetaMask Integration
        </Typography>
      </Grid>
      {accountData.address ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Address: {accountData.address}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Balance (ETH): {accountData.balance} {accountData.network === 'homestead' ? 'ETH' : `(${accountData.network})`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Balance (BNB): {accountData.balance} {accountData.network ==='bsc-mainnet' ? 'BNB' : `(${accountData.network})`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="transaction-address"
              label="Transaction Address"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={_sendTransaction}
              disabled={!accountData.address}
            >
              Send Transaction
            </Button>
          </Grid>
          {message && (
            <Grid item xs={12}>
              <Typography variant="body1" component="p" gutterBottom>
                {message}
              </Typography>
            </Grid>
          )}
        </>
      ) : (
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={_connectToMetaMask}
          >
            Connect to MetaMask
          </Button>
        </Grid>
      )}
    </Grid>
  </Box>
  );
};
