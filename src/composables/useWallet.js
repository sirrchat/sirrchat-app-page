import { ref, computed, markRaw } from 'vue'
import { createAppKit } from '@reown/appkit/vue'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers'

// WalletConnect Project ID
const PROJECT_ID = '575623c710773894f235577114ea4986'

// Contract address on BSC
const CONTRACT_ADDRESS = '0x3e70e7b2346d7adaebc77d4a181aa25900975065'

// BSC Chain Configuration
const BSC_CHAIN = {
  id: 56,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org'] }
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' }
  }
}

// Contract ABI
const CONTRACT_ABI = [
  // Write functions
  "function register(string domain, string server, string region) external returns (bytes32)",
  "function updateNode(bytes32 nodeId, string server, string region) external",
  "function revokeNode(bytes32 nodeId) external",
  // Read functions
  "function getNode(bytes32 nodeId) external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status))",
  "function getNodeCount() external view returns (uint256)",
  "function getApprovedNodesCount() external view returns (uint256)",
  "function domainToNodeId(string domain) external view returns (bytes32)",
  // Paginated read functions
  "function getApprovedNodesPaginated(uint256 offset, uint256 limit) external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status)[] nodes, uint256 total)",
  "function getPendingNodesPaginated(uint256 offset, uint256 limit) external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status)[] nodes, uint256 total)",
  "function getNodesByOwnerPaginated(address owner, uint256 offset, uint256 limit) external view returns (tuple(address owner, string domain, string server, string region, uint256 registeredAt, uint8 status)[] nodes, uint256 total)",
  "function getNodeIdsByOwner(address owner) external view returns (bytes32[])"
]

// Node Status enum mapping
export const NodeStatus = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Suspended',
  4: 'Offline',
  5: 'Revoked'
}

// Web3Modal metadata
const metadata = {
  name: 'Sirr Node Registry',
  description: 'Register and manage Sirr mail service nodes',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://sirr.app',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/assets/identity.svg` : '']
}

// Create AppKit instance
let modal = null

function getModal() {
  if (!modal) {
    const ethersAdapter = new EthersAdapter()

    modal = createAppKit({
      adapters: [ethersAdapter],
      networks: [BSC_CHAIN],
      projectId: PROJECT_ID,
      metadata,
      features: {
        email: false,
        socials: false,
        analytics: false,
        onramp: false,
        swaps: false
      },
      themeMode: 'light',
      themeVariables: {
        '--w3m-accent': '#5b8def'
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
        '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150', // SafePal
        '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4'  // Binance Web3 Wallet
      ]
    })
  }
  return modal
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
const networkName = computed(() => {
  if (chainId.value === 56n || chainId.value === 56) return 'BNB Smart Chain'
  if (chainId.value === 97n || chainId.value === 97) return 'BSC Testnet'
  return chainId.value ? `Chain ${chainId.value}` : ''
})
const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

// Get read-only provider for BSC
function getReadProvider() {
  return new JsonRpcProvider('https://bsc-dataseed.binance.org')
}

// Get read-only contract (no wallet needed)
function getReadContract() {
  const readProvider = getReadProvider()
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, readProvider)
}

// Sync connection state from modal
async function syncConnectionState() {
  const m = getModal()
  const state = m.getState()
  console.log('Syncing state:', state)

  const currentAddress = m.getAddress?.() || state.address || state.selectedAddress
  const connected = state.isConnected || !!currentAddress

  if (connected && currentAddress && !address.value) {
    await setupProvider(currentAddress)
    return true
  }
  return false
}

// Open AppKit modal
async function connect() {
  try {
    isConnecting.value = true
    error.value = null

    const m = getModal()

    return new Promise((resolve) => {
      let modalWasOpen = false
      let unsubscribe = null

      const cleanup = () => {
        if (unsubscribe) {
          unsubscribe()
          unsubscribe = null
        }
      }

      // Subscribe to state changes to detect when modal closes
      unsubscribe = m.subscribeState(async (state) => {
        console.log('Connect subscribeState:', state)

        if (state.open) {
          modalWasOpen = true
        }

        // Modal was open and now closed - sync the state
        if (modalWasOpen && !state.open) {
          cleanup()

          // Wait a bit for state to settle
          await new Promise(r => setTimeout(r, 300))

          // Sync connection state
          const connected = await syncConnectionState()
          console.log('After modal close, connected:', connected)

          isConnecting.value = false
          resolve(connected)
        }
      })

      // Open the modal
      m.open()

      // Timeout after 2 minutes
      setTimeout(() => {
        cleanup()
        isConnecting.value = false
        resolve(false)
      }, 120000)
    })
  } catch (err) {
    console.error('Failed to connect wallet:', err)
    error.value = err.message
    isConnecting.value = false
    return false
  }
}

// Disconnect wallet
function disconnect() {
  const m = getModal()
  m.disconnect()
  address.value = null
  signer.value = null
  contract.value = null
  chainId.value = null
  provider.value = null
}

// Setup provider and contract when connected
async function setupProvider(walletAddress) {
  try {
    const m = getModal()
    const walletProvider = m.getWalletProvider()
    if (walletProvider && walletAddress) {
      provider.value = markRaw(new BrowserProvider(walletProvider))
      signer.value = markRaw(await provider.value.getSigner())
      address.value = walletAddress

      const network = await provider.value.getNetwork()
      chainId.value = network.chainId

      contract.value = markRaw(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer.value))
      return true
    }
  } catch (err) {
    console.error('Error setting up provider:', err)
    error.value = err.message
  }
  return false
}

// Clear provider state
function clearProvider() {
  address.value = null
  signer.value = null
  contract.value = null
  chainId.value = null
  provider.value = null
}

// Subscribe to wallet events
function subscribeToEvents() {
  const m = getModal()

  m.subscribeState(async (state) => {
    console.log('AppKit state changed:', state)

    // Try to get address from modal directly
    const currentAddress = m.getAddress?.() || state.address || state.selectedAddress
    const connected = state.isConnected || !!currentAddress

    console.log('Parsed - connected:', connected, 'address:', currentAddress)

    // Handle disconnection
    if (!connected && address.value) {
      console.log('Disconnecting...')
      clearProvider()
    }

    // Handle connection
    if (connected && currentAddress && !address.value) {
      console.log('Connecting with address:', currentAddress)
      await setupProvider(currentAddress)
    }
  })
}

// Initialize on first use
let initialized = false
function initializeModal() {
  if (!initialized) {
    getModal()
    subscribeToEvents()
    initialized = true
  }
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

// Default page size
const DEFAULT_PAGE_SIZE = 20

// Helper function to parse node data from contract result
function parseNode(node) {
  return {
    owner: node.owner,
    domain: node.domain,
    server: node.server,
    region: node.region,
    registeredAt: node.registeredAt,
    status: Number(node.status)
  }
}

async function getApprovedNodes(offset = 0, limit = DEFAULT_PAGE_SIZE) {
  const c = getReadContract()
  const result = await c.getApprovedNodesPaginated(offset, limit)
  return {
    nodes: result.nodes.map(parseNode),
    total: Number(result.total)
  }
}

async function getNodeCount() {
  const c = getReadContract()
  return await c.getNodeCount()
}

async function getApprovedNodesCount() {
  const c = getReadContract()
  return await c.getApprovedNodesCount()
}

async function getPendingNodes(offset = 0, limit = DEFAULT_PAGE_SIZE) {
  const c = getReadContract()
  const result = await c.getPendingNodesPaginated(offset, limit)
  return {
    nodes: result.nodes.map(parseNode),
    total: Number(result.total)
  }
}

async function getNode(nodeId) {
  const c = getReadContract()
  const node = await c.getNode(nodeId)
  return parseNode(node)
}


// Get my nodes with pagination
async function getMyNodes(offset = 0, limit = DEFAULT_PAGE_SIZE) {
  if (!address.value) return { nodes: [], total: 0 }

  const c = getReadContract()
  const result = await c.getNodesByOwnerPaginated(address.value, offset, limit)

  // Get node IDs for mapping
  const nodeIds = await c.getNodeIdsByOwner(address.value)

  return {
    nodes: result.nodes.map((node, index) => ({
      nodeId: nodeIds[offset + index],
      ...parseNode(node)
    })),
    total: Number(result.total)
  }
}

// Export composable
export function useWallet() {
  // Initialize modal on first use
  initializeModal()

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

    // Contract methods
    registerNode,
    updateNode,
    revokeNode,
    getApprovedNodes,
    getNodeCount,
    getApprovedNodesCount,
    getPendingNodes,
    getNode,
    getMyNodes,

    // Constants
    NodeStatus,
    CONTRACT_ADDRESS,
    DEFAULT_PAGE_SIZE,
    BSC_CHAIN
  }
}
