import {
  __async,
  __commonJS,
  __spreadProps,
  __spreadValues
} from "./chunk-SFFCLR5V.js";

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/EndpointsBase.js
var EndpointsBase = class {
  api;
  constructor(api) {
    this.api = api;
  }
  getRequest(url) {
    return __async(this, null, function* () {
      return yield this.api.makeRequest("GET", url);
    });
  }
  postRequest(url, body, contentType = void 0) {
    return __async(this, null, function* () {
      return yield this.api.makeRequest("POST", url, body, contentType);
    });
  }
  putRequest(url, body, contentType = void 0) {
    return __async(this, null, function* () {
      return yield this.api.makeRequest("PUT", url, body, contentType);
    });
  }
  deleteRequest(url, body) {
    return __async(this, null, function* () {
      return yield this.api.makeRequest("DELETE", url, body);
    });
  }
  paramsFor(args) {
    const params = new URLSearchParams();
    for (let key of Object.getOwnPropertyNames(args)) {
      if (args[key] || args[key] === 0 || !args[key] && typeof args[key] === "boolean") {
        params.append(key, args[key].toString());
      }
    }
    return [...params].length > 0 ? `?${params.toString()}` : "";
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/AlbumsEndpoints.js
var AlbumsEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        const album = yield this.getRequest(`albums/${idOrIds}${params2}`);
        return album;
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`albums${params}`);
      return response.albums;
    });
  }
  tracks(albumId, market, limit, offset) {
    const params = this.paramsFor({ market, limit, offset });
    return this.getRequest(`albums/${albumId}/tracks${params}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/ArtistsEndpoints.js
var ArtistsEndpoints = class extends EndpointsBase {
  get(idOrIds) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const artist = this.getRequest(`artists/${idOrIds}`);
        return artist;
      }
      const params = this.paramsFor({ ids: idOrIds });
      const response = yield this.getRequest(`artists${params}`);
      return response.artists;
    });
  }
  albums(id, includeGroups, market, limit, offset) {
    const params = this.paramsFor({
      include_groups: includeGroups,
      market,
      limit,
      offset
    });
    return this.getRequest(`artists/${id}/albums${params}`);
  }
  topTracks(id, market) {
    const params = this.paramsFor({ market });
    return this.getRequest(`artists/${id}/top-tracks${params}`);
  }
  relatedArtists(id) {
    return this.getRequest(`artists/${id}/related-artists`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/AudiobooksEndpoints.js
var AudiobooksEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        return this.getRequest(`audiobooks/${idOrIds}${params2}`);
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`audiobooks${params}`);
      return response.audiobooks;
    });
  }
  getAudiobookChapters(id, market, limit, offset) {
    const params = this.paramsFor({ market, limit, offset });
    return this.getRequest(`audiobooks/${id}/chapters${params}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/BrowseEndpoints.js
var BrowseEndpoints = class extends EndpointsBase {
  getCategories(country, locale, limit, offset) {
    const params = this.paramsFor({ country, locale, limit, offset });
    return this.getRequest(`browse/categories${params}`);
  }
  getCategory(categoryId, country, locale) {
    const params = this.paramsFor({ country, locale });
    return this.getRequest(`browse/categories/${categoryId}${params}`);
  }
  getNewReleases(country, limit, offset) {
    const params = this.paramsFor({ country, limit, offset });
    return this.getRequest(`browse/new-releases${params}`);
  }
  getFeaturedPlaylists(country, locale, timestamp, limit, offset) {
    const params = this.paramsFor({ country, locale, timestamp, limit, offset });
    return this.getRequest(`browse/featured-playlists${params}`);
  }
  getPlaylistsForCategory(category_id, country, limit, offset) {
    const params = this.paramsFor({ country, limit, offset });
    return this.getRequest(`browse/categories/${category_id}/playlists${params}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/ChaptersEndpoints.js
var ChaptersEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        return this.getRequest(`chapters/${idOrIds}${params2}`);
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`chapters${params}`);
      return response.chapters;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/EpisodesEndpoints.js
var EpisodesEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        return this.getRequest(`episodes/${idOrIds}${params2}`);
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`episodes${params}`);
      return response.episodes;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/RecommendationsEndpoints.js
var RecommendationsEndpoints = class extends EndpointsBase {
  get(request) {
    const params = this.paramsFor(request);
    return this.getRequest(`recommendations${params}`);
  }
  genreSeeds() {
    return this.getRequest("recommendations/available-genre-seeds");
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/MarketsEndpoints.js
var MarketsEndpoints = class extends EndpointsBase {
  getAvailableMarkets() {
    return this.getRequest("markets");
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/PlayerEndpoints.js
var PlayerEndpoints = class extends EndpointsBase {
  getPlaybackState(market, additional_types) {
    const params = this.paramsFor({ market, additional_types });
    return this.getRequest(`me/player${params}`);
  }
  getAvailableDevices() {
    return this.getRequest("me/player/devices");
  }
  getCurrentlyPlayingTrack(market, additional_types) {
    const params = this.paramsFor({ market, additional_types });
    return this.getRequest(`me/player/currently-playing${params}`);
  }
  getRecentlyPlayedTracks(limit, queryRange) {
    const paramObj = { limit };
    if (queryRange) {
      if (queryRange.type === "before") {
        paramObj.before = queryRange.timestamp;
      } else if (queryRange.type === "after") {
        paramObj.after = queryRange.timestamp;
      }
    }
    const params = this.paramsFor(paramObj);
    return this.getRequest(`me/player/recently-played${params}`);
  }
  getUsersQueue() {
    return this.getRequest("me/player/queue");
  }
  transferPlayback(device_ids, play) {
    return __async(this, null, function* () {
      if (device_ids.length > 1) {
        throw new Error("Although an array is accepted, only a single device_id is currently supported. Supplying more than one will return 400 Bad Request");
      }
      yield this.putRequest("me/player", { device_ids, play });
    });
  }
  startResumePlayback(device_id, context_uri, uris, offset, positionMs) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ device_id });
      yield this.putRequest(`me/player/play${params}`, { context_uri, uris, offset, positionMs });
    });
  }
  pausePlayback(device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ device_id });
      yield this.putRequest(`me/player/pause${params}`);
    });
  }
  skipToNext(device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ device_id });
      yield this.postRequest(`me/player/next${params}`);
    });
  }
  skipToPrevious(device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ device_id });
      yield this.postRequest(`me/player/previous${params}`);
    });
  }
  seekToPosition(position_ms, device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ position_ms, device_id });
      yield this.putRequest(`me/player/seek${params}`);
    });
  }
  setRepeatMode(state, device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ state, device_id });
      yield this.putRequest(`me/player/repeat${params}`);
    });
  }
  setPlaybackVolume(volume_percent, device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ volume_percent, device_id });
      yield this.putRequest(`me/player/volume${params}`);
    });
  }
  togglePlaybackShuffle(state, device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ state, device_id });
      yield this.putRequest(`me/player/shuffle${params}`);
    });
  }
  addItemToPlaybackQueue(uri, device_id) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ uri, device_id });
      yield this.postRequest(`me/player/queue${params}`);
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/PlaylistsEndpoints.js
var PlaylistsEndpoints = class extends EndpointsBase {
  getPlaylist(playlist_id, market, fields, additional_types) {
    const params = this.paramsFor({ market, fields, additional_types: additional_types?.join(",") });
    return this.getRequest(`playlists/${playlist_id}${params}`);
  }
  getPlaylistItems(playlist_id, market, fields, limit, offset, additional_types) {
    const params = this.paramsFor({ market, fields, limit, offset, additional_types: additional_types?.join(",") });
    return this.getRequest(`playlists/${playlist_id}/tracks${params}`);
  }
  changePlaylistDetails(playlist_id, request) {
    return __async(this, null, function* () {
      yield this.putRequest(`playlists/${playlist_id}`, request);
    });
  }
  movePlaylistItems(playlist_id, range_start, range_length, moveToPosition) {
    return this.updatePlaylistItems(playlist_id, {
      range_start,
      range_length,
      insert_before: moveToPosition
    });
  }
  updatePlaylistItems(playlist_id, request) {
    return this.putRequest(`playlists/${playlist_id}/tracks`, request);
  }
  addItemsToPlaylist(playlist_id, uris, position) {
    return __async(this, null, function* () {
      yield this.postRequest(`playlists/${playlist_id}/tracks`, { position, uris });
    });
  }
  removeItemsFromPlaylist(playlist_id, request) {
    return __async(this, null, function* () {
      yield this.deleteRequest(`playlists/${playlist_id}/tracks`, request);
    });
  }
  getUsersPlaylists(user_id, limit, offset) {
    const params = this.paramsFor({ limit, offset });
    return this.getRequest(`users/${user_id}/playlists${params}`);
  }
  createPlaylist(user_id, request) {
    return this.postRequest(`users/${user_id}/playlists`, request);
  }
  getPlaylistCoverImage(playlist_id) {
    return this.getRequest(`playlists/${playlist_id}/images`);
  }
  addCustomPlaylistCoverImage(playlist_id, imageData) {
    return __async(this, null, function* () {
      let base64EncodedJpeg = "";
      if (imageData instanceof Buffer) {
        base64EncodedJpeg = imageData.toString("base64");
      } else if (imageData instanceof HTMLCanvasElement) {
        base64EncodedJpeg = imageData.toDataURL("image/jpeg").split(";base64,")[1];
      } else if (imageData instanceof HTMLImageElement) {
        const canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get canvas context");
        }
        ctx.drawImage(imageData, 0, 0);
        base64EncodedJpeg = canvas.toDataURL("image/jpeg").split(";base64,")[1];
      } else if (typeof imageData === "string") {
        base64EncodedJpeg = imageData;
      } else {
        throw new Error("ImageData must be a Buffer, HTMLImageElement, HTMLCanvasElement, or string containing a base64 encoded jpeg");
      }
      yield this.addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg);
    });
  }
  addCustomPlaylistCoverImageFromBase64String(playlist_id, base64EncodedJpeg) {
    return __async(this, null, function* () {
      yield this.putRequest(`playlists/${playlist_id}/images`, base64EncodedJpeg, "image/jpeg");
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/SearchEndpoints.js
var SearchEndpoints = class extends EndpointsBase {
  execute(q, type, market, limit, offset, include_external) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ q, type, market, limit, offset, include_external });
      return yield this.getRequest(`search${params}`);
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/ShowsEndpoints.js
var ShowsEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        return this.getRequest(`shows/${idOrIds}${params2}`);
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`shows${params}`);
      return response.shows;
    });
  }
  episodes(id, market, limit, offset) {
    const params = this.paramsFor({ market, limit, offset });
    return this.getRequest(`shows/${id}/episodes${params}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/TracksEndpoints.js
var TracksEndpoints = class extends EndpointsBase {
  get(idOrIds, market) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        const params2 = this.paramsFor({ market });
        return this.getRequest(`tracks/${idOrIds}${params2}`);
      }
      const params = this.paramsFor({ ids: idOrIds, market });
      const response = yield this.getRequest(`tracks${params}`);
      return response.tracks;
    });
  }
  audioFeatures(idOrIds) {
    return __async(this, null, function* () {
      if (typeof idOrIds === "string") {
        return this.getRequest(`audio-features/${idOrIds}`);
      }
      const params = this.paramsFor({ ids: idOrIds });
      const response = yield this.getRequest(`audio-features${params}`);
      return response.audio_features;
    });
  }
  audioAnalysis(id) {
    return this.getRequest(`audio-analysis/${id}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/IAuthStrategy.js
var emptyAccessToken = { access_token: "emptyAccessToken", token_type: "", expires_in: 0, refresh_token: "", expires: -1 };
function isEmptyAccessToken(value) {
  return value === emptyAccessToken;
}

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/UsersEndpoints.js
var UsersEndpoints = class extends EndpointsBase {
  profile(userId) {
    return this.getRequest(`users/${userId}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/CurrentUserEndpoints.js
var CurrentUserEndpoints = class extends EndpointsBase {
  albums;
  audiobooks;
  episodes;
  playlists;
  shows;
  tracks;
  constructor(api) {
    super(api);
    this.albums = new CurrentUserAlbumsEndpoints(api);
    this.audiobooks = new CurrentUserAudiobooksEndpoints(api);
    this.episodes = new CurrentUserEpisodesEndpoints(api);
    this.playlists = new CurrentUserPlaylistsEndpoints(api);
    this.shows = new CurrentUserShowsEndpoints(api);
    this.tracks = new CurrentUserTracksEndpoints(api);
  }
  profile() {
    return this.getRequest("me");
  }
  topItems(type, time_range, limit, offset) {
    const params = this.paramsFor({ time_range, limit, offset });
    return this.getRequest(`me/top/${type}${params}`);
  }
  followedArtists(after, limit) {
    const params = this.paramsFor({ type: "artist", after, limit });
    return this.getRequest(`me/following${params}`);
  }
  followArtistsOrUsers(ids, type) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ type });
      yield this.putRequest(`me/following${params}`, { ids });
    });
  }
  unfollowArtistsOrUsers(ids, type) {
    return __async(this, null, function* () {
      const params = this.paramsFor({ type });
      yield this.deleteRequest(`me/following${params}`, { ids });
    });
  }
  followsArtistsOrUsers(ids, type) {
    const params = this.paramsFor({ ids, type });
    return this.getRequest(`me/following/contains${params}`);
  }
};
var CurrentUserAlbumsEndpoints = class extends EndpointsBase {
  savedAlbums(limit, offset, market) {
    const params = this.paramsFor({ limit, offset, market });
    return this.getRequest(`me/albums${params}`);
  }
  saveAlbums(ids) {
    return __async(this, null, function* () {
      yield this.putRequest("me/albums", ids);
    });
  }
  removeSavedAlbums(ids) {
    return __async(this, null, function* () {
      yield this.deleteRequest("me/albums", ids);
    });
  }
  hasSavedAlbums(ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`me/albums/contains${params}`);
  }
};
var CurrentUserAudiobooksEndpoints = class extends EndpointsBase {
  savedAudiobooks(limit, offset) {
    const params = this.paramsFor({ limit, offset });
    return this.getRequest(`me/audiobooks${params}`);
  }
  saveAudiobooks(ids) {
    return __async(this, null, function* () {
      yield this.putRequest("me/audiobooks", ids);
    });
  }
  removeSavedAudiobooks(ids) {
    return __async(this, null, function* () {
      yield this.deleteRequest("me/audiobooks", ids);
    });
  }
  hasSavedAudiobooks(ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`me/audiobooks/contains${params}`);
  }
};
var CurrentUserEpisodesEndpoints = class extends EndpointsBase {
  savedEpisodes(market, limit, offset) {
    const params = this.paramsFor({ market, limit, offset });
    return this.getRequest(`me/episodes${params}`);
  }
  saveEpisodes(ids) {
    return __async(this, null, function* () {
      yield this.putRequest(`me/episodes`, ids);
    });
  }
  removeSavedEpisodes(ids) {
    return __async(this, null, function* () {
      yield this.deleteRequest(`me/episodes`, ids);
    });
  }
  hasSavedEpisodes(ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`me/episodes/contains${params}`);
  }
};
var CurrentUserPlaylistsEndpoints = class extends EndpointsBase {
  playlists(limit, offset) {
    const params = this.paramsFor({ limit, offset });
    return this.getRequest(`me/playlists${params}`);
  }
  follow(playlist_id) {
    return __async(this, null, function* () {
      yield this.putRequest(`playlists/${playlist_id}/followers`);
    });
  }
  unfollow(playlist_id) {
    return __async(this, null, function* () {
      yield this.deleteRequest(`playlists/${playlist_id}/followers`);
    });
  }
  isFollowing(playlistId, ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`playlists/${playlistId}/followers/contains${params}`);
  }
};
var CurrentUserShowsEndpoints = class extends EndpointsBase {
  savedShows(limit, offset) {
    const params = this.paramsFor({ limit, offset });
    return this.getRequest(`me/shows${params}`);
  }
  saveShows(ids) {
    const params = this.paramsFor({ ids });
    return this.putRequest(`me/shows${params}`);
  }
  removeSavedShows(ids, market) {
    const params = this.paramsFor({ ids, market });
    return this.deleteRequest(`me/shows${params}`);
  }
  hasSavedShow(ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`me/shows/contains${params}`);
  }
};
var CurrentUserTracksEndpoints = class extends EndpointsBase {
  savedTracks(limit, offset, market) {
    const params = this.paramsFor({ limit, offset, market });
    return this.getRequest(`me/tracks${params}`);
  }
  saveTracks(ids) {
    return __async(this, null, function* () {
      yield this.putRequest("me/tracks", ids);
    });
  }
  removeSavedTracks(ids) {
    return __async(this, null, function* () {
      yield this.deleteRequest("me/tracks", ids);
    });
  }
  hasSavedTracks(ids) {
    const params = this.paramsFor({ ids });
    return this.getRequest(`me/tracks/contains${params}`);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/Crypto.js
var Crypto = class {
  static get current() {
    return this.hasSubtleCrypto ? window.crypto : this.tryLoadNodeWebCrypto();
  }
  static get hasSubtleCrypto() {
    return typeof window !== "undefined" && typeof window.crypto !== "undefined" && typeof window.crypto.subtle !== "undefined";
  }
  static tryLoadNodeWebCrypto() {
    try {
      const { webcrypto } = require_crypto();
      return webcrypto;
    } catch (e) {
      throw e;
    }
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/AccessTokenHelpers.js
var AccessTokenHelpers = class _AccessTokenHelpers {
  static refreshCachedAccessToken(clientId, item) {
    return __async(this, null, function* () {
      const updated = yield _AccessTokenHelpers.refreshToken(clientId, item.refresh_token);
      return _AccessTokenHelpers.toCachable(updated);
    });
  }
  static toCachable(item) {
    if (item.expires && item.expires === -1) {
      return item;
    }
    return __spreadProps(__spreadValues({}, item), { expires: this.calculateExpiry(item) });
  }
  static calculateExpiry(item) {
    return Date.now() + item.expires_in * 1e3;
  }
  static refreshToken(clientId, refreshToken) {
    return __async(this, null, function* () {
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);
      const result = yield fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });
      const text = yield result.text();
      if (!result.ok) {
        throw new Error(`Failed to refresh token: ${result.statusText}, ${text}`);
      }
      const json = JSON.parse(text);
      return json;
    });
  }
  static generateCodeVerifier(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  static generateCodeChallenge(codeVerifier) {
    return __async(this, null, function* () {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = yield Crypto.current.subtle.digest("SHA-256", data);
      const digestBytes = [...new Uint8Array(digest)];
      const hasBuffer = typeof Buffer !== "undefined";
      const digestAsBase64 = hasBuffer ? Buffer.from(digest).toString("base64") : btoa(String.fromCharCode.apply(null, digestBytes));
      return digestAsBase64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/ClientCredentialsStrategy.js
var ClientCredentialsStrategy = class _ClientCredentialsStrategy {
  clientId;
  clientSecret;
  scopes;
  static cacheKey = "spotify-sdk:ClientCredentialsStrategy:token";
  configuration = null;
  get cache() {
    return this.configuration.cachingStrategy;
  }
  constructor(clientId, clientSecret, scopes = []) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scopes = scopes;
  }
  setConfiguration(configuration) {
    this.configuration = configuration;
  }
  getOrCreateAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.getOrCreate(_ClientCredentialsStrategy.cacheKey, () => __async(this, null, function* () {
        const token2 = yield this.getTokenFromApi();
        return AccessTokenHelpers.toCachable(token2);
      }), (_) => __async(this, null, function* () {
        const refreshed = yield this.getTokenFromApi();
        return AccessTokenHelpers.toCachable(refreshed);
      }));
      return token;
    });
  }
  getAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.get(_ClientCredentialsStrategy.cacheKey);
      return token;
    });
  }
  removeAccessToken() {
    this.cache.remove(_ClientCredentialsStrategy.cacheKey);
  }
  getTokenFromApi() {
    return __async(this, null, function* () {
      const options = {
        grant_type: "client_credentials",
        scope: this.scopes.join(" ")
      };
      const bodyAsString = Object.keys(options).map((key) => key + "=" + options[key]).join("&");
      const hasBuffer = typeof Buffer !== "undefined";
      const credentials = `${this.clientId}:${this.clientSecret}`;
      const basicAuth = hasBuffer ? Buffer.from(credentials).toString("base64") : btoa(credentials);
      const result = yield fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${basicAuth}`
        },
        body: bodyAsString
      });
      if (result.status !== 200) {
        throw new Error("Failed to get access token.");
      }
      const json = yield result.json();
      return json;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/ImplicitGrantStrategy.js
var ImplicitGrantStrategy = class _ImplicitGrantStrategy {
  clientId;
  redirectUri;
  scopes;
  static cacheKey = "spotify-sdk:ImplicitGrantStrategy:token";
  configuration = null;
  get cache() {
    return this.configuration.cachingStrategy;
  }
  constructor(clientId, redirectUri, scopes) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }
  setConfiguration(configuration) {
    this.configuration = configuration;
  }
  getOrCreateAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.getOrCreate(_ImplicitGrantStrategy.cacheKey, () => __async(this, null, function* () {
        const token2 = yield this.redirectOrVerifyToken();
        return AccessTokenHelpers.toCachable(token2);
      }), (expiring) => __async(this, null, function* () {
        return AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring);
      }));
      return token;
    });
  }
  getAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.get(_ImplicitGrantStrategy.cacheKey);
      return token;
    });
  }
  removeAccessToken() {
    this.cache.remove(_ImplicitGrantStrategy.cacheKey);
  }
  redirectOrVerifyToken() {
    return __async(this, null, function* () {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      if (accessToken) {
        return Promise.resolve({
          access_token: accessToken,
          token_type: hashParams.get("token_type") ?? "",
          expires_in: parseInt(hashParams.get("expires_in") ?? "0"),
          refresh_token: hashParams.get("refresh_token") ?? "",
          expires: Number(hashParams.get("expires")) || 0
        });
      }
      const scopes = this.scopes ?? [];
      var scope = scopes.join(" ");
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("response_type", "token");
      params.append("redirect_uri", this.redirectUri);
      params.append("scope", scope);
      const authUrl = "https://accounts.spotify.com/authorize?" + params.toString();
      this.configuration.redirectionStrategy.redirect(authUrl);
      return emptyAccessToken;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/AuthorizationCodeWithPKCEStrategy.js
var AuthorizationCodeWithPKCEStrategy = class _AuthorizationCodeWithPKCEStrategy {
  clientId;
  redirectUri;
  scopes;
  static cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";
  configuration = null;
  get cache() {
    return this.configuration.cachingStrategy;
  }
  constructor(clientId, redirectUri, scopes) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }
  setConfiguration(configuration) {
    this.configuration = configuration;
  }
  getOrCreateAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.getOrCreate(_AuthorizationCodeWithPKCEStrategy.cacheKey, () => __async(this, null, function* () {
        const token2 = yield this.redirectOrVerifyToken();
        return AccessTokenHelpers.toCachable(token2);
      }), (expiring) => __async(this, null, function* () {
        return AccessTokenHelpers.refreshCachedAccessToken(this.clientId, expiring);
      }));
      return token;
    });
  }
  getAccessToken() {
    return __async(this, null, function* () {
      const token = yield this.cache.get(_AuthorizationCodeWithPKCEStrategy.cacheKey);
      return token;
    });
  }
  removeAccessToken() {
    this.cache.remove(_AuthorizationCodeWithPKCEStrategy.cacheKey);
  }
  redirectOrVerifyToken() {
    return __async(this, null, function* () {
      const hashParams = new URLSearchParams(window.location.search);
      const code = hashParams.get("code");
      if (code) {
        const token = yield this.verifyAndExchangeCode(code);
        this.removeCodeFromUrl();
        return token;
      }
      this.redirectToSpotify();
      return emptyAccessToken;
    });
  }
  redirectToSpotify() {
    return __async(this, null, function* () {
      const verifier = AccessTokenHelpers.generateCodeVerifier(128);
      const challenge = yield AccessTokenHelpers.generateCodeChallenge(verifier);
      const singleUseVerifier = { verifier, expiresOnAccess: true };
      this.cache.setCacheItem("spotify-sdk:verifier", singleUseVerifier);
      const redirectTarget = yield this.generateRedirectUrlForUser(this.scopes, challenge);
      yield this.configuration.redirectionStrategy.redirect(redirectTarget);
    });
  }
  verifyAndExchangeCode(code) {
    return __async(this, null, function* () {
      const cachedItem = yield this.cache.get("spotify-sdk:verifier");
      const verifier = cachedItem?.verifier;
      if (!verifier) {
        throw new Error("No verifier found in cache - can't validate query string callback parameters.");
      }
      yield this.configuration.redirectionStrategy.onReturnFromRedirect();
      return yield this.exchangeCodeForToken(code, verifier);
    });
  }
  removeCodeFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    const newUrl = url.search ? url.href : url.href.replace("?", "");
    window.history.replaceState({}, document.title, newUrl);
  }
  generateRedirectUrlForUser(scopes, challenge) {
    return __async(this, null, function* () {
      const scope = scopes.join(" ");
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("response_type", "code");
      params.append("redirect_uri", this.redirectUri);
      params.append("scope", scope);
      params.append("code_challenge_method", "S256");
      params.append("code_challenge", challenge);
      return `https://accounts.spotify.com/authorize?${params.toString()}`;
    });
  }
  exchangeCodeForToken(code, verifier) {
    return __async(this, null, function* () {
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", this.redirectUri);
      params.append("code_verifier", verifier);
      const result = yield fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });
      const text = yield result.text();
      if (!result.ok) {
        throw new Error(`Failed to exchange code for token: ${result.statusText}, ${text}`);
      }
      const json = JSON.parse(text);
      return json;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/serialization/DefaultResponseDeserializer.js
var DefaultResponseDeserializer = class {
  deserialize(response) {
    return __async(this, null, function* () {
      const text = yield response.text();
      if (text.length > 0) {
        const json = JSON.parse(text);
        return json;
      }
      return null;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/responsevalidation/DefaultResponseValidator.js
var DefaultResponseValidator = class {
  validateResponse(response) {
    return __async(this, null, function* () {
      switch (response.status) {
        case 401:
          throw new Error("Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.");
        case 403:
          const body = yield response.text();
          throw new Error(`Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here. Body: ${body}`);
        case 429:
          throw new Error("The app has exceeded its rate limits.");
        default:
          if (!response.status.toString().startsWith("20")) {
            const body2 = yield response.text();
            throw new Error(`Unrecognised response code: ${response.status} - ${response.statusText}. Body: ${body2}`);
          }
      }
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/errorhandling/NoOpErrorHandler.js
var NoOpErrorHandler = class {
  handleErrors(_) {
    return __async(this, null, function* () {
      return false;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/redirection/DocumentLocationRedirectionStrategy.js
var DocumentLocationRedirectionStrategy = class {
  redirect(targetUrl) {
    return __async(this, null, function* () {
      document.location = targetUrl.toString();
    });
  }
  onReturnFromRedirect() {
    return __async(this, null, function* () {
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/caching/GenericCache.js
var GenericCache = class {
  storage;
  updateFunctions;
  autoRenewInterval;
  autoRenewWindow;
  constructor(storage, updateFunctions = /* @__PURE__ */ new Map(), autoRenewInterval = 0, autoRenewWindow = 2 * 60 * 1e3) {
    this.storage = storage;
    this.updateFunctions = updateFunctions;
    this.autoRenewInterval = autoRenewInterval;
    this.autoRenewWindow = autoRenewWindow;
    if (this.autoRenewInterval > 0) {
      setInterval(() => this.autoRenewRenewableItems(), this.autoRenewInterval);
    }
  }
  getOrCreate(cacheKey, createFunction, updateFunction) {
    return __async(this, null, function* () {
      if (updateFunction) {
        this.updateFunctions.set(cacheKey, updateFunction);
      }
      const item = yield this.get(cacheKey);
      if (item) {
        return item;
      }
      const newCacheItem = yield createFunction();
      if (!newCacheItem) {
        throw new Error("Could not create cache item");
      }
      if (!isEmptyAccessToken(newCacheItem)) {
        this.setCacheItem(cacheKey, newCacheItem);
      }
      return newCacheItem;
    });
  }
  get(cacheKey) {
    return __async(this, null, function* () {
      let asString = this.storage.get(cacheKey);
      let cachedItem = asString ? JSON.parse(asString) : null;
      if (this.itemDueToExpire(cachedItem) && this.updateFunctions.has(cacheKey)) {
        const updateFunction = this.updateFunctions.get(cacheKey);
        yield this.tryUpdateItem(cacheKey, cachedItem, updateFunction);
        asString = this.storage.get(cacheKey);
        cachedItem = asString ? JSON.parse(asString) : null;
      }
      if (!cachedItem) {
        return null;
      }
      if (cachedItem.expires && (cachedItem.expires === -1 || cachedItem.expires <= Date.now())) {
        this.remove(cacheKey);
        return null;
      }
      if (cachedItem.expiresOnAccess && cachedItem.expiresOnAccess === true) {
        this.remove(cacheKey);
        return cachedItem;
      }
      return cachedItem;
    });
  }
  set(cacheKey, value, expiresIn) {
    const expires = Date.now() + expiresIn;
    const cacheItem = __spreadProps(__spreadValues({}, value), { expires });
    this.setCacheItem(cacheKey, cacheItem);
  }
  setCacheItem(cacheKey, cacheItem) {
    const asString = JSON.stringify(cacheItem);
    this.storage.set(cacheKey, asString);
  }
  remove(cacheKey) {
    this.storage.remove(cacheKey);
  }
  itemDueToExpire(item) {
    if (!item) {
      return false;
    }
    if (!item.expires) {
      return false;
    }
    return item.expires - Date.now() < this.autoRenewWindow;
  }
  autoRenewRenewableItems() {
    return __async(this, null, function* () {
      this.updateFunctions.forEach((updateFunction, key) => __async(this, null, function* () {
        const cachedItem = yield this.get(key);
        if (!cachedItem) {
          return;
        }
        if (updateFunction && this.itemDueToExpire(cachedItem)) {
          yield this.tryUpdateItem(key, cachedItem, updateFunction);
        }
      }));
    });
  }
  tryUpdateItem(key, cachedItem, updateFunction) {
    return __async(this, null, function* () {
      try {
        const updated = yield updateFunction(cachedItem);
        if (updated) {
          this.setCacheItem(key, updated);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/caching/LocalStorageCachingStrategy.js
var LocalStorageCachingStrategy = class extends GenericCache {
  constructor() {
    super(new LocalStorageCacheStore());
  }
};
var LocalStorageCacheStore = class {
  get(key) {
    return localStorage.getItem(key);
  }
  set(key, value) {
    localStorage.setItem(key, value);
  }
  remove(key) {
    localStorage.removeItem(key);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/caching/InMemoryCachingStrategy.js
var InMemoryCachingStrategy = class extends GenericCache {
  constructor() {
    super(new DictionaryCacheStore());
  }
};
var DictionaryCacheStore = class {
  cache = /* @__PURE__ */ new Map();
  get(key) {
    return this.cache.get(key) ?? null;
  }
  set(key, value) {
    this.cache.set(key, value);
  }
  remove(key) {
    this.cache.delete(key);
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/auth/ProvidedAccessTokenStrategy.js
var ProvidedAccessTokenStrategy = class {
  clientId;
  accessToken;
  refreshTokenAction;
  constructor(clientId, accessToken, refreshTokenAction) {
    this.clientId = clientId;
    this.accessToken = accessToken;
    this.refreshTokenAction = refreshTokenAction || AccessTokenHelpers.refreshCachedAccessToken;
    if (!this.accessToken.expires) {
      this.accessToken.expires = AccessTokenHelpers.calculateExpiry(this.accessToken);
    }
  }
  setConfiguration(_) {
  }
  getOrCreateAccessToken() {
    return __async(this, null, function* () {
      if (this.accessToken.expires && this.accessToken.expires <= Date.now()) {
        const refreshed = yield this.refreshTokenAction(this.clientId, this.accessToken);
        this.accessToken = refreshed;
      }
      return this.accessToken;
    });
  }
  getAccessToken() {
    return __async(this, null, function* () {
      return this.accessToken;
    });
  }
  removeAccessToken() {
    this.accessToken = {
      access_token: "",
      token_type: "",
      expires_in: 0,
      refresh_token: "",
      expires: 0
    };
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/SpotifyApi.js
var SpotifyApi = class _SpotifyApi {
  sdkConfig;
  static rootUrl = "https://api.spotify.com/v1/";
  authenticationStrategy;
  albums;
  artists;
  audiobooks;
  browse;
  chapters;
  episodes;
  recommendations;
  markets;
  player;
  playlists;
  shows;
  tracks;
  users;
  search;
  currentUser;
  constructor(authentication, config) {
    this.sdkConfig = this.initializeSdk(config);
    this.albums = new AlbumsEndpoints(this);
    this.artists = new ArtistsEndpoints(this);
    this.audiobooks = new AudiobooksEndpoints(this);
    this.browse = new BrowseEndpoints(this);
    this.chapters = new ChaptersEndpoints(this);
    this.episodes = new EpisodesEndpoints(this);
    this.recommendations = new RecommendationsEndpoints(this);
    this.markets = new MarketsEndpoints(this);
    this.player = new PlayerEndpoints(this);
    this.playlists = new PlaylistsEndpoints(this);
    this.shows = new ShowsEndpoints(this);
    this.tracks = new TracksEndpoints(this);
    this.users = new UsersEndpoints(this);
    this.currentUser = new CurrentUserEndpoints(this);
    const search = new SearchEndpoints(this);
    this.search = search.execute.bind(search);
    this.authenticationStrategy = authentication;
    this.authenticationStrategy.setConfiguration(this.sdkConfig);
  }
  makeRequest(method, url, body = void 0, contentType = void 0) {
    return __async(this, null, function* () {
      try {
        const accessToken = yield this.authenticationStrategy.getOrCreateAccessToken();
        if (isEmptyAccessToken(accessToken)) {
          console.warn("No access token found, authenticating now.");
          return null;
        }
        const token = accessToken?.access_token;
        const fullUrl = _SpotifyApi.rootUrl + url;
        const opts = {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType ?? "application/json"
          },
          body: body ? typeof body === "string" ? body : JSON.stringify(body) : void 0
        };
        this.sdkConfig.beforeRequest(fullUrl, opts);
        const result = yield this.sdkConfig.fetch(fullUrl, opts);
        this.sdkConfig.afterRequest(fullUrl, opts, result);
        if (result.status === 204) {
          return null;
        }
        yield this.sdkConfig.responseValidator.validateResponse(result);
        return this.sdkConfig.deserializer.deserialize(result);
      } catch (error) {
        const handled = yield this.sdkConfig.errorHandler.handleErrors(error);
        if (!handled) {
          throw error;
        }
        return null;
      }
    });
  }
  initializeSdk(config) {
    const isBrowser = typeof window !== "undefined";
    const defaultConfig = {
      fetch: (req, init) => fetch(req, init),
      beforeRequest: (_, __) => {
      },
      afterRequest: (_, __, ___) => {
      },
      deserializer: new DefaultResponseDeserializer(),
      responseValidator: new DefaultResponseValidator(),
      errorHandler: new NoOpErrorHandler(),
      redirectionStrategy: new DocumentLocationRedirectionStrategy(),
      cachingStrategy: isBrowser ? new LocalStorageCachingStrategy() : new InMemoryCachingStrategy()
    };
    return __spreadValues(__spreadValues({}, defaultConfig), config);
  }
  switchAuthenticationStrategy(authentication) {
    this.authenticationStrategy = authentication;
    this.authenticationStrategy.setConfiguration(this.sdkConfig);
    this.authenticationStrategy.getOrCreateAccessToken();
  }
  /**
   * Use this when you're running in a browser and you want to control when first authentication+redirect happens.
  */
  authenticate() {
    return __async(this, null, function* () {
      const response = yield this.authenticationStrategy.getOrCreateAccessToken();
      return {
        authenticated: response.expires > Date.now() && !isEmptyAccessToken(response),
        accessToken: response
      };
    });
  }
  /**
   * @returns the current access token. null implies the SpotifyApi is not yet authenticated.
   */
  getAccessToken() {
    return __async(this, null, function* () {
      return this.authenticationStrategy.getAccessToken();
    });
  }
  /**
   * Removes the access token if it exists.
   */
  logOut() {
    this.authenticationStrategy.removeAccessToken();
  }
  static withUserAuthorization(clientId, redirectUri, scopes = [], config) {
    const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
    return new _SpotifyApi(strategy, config);
  }
  static withClientCredentials(clientId, clientSecret, scopes = [], config) {
    const strategy = new ClientCredentialsStrategy(clientId, clientSecret, scopes);
    return new _SpotifyApi(strategy, config);
  }
  static withImplicitGrant(clientId, redirectUri, scopes = [], config) {
    const strategy = new ImplicitGrantStrategy(clientId, redirectUri, scopes);
    return new _SpotifyApi(strategy, config);
  }
  /**
   * Use this when you're running in a Node environment, and accepting the access token from a client-side `performUserAuthorization` call.
   * You can also use this method if you already have an access token and don't want to use the built-in authentication strategies.
   */
  static withAccessToken(clientId, token, config) {
    const strategy = new ProvidedAccessTokenStrategy(clientId, token);
    return new _SpotifyApi(strategy, config);
  }
  static performUserAuthorization(clientId, redirectUri, scopes, onAuthorizationOrUrl, config) {
    return __async(this, null, function* () {
      const strategy = new AuthorizationCodeWithPKCEStrategy(clientId, redirectUri, scopes);
      const client = new _SpotifyApi(strategy, config);
      const accessToken = yield client.authenticationStrategy.getOrCreateAccessToken();
      if (!isEmptyAccessToken(accessToken)) {
        if (typeof onAuthorizationOrUrl === "string") {
          console.log("Posting access token to postback URL.");
          yield fetch(onAuthorizationOrUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(accessToken)
          });
        } else {
          yield onAuthorizationOrUrl(accessToken);
        }
      }
      return {
        authenticated: accessToken.expires > Date.now() && !isEmptyAccessToken(accessToken),
        accessToken
      };
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/errorhandling/ConsoleLoggingErrorHandler.js
var ConsoleLoggingErrorHandler = class {
  handleErrors(error) {
    return __async(this, null, function* () {
      console.log(error);
      return false;
    });
  }
};

// node_modules/@spotify/web-api-ts-sdk/dist/mjs/Scopes.js
var Scopes = class _Scopes {
  static get playlist() {
    return [
      ..._Scopes.playlistRead,
      ..._Scopes.playlistModify
    ];
  }
  static get playlistRead() {
    return [
      "playlist-read-private",
      "playlist-read-collaborative"
    ];
  }
  static get playlistModify() {
    return [
      "playlist-modify-public",
      "playlist-modify-private",
      "ugc-image-upload"
    ];
  }
  static get userDetails() {
    return [
      "user-read-private",
      "user-read-email"
    ];
  }
  static get userLibrary() {
    return [
      ..._Scopes.userLibraryRead,
      ..._Scopes.userLibraryModify
    ];
  }
  static get userLibraryRead() {
    return [
      "user-library-read"
    ];
  }
  static get userLibraryModify() {
    return [
      "user-library-modify"
    ];
  }
  static get userRecents() {
    return [
      "user-top-read",
      "user-read-recently-played"
    ];
  }
  static get userFollow() {
    return [
      ..._Scopes.userFollowRead,
      ..._Scopes.userFollowModify
    ];
  }
  static get userFollowRead() {
    return [
      "user-follow-read"
    ];
  }
  static get userFollowModify() {
    return [
      "user-follow-modify"
    ];
  }
  static get userPlayback() {
    return [
      ..._Scopes.userPlaybackRead,
      ..._Scopes.userPlaybackModify
    ];
  }
  static get userPlaybackRead() {
    return [
      "user-read-playback-position",
      "user-read-playback-state",
      "user-read-currently-playing"
    ];
  }
  static get userPlaybackModify() {
    return [
      "user-modify-playback-state",
      "app-remote-control",
      "streaming"
    ];
  }
  static get all() {
    return [
      ..._Scopes.userDetails,
      ..._Scopes.playlist,
      ..._Scopes.userLibrary,
      ..._Scopes.userRecents,
      ..._Scopes.userFollow,
      ..._Scopes.userPlayback
    ];
  }
};
export {
  AuthorizationCodeWithPKCEStrategy,
  ClientCredentialsStrategy,
  ConsoleLoggingErrorHandler,
  DefaultResponseDeserializer,
  DefaultResponseValidator,
  DocumentLocationRedirectionStrategy,
  GenericCache,
  InMemoryCachingStrategy,
  LocalStorageCachingStrategy,
  NoOpErrorHandler,
  Scopes,
  SpotifyApi,
  emptyAccessToken
};
//# sourceMappingURL=@spotify_web-api-ts-sdk.js.map
