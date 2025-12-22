import { ref, computed } from 'vue'
import { ethers } from 'ethers'

// Contract ABI
const CONTRACT_ABI = [
  "function register(string domain, string server, string region) external returns (bytes32)",
  "function updateNode(bytes32 nodeId, string server, string region) external",
  "function revokeNode(bytes32 nodeId) external",
  "function getNode(bytes32 nodeId) external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status))",
  "function getApprovedNodes() external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status)[])",
  "function getPendingNodes() external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status)[])",
  "function getNodeCount() external view returns (uint256)",
  "function getApprovedNodesCount() external view returns (uint256)",
  "function getAllNodeIds() external view returns (bytes32[])",
  "function domainToNodeId(string domain) external view returns (bytes32)"
]

// Contract address - UPDATE THIS with your deployed contract address
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

// Node Status enum mapping
export const NodeStatus = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Suspended',
  4: 'Offline',
  5: 'Revoked'
}

// Network names
const NETWORK_NAMES = {
  1n: 'Ethereum Mainnet',
  5n: 'Goerli Testnet',
  11155111n: 'Sepolia Testnet',
  137n: 'Polygon',
  80001n: 'Mumbai Testnet',
  56n: 'BNB Chain',
  97n: 'BNB Testnet',
  42161n: 'Arbitrum One',
  10n: 'Optimism',
  8453n: 'Base'
}

// Global state
const provider = ref(null)
const signer = ref(null)
const contract = ref(null)
const address = ref(null)
const chainId = ref(null)
const isConnecting = ref(false)
const error = ref(null)

// Computed
const isConnected = computed(() => !!address.value)
const networkName = computed(() => NETWORK_NAMES[chainId.value] || `Chain ${chainId.value}`)
const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

// Initialize provider and listeners
function initProvider() {
  if (!window.ethereum) return false

  provider.value = new ethers.BrowserProvider(window.ethereum)

  window.ethereum.on('accountsChanged', handleAccountsChanged)
  window.ethereum.on('chainChanged', () => window.location.reload())

  return true
}

// Handle account changes
async function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    disconnect()
  } else {
    await connect()
  }
}

// Connect wallet
async function connect() {
  if (!window.ethereum) {
    error.value = 'Please install MetaMask or another Web3 wallet'
    return false
  }

  try {
    isConnecting.value = true
    error.value = null

    if (!provider.value) {
      initProvider()
    }

    await provider.value.send("eth_requestAccounts", [])
    signer.value = await provider.value.getSigner()
    address.value = await signer.value.getAddress()

    const network = await provider.value.getNetwork()
    chainId.value = network.chainId

    // Initialize contract
    contract.value = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer.value)

    return true
  } catch (err) {
    console.error('Failed to connect wallet:', err)
    error.value = err.message
    return false
  } finally {
    isConnecting.value = false
  }
}

// Disconnect wallet
function disconnect() {
  address.value = null
  signer.value = null
  contract.value = null
  chainId.value = null
}

// Check if already connected
async function checkConnection() {
  if (!window.ethereum) return false

  try {
    if (!provider.value) {
      initProvider()
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length > 0) {
      await connect()
      return true
    }
  } catch (err) {
    console.error('Error checking connection:', err)
  }

  return false
}

// Get read-only contract (no wallet needed)
function getReadContract() {
  if (contract.value) return contract.value

  const readProvider = provider.value || new ethers.JsonRpcProvider()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider)
}

// Contract methods
async function registerNode(domain, server, region) {
  if (!contract.value) throw new Error('Wallet not connected')
  const tx = await contract.value.register(domain, server, region)
  return await tx.wait()
}

async function updateNode(nodeId, server, region) {
  if (!contract.value) throw new Error('Wallet not connected')
  const tx = await contract.value.updateNode(nodeId, server, region)
  return await tx.wait()
}

async function revokeNode(nodeId) {
  if (!contract.value) throw new Error('Wallet not connected')
  const tx = await contract.value.revokeNode(nodeId)
  return await tx.wait()
}

async function getApprovedNodes() {
  const c = getReadContract()
  return await c.getApprovedNodes()
}

async function getNodeCount() {
  const c = getReadContract()
  return await c.getNodeCount()
}

async function getApprovedNodesCount() {
  const c = getReadContract()
  return await c.getApprovedNodesCount()
}

async function getPendingNodes() {
  const c = getReadContract()
  return await c.getPendingNodes()
}

async function getAllNodeIds() {
  const c = getReadContract()
  return await c.getAllNodeIds()
}

async function getNode(nodeId) {
  const c = getReadContract()
  return await c.getNode(nodeId)
}

async function getMyNodes() {
  if (!address.value) return []

  const allNodeIds = await getAllNodeIds()
  const myNodes = []

  for (const nodeId of allNodeIds) {
    const node = await getNode(nodeId)
    if (node.owner.toLowerCase() === address.value.toLowerCase()) {
      myNodes.push({ nodeId, ...node })
    }
  }

  return myNodes
}

// Export composable
export function useWallet() {
  return {
    // State
    provider,
    signer,
    contract,
    address,
    chainId,
    isConnecting,
    error,

    // Computed
    isConnected,
    networkName,
    shortAddress,

    // Methods
    connect,
    disconnect,
    checkConnection,

    // Contract methods
    registerNode,
    updateNode,
    revokeNode,
    getApprovedNodes,
    getNodeCount,
    getApprovedNodesCount,
    getPendingNodes,
    getAllNodeIds,
    getNode,
    getMyNodes,

    // Constants
    NodeStatus,
    CONTRACT_ADDRESS
  }
}
