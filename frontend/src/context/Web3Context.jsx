import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

const Web3Context = createContext(null);

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

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask to use this dApp');
            return;
        }

        try {
            setIsConnecting(true);
            setError(null);

            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await browserProvider.send('eth_requestAccounts', []);
            const network = await browserProvider.getNetwork();
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
        } catch (err) {
            setError(err.message);
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
        connectWallet,
        disconnectWallet,
        isConnected: !!account
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
};
