// import { useWeb3React } from "@web3-react/core";
// import { InjectedConnector } from "@web3-react/injected-connector";
// import { ethers } from "ethers";
// import { useEffect, useState } from "react";

// import { initializeConnector } from "@web3-react/core";
// import { MetaMask } from "@web3-react/metamask";

// export const [metaMask, hooks] = initializeConnector(
//   (actions) => new MetaMask({ actions })
// );

// export const injected = new InjectedConnector({
//   supportedChainIds: [137, 80001],
// });

// // web3 library
// export const getLibrary = (provider) => {
//   const library = new ethers.providers.Web3Provider(provider);
//   library.pollingInterval = 12000;
//   // initialize(provider);
//   return library;
// };

// export const useActivatingConnector = () => {
//   const { connector } = useWeb3React();
//   const [activatingConnector, setActivatingConnector] = useState(injected);
//   useEffect(() => {
//     if (activatingConnector && activatingConnector === connector) {
//       setActivatingConnector(undefined);
//     }
//   }, [activatingConnector, connector]);
//   return activatingConnector;
// };

// export const useEagerConnect = () => {
//   const { activate, active } = useWeb3React();
//   const [tried, setTried] = useState(false);
//   useEffect(() => {
//     injected.isAuthorized().then((isAuthorized) => {
//       if (isAuthorized) {
//         activate(injected, undefined, true).catch(() => {
//           setTried(true);
//         });
//       } else {
//         setTried(true);
//       }
//     });
//   }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))
//   // if the connection worked, wait until we get confirmation of that to flip the flag
//   useEffect(() => {
//     if (!tried && active) {
//       setTried(true);
//     }
//   }, [tried, active]);
//   return tried;
// };

// export const useInactiveListener = (suppress = false) => {
//   const { active, error, activate } = useWeb3React();
//   useEffect(() => {
//     const { ethereum } = window;
//     if (ethereum && ethereum.on && !active && !error && !suppress) {
//       const handleConnect = () => {
//         console.log("Handling 'connect' event");
//         activate(injected);
//       };
//       const handleChainChanged = (chainId) => {
//         console.log("Handling 'chainChanged' event with payload", chainId);
//         activate(injected);
//       };
//       const handleAccountsChanged = (accounts) => {
//         console.log("Handling 'accountsChanged' event with payload", accounts);
//         if (accounts.length > 0) {
//           activate(injected);
//         }
//       };
//       const handleNetworkChanged = (networkId) => {
//         console.log("Handling 'networkChanged' event with payload", networkId);
//         activate(injected);
//       };
//       ethereum.on("connect", handleConnect);
//       ethereum.on("chainChanged", handleChainChanged);
//       ethereum.on("accountsChanged", handleAccountsChanged);
//       ethereum.on("networkChanged", handleNetworkChanged);
//       return () => {
//         if (ethereum.removeListener) {
//           ethereum.removeListener("connect", handleConnect);
//           ethereum.removeListener("chainChanged", handleChainChanged);
//           ethereum.removeListener("accountsChanged", handleAccountsChanged);
//           ethereum.removeListener("networkChanged", handleNetworkChanged);
//         }
//       };
//     }
//   }, [active, error, suppress, activate]);
// };
