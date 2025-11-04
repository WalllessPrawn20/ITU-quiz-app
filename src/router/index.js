import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Homepageview.vue'
import SettingsView from '../views/SettingsView.vue'
import RegionView from '../views/Categoryview.vue'
import StatsView from '../views/StatsView.vue'
import ThemesView from '../views/Settingview.vue'
import GameView from '../views/GameView.vue'
import QuestionABCDView from '../views/QuestionABCDView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/category', name: 'region', component: RegionView },
    { path: '/stats', name: 'stats', component: StatsView },
    { path: '/themes', name: 'themes', component: ThemesView },
    { path: '/game', name: 'game', component: GameView },
    { path: '/questionABCD', name: 'questionABCD', component: QuestionABCDView },
  ],
})

export default router
