<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWallet, NodeStatus } from '@/composables/useWallet'

const { t } = useI18n()
const {
  isConnected,
  isConnecting,
  address,
  shortAddress,
  networkName,
  connect,
  disconnect,
  checkConnection,
  registerNode,
  updateNode,
  revokeNode,
  getApprovedNodes,
  getNodeCount,
  getApprovedNodesCount,
  getPendingNodes,
  getMyNodes,
  CONTRACT_ADDRESS
} = useWallet()

// Tab state
const activeTab = ref('browse')

// Stats
const stats = ref({
  totalNodes: '-',
  approvedNodes: '-',
  pendingNodes: '-',
  myNodes: '-'
})

// Nodes data
const approvedNodes = ref([])
const myNodes = ref([])
const isLoading = ref(false)

// Register form
const registerForm = ref({
  domain: '',
  server: '',
  region: ''
})
const isRegistering = ref(false)

// Update modal
const showUpdateModal = ref(false)
const updateForm = ref({
  nodeId: '',
  server: '',
  region: ''
})
const isUpdating = ref(false)

// Revoke modal
const showRevokeModal = ref(false)
const revokeNodeId = ref('')
const isRevoking = ref(false)

// Computed
const isContractConfigured = computed(() => CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000')

// Methods
async function handleConnect() {
  if (isConnected.value) {
    disconnect()
  } else {
    await connect()
    await loadAllData()
  }
}

async function loadPublicData() {
  if (!isContractConfigured.value) return

  isLoading.value = true
  try {
    const nodes = await getApprovedNodes()
    approvedNodes.value = nodes

    const [total, approved] = await Promise.all([
      getNodeCount(),
      getApprovedNodesCount()
    ])

    stats.value.totalNodes = total.toString()
    stats.value.approvedNodes = approved.toString()

    try {
      const pending = await getPendingNodes()
      stats.value.pendingNodes = pending.length.toString()
    } catch {
      stats.value.pendingNodes = '-'
    }
  } catch (error) {
    console.error('Error loading public data:', error)
  } finally {
    isLoading.value = false
  }
}

async function loadMyNodesData() {
  if (!isConnected.value) return

  try {
    const nodes = await getMyNodes()
    myNodes.value = nodes
    stats.value.myNodes = nodes.length.toString()
  } catch (error) {
    console.error('Error loading my nodes:', error)
  }
}

async function loadAllData() {
  await loadPublicData()
  await loadMyNodesData()
}

async function handleRegister() {
  if (!registerForm.value.domain || !registerForm.value.server) {
    alert(t('nodeRegistry.register.connectAlert'))
    return
  }

  isRegistering.value = true
  try {
    await registerNode(
      registerForm.value.domain,
      registerForm.value.server,
      registerForm.value.region
    )

    alert(t('nodeRegistry.messages.registerSuccess'))
    registerForm.value = { domain: '', server: '', region: '' }
    await loadAllData()
    activeTab.value = 'my-nodes'
  } catch (error) {
    console.error('Registration failed:', error)
    alert(`${t('nodeRegistry.messages.error')}: ${error.reason || error.message}`)
  } finally {
    isRegistering.value = false
  }
}

function openUpdateModal(nodeId, server, region) {
  updateForm.value = { nodeId, server, region }
  showUpdateModal.value = true
}

async function handleUpdate() {
  isUpdating.value = true
  try {
    await updateNode(
      updateForm.value.nodeId,
      updateForm.value.server,
      updateForm.value.region
    )

    alert(t('nodeRegistry.messages.updateSuccess'))
    showUpdateModal.value = false
    await loadMyNodesData()
  } catch (error) {
    console.error('Update failed:', error)
    alert(`${t('nodeRegistry.messages.error')}: ${error.reason || error.message}`)
  } finally {
    isUpdating.value = false
  }
}

function openRevokeModal(nodeId) {
  revokeNodeId.value = nodeId
  showRevokeModal.value = true
}

async function handleRevoke() {
  isRevoking.value = true
  try {
    await revokeNode(revokeNodeId.value)

    alert(t('nodeRegistry.messages.revokeSuccess'))
    showRevokeModal.value = false
    await loadAllData()
  } catch (error) {
    console.error('Revoke failed:', error)
    alert(`${t('nodeRegistry.messages.error')}: ${error.reason || error.message}`)
  } finally {
    isRevoking.value = false
  }
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getStatusClass(status) {
  return `status-${NodeStatus[status].toLowerCase()}`
}

// Lifecycle
onMounted(async () => {
  await checkConnection()
  await loadPublicData()
  if (isConnected.value) {
    await loadMyNodesData()
  }
})
</script>

<template>
  <main class="main">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">{{ t('nodeRegistry.title') }}</h1>
        <p class="page-subtitle">{{ t('nodeRegistry.subtitle') }}</p>
      </div>

      <!-- Wallet Connection -->
      <div class="wallet-section">
        <div class="wallet-info">
          <div class="wallet-status">
            <div class="wallet-status-dot" :class="{ connected: isConnected }"></div>
            <span>{{ isConnected ? t('nodeRegistry.connected') : t('nodeRegistry.notConnected') }}</span>
          </div>
          <span v-if="isConnected" class="wallet-address">{{ shortAddress }}</span>
        </div>
        <div class="wallet-actions">
          <div v-if="isConnected" class="network-badge">
            <span>{{ networkName }}</span>
          </div>
          <button
            class="btn btn-primary"
            :disabled="isConnecting"
            @click="handleConnect"
          >
            <span v-if="isConnecting" class="loading"></span>
            <span v-else>{{ isConnected ? t('nodeRegistry.disconnect') : t('nodeRegistry.connectWallet') }}</span>
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalNodes }}</div>
          <div class="stat-label">{{ t('nodeRegistry.stats.totalNodes') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.approvedNodes }}</div>
          <div class="stat-label">{{ t('nodeRegistry.stats.approvedNodes') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.pendingNodes }}</div>
          <div class="stat-label">{{ t('nodeRegistry.stats.pendingNodes') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.myNodes }}</div>
          <div class="stat-label">{{ t('nodeRegistry.stats.myNodes') }}</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'browse' }"
          @click="activeTab = 'browse'"
        >
          {{ t('nodeRegistry.tabs.browse') }}
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          {{ t('nodeRegistry.tabs.register') }}
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'my-nodes' }"
          @click="activeTab = 'my-nodes'"
        >
          {{ t('nodeRegistry.tabs.myNodes') }}
        </button>
      </div>

      <!-- Tab: Browse Nodes -->
      <div v-show="activeTab === 'browse'" class="tab-content">
        <div class="card">
          <h2 class="card-title">{{ t('nodeRegistry.browse.title') }}</h2>

          <div v-if="!isContractConfigured" class="alert alert-warning">
            Contract address not configured. Please update the CONTRACT_ADDRESS in the code.
          </div>

          <div v-else-if="isLoading" class="empty-state">
            <div class="loading loading-dark"></div>
            <p>Loading nodes...</p>
          </div>

          <div v-else-if="approvedNodes.length === 0" class="empty-state">
            <div class="empty-state-icon">&#128274;</div>
            <p class="empty-state-title">{{ t('nodeRegistry.browse.noNodes') }}</p>
            <p>{{ t('nodeRegistry.browse.beFirst') }}</p>
          </div>

          <table v-else class="node-table">
            <thead>
              <tr>
                <th>{{ t('nodeRegistry.browse.domain') }}</th>
                <th>{{ t('nodeRegistry.browse.server') }}</th>
                <th>{{ t('nodeRegistry.browse.region') }}</th>
                <th>{{ t('nodeRegistry.browse.status') }}</th>
                <th>{{ t('nodeRegistry.browse.registered') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(node, index) in approvedNodes" :key="index">
                <td class="node-domain">{{ node.domain }}</td>
                <td class="node-server">{{ node.server }}</td>
                <td>{{ node.region || '-' }}</td>
                <td><span class="status-badge status-approved">Approved</span></td>
                <td>{{ formatDate(node.registeredAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab: Register Node -->
      <div v-show="activeTab === 'register'" class="tab-content">
        <div class="card">
          <h2 class="card-title">{{ t('nodeRegistry.register.title') }}</h2>

          <div v-if="!isConnected" class="alert alert-info">
            {{ t('nodeRegistry.register.connectAlert') }}
          </div>

          <form v-else @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label" for="nodeDomain">{{ t('nodeRegistry.register.domain') }} *</label>
              <input
                type="text"
                class="form-input"
                id="nodeDomain"
                v-model="registerForm.domain"
                :placeholder="t('nodeRegistry.register.domainPlaceholder')"
                required
              >
              <p class="form-hint">{{ t('nodeRegistry.register.domainHint') }}</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="nodeServer">{{ t('nodeRegistry.register.server') }} *</label>
                <input
                  type="text"
                  class="form-input"
                  id="nodeServer"
                  v-model="registerForm.server"
                  :placeholder="t('nodeRegistry.register.serverPlaceholder')"
                  required
                >
                <p class="form-hint">{{ t('nodeRegistry.register.serverHint') }}</p>
              </div>

              <div class="form-group">
                <label class="form-label" for="nodeRegion">{{ t('nodeRegistry.register.region') }}</label>
                <input
                  type="text"
                  class="form-input"
                  id="nodeRegion"
                  v-model="registerForm.region"
                  :placeholder="t('nodeRegistry.register.regionPlaceholder')"
                >
                <p class="form-hint">{{ t('nodeRegistry.register.regionHint') }}</p>
              </div>
            </div>

            <div class="alert alert-warning">
              {{ t('nodeRegistry.register.pendingWarning') }}
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isRegistering">
              <span v-if="isRegistering" class="loading"></span>
              <span>{{ isRegistering ? t('nodeRegistry.register.registering') : t('nodeRegistry.register.submit') }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Tab: My Nodes -->
      <div v-show="activeTab === 'my-nodes'" class="tab-content">
        <div class="card">
          <h2 class="card-title">{{ t('nodeRegistry.myNodes.title') }}</h2>

          <div v-if="!isConnected" class="alert alert-info">
            {{ t('nodeRegistry.myNodes.connectAlert') }}
          </div>

          <div v-else-if="myNodes.length === 0" class="empty-state">
            <div class="empty-state-icon">&#128203;</div>
            <p class="empty-state-title">{{ t('nodeRegistry.myNodes.noNodes') }}</p>
            <p>{{ t('nodeRegistry.myNodes.noNodesDesc') }}</p>
          </div>

          <table v-else class="node-table">
            <thead>
              <tr>
                <th>{{ t('nodeRegistry.browse.domain') }}</th>
                <th>{{ t('nodeRegistry.browse.server') }}</th>
                <th>{{ t('nodeRegistry.browse.region') }}</th>
                <th>{{ t('nodeRegistry.browse.status') }}</th>
                <th>{{ t('nodeRegistry.browse.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="node in myNodes" :key="node.nodeId">
                <td class="node-domain">{{ node.domain }}</td>
                <td class="node-server">{{ node.server }}</td>
                <td>{{ node.region || '-' }}</td>
                <td>
                  <span class="status-badge" :class="getStatusClass(node.status)">
                    {{ NodeStatus[node.status] }}
                  </span>
                </td>
                <td class="node-actions">
                  <template v-if="node.status !== 5">
                    <button
                      class="btn btn-secondary btn-sm"
                      @click="openUpdateModal(node.nodeId, node.server, node.region)"
                    >
                      {{ t('nodeRegistry.myNodes.update') }}
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="openRevokeModal(node.nodeId)"
                    >
                      {{ t('nodeRegistry.myNodes.revoke') }}
                    </button>
                  </template>
                  <span v-else class="text-muted">Revoked</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Update Modal -->
    <div class="modal-overlay" :class="{ active: showUpdateModal }" @click.self="showUpdateModal = false">
      <div class="modal">
        <h3 class="modal-title">{{ t('nodeRegistry.updateModal.title') }}</h3>
        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label class="form-label" for="updateServer">{{ t('nodeRegistry.register.server') }} *</label>
            <input
              type="text"
              class="form-input"
              id="updateServer"
              v-model="updateForm.server"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="updateRegion">{{ t('nodeRegistry.register.region') }}</label>
            <input
              type="text"
              class="form-input"
              id="updateRegion"
              v-model="updateForm.region"
            >
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="showUpdateModal = false">
              {{ t('nodeRegistry.updateModal.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isUpdating">
              <span v-if="isUpdating" class="loading"></span>
              <span>{{ t('nodeRegistry.updateModal.submit') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Revoke Modal -->
    <div class="modal-overlay" :class="{ active: showRevokeModal }" @click.self="showRevokeModal = false">
      <div class="modal">
        <h3 class="modal-title">{{ t('nodeRegistry.revokeModal.title') }}</h3>
        <p class="text-muted">{{ t('nodeRegistry.revokeModal.confirm') }}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" @click="showRevokeModal = false">
            {{ t('nodeRegistry.revokeModal.cancel') }}
          </button>
          <button type="button" class="btn btn-danger" :disabled="isRevoking" @click="handleRevoke">
            <span v-if="isRevoking" class="loading"></span>
            <span>{{ t('nodeRegistry.revokeModal.submit') }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main {
  padding: 6rem 2rem 4rem;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}

/* Wallet Section */
.wallet-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wallet-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wallet-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-error);
}

.wallet-status-dot.connected {
  background: var(--color-success);
}

.wallet-address {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--color-text-light);
}

.wallet-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.network-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-bg-alt);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}

.tab-btn.active {
  background: var(--gradient-primary);
  color: white;
}

/* Node Table */
.node-table {
  width: 100%;
  border-collapse: collapse;
}

.node-table th,
.node-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.node-table th {
  font-weight: 600;
  color: var(--color-text-light);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.node-table td {
  font-size: 0.95rem;
}

.node-table tr:hover {
  background: var(--color-bg-alt);
}

.node-domain {
  font-weight: 600;
  color: var(--color-text);
}

.node-server {
  font-family: monospace;
  color: var(--color-text-light);
}

.node-actions {
  display: flex;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--color-text-light);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

/* Modal */
.modal-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  align-items: center;
  justify-content: center;
}

.modal-overlay.active {
  display: flex;
}

.modal {
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.text-muted {
  color: var(--color-text-light);
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wallet-section {
    flex-direction: column;
    text-align: center;
  }

  .wallet-info {
    flex-direction: column;
  }

  .tabs {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .node-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
