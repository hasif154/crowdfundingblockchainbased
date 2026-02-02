import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

const Web3Context = createContext(null);

// Expected chain ID for local Hardhat network
const EXPECTED_CHAIN_ID = 31337n; // Hardhat local
const EXPECTED_CHAIN_NAME = "Hardhat Local";

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [wrongNetwork, setWrongNetwork] = useState(false);

    const switchToLocalNetwork = async () => {
        if (!window.ethereum) return;

        try {
            // Try to switch to the network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7A69' }], // 31337 in hex
            });
        } catch (switchError) {
            // If the network doesn't exist, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x7A69', // 31337 in hex
                            chainName: 'Hardhat Local',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['http://127.0.0.1:8545'],
                        }],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    setError('Could not add Hardhat network. Please add it manually.');
                }
            } else {
                console.error('Error switching network:', switchError);
            }
        }
    };

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask to use this dApp');
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);
            setWrongNetwork(false);

            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send('eth_requestAccounts', []);
            const network = await browserProvider.getNetwork();

            // Check if on the correct network
            if (network.chainId !== EXPECTED_CHAIN_ID) {
                setWrongNetwork(true);
                setError(`Please switch to ${EXPECTED_CHAIN_NAME} network (Chain ID: 31337)`);
                setIsConnecting(false);

                // Attempt to switch network automatically
                await switchToLocalNetwork();
                return;
            }

            const walletSigner = await browserProvider.getSigner();

            const crowdfundingContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                walletSigner
            );

            setProvider(browserProvider);
            setSigner(walletSigner);
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setContract(crowdfundingContract);
            setWrongNetwork(false);
        } catch (err) {
            console.error('Connection error:', err);

            // Handle specific RPC errors
            if (err.message?.includes('403') || err.message?.includes('RPC endpoint')) {
                setError('RPC connection failed. Please make sure Hardhat node is running (npx hardhat node) and MetaMask is connected to localhost:8545');
            } else {
                setError(err.message || 'Failed to connect wallet');
            }
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setContract(null);
        setChainId(null);
        setWrongNetwork(false);
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    disconnectWallet();
                } else {
                    setAccount(accounts[0]);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, [disconnectWallet]);

    const value = {
        account,
        provider,
        signer,
        contract,
        chainId,
        isConnecting,
        error,
        wrongNetwork,
        connectWallet,
        disconnectWallet,
        switchToLocalNetwork,
        isConnected: !!account && !wrongNetwork
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};
