import HomeView from '@/views/HomeView.vue'
import NodeRegistryView from '@/views/NodeRegistryView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/node-registry',
    name: 'node-registry',
    component: NodeRegistryView
  }
]

export default routes
