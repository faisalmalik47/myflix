import axios from 'axios'
import { getEnv } from '@/utils/env.js'

const BASE = 'https://api.themoviedb.org/3'
export const IMG = 'https://image.tmdb.org/t/p'

const api = axios.create({
  baseURL: BASE,
})

api.interceptors.request.use((config) => {
  const token = getEnv('VITE_TMDB_ACCESS_TOKEN')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Image URL helpers
export const poster = (path, size = 'w342') => path ? `${IMG}/${size}${path}` : null
export const backdrop = (path, size = 'w1280') => path ? `${IMG}/${size}${path}` : null
export const profile = (path, size = 'w185') => path ? `${IMG}/${size}${path}` : null

// Trending
export const getTrending = (page = 1) =>
  api.get('/trending/all/week', { params: { page } }).then(r => r.data)

// Movies
export const getPopularMovies = (page = 1) =>
  api.get('/movie/popular', { params: { page } }).then(r => r.data)

export const getTopRatedMovies = (page = 1) =>
  api.get('/movie/top_rated', { params: { page } }).then(r => r.data)

export const getNowPlayingMovies = (page = 1) =>
  api.get('/movie/now_playing', { params: { page } }).then(r => r.data)

export const discoverMovies = (params = {}) =>
  api.get('/discover/movie', { params: { sort_by: 'popularity.desc', ...params } }).then(r => r.data)

export const getMovie = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } }).then(r => r.data)

export const getMovieRecommendations = (id, page = 1) =>
  api.get(`/movie/${id}/recommendations`, { params: { page } }).then(r => r.data)

export const getMovieSimilar = (id, page = 1) =>
  api.get(`/movie/${id}/similar`, { params: { page } }).then(r => r.data)

// TV Shows
export const getPopularTv = (page = 1) =>
  api.get('/tv/popular', { params: { page } }).then(r => r.data)

export const getTopRatedTv = (page = 1) =>
  api.get('/tv/top_rated', { params: { page } }).then(r => r.data)

export const discoverTv = (params = {}) =>
  api.get('/discover/tv', { params: { sort_by: 'popularity.desc', ...params } }).then(r => r.data)

export const getTvShow = (id) =>
  api.get(`/tv/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } }).then(r => r.data)

export const getSeason = (tvId, seasonNumber) =>
  api.get(`/tv/${tvId}/season/${seasonNumber}`).then(r => r.data)

// Search
export const searchMulti = (query, page = 1) =>
  api.get('/search/multi', { params: { query, page } }).then(r => r.data)

// Genres
export const getMovieGenres = () =>
  api.get('/genre/movie/list').then(r => r.data.genres)

export const getTvGenres = () =>
  api.get('/genre/tv/list').then(r => r.data.genres)

// Person
export const getPerson = (id) =>
  api.get(`/person/${id}`, { params: { append_to_response: 'combined_credits' } }).then(r => r.data)

// Redflix Top 10 Today
export const getTop10Movies = () =>
  api.get('/trending/movie/day').then(r => (r.data.results || []).slice(0, 10))

export const getTop10Tv = () =>
  api.get('/trending/tv/day').then(r => (r.data.results || []).slice(0, 10))

// Redflix Anime Hub
export const getTrendingAnime = (page = 1) =>
  api.get('/discover/tv', {
    params: {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page
    }
  }).then(r => r.data)

export const getTopRatedAnime = (page = 1) =>
  api.get('/discover/tv', {
    params: {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'vote_average.desc',
      'vote_count.gte': 150,
      page
    }
  }).then(r => r.data)

export const getAnimeMovies = (page = 1) =>
  api.get('/discover/movie', {
    params: {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page
    }
  }).then(r => r.data)

// Curated Studios & Platforms (Redflix exact)
export const CURATED_STREAMING_PLATFORMS = [
  { provider_id: 8, provider_name: 'Netflix', local_logo_path: '/platform/Logonetflix.svg', accent: '#b81d24', invertLogo: false },
  { provider_id: 9, provider_name: 'Amazon Prime Video', local_logo_path: '/platform/Amazon_Prime_Video_logo.svg', accent: '#0f3d5c', invertLogo: false },
  { provider_id: 526, provider_name: 'AMC+', local_logo_path: '/platform/amclogo@2x.png', accent: '#3a2c16', invertLogo: false },
  { provider_id: 350, provider_name: 'Apple TV', local_logo_path: '/platform/Apple_TV_logo.svg', accent: '#1c1c1e', invertLogo: true },
  { provider_id: 283, provider_name: 'Crunchyroll', local_logo_path: '/platform/crunchyroll.svg', accent: '#7a3410', invertLogo: false },
  { provider_id: 337, provider_name: 'Disney+', local_logo_path: '/platform/Disney_logo.svg', accent: '#1a4db8', invertLogo: false },
  { provider_id: 15, provider_name: 'Hulu', local_logo_path: '/platform/Hulu_logo_(2018).svg', accent: '#0c3d2c', invertLogo: false },
  { provider_id: 1899, provider_name: 'HBO Max', local_logo_path: '/platform/hbo-logo.svg', accent: '#4a1a78', invertLogo: false },
  { provider_id: 34, provider_name: 'MGM+', local_logo_path: '/platform/mgm-logo.svg', accent: '#3d3214', invertLogo: false },
  { provider_id: 2303, provider_name: 'Paramount+', local_logo_path: '/platform/Paramount-_logo.svg', accent: '#0a3a7a', invertLogo: false },
  { provider_id: 387, provider_name: 'Peacock', local_logo_path: '/platform/peacock.svg', accent: '#12261c', invertLogo: false },
  { provider_id: 99, provider_name: 'Shudder', local_logo_path: '/platform/shudder.svg', accent: '#5c1014', invertLogo: false }
]

export const STUDIOS = CURATED_STREAMING_PLATFORMS

export const getPlatformTitles = (providerId, type = 'movie', page = 1) => {
  const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie'
  return api.get(endpoint, {
    params: {
      with_watch_providers: providerId,
      watch_region: 'US',
      sort_by: 'popularity.desc',
      page
    }
  }).then(r => r.data)
}

export const getStudioTitles = (studio, page = 1) => {
  const providerId = studio.provider_id || studio.id
  return getPlatformTitles(providerId, 'movie', page)
}

