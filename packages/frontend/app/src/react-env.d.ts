/// <reference types="react-scripts" />

declare const __CONTRACT_ADDRESS__: string
interface Window {
    ethereum: import('ethers').providers.ExternalProvider
}