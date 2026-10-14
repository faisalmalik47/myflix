import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue') },
  { path: '/movies', name: 'Movies', component: () => import('@/views/Movies.vue') },
  { path: '/tv', name: 'TvShows', component: () => import('@/views/TvShows.vue') },
  { path: '/tv-shows', redirect: '/tv' },
  { path: '/shows', redirect: '/tv' },
  { path: '/anime', name: 'Anime', component: () => import('@/views/Anime.vue') },
  { path: '/play', name: 'Play', component: () => import('@/views/Play.vue') },
  { path: '/browse', redirect: '/search' },
  { path: '/search', name: 'Search', component: () => import('@/views/Search.vue') },
  { path: '/my-list', redirect: '/watchlist' },
  { path: '/watchlist', name: 'Watchlist', component: () => import('@/views/Watchlist.vue') },
  { path: '/movie/:id', name: 'MovieDetail', component: () => import('@/views/MovieDetail.vue') },
  { path: '/tv/:id', name: 'TvDetail', component: () => import('@/views/TvDetail.vue') },
  { path: '/movie/:id/watch', name: 'StreamMovie', component: () => import('@/views/StreamMovie.vue') },
  { path: '/tv/:id/watch/:season/:episode', name: 'StreamTv', component: () => import('@/views/StreamTv.vue') },
  { path: '/person/:id', name: 'PersonDetail', component: () => import('@/views/PersonDetail.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/auth/callback', name: 'AuthCallback', component: () => import('@/views/AuthCallback.vue') },
  { path: '/platforms/:id/:type?', name: 'PlatformDetail', component: () => import('@/views/PlatformDetail.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
