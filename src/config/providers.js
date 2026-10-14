// =========================================================================
// Official Redflix Streaming Server Engine
// Fetched directly from original Redflix (redflix.co) production architecture
// =========================================================================

/**
 * 1. Official Redflix Primary Servers (Movies & TV Shows)
 * Exactly mirrors the server definitions, domains, parameters and order on redflix.co
 */
export const redflixServers = [
  {
    id: 'vidbolt',
    name: 'Redflix',
    tagline: 'Official Default',
    tag: 'Default',
    origin: 'https://vidbolt.xyz',
    isOfficial: true,
    movieUrl: (id) => `https://vidbolt.xyz/movie/${id}?theme=E50914&autoPlay=true&mobileSheets=true`,
    tvUrl: (id, s, e) => `https://vidbolt.xyz/tv/${id}/${s}/${e}?theme=E50914&autoPlay=true&mobileSheets=true`
  },
  {
    id: 'filmu',
    name: 'Bolt',
    tagline: 'Ultra Fast',
    tag: 'Fast',
    origin: 'https://embed.filmu.in',
    isOfficial: true,
    movieUrl: (id) => `https://embed.filmu.in/movie/${id}?color=e50914`,
    tvUrl: (id, s, e) => `https://embed.filmu.in/tv/${id}/${s}/${e}?color=e50914`
  },
  {
    id: 'videasy',
    name: 'Mega',
    tagline: 'Multi-Quality 1080p',
    tag: 'Multi-Quality',
    origin: 'https://player.videasy.to',
    isOfficial: true,
    movieUrl: (id) => `https://player.videasy.to/movie/${id}?color=E50914`,
    tvUrl: (id, s, e) => `https://player.videasy.to/tv/${id}/${s}/${e}?color=E50914&nextEpisode=true&autoplayNextEpisode=true`
  },
  {
    id: 'vidlink',
    name: 'Nova',
    tagline: 'Multi-Audio & Subtitles',
    tag: 'Nova',
    origin: 'https://vidlink.pro',
    isOfficial: true,
    movieUrl: (id) => `https://vidlink.pro/movie/${id}?primaryColor=63b8bc&autoplay=true&nextbutton=false`,
    tvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=63b8bc&autoplay=true&nextbutton=true`
  },
  {
    id: 'vidfast',
    name: 'Alpha',
    tagline: 'High Speed CDN',
    tag: 'Alpha',
    origin: 'https://vidfast.vc',
    isOfficial: true,
    movieUrl: (id) => `https://vidfast.vc/movie/${id}?autoPlay=true`,
    tvUrl: (id, s, e) => `https://vidfast.vc/tv/${id}/${s}/${e}?autoNext=true&nextButton=false&title=true&poster=true&autoPlay=true`
  },
  {
    id: 'vidrift',
    name: 'Vid',
    tagline: 'Ad-Clean Stream',
    tag: 'Vid',
    origin: 'https://embed.vidrift.in',
    isOfficial: true,
    movieUrl: (id) => `https://embed.vidrift.in/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://embed.vidrift.in/embed/tv/${id}/${s}/${e}`
  },
  {
    id: 'playapi',
    name: 'PlayFast',
    tagline: 'Low Latency',
    tag: 'PlayFast',
    origin: 'https://playapi.co',
    isOfficial: true,
    movieUrl: (id) => `https://playapi.co/movie/${id}`,
    tvUrl: (id, s, e) => `https://playapi.co/tv/${id}/${s}/${e}`
  },
  {
    id: 'vidcore',
    name: 'Orion',
    tagline: 'Redflix Themed',
    tag: 'Orion',
    origin: 'https://vidcore.net',
    isOfficial: true,
    movieUrl: (id) => `https://vidcore.net/movie/${id}?theme=E50914`,
    tvUrl: (id, s, e) => `https://vidcore.net/tv/${id}/${s}/${e}?theme=E50914`
  },
  {
    id: 'screenscape',
    name: 'Hindi',
    tagline: 'Hindi Audio / Dual Language',
    tag: 'Hindi',
    isHindi: true,
    origin: 'https://screenscape.me',
    isOfficial: true,
    movieUrl: (id) => `https://screenscape.me/embed?tmdb=${id}&type=movie&lan=hindi`,
    tvUrl: (id, s, e) => `https://screenscape.me/embed?tmdb=${id}&type=tv&lan=hindi&s=${s}&e=${e}`
  },
  {
    id: 'screenscape-fast',
    name: 'Fast',
    tagline: 'Fast English Audio',
    tag: 'Fast',
    origin: 'https://screenscape.me',
    isOfficial: true,
    movieUrl: (id) => `https://screenscape.me/embed?tmdb=${id}&type=movie`,
    tvUrl: (id, s, e) => `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${s}&e=${e}`
  },
  {
    id: 'hindi-new',
    name: 'Hindi New',
    tagline: 'Hindi Dubbed VIP',
    tag: 'Hindi New',
    isHindi: true,
    origin: 'https://embed.reelsdownload.online',
    isOfficial: true,
    movieUrl: (id) => `https://embed.reelsdownload.online/player/${id}?key=k_885c7f4e1997d1d9c4e42aff`,
    tvUrl: (id, s, e) => `https://embed.reelsdownload.online/player/${id}/${s}/${e}?key=k_885c7f4e1997d1d9c4e42aff`
  },
  {
    id: 'cinezo',
    name: 'Cinezo',
    tagline: 'Custom Redflix Palette',
    tag: 'Cinezo',
    origin: 'https://player.cinezo.live',
    isOfficial: true,
    movieUrl: (id) => `https://player.cinezo.live/embed/movie/${id}?autoplay=true&poster=true&primarycolor=E50914&secondarycolor=0a0a12&iconcolor=ffffff`,
    tvUrl: (id, s, e) => `https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=true&poster=true&primarycolor=E50914&secondarycolor=0a0a12&iconcolor=ffffff`
  },
  {
    id: 'vidup',
    name: 'Premium',
    tagline: 'Premium 4K Stream',
    tag: 'Premium',
    origin: 'https://vidup.to',
    isOfficial: true,
    movieUrl: (id) => `https://vidup.to/movie/${id}?theme=E50914`,
    tvUrl: (id, s, e) => `https://vidup.to/tv/${id}/${s}/${e}?theme=E50914`
  },
  {
    id: 'zxcstream',
    name: 'Vidgod',
    tagline: 'Instant Load',
    tag: 'Vidgod',
    origin: 'https://api.zxcstream.xyz',
    isOfficial: true,
    movieUrl: (id) => `https://api.zxcstream.xyz/player/movie/${id}`,
    tvUrl: (id, s, e) => `https://api.zxcstream.xyz/player/tv/${id}/${s}/${e}`
  },
  {
    id: 'peachify',
    name: 'Hindi Mirror',
    tagline: 'Hindi Dubbed Stream',
    tag: 'Hindi Mirror',
    isHindi: true,
    origin: 'https://peachify.top',
    isOfficial: true,
    movieUrl: (id) => `https://peachify.top/embed/movie/${id}?accent=E50914&dub=Hindi`,
    tvUrl: (id, s, e) => `https://peachify.top/embed/tv/${id}/${s}/${e}?accent=E50914&dub=Hindi`
  },
  {
    id: 'vidrock',
    name: 'Vidrock',
    tagline: 'Rock Solid CDN',
    tag: 'Vidrock',
    origin: 'https://vidrock.net',
    isOfficial: true,
    movieUrl: (id) => `https://vidrock.net/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidrock.net/tv/${id}/${s}/${e}?autoplay=true&autonext=true`
  },
  {
    id: 'vares',
    name: 'Vares',
    tagline: 'Audio Boost',
    tag: 'Audio Boost',
    origin: 'https://orion.vares.top',
    isOfficial: true,
    movieUrl: (id) => `https://orion.vares.top/movie/${id}?autostart=true`,
    tvUrl: (id, s, e) => `https://orion.vares.top/tv/${id}/${s}/${e}?autostart=true`
  }
]

/**
 * 2. Official Redflix Anime Servers (with Sub & Dub tracks)
 * Fetched from Redflix Anime Engine (vidbolt, filmu, megaplay, tryembed, vidnest)
 */
export const animeServers = [
  {
    id: 'vidbolt-sub',
    name: 'Redflix Sub',
    track: 'sub',
    origin: 'https://vidbolt.xyz',
    isAnime: true,
    animeUrl: (id, ep) => `https://vidbolt.xyz/anime/${id}/${ep}/sub?theme=E50914&autoPlay=true`,
    movieUrl: (id) => `https://vidbolt.xyz/anime/${id}/1/sub?theme=E50914&autoPlay=true`,
    tvUrl: (id, s, e) => `https://vidbolt.xyz/anime/${id}/${e}/sub?theme=E50914&autoPlay=true`
  },
  {
    id: 'vidbolt-dub',
    name: 'Redflix Dub',
    track: 'dub',
    origin: 'https://vidbolt.xyz',
    isAnime: true,
    animeUrl: (id, ep) => `https://vidbolt.xyz/anime/${id}/${ep}/dub?theme=E50914&autoPlay=true`,
    movieUrl: (id) => `https://vidbolt.xyz/anime/${id}/1/dub?theme=E50914&autoPlay=true`,
    tvUrl: (id, s, e) => `https://vidbolt.xyz/anime/${id}/${e}/dub?theme=E50914&autoPlay=true`
  },
  {
    id: 'filmu-sub',
    name: 'Orion Sub',
    track: 'sub',
    origin: 'https://embed.filmu.in',
    isAnime: true,
    animeUrl: (id, ep) => `https://embed.filmu.in/anime/${id}/${ep}/sub?color=e50914`,
    movieUrl: (id) => `https://embed.filmu.in/anime/${id}/1/sub?color=e50914`,
    tvUrl: (id, s, e) => `https://embed.filmu.in/anime/${id}/${e}/sub?color=e50914`
  },
  {
    id: 'filmu-dub',
    name: 'Orion Dub',
    track: 'dub',
    origin: 'https://embed.filmu.in',
    isAnime: true,
    animeUrl: (id, ep) => `https://embed.filmu.in/anime/${id}/${ep}/dub?color=e50914`,
    movieUrl: (id) => `https://embed.filmu.in/anime/${id}/1/dub?color=e50914`,
    tvUrl: (id, s, e) => `https://embed.filmu.in/anime/${id}/${e}/dub?color=e50914`
  },
  {
    id: 'megaplay-sub',
    name: 'Premium Sub',
    track: 'sub',
    origin: 'https://megaplay.buzz',
    isAnime: true,
    animeUrl: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/sub`,
    movieUrl: (id) => `https://megaplay.buzz/stream/ani/${id}/1/sub`,
    tvUrl: (id, s, e) => `https://megaplay.buzz/stream/ani/${id}/${e}/sub`
  },
  {
    id: 'megaplay-dub',
    name: 'Premium Dub',
    track: 'dub',
    origin: 'https://megaplay.buzz',
    isAnime: true,
    animeUrl: (id, ep) => `https://megaplay.buzz/stream/ani/${id}/${ep}/dub`,
    movieUrl: (id) => `https://megaplay.buzz/stream/ani/${id}/1/dub`,
    tvUrl: (id, s, e) => `https://megaplay.buzz/stream/ani/${id}/${e}/dub`
  },
  {
    id: 'tryembed-sub',
    name: 'Ultra Sub',
    track: 'sub',
    origin: 'https://tryembed.us.cc',
    isAnime: true,
    animeUrl: (id, ep) => `https://tryembed.us.cc/embed/anime/${id}/${ep}/sub`,
    movieUrl: (id) => `https://tryembed.us.cc/embed/anime/${id}/1/sub`,
    tvUrl: (id, s, e) => `https://tryembed.us.cc/embed/anime/${id}/${e}/sub`
  },
  {
    id: 'tryembed-dub',
    name: 'Ultra Dub',
    track: 'dub',
    origin: 'https://tryembed.us.cc',
    isAnime: true,
    animeUrl: (id, ep) => `https://tryembed.us.cc/embed/anime/${id}/${ep}/dub`,
    movieUrl: (id) => `https://tryembed.us.cc/embed/anime/${id}/1/dub`,
    tvUrl: (id, s, e) => `https://tryembed.us.cc/embed/anime/${id}/${e}/dub`
  },
  {
    id: 'vidnest-sub',
    name: 'Alpha Sub',
    track: 'sub',
    origin: 'https://vidnest.fun',
    isAnime: true,
    animeUrl: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/sub`,
    movieUrl: (id) => `https://vidnest.fun/anime/${id}/1/sub`,
    tvUrl: (id, s, e) => `https://vidnest.fun/anime/${id}/${e}/sub`
  },
  {
    id: 'vidnest-dub',
    name: 'Alpha Dub',
    track: 'dub',
    origin: 'https://vidnest.fun',
    isAnime: true,
    animeUrl: (id, ep) => `https://vidnest.fun/anime/${id}/${ep}/dub`,
    movieUrl: (id) => `https://vidnest.fun/anime/${id}/1/dub`,
    tvUrl: (id, s, e) => `https://vidnest.fun/anime/${id}/${e}/dub`
  }
]

/**
 * 3. Fallback High-Reliability Mirrors
 * Retained for maximum resilience and redundancy
 */
export const fallbackServers = [
  {
    id: 'cinemaos',
    name: 'CinemaOS',
    tagline: 'Fast Stream VIP',
    tag: 'CinemaOS',
    origin: 'https://cinemaos.tech',
    movieUrl: (id) => `https://cinemaos.tech/player/${id}`,
    tvUrl: (id, s, e) => `https://cinemaos.tech/player/${id}?s=${s}&e=${e}`
  },
  {
    id: 'cinemaos-live',
    name: 'CinemaOS Live',
    tagline: 'Ultra Buffer',
    tag: 'CinemaOS Live',
    origin: 'https://cinemaos.live',
    movieUrl: (id) => `https://cinemaos.live/player/${id}`,
    tvUrl: (id, s, e) => `https://cinemaos.live/player/${id}?s=${s}&e=${e}`
  },
  {
    id: 'vidsrc-su',
    name: 'VidSrc SU',
    tagline: 'Reliable Mirror',
    tag: 'VidSrc',
    origin: 'https://vidsrc.su',
    movieUrl: (id) => `https://vidsrc.su/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`
  },
  {
    id: 'vidsrc-pm',
    name: 'VidSrc PM',
    tagline: 'Backup Mirror',
    tag: 'VidSrc',
    origin: 'https://vidsrc.pm',
    movieUrl: (id) => `https://vidsrc.pm/embed/movie/${id}`,
    tvUrl: (id, s, e) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`
  },
  {
    id: 'autoembed-co',
    name: 'AutoEmbed Co',
    tagline: 'Clean Stream',
    tag: 'AutoEmbed',
    origin: 'https://autoembed.co',
    movieUrl: (id) => `https://autoembed.co/movie/tmdb/${id}`,
    tvUrl: (id, s, e) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`
  },
  {
    id: 'superembed',
    name: 'MultiEmbed',
    tagline: 'Global CDN',
    tag: 'MultiEmbed',
    origin: 'https://multiembed.mov',
    movieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tvUrl: (id, s, e) => `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    tagline: 'Fast Server',
    tag: 'Smashy',
    origin: 'https://player.smashy.stream',
    movieUrl: (id) => `https://player.smashy.stream/movie/${id}`,
    tvUrl: (id, s, e) => `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`
  }
]

/**
 * Combined list: Official Redflix servers come first, followed by fallbacks
 */
export const providers = [
  ...redflixServers,
  ...fallbackServers
]

export const allServers = [
  ...redflixServers,
  ...animeServers,
  ...fallbackServers
]

export function getProvidersForMediaType(mediaType = 'movie') {
  if (mediaType === 'anime') {
    return [...animeServers, ...redflixServers]
  }
  return providers
}
