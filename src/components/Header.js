import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import Web3Modal from 'web3modal';
import { GlobalContext } from "../context/GlobalContext";
import logo from './../assets/logo512.png';
import CONFIG from './../abi/config.json'


const HeaderComponent = ({setError, setErrMsg}) => {

    const { account, addAccount, delAccount } = useContext(GlobalContext);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask');
            return
        }
        const web3modal = new Web3Modal();
        const instance = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        addAccount({ id: address });
        const network = await provider.getNetwork();
        console.log(network)
        if(network.chainId !== CONFIG.NETWORK_ID ) {
            setError(true) 
            setErrMsg('Contract is not deployed on current network. please choose Binance Smartchain Mainnet')
        } else {
            setError(false) 
            setErrMsg('')
        }
        
    }
    useEffect(()=>{
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', accounts => {
                addAccount({ id: accounts[0] })
            })
            window.ethereum.on('chainChanged', chainId => {
                window.location.reload();
            })
        }
    }, [account]);
    return (
        <div className="w-full flex items-center flex-col">
            <div className="max-w-[950px] p-2">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-4 sm:mt-0">
                {account ? (
                    <div className="flex items-center flex-col">
                        <a
                            href={`${CONFIG.BLOCKCHAIN_EXPLORER}address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-[#ab5c2a] hover:bg-yellow-300 rounded text-black">
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                        </a>
                        <button className="text-xs text-right hover:text-yellow-500" onClick={() => delAccount()}>Disconnect</button>
                    </div>
                ) : (
                    <button className="px-6 py-2 bg-[#ab5c2a] hover:bg-yellow-300 rounded text-black font-bold" onClick={() => connectWallet()}>Connect Wallet</button>
                )}
            </div>

        </div>
    );
};

export default HeaderComponent;
