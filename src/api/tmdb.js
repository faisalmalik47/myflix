import axios from 'axios'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN || ''
const BASE = 'https://api.themoviedb.org/3'
export const IMG = 'https://image.tmdb.org/t/p'

const api = axios.create({
  baseURL: BASE,
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
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

// Redflix Studios & Platforms
export const STUDIOS = [
  { id: 'netflix', name: 'Netflix', networkId: 213, color: '#E50914', icon: 'netflix' },
  { id: 'disney', name: 'Disney+', networkId: 2739, color: '#113CCF', icon: 'disney' },
  { id: 'max', name: 'Max (HBO)', networkId: 49, color: '#002BE7', icon: 'max' },
  { id: 'apple', name: 'Apple TV+', networkId: 2552, color: '#A2AAAD', icon: 'apple' },
  { id: 'prime', name: 'Prime Video', networkId: 1024, color: '#00A8E1', icon: 'prime' },
  { id: 'paramount', name: 'Paramount+', networkId: 4330, color: '#0064FF', icon: 'paramount' },
  { id: 'marvel', name: 'Marvel', companyId: 420, color: '#ED1D24', icon: 'marvel' }
]

export const getStudioTitles = (studio, page = 1) => {
  if (studio.companyId) {
    return api.get('/discover/movie', {
      params: {
        with_companies: studio.companyId,
        sort_by: 'popularity.desc',
        page
      }
    }).then(r => r.data)
  }
  return api.get('/discover/tv', {
    params: {
      with_networks: studio.networkId,
      sort_by: 'popularity.desc',
      page
    }
  }).then(r => r.data)
}

