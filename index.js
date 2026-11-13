/**
 * Host-only DSH bundle: read-only Danbooru tools for AI-art prompt research.
 *
 * No runtime dependencies: the plugin uses the global fetch, one serialized
 * request gate (Danbooru asks for ~1 request/second) and a small in-memory TTL
 * cache. Every request carries an identifying User-Agent, as the Danbooru API
 * rules require; anonymous access works, credentials only raise the limits.
 *
 * Config (all optional, read from the bundle patch or environment):
 *   contact          string  Extra identity for the User-Agent, e.g. "user #12345".
 *   minIntervalMs    number  Minimum gap between request starts (default 1100).
 *   timeoutMs        number  Per-request deadline in milliseconds (default 20000).
 *   cacheTtlMs       number  In-memory cache lifetime (default 600000).
 *   defaultRating    string  g | s | q | e | all (default all; R18 included).
 *   maxWikiChars     number  Longest wiki excerpt in a tag answer (default 4000).
 *
 * Credentials are resolved through the Harness credentials seam on every
 * request (falling back to the launch environment), so a value saved with
 * `danbooru_save_credentials` reaches the next call without a restart. Nothing
 * here stores or returns a secret value.
 *
 * Environment (fallback when the credentials store has no entry):
 *   DANBOORU_LOGIN       Danbooru user name; with DANBOORU_API_KEY it raises limits.
 *   DANBOORU_API_KEY     Danbooru API key from the user's profile page.
 *   DANBOORU_USER_AGENT  Full User-Agent override (keep it descriptive).
 */
const VERSION = '0.14.0'
const ORIGIN = 'https://danbooru.donmai.us'

/** Artist posts page; when a year is known the query includes that year's date range. */
const artistPostsUrl = (name, year) => `${ORIGIN}/posts?${new URLSearchParams({ tags: year ? `${name} date:${year}-01-01..${year}-12-31` : name }).toString()}`

const CATEGORY_IDS = { general: 0, artist: 1, copyright: 3, character: 4, meta: 5 }
const CATEGORY_NAMES = { 0: 'general', 1: 'artist', 2: 'general', 3: 'copyright', 4: 'character', 5: 'meta', 6: 'meta' }
const RATING_NAMES = { g: 'general', s: 'sensitive', q: 'questionable', e: 'explicit' }

const TTL = { posts: 5 * 60_000, tags: 6 * 60 * 60_000, wiki: 24 * 60 * 60_000, related: 60 * 60_000 }

const clamp = (value, min, max, fallback) => {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback
}

/** Danbooru's date metatag scopes a search to posts published in one calendar year. */
const MIN_YEAR = 2005
const latestYear = () => new Date().getFullYear() + 1
const yearTag = (year) => `date:${year}-01-01..${year}-12-31`

function parseYear(value) {
  if (value === undefined || value === null || value === '') return undefined
  const year = Math.trunc(Number(value))
  if (!Number.isFinite(year)) throw new Error('year must be an integer')
  const max = latestYear()
  if (year < MIN_YEAR || year > max) throw new Error(`year must be between ${MIN_YEAR} and ${max}`)
  return year
}

/** Voice-actor tags share the artist category on Danbooru but are not illustrators. */
const isIllustratorTag = (name) => !/_\(voice_actor\)$/.test(name)
const splitTags = (value) => (typeof value === 'string' && value.trim() ? value.trim().split(/\s+/).filter(Boolean) : [])

/** Video/animation files (mp4/webm/ugoira zip/...) are excluded everywhere; the plugin is image-only. */
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mkv', 'mov', 'avi', 'm4v', 'zip'])
const urlExtension = (url) => {
  const text = String(url ?? '').split('?')[0]
  const dot = text.lastIndexOf('.')
  return dot >= 0 ? text.slice(dot + 1).toLowerCase() : ''
}
const isVideoPost = (post) => {
  if (!post) return false
  if (VIDEO_EXTENSIONS.has(String(post.file_ext ?? '').toLowerCase())) return true
  if (VIDEO_EXTENSIONS.has(urlExtension(post.file_url)) || VIDEO_EXTENSIONS.has(urlExtension(post.large_file_url))) return true
  const meta = splitTags(post.tag_string_meta)
  return meta.includes('ugoira') || meta.includes('video')
}
const onlyImages = (posts) => (Array.isArray(posts) ? posts.filter((post) => !isVideoPost(post)) : [])
const categoryName = (id) => CATEGORY_NAMES[id] ?? String(id ?? 'unknown')
const truncate = (text, max) => (text.length > max ? `${text.slice(0, max)}…` : text)
const round = (value, digits = 3) => (typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null)

/** Drop undefined values (and NaN/Infinity) so a tool result always round-trips through JSON. */
const toLossless = (value) => JSON.parse(JSON.stringify(value))

/** Local calendar day as YYYY-MM-DD; the Popular page takes it as a week/month anchor. */
const isoDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** Exact-token filter for endpoints that cannot take search tags server-side (Popular week). */
function postMatchesTags(post, userTags) {
  const tokens = splitTags(userTags).filter((token) => token && !token.includes(':'))
  if (tokens.length === 0) return true
  const present = new Set([
    ...splitTags(post.tag_string_general),
    ...splitTags(post.tag_string_artist),
    ...splitTags(post.tag_string_character),
    ...splitTags(post.tag_string_copyright),
    ...splitTags(post.tag_string_meta),
  ])
  return tokens.every((token) => present.has(token))
}

/** Convenience style tag sets; users can also pass style_tags directly. The fleshy preset only
 * uses body-shape tags, so pose/composition tags (ass_focus, from_behind, ...) cannot make an
 * artist look fleshy; POSE_TAGS is reported separately as a "composition shot" diagnostic. */
const STYLE_PRESETS = {
  fleshy: ['thick_thighs', 'plump', 'curvy', 'wide_hips', 'pear-shaped_figure'],
}
const POSE_TAGS = ['ass_focus', 'from_behind', 'bent_over', 'spread_legs']

/** Tags too generic or structural to describe a style; skipped when building a similarity profile. */
const SIMILARITY_STOPLIST = new Set([
  '1girl', '1boy', 'solo', 'solo_focus', 'multiple_girls', 'multiple_boys', 'highres', 'absurdres',
  'commentary', 'english_commentary', 'translated', 'web_address', 'signature', 'artist_name',
  'dated_commentary', 'japanese_commentary', 'commentary_request', 'character_name', 'copyright_name',
  'twitter_username', 'patreon_username', 'patreon_logo', 'paid_reward_available', 'non-web_source',
  'official_art', 'commission', 'partial_commentary', 'bad_id', 'bad_twitter_id', 'bad_pixiv_id',
  'photo-referenced', 'inactive_account', 'restricted',
  'white_background', 'transparent_background', 'gradient_background', 'simple_background',
  'blue_background', 'black_background', 'pink_background', 'grey_background', 'yellow_background',
])
const SIMILARITY_TOTAL_POSTS = 8_600_000

/** Compositions that hide the face; examples only use them when the caller explicitly allows no face. */
const FACE_HIDDEN_TAGS = new Set(['ass_focus', 'from_behind', 'head_out_of_frame', 'faceless', 'faceless_male', 'no_face', 'lower_body', 'feet_out_of_frame', 'silhouette'])

/** Tags that mark 3D/photoreal renders; they are downweighted and examples prefer 2D drawings. */
const THREE_D_TAGS = new Set(['3d', 'photorealistic', 'faux_3d'])
const isThreeDPost = (post) => Boolean(post) && splitTags(post.tag_string_general).some((tag) => THREE_D_TAGS.has(tag))

/** Tags downweighted in similarity scoring (furry themes and 3D renders should not drive artist similarity). */
const SIMILARITY_DOWNWEIGHT = new Map([
  ['furry', 0.05],
  ['furry_female', 0.05],
  ['furry_male', 0.05],
  ['anthro', 0.05],
  ['humanoid_furry', 0.05],
  ['3d', 0.05],
  ['photorealistic', 0.05],
  ['faux_3d', 0.05],
])
const tagDownweight = (name) => SIMILARITY_DOWNWEIGHT.get(name) ?? 1

/** Parse a comma/space separated tag list from a tool argument. */
const parseTagList = (text) => String(text ?? '').split(/[,\s]+/).map((tag) => tag.trim()).filter(Boolean)

/**
 * Layered priority weights for image-to-artist search.
 * person mode: person style > expression style > rendering technique > color palette > tags.
 * style mode: rendering technique + color palette first, then person/expression/tags.
 */
const IMAGE_SEARCH_WEIGHTS = {
  person: { person: 0.4, expression: 0.25, technique: 0.2, color: 0.1, tag: 0.05 },
  style: { technique: 0.4, color: 0.25, person: 0.2, expression: 0.1, tag: 0.05 },
}

/** Body-part focus presets: the first tag is the part-specific focus tag, the rest are broader fallbacks. */
const PART_PRESETS = {
  hands: ['hand_focus', 'hands', 'hand_up'],
  feet: ['foot_focus', 'feet', 'barefoot'],
  thighs: ['thigh_focus', 'thighs', 'thick_thighs'],
  legs: ['leg_focus', 'legs', 'pantyhose'],
  ass: ['ass_focus', 'huge_ass'],
  breasts: ['breast_focus', 'large_breasts', 'cleavage'],
  hips: ['hip_focus', 'wide_hips'],
  eyes: ['eye_focus', 'eyes'],
  mouth: ['mouth_focus', 'parted_lips'],
  back: ['back_focus', 'back'],
  armpits: ['armpit_focus', 'armpits'],
  navel: ['navel_focus', 'navel'],
  belly: ['stomach_focus', 'belly'],
  abs: ['stomach_focus', 'abs'],
  hair: ['hair_focus', 'long_hair'],
  neck: ['neck_focus', 'neck'],
  pectorals: ['pectoral_focus', 'pectorals'],
}

/** Expression tags used to build a facial-expression profile and compare candidates with the seed. */
const EXPRESSION_TAGS = new Set([
  'smile', 'light_smile', 'open_mouth', 'closed_mouth', 'parted_lips', 'grin', 'smug',
  'seductive_smile', 'naughty_face', 'blush', 'half-closed_eyes', 'closed_eyes', 'one_eye_closed',
  'tears', 'crying', 'sweatdrop', 'heavy_breathing', 'tongue_out', 'licking_lips', 'saliva',
  'ahegao', 'rolling_eyes', 'heart-shaped_pupils', 'expressionless', 'pout', 'embarrassed',
  'flustered', 'nervous', 'aroused', 'moaning', 'furrowed_brow', 'raised_eyebrows', 'spoken_heart',
])

const clampFloat = (value, min, max, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

const splitStyleTags = (value) => String(value ?? '').split(/[\s,，]+/).map((tag) => tag.trim()).filter(Boolean)

/** Whether one post carries the style tags; matchAll requires every tag, otherwise any one. */
function postHasStyle(post, tags, matchAll) {
  const pool = new Set([
    ...splitTags(post.tag_string_general),
    ...splitTags(post.tag_string_artist),
    ...splitTags(post.tag_string_character),
    ...splitTags(post.tag_string_copyright),
    ...splitTags(post.tag_string_meta),
  ])
  return matchAll ? tags.every((tag) => pool.has(tag)) : tags.some((tag) => pool.has(tag))
}

function normalizeConfig(raw) {
  const input = raw && typeof raw === 'object' ? raw : {}
  const contact = String(input.contact ?? process.env.DANBOORU_CONTACT ?? '').trim()
  const fullUserAgent = String(input.userAgent ?? process.env.DANBOORU_USER_AGENT ?? '').trim()
  const userAgent = fullUserAgent || `dsh-danbooru-tools/${VERSION} (DeepSeek Harness${contact ? `; ${contact}` : ''})`
  return {
    userAgent,
    minIntervalMs: clamp(input.minIntervalMs ?? process.env.DANBOORU_MIN_INTERVAL_MS, 200, 60_000, 1100),
    timeoutMs: clamp(input.timeoutMs, 2_000, 120_000, 20_000),
    cacheTtlMs: clamp(input.cacheTtlMs, 0, 86_400_000, 600_000),
    defaultRating: ['g', 's', 'q', 'e', 'all'].includes(input.defaultRating) ? input.defaultRating : 'all',
    maxWikiChars: clamp(input.maxWikiChars, 200, 20_000, 4_000),
  }
}

function describeError(error) {
  const cause = error && typeof error === 'object' ? error.cause : undefined
  const code = cause && typeof cause === 'object' ? cause.code : undefined
  const message = error instanceof Error ? error.message : String(error)
  return code ? `${message} (${code})` : message
}

function abortError() {
  return new Error('Danbooru request aborted')
}

/** One serialized gate so concurrent tool calls cannot exceed Danbooru's rate limit. */
function createGate(intervalMs) {
  let lastStart = 0
  let chain = Promise.resolve()
  return function reserve() {
    const slot = chain.then(async () => {
      const wait = lastStart + intervalMs - Date.now()
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
      lastStart = Date.now()
    })
    chain = slot.then(() => undefined, () => undefined)
    return slot
  }
}

function createCache(ttlMs, maxEntries = 200) {
  const entries = new Map()
  return {
    get(key) {
      if (ttlMs <= 0) return undefined
      const hit = entries.get(key)
      if (!hit) return undefined
      if (Date.now() - hit.at > ttlMs) {
        entries.delete(key)
        return undefined
      }
      entries.delete(key)
      entries.set(key, hit)
      return hit.value
    },
    set(key, value) {
      if (ttlMs <= 0) return
      entries.set(key, { at: Date.now(), value })
      while (entries.size > maxEntries) entries.delete(entries.keys().next().value)
    },
  }
}

function httpMessage(status, path, bodyText, authenticated = false) {
  let detail = ''
  try {
    const parsed = JSON.parse(bodyText)
    detail = String(parsed?.message ?? parsed?.error ?? parsed?.errors ?? '').trim()
  } catch {
    detail = String(bodyText ?? '').replace(/\s+/g, ' ').trim().slice(0, 300)
  }
  const suffix = detail ? ` Server said: ${detail}` : ''
  if (status === 401) return authenticated
    ? `Danbooru rejected the stored credentials (401); re-save them with danbooru_save_credentials, or remove them with clear=true.${suffix}`
    : `Danbooru rejected the request (401).${suffix}`
  if (status === 403) return `Danbooru refused the request (403). It asks for a descriptive User-Agent; set DANBOORU_USER_AGENT (for example "MyBot/1.0 (user #12345)").${suffix}`
  if (status === 404) return `Danbooru returned 404 for ${path}.${suffix}`
  if (status === 429) return `Danbooru rate limit reached (429); the plugin already spaces request starts about 1s apart, so wait a moment and retry.${suffix}`
  if (status === 422) return authenticated
    ? `Danbooru rejected the tag query (422) for the logged-in account; the server states the current tag cap, so remove tags to fit it.${suffix}`
    : `Danbooru could not run the query (422). Anonymous searches accept at most 2 tags; save credentials with danbooru_save_credentials for one more.${suffix}`
  return `Danbooru request ${path} failed with HTTP ${status}.${suffix}`
}

function createClient(config, credentials) {
  const reserve = createGate(config.minIntervalMs)
  const cache = createCache(config.cacheTtlMs)

  /** Stored credential first, launch environment second; an empty value is absent. */
  const readCredential = async (name) => {
    if (credentials) {
      try {
        const resolved = await credentials.resolve(name)
        if (resolved && typeof resolved.value === 'string' && resolved.value.trim()) return resolved.value.trim()
      } catch {
        // A missing or broken store falls back to the launch environment.
      }
    }
    const value = String(process.env[name] ?? '').trim()
    return value || undefined
  }

  /** Resolve both refs per request so a saved credential reaches the next call without a restart. */
  const readAuth = async () => {
    const [login, apiKey] = await Promise.all([readCredential('DANBOORU_LOGIN'), readCredential('DANBOORU_API_KEY')])
    return { login, apiKey, configured: Boolean(login && apiKey) }
  }

  /**
   * Fetch one JSON document. `query` is either an object of search parameters or
   * empty; the cache key is built before credentials are attached so a shared
   * profile never caches a response under a key that hides who asked.
   */
  async function request(path, query = {}, options = {}) {
    const { signal, ttlMs = config.cacheTtlMs } = options
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      search.set(key, String(value))
    }
    const cacheKey = `${path}?${search.toString()}`
    const cached = cache.get(cacheKey)
    if (cached !== undefined) return cached

    const auth = await readAuth()
    if (auth.configured) {
      search.set('login', auth.login)
      search.set('api_key', auth.apiKey)
    }
    const url = `${ORIGIN}${path}${search.size ? `?${search}` : ''}`

    for (let attempt = 0; ; attempt += 1) {
      await reserve()
      const timeout = AbortSignal.timeout(config.timeoutMs)
      const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
      let response
      try {
        response = await fetch(url, {
          headers: { 'user-agent': config.userAgent, accept: 'application/json' },
          signal: combined,
        })
      } catch (error) {
        if (signal?.aborted) throw abortError()
        if (error?.name === 'TimeoutError') throw new Error(`Danbooru request timed out after ${config.timeoutMs}ms`)
        throw new Error(`Danbooru request failed: ${describeError(error)}`)
      }
      const text = await response.text()
      if (response.ok) {
        let data
        try {
          data = JSON.parse(text)
        } catch {
          throw new Error(`Danbooru returned a non-JSON body for ${path}`)
        }
        cache.set(cacheKey, data)
        return data
      }
      if (response.status === 429 && attempt === 0) {
        const retryAfter = Number(response.headers.get('retry-after'))
        const delay = Math.min(30, Math.max(1, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 2))
        await new Promise((resolve) => setTimeout(resolve, delay * 1000))
        continue
      }
      throw new Error(httpMessage(response.status, path, text, auth.configured))
    }
  }

  return { request, ttl: TTL, config }
}

function mapPost(post) {
  return {
    id: post.id,
    created_at: post.created_at ?? null,
    score: post.score ?? 0,
    rating: RATING_NAMES[post.rating] ?? post.rating ?? null,
    tags: {
      general: splitTags(post.tag_string_general),
      artist: splitTags(post.tag_string_artist),
      copyright: splitTags(post.tag_string_copyright),
      character: splitTags(post.tag_string_character),
      meta: splitTags(post.tag_string_meta),
    },
    image: {
      width: post.image_width ?? null,
      height: post.image_height ?? null,
      file_ext: post.file_ext ?? null,
      file_size: post.file_size ?? null,
    },
    urls: {
      post: `${ORIGIN}/posts/${post.id}`,
      preview: post.preview_file_url ?? null,
      sample: post.large_file_url ?? null,
      original: post.file_url ?? null,
    },
    source: post.source ?? '',
    md5: post.md5 ?? null,
    parent_id: post.parent_id ?? null,
    has_children: Boolean(post.has_children),
    is_pending: Boolean(post.is_pending),
    is_flagged: Boolean(post.is_flagged),
    is_deleted: Boolean(post.is_deleted),
    is_banned: Boolean(post.is_banned),
  }
}

const output = {
  schema: { type: 'object', additionalProperties: true },
  render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
}

const parameters = (properties, required = []) => ({ type: 'object', additionalProperties: false, properties, required })

export const inject = ['tools']

/**
 * Register the Danbooru tools. Every tool is read-only; nothing here writes to
 * Danbooru, the profile, or the workspace.
 */
export function apply(ctx, rawConfig = {}) {
  const config = normalizeConfig(rawConfig)
  let credentials
  try {
    credentials = typeof ctx.get === 'function' ? ctx.get('credentials') : undefined
  } catch {
    credentials = undefined
  }
  const client = createClient(config, credentials)
  const { request } = client

  /** Report configuration state without exposing any value. */
  const authStatus = async () => {
    const flag = async (name) => {
      if (credentials) {
        try {
          const info = await credentials.describe(name)
          return { configured: Boolean(info?.configured), source: info?.source ?? null, writable: info?.writable ?? null }
        } catch {
          // Fall through to the environment check.
        }
      }
      const value = String(process.env[name] ?? '').trim()
      return { configured: value.length > 0, source: value.length > 0 ? 'env' : null, writable: null }
    }
    const [login, apiKey] = await Promise.all([flag('DANBOORU_LOGIN'), flag('DANBOORU_API_KEY')])
    const configured = login.configured && apiKey.configured
    return {
      configured,
      login: { configured: login.configured, source: login.source, writable: login.writable },
      apiKey: { configured: apiKey.configured, source: apiKey.source, writable: apiKey.writable },
      hint: configured
        ? 'Requests authenticate with this login; anonymous limits no longer apply.'
        : 'Call danbooru_save_credentials with login and apiKey to raise the two-tag anonymous limit.',
    }
  }

  const tools = [
    {
      name: 'danbooru_search_posts',
      description: 'Search Danbooru posts by tag query and return prompt-ready tag sets plus image URLs. Read-only public API; anonymous searches accept two tags, DANBOORU_LOGIN plus DANBOORU_API_KEY raise that. The default rating filter is general; pass rating=all to disable it. Pass year to only see posts published in that calendar year.',
      parameters: parameters({
        tags: { type: 'string', description: 'Danbooru tag query, space separated, e.g. "hatsune_miku solo smile".' },
        limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Number of posts to return (default 20).' },
        page: { type: 'integer', minimum: 1, maximum: 1000, description: 'Page number (default 1).' },
        rating: { type: 'string', enum: ['g', 's', 'q', 'e', 'all'], description: 'Rating filter; all (default) = no filter, R18 included; g=general, s=sensitive, q=questionable, e=explicit.' },
        year: { type: 'integer', minimum: 2005, description: 'Only posts published in this calendar year (Danbooru date metatag).' },
        order: { type: 'string', enum: ['newest', 'score', 'rank'], description: 'Result order: newest first (default), highest score first, or rank (the Danbooru Hot row; recent uploads only, so a past year returns nothing).' },
      }),
      output,
      async execute(args, exec) {
        const limit = clamp(args?.limit, 1, 100, 20)
        const page = clamp(args?.page, 1, 1000, 1)
        const rating = ['g', 's', 'q', 'e', 'all'].includes(args?.rating) ? args.rating : config.defaultRating
        const year = parseYear(args?.year)
        const order = ['score', 'rank'].includes(args?.order) ? args.order : 'newest'
        let tags = String(args?.tags ?? '').trim()
        if (year) tags = tags ? `${tags} ${yearTag(year)}` : yearTag(year)
        if (order === 'score') tags = tags ? `${tags} order:score` : 'order:score'
        if (order === 'rank') tags = tags ? `${tags} order:rank` : 'order:rank'
        if (rating !== 'all' && !/(^|\s)rating:/.test(tags)) tags = tags ? `${tags} rating:${rating}` : `rating:${rating}`
        const data = await request('/posts.json', { tags: tags || undefined, limit, page }, { signal: exec?.signal, ttlMs: TTL.posts })
        if (!Array.isArray(data)) throw new Error('Danbooru returned an unexpected /posts.json payload')
        const photos = onlyImages(data)
        return { query: { tags, rating, limit, page, year: year ?? null, order }, count: photos.length, posts: photos.map(mapPost) }
      },
    },
    {
      name: 'danbooru_top_artists',
      description: 'Rank artists by weighted reference value for one calendar year. Default weighting samples three tiers: Danbooru Hot posts (order:rank, weight 3), posts with the largest favorite growth in the reference week (Popular week, weight 2), then the newest posts matching the year and tag filter (weight 1). Hot rank only covers recent uploads, so a past-year query uses the week ending that year and reports Hot as skipped. Each artist keeps its newest sampled post as the reference image. Pass weighting=uniform for the old score-only sampling.',
      parameters: parameters({
        year: { type: 'integer', minimum: 2005, description: 'Calendar year to rank artists in, e.g. 2025.' },
        tags: { type: 'string', description: 'Optional extra real tags (character, copyright, theme) applied to every tier.' },
        limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Artists to return (default 10).' },
        sample: { type: 'integer', minimum: 20, maximum: 600, description: 'Fallback sample size in uniform mode (default 200 = one request). Weighted mode always takes one newest and one highest-score page.' },
        hot_sample: { type: 'integer', minimum: 0, maximum: 200, description: 'Hot posts to sample (default 60; 0 disables the tier).' },
        rising_sample: { type: 'integer', minimum: 0, maximum: 200, description: 'Weekly-favorite posts to sample (default 60; 0 disables the tier).' },
        rating: { type: 'string', enum: ['g', 's', 'q', 'e', 'all'], description: 'Rating filter; all (default) = no filter, R18 included. The rising tier is filtered client-side, so it can be empty when rating is narrowed to g.' },
        weighting: { type: 'string', enum: ['weighted', 'uniform'], description: 'weighted (default) applies the hot/rising/fallback tier weights and reference-priority order; uniform samples only the fallback tier and ranks by score.' },
        rank_by: { type: 'string', enum: ['reference_priority', 'weighted_score', 'total_score', 'avg_score', 'posts'], description: 'Ranking metric; reference_priority (default) orders by Hot presence, then the favorite-growth week, then fallback sample size, with total score as the tie-break. weighted_score sums tier_weight x post score; total_score and avg_score look at post scores; posts counts sampled posts.' },
        include_total: { type: 'boolean', description: 'Also return how many posts the year (and tags) contain; costs one extra request.' },
      }, ['year']),
      output,
      async execute(args, exec) {
        const year = parseYear(args?.year)
        if (!year) throw new Error('year is required')
        const limit = clamp(args?.limit, 1, 25, 10)
        const sample = clamp(args?.sample, 20, 600, 200)
        const rating = ['g', 's', 'q', 'e', 'all'].includes(args?.rating) ? args.rating : config.defaultRating
        const weighted = args?.weighting !== 'uniform'
        const rankBy = ['reference_priority', 'weighted_score', 'total_score', 'avg_score', 'posts'].includes(args?.rank_by)
          ? args.rank_by
          : (weighted ? 'reference_priority' : 'total_score')
        const userTags = String(args?.tags ?? '').trim()
        const ratingTag = rating !== 'all' && !/(^|\s)rating:/.test(userTags) ? `rating:${rating}` : ''
        const baseTags = [userTags, yearTag(year), ratingTag].filter(Boolean).join(' ')
        const currentYear = new Date().getFullYear()
        const anchorDate = year === currentYear ? isoDay(new Date()) : `${year}-12-31`
        const weights = { hot: 3, rising: 2, recent: 1 }

        const tierStats = { hot: null, rising: null, recent: null }
        const seen = new Set()
        const byArtist = new Map()
        let sampledPosts = 0

        /** Add one tier's posts, skipping duplicates and posts outside the year/rating/tag filters. */
        const addPosts = (posts, tier, weight) => {
          let added = 0
          for (const post of Array.isArray(posts) ? posts : []) {
            if (!post || !post.id || seen.has(post.id)) continue
            if (isVideoPost(post)) continue
            if (post.created_at && !String(post.created_at).startsWith(String(year))) continue
            if (rating !== 'all' && post.rating !== rating) continue
            if (userTags && !postMatchesTags(post, userTags)) continue
            seen.add(post.id)
            added += 1
            sampledPosts += 1
            const postScore = Number(post.score) || 0
            const reference = {
              post_id: post.id,
              post_url: `${ORIGIN}/posts/${post.id}`,
              preview_url: post.preview_file_url ?? null,
              sample_url: post.large_file_url ?? post.file_url ?? null,
              created_at: post.created_at ?? null,
              score: postScore,
              rating: post.rating ?? null,
              tier,
            }
            for (const name of splitTags(post.tag_string_artist).filter(isIllustratorTag)) {
              const entry = byArtist.get(name) ?? {
                tier_posts: { hot: 0, rising: 0, recent: 0 },
                posts: 0,
                total_score: 0,
                weighted_score: 0,
                weighted_posts: 0,
                top_score: Number.NEGATIVE_INFINITY,
                top: null,
                newest: null,
              }
              entry.posts += 1
              entry.total_score += postScore
              entry.weighted_score += weight * Math.max(0, postScore)
              entry.weighted_posts += weight
              entry.tier_posts[tier] += 1
              if (!entry.newest || String(reference.created_at ?? '') > String(entry.newest.created_at ?? '')) entry.newest = reference
              if (postScore > entry.top_score) {
                entry.top_score = postScore
                entry.top = reference
              }
              byArtist.set(name, entry)
            }
          }
          return added
        }

        // Tier 1: Danbooru Hot (order:rank). Rank only covers recent uploads.
        if (weighted && year === currentYear) {
          const hotSize = clamp(args?.hot_sample, 0, 200, 60)
          if (hotSize > 0) {
            const hotTags = ['order:rank', userTags, ratingTag].filter(Boolean).join(' ')
            const hotPosts = await request('/posts.json', { tags: hotTags, limit: hotSize }, { signal: exec?.signal, ttlMs: TTL.posts })
            tierStats.hot = { sampled: addPosts(hotPosts, 'hot', weights.hot), raw: Array.isArray(hotPosts) ? hotPosts.length : 0, weight: weights.hot, source: 'posts.json?tags=order:rank' }
          } else {
            tierStats.hot = { sampled: 0, weight: weights.hot, disabled: true }
          }
        } else if (weighted) {
          tierStats.hot = { sampled: 0, weight: weights.hot, skipped: 'Danbooru hot rank only covers recent uploads, so it cannot be scoped to a past year' }
        }

        // Tier 2: favorites gained during the reference week.
        if (weighted) {
          const risingSize = clamp(args?.rising_sample, 0, 200, 60)
          if (risingSize > 0) {
            try {
              const risingPosts = await request('/explore/posts/popular.json', { scale: 'week', date: anchorDate, limit: risingSize }, { signal: exec?.signal, ttlMs: TTL.posts })
              tierStats.rising = { sampled: addPosts(risingPosts, 'rising', weights.rising), raw: Array.isArray(risingPosts) ? risingPosts.length : 0, weight: weights.rising, scale: 'week', date: anchorDate, source: '/explore/posts/popular.json' }
            } catch (error) {
              tierStats.rising = { sampled: 0, weight: weights.rising, error: error instanceof Error ? error.message : String(error) }
            }
          } else {
            tierStats.rising = { sampled: 0, weight: weights.rising, disabled: true }
          }
        }

        // Tier 3: fallback sample over the whole year. Weighted mode takes one newest page
        // (newer references for the same artist) plus one highest-score page (broad coverage);
        // uniform mode keeps the old score-only sampling.
        const perPage = 200
        const fallback = []
        if (weighted) {
          for (const tags of [baseTags, `${baseTags} order:score`]) {
            const chunk = await request('/posts.json', { tags, limit: perPage, page: 1 }, { signal: exec?.signal, ttlMs: TTL.posts })
            if (Array.isArray(chunk)) fallback.push(...chunk)
          }
        } else {
          const pages = Math.ceil(sample / perPage)
          for (let page = 1; page <= pages; page += 1) {
            const chunk = await request('/posts.json', { tags: `${baseTags} order:score`, limit: perPage, page }, { signal: exec?.signal, ttlMs: TTL.posts })
            if (!Array.isArray(chunk) || chunk.length === 0) break
            fallback.push(...chunk)
            if (chunk.length < perPage) break
          }
        }
        tierStats.recent = {
          sampled: addPosts(weighted ? fallback.slice(0, sample + perPage) : fallback.slice(0, sample), 'recent', weighted ? weights.recent : 1),
          weight: weighted ? weights.recent : 1,
          order: weighted ? 'newest+score' : 'score',
          source: 'posts.json',
        }

        if (sampledPosts === 0) {
          return {
            year,
            weighting: weighted ? { mode: 'weighted', hot: weights.hot, rising: weights.rising, recent: weights.recent } : { mode: 'uniform' },
            tiers: tierStats,
            sampled_posts: 0,
            sampled_artists: 0,
            artists: [],
            note: 'No posts matched this year and tag filter.',
          }
        }

        const rankers = {
          reference_priority: (left, right) =>
            (right.tier_posts.hot - left.tier_posts.hot) ||
            (right.tier_posts.rising - left.tier_posts.rising) ||
            (right.tier_posts.recent - left.tier_posts.recent) ||
            (right.total_score - left.total_score) ||
            (right.posts - left.posts),
          weighted_score: (left, right) => right.weighted_score - left.weighted_score || right.weighted_posts - left.weighted_posts || right.posts - left.posts,
          total_score: (left, right) => right.total_score - left.total_score || right.posts - left.posts,
          avg_score: (left, right) => right.avg_score - left.avg_score || right.posts - left.posts,
          posts: (left, right) => right.posts - left.posts || right.total_score - left.total_score,
        }
        const artists = [...byArtist.entries()]
          .map(([name, entry]) => ({
            name,
            artist_url: artistPostsUrl(name, year),
            weighted_score: round(entry.weighted_score, 1),
            weighted_posts: entry.weighted_posts,
            posts: entry.posts,
            tier_posts: entry.tier_posts,
            total_score: entry.total_score,
            avg_score: entry.posts > 0 ? round(entry.total_score / entry.posts, 2) : 0,
            top_score: entry.top_score === Number.NEGATIVE_INFINITY ? 0 : entry.top_score,
            example: entry.newest,
            top: entry.top,
          }))
          .sort((left, right) => (rankers[rankBy] ?? rankers.reference_priority)(left, right) || left.name.localeCompare(right.name))
          .slice(0, limit)

        let totalPosts
        if (args?.include_total === true) {
          try {
            const counts = await request('/counts/posts.json', { tags: baseTags }, { signal: exec?.signal, ttlMs: TTL.tags })
            totalPosts = counts?.counts?.posts ?? null
          } catch {
            totalPosts = null
          }
        }

        return {
          year,
          weighting: weighted ? { mode: 'weighted', hot: weights.hot, rising: weights.rising, recent: weights.recent } : { mode: 'uniform' },
          anchor_date: anchorDate,
          tiers: tierStats,
          query: { tags: baseTags, rating, sample, rank_by: rankBy },
          sampled_posts: sampledPosts,
          sampled_artists: byArtist.size,
          artists,
          note: 'Ranked by reference priority: Hot presence first, then the favorite-growth week, then the fallback sample, with total score as the tie-break. Reference image (example) is the newest sampled post per artist; the Hot tier only covers recent uploads, and the rising tier is client-side filtered so it can be empty when rating=g.',
          ...(args?.include_total === true ? { total_posts: totalPosts } : {}),
        }
      },
    },
    {
      name: 'danbooru_year_artists',
      description: 'Rank artists by the total favorites of posts uploaded in one calendar year, independent of the Hot/weekly weighting. It samples each month of the year by favorites (order:favcount, one request per elapsed month) and sums favorites per artist, so a full year with no recency bias. With style_tags or style_preset it also verifies each candidate on their own year posts and keeps only artists whose share of body-shape-tagged posts reaches style_threshold (default 0.05) with at least style_min_hits hits; pose/composition tags are not counted as evidence, so close-up rear shots cannot fake a fleshy body type. With appearance_tags it measures 人体 references on the same year posts: skin color (pale_skin, dark_skin, tan) and skin texture (shiny_skin, sweat, wet), returning an appearance block with per-tag hit counts, a ratio and up to three reference posts. With color_tags it measures the overall palette instead: monochrome, limited_palette, pastel_colors, blue_theme, colorful, iridescent and similar, returning a color block the same way. Each threshold (appearance_threshold / color_threshold) optionally gates on that share. Each returned artist carries style.best / appearance.best / color.best references. Use this when the user asks for popular artists of a body type, skin look or overall color tone in a year.',
      parameters: parameters({
        year: { type: 'integer', minimum: 2005, description: 'Calendar year to rank, e.g. 2026.' },
        tags: { type: 'string', description: 'Optional real tags to narrow every monthly sample.' },
        rating: { type: 'string', enum: ['g', 's', 'q', 'e', 'all'], description: 'Rating filter; all (default) = no filter, R18 included; g=general, s=sensitive, q=questionable, e=explicit.' },
        limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Artists to return (default 10).' },
        monthly_sample: { type: 'integer', minimum: 20, maximum: 200, description: 'Posts taken per month, highest favorites first (default 200 = one request per month).' },
        style_tags: { type: 'string', description: 'Comma or space separated real tags; an artist qualifies only when enough of their year posts carry these tags (e.g. "thick_thighs plump").' },
        style_preset: { type: 'string', enum: ['fleshy'], description: 'Convenience style set: fleshy = thick_thighs, plump, curvy, wide_hips.' },
        style_match: { type: 'string', enum: ['any', 'all'], description: 'any (default) counts a post that has at least one of the style tags; all requires every tag.' },
        style_threshold: { type: 'number', minimum: 0, maximum: 1, description: 'Minimum share of the artist\'s checked year posts that must carry a style tag (default 0.05 = 5%; pass 0 to measure without gating).' },
        style_min_posts: { type: 'integer', minimum: 1, maximum: 100, description: 'Minimum year posts to check before judging the ratio (default 3).' },
        style_min_hits: { type: 'integer', minimum: 1, maximum: 100, description: 'Minimum number of checked posts that must carry a style tag (default 2), so a single stray tag cannot qualify an artist.' },
        style_max_checks: { type: 'integer', minimum: 1, maximum: 120, description: 'Maximum artists to verify in favorites order before stopping (default 40).' },
        appearance_tags: { type: 'string', description: '人体附加参考 tags verified on each candidate\'s year posts: skin color (pale_skin, dark_skin, tan) and skin texture (shiny_skin, sweat, wet, oiled_skin). Eye color is not part of the body block anymore — use color_tags for the overall palette. Returned artists get an appearance block with per-tag hit counts and up to three reference posts.' },
        appearance_match: { type: 'string', enum: ['any', 'all'], description: 'any (default) counts a post that has at least one appearance tag; all requires every tag.' },
        appearance_threshold: { type: 'number', minimum: 0, maximum: 1, description: 'Optional gate: require at least this share of the artist\'s checked year posts to carry an appearance tag (default 0 = report only, no gating).' },
        color_tags: { type: 'string', description: '整体色调参考 tags verified on the same year posts: monochrome, limited_palette, pastel_colors, blue_theme, red_theme, colorful, iridescent, high_contrast... Returned artists get a color block with per-tag hit counts, a ratio and up to three reference posts.' },
        color_match: { type: 'string', enum: ['any', 'all'], description: 'any (default) counts a post that has at least one color tag; all requires every tag.' },
        color_threshold: { type: 'number', minimum: 0, maximum: 1, description: 'Optional gate: require at least this share of the artist\'s checked year posts to carry a color tag (default 0 = report only, no gating).' },
        compact: { type: 'boolean', description: 'Return only name, total_favorites, posts, months and style ratio (no post references) to keep responses small when scanning many artists.' },
      }, ['year']),
      output,
      async execute(args, exec) {
        const year = parseYear(args?.year)
        if (!year) throw new Error('year is required')
        const limit = clamp(args?.limit, 1, 25, 10)
        const monthlySample = clamp(args?.monthly_sample, 20, 200, 200)
        const rating = ['g', 's', 'q', 'e', 'all'].includes(args?.rating) ? args.rating : config.defaultRating
        const userTags = String(args?.tags ?? '').trim()
        const currentYear = new Date().getFullYear()
        const months = year < currentYear ? 12 : (year > currentYear ? 0 : new Date().getMonth() + 1)
        if (months === 0) {
          return { year, method: 'year_favorites', independent_of_hot: true, rating, months_sampled: [], monthly_sample: monthlySample, sampled_posts: 0, sampled_artists: 0, artists: [], note: 'That year has no uploads yet.' }
        }
        const ratingTag = rating !== 'all' && !/(^|\s)rating:/.test(userTags) ? `rating:${rating}` : ''
        const presetTags = STYLE_PRESETS[args?.style_preset] ?? []
        const styleTags = [...new Set([...presetTags, ...splitStyleTags(args?.style_tags)])]
        const styleThreshold = clampFloat(args?.style_threshold, 0, 1, 0.05)
        const styleMatchAll = args?.style_match === 'all'
        const styleMinPosts = clamp(args?.style_min_posts, 1, 100, 3)
        const styleMaxChecks = clamp(args?.style_max_checks, 1, 120, 40)
        const styleMinHits = clamp(args?.style_min_hits, 1, 100, 2)
        const appearanceTags = [...new Set(splitStyleTags(args?.appearance_tags))]
        const appearanceMatchAll = args?.appearance_match === 'all'
        const appearanceThreshold = clampFloat(args?.appearance_threshold, 0, 1, 0)
        const hasAppearance = appearanceTags.length > 0
        const colorTags = [...new Set(splitStyleTags(args?.color_tags))]
        const colorMatchAll = args?.color_match === 'all'
        const colorThreshold = clampFloat(args?.color_threshold, 0, 1, 0)
        const hasColor = colorTags.length > 0
        const compact = args?.compact === true
        const byArtist = new Map()
        const sample = []
        let sampledPosts = 0

        // One request per month: the month's highest-favorited posts. Summing those favorites
        // estimates the artist's favorites for the whole year without a recent-window bias.
        for (let month = 1; month <= months; month += 1) {
          const lastDay = new Date(year, month, 0).getDate()
          const monthTag = `date:${year}-${String(month).padStart(2, '0')}-01..${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
          const tags = [userTags, monthTag, ratingTag, 'order:favcount'].filter(Boolean).join(' ')
          const posts = await request('/posts.json', { tags, limit: monthlySample }, { signal: exec?.signal, ttlMs: TTL.posts })
          const rows = onlyImages(posts)
          sample.push({ month, sampled: rows.length })
          for (const post of rows) {
            sampledPosts += 1
            const favorites = Number(post.fav_count) || 0
            const reference = {
              post_id: post.id,
              post_url: `${ORIGIN}/posts/${post.id}`,
              preview_url: post.preview_file_url ?? null,
              sample_url: post.large_file_url ?? post.file_url ?? null,
              created_at: post.created_at ?? null,
              fav_count: favorites,
              rating: post.rating ?? null,
            }
            for (const name of splitTags(post.tag_string_artist).filter(isIllustratorTag)) {
              const entry = byArtist.get(name) ?? { total_favorites: 0, posts: 0, months: new Set(), best: null, newest: null }
              entry.total_favorites += favorites
              entry.posts += 1
              entry.months.add(month)
              if (!entry.best || favorites > entry.best.fav_count) entry.best = reference
              if (!entry.newest || String(reference.created_at ?? '') > String(entry.newest.created_at ?? '')) entry.newest = reference
              byArtist.set(name, entry)
            }
          }
        }

        const rankedArtists = [...byArtist.entries()]
          .map(([name, entry]) => ({
            name,
            artist_url: artistPostsUrl(name, year),
            total_favorites: entry.total_favorites,
            posts: entry.posts,
            avg_favorites: entry.posts > 0 ? round(entry.total_favorites / entry.posts, 1) : 0,
            months: entry.months.size,
            best: entry.best,
            newest: entry.newest,
          }))
          .sort((left, right) => right.total_favorites - left.total_favorites || right.posts - left.posts || left.name.localeCompare(right.name))

        // Style prefilter: verify candidates on their own posts from the same year and keep only
        // those whose style-tag share reaches the threshold. One request per checked candidate,
        // in favorites order, and it stops as soon as `limit` artists qualify.
        let artists = rankedArtists.slice(0, limit)
        let styleFilter = null
        let appearanceFilter = null
        let colorFilter = null
        if (styleTags.length > 0 || hasAppearance || hasColor) {
          const qualified = []
          let checked = 0
          for (const artist of rankedArtists) {
            if (qualified.length >= limit || checked >= styleMaxChecks) break
            checked += 1
            let checkedPosts = []
            try {
              const artistQuery = [artist.name, yearTag(year), ratingTag, 'order:favcount'].filter(Boolean).join(' ')
              const data = await request('/posts.json', { tags: artistQuery, limit: 100 }, { signal: exec?.signal, ttlMs: TTL.posts })
              checkedPosts = onlyImages(data)
            } catch {
              continue
            }
            if (checkedPosts.length < styleMinPosts) continue
            const stylePosts = []
            const appearancePosts = []
            const colorPosts = []
            const perTag = Object.fromEntries(appearanceTags.map((tag) => [tag, 0]))
            const colorPerTag = Object.fromEntries(colorTags.map((tag) => [tag, 0]))
            let hits = 0
            let poseHits = 0
            let appearanceHits = 0
            let colorHits = 0
            const needPool = hasAppearance || hasColor
            for (const post of checkedPosts) {
              if (postHasStyle(post, POSE_TAGS, false)) poseHits += 1
              if (needPool) {
                const pool = new Set([...splitTags(post.tag_string_general), ...splitTags(post.tag_string_character)])
                if (hasAppearance) {
                  const matchedTags = []
                  for (const tag of appearanceTags) {
                    if (pool.has(tag)) {
                      perTag[tag] += 1
                      matchedTags.push(tag)
                    }
                  }
                  const matched = matchedTags.length > 0 && (!appearanceMatchAll || matchedTags.length === appearanceTags.length)
                  if (matched) {
                    appearanceHits += 1
                    appearancePosts.push({
                      post_id: post.id,
                      post_url: `${ORIGIN}/posts/${post.id}`,
                      preview_url: post.preview_file_url ?? null,
                      sample_url: post.large_file_url ?? post.file_url ?? null,
                      created_at: post.created_at ?? null,
                      fav_count: Number(post.fav_count) || 0,
                      rating: post.rating ?? null,
                      matched_tags: matchedTags,
                    })
                  }
                }
                if (hasColor) {
                  const matchedTags = []
                  for (const tag of colorTags) {
                    if (pool.has(tag)) {
                      colorPerTag[tag] += 1
                      matchedTags.push(tag)
                    }
                  }
                  const matched = matchedTags.length > 0 && (!colorMatchAll || matchedTags.length === colorTags.length)
                  if (matched) {
                    colorHits += 1
                    colorPosts.push({
                      post_id: post.id,
                      post_url: `${ORIGIN}/posts/${post.id}`,
                      preview_url: post.preview_file_url ?? null,
                      sample_url: post.large_file_url ?? post.file_url ?? null,
                      created_at: post.created_at ?? null,
                      fav_count: Number(post.fav_count) || 0,
                      rating: post.rating ?? null,
                      matched_tags: matchedTags,
                    })
                  }
                }
              }
              if (styleTags.length === 0) continue
              if (!postHasStyle(post, styleTags, styleMatchAll)) continue
              hits += 1
              stylePosts.push({
                post_id: post.id,
                post_url: `${ORIGIN}/posts/${post.id}`,
                preview_url: post.preview_file_url ?? null,
                sample_url: post.large_file_url ?? post.file_url ?? null,
                created_at: post.created_at ?? null,
                fav_count: Number(post.fav_count) || 0,
                rating: post.rating ?? null,
              })
            }
            const ratio = hits / checkedPosts.length
            const appearanceRatio = appearanceHits / checkedPosts.length
            const colorRatio = colorHits / checkedPosts.length
            const styleOk = styleTags.length === 0 || (ratio >= styleThreshold && hits >= styleMinHits)
            const appearanceOk = !hasAppearance || appearanceThreshold <= 0 || (appearanceRatio >= appearanceThreshold && appearanceHits > 0)
            const colorOk = !hasColor || colorThreshold <= 0 || (colorRatio >= colorThreshold && colorHits > 0)
            if (styleOk && appearanceOk && colorOk) {
              stylePosts.sort((left, right) => right.fav_count - left.fav_count)
              appearancePosts.sort((left, right) => right.fav_count - left.fav_count)
              colorPosts.sort((left, right) => right.fav_count - left.fav_count)
              qualified.push({
                ...artist,
                ...(styleTags.length > 0
                  ? {
                      style: {
                        tags: styleTags,
                        match: styleMatchAll ? 'all' : 'any',
                        threshold: styleThreshold,
                        min_hits: styleMinHits,
                        checked_posts: checkedPosts.length,
                        hit_posts: hits,
                        ratio: round(ratio, 3),
                        pose_posts: poseHits,
                        best: stylePosts.slice(0, 3),
                      },
                    }
                  : {}),
                ...(hasAppearance
                  ? {
                      appearance: {
                        tags: appearanceTags,
                        match: appearanceMatchAll ? 'all' : 'any',
                        threshold: appearanceThreshold,
                        checked_posts: checkedPosts.length,
                        hit_posts: appearanceHits,
                        ratio: round(appearanceRatio, 3),
                        per_tag: perTag,
                        best: appearancePosts.slice(0, 3),
                      },
                    }
                  : {}),
                ...(hasColor
                  ? {
                      color: {
                        tags: colorTags,
                        match: colorMatchAll ? 'all' : 'any',
                        threshold: colorThreshold,
                        checked_posts: checkedPosts.length,
                        hit_posts: colorHits,
                        ratio: round(colorRatio, 3),
                        per_tag: colorPerTag,
                        best: colorPosts.slice(0, 3),
                      },
                    }
                  : {}),
              })
            }
          }
          artists = qualified
          styleFilter = styleTags.length > 0
            ? {
                tags: styleTags,
                match: styleMatchAll ? 'all' : 'any',
                threshold: styleThreshold,
                min_posts: styleMinPosts,
                min_hits: styleMinHits,
                max_checks: styleMaxChecks,
                checked_artists: checked,
                qualified: qualified.length,
              }
            : null
          appearanceFilter = hasAppearance
            ? {
                tags: appearanceTags,
                match: appearanceMatchAll ? 'all' : 'any',
                threshold: appearanceThreshold,
                min_posts: styleMinPosts,
                max_checks: styleMaxChecks,
                checked_artists: checked,
                qualified: qualified.length,
              }
            : null
          colorFilter = hasColor
            ? {
                tags: colorTags,
                match: colorMatchAll ? 'all' : 'any',
                threshold: colorThreshold,
                min_posts: styleMinPosts,
                max_checks: styleMaxChecks,
                checked_artists: checked,
                qualified: qualified.length,
              }
            : null
        }

        return {
          year,
          method: 'year_favorites',
          independent_of_hot: true,
          rating,
          months_sampled: sample.map((row) => row.month),
          monthly_sample: monthlySample,
          sampled_posts: sampledPosts,
          sampled_artists: byArtist.size,
          artists: compact
            ? artists.map((artist) => ({
                name: artist.name,
                artist_url: artist.artist_url,
                total_favorites: artist.total_favorites,
                posts: artist.posts,
                months: artist.months,
                ...(artist.style ? { style: artist.style } : {}),
                ...(artist.appearance ? { appearance: artist.appearance } : {}),
                ...(artist.color ? { color: artist.color } : {}),
              }))
            : artists,
          style_filter: styleFilter,
          appearance_filter: appearanceFilter,
          color_filter: colorFilter,
          sample,
          note: styleFilter || appearanceFilter || colorFilter
            ? 'Total favorites are summed over each month\'s highest-favorited sample and each candidate\'s style/appearance/color share is measured on up to 100 of their own highest-favorited posts from that year, so both are estimates. This ranking is separate from the Hot/rising weighting.'
            : 'Total favorites are summed over each month\'s highest-favorited sample, so they estimate the year total rather than the exact site-wide sum; posts outside the per-month cap are not counted. This ranking is separate from the Hot/rising weighting.',
        }
      },
    },
    {
      name: 'danbooru_search_tags',
      description: 'Resolve tag names with the Danbooru autocomplete API: canonical name, category (general/artist/copyright/character/meta) and post count. Use it to turn an idea or a character name into valid Danbooru tags before searching posts.',
      parameters: parameters({
        query: { type: 'string', description: 'Text to autocomplete, e.g. "hatsune" or "a girl with blue hair".' },
        category: { type: 'string', enum: ['general', 'artist', 'copyright', 'character', 'meta'], description: 'Only return tags of this category.' },
        limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Number of suggestions (default 20).' },
      }, ['query']),
      output,
      async execute(args, exec) {
        const query = String(args?.query ?? '').trim()
        if (!query) throw new Error('query is required')
        const limit = clamp(args?.limit, 1, 100, 20)
        const category = CATEGORY_IDS[args?.category]
        const data = await request('/autocomplete.json', {
          'search[query]': query,
          'search[type]': 'tag',
          'search[category]': category,
          limit,
        }, { signal: exec?.signal, ttlMs: TTL.tags })
        if (!Array.isArray(data)) throw new Error('Danbooru returned an unexpected /autocomplete.json payload')
        return {
          query,
          category: args?.category ?? null,
          count: data.length,
          tags: data.map((entry) => ({
            name: entry.value ?? entry.tag?.name ?? '',
            label: entry.label ?? '',
            category: categoryName(entry.category ?? entry.tag?.category),
            post_count: entry.post_count ?? entry.tag?.post_count ?? 0,
          })),
        }
      },
    },
    {
      name: 'danbooru_get_tag',
      description: 'Read one Danbooru tag: category, post count, deprecation flag, plus a trimmed wiki excerpt and the other/localized names used for prompts. Read-only.',
      parameters: parameters({
        name: { type: 'string', description: 'Exact tag name, e.g. "hatsune_miku".' },
      }, ['name']),
      output,
      async execute(args, exec) {
        const name = String(args?.name ?? '').trim()
        if (!name) throw new Error('name is required')
        const tags = await request('/tags.json', { 'search[name]': name, limit: 1 }, { signal: exec?.signal, ttlMs: TTL.tags })
        const tag = Array.isArray(tags) ? tags[0] : undefined
        if (!tag) {
          return { name, found: false, hint: 'No exact tag matched; call danbooru_search_tags to find the canonical name.' }
        }
        let wiki = null
        let wikiError
        try {
          const pages = await request('/wiki_pages.json', { 'search[title]': tag.name, limit: 1 }, { signal: exec?.signal, ttlMs: TTL.wiki })
          const page = Array.isArray(pages) ? pages[0] : undefined
          if (page) {
            wiki = {
              title: page.title,
              summary: truncate(String(page.body ?? '').replace(/\r\n/g, '\n').trim(), config.maxWikiChars),
              other_names: Array.isArray(page.other_names) ? page.other_names.slice(0, 20) : [],
              updated_at: page.updated_at ?? null,
              url: `${ORIGIN}/wiki_pages/${encodeURIComponent(page.title)}`,
            }
          }
        } catch (error) {
          wikiError = error instanceof Error ? error.message : String(error)
        }
        return {
          name: tag.name,
          found: true,
          category: categoryName(tag.category),
          post_count: tag.post_count ?? 0,
          is_deprecated: Boolean(tag.is_deprecated),
          wiki,
          ...(wikiError ? { wiki_error: wikiError } : {}),
        }
      },
    },
    {
      name: 'danbooru_related_tags',
      description: 'List tags that co-occur with a tag (Danbooru related_tag API) with post counts and co-occurrence frequency. Useful to expand a prompt with plausible appearance, costume or composition tags.',
      parameters: parameters({
        query: { type: 'string', description: 'Tag whose related tags should be listed, e.g. "hatsune_miku".' },
        category: { type: 'string', enum: ['general', 'artist', 'copyright', 'character', 'meta'], description: 'Only return related tags of this category.' },
        limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Number of related tags (default 20).' },
      }, ['query']),
      output,
      async execute(args, exec) {
        const query = String(args?.query ?? '').trim()
        if (!query) throw new Error('query is required')
        const limit = clamp(args?.limit, 1, 100, 20)
        const category = CATEGORY_IDS[args?.category]
        const data = await request('/related_tag.json', { query, category, limit }, { signal: exec?.signal, ttlMs: TTL.related })
        const rows = Array.isArray(data?.related_tags) ? data.related_tags : []
        const related = rows
          .filter((entry) => entry?.tag?.name && entry.tag.name !== data?.query)
          .map((entry) => ({
            name: entry.tag.name,
            category: categoryName(entry.tag.category),
            post_count: entry.tag.post_count ?? 0,
            frequency: round(entry.frequency),
            cosine_similarity: round(entry.cosine_similarity),
          }))
        return {
          query: data?.query ?? query,
          post_count: data?.post_count ?? 0,
          count: related.length,
          related,
        }
      },
    },
    {
      name: 'danbooru_similar_artists',
      description: 'Find artists whose tag profile and facial-expression profile resemble a seed artist, using Danbooru co-occurrence data (no image embedding). It builds the seed artist\'s characteristic tags (frequent for them, but not universal site-wide) plus an expression-tag profile (smile, blush, half-closed_eyes, ...), then collects artists who share those tags and scores them by frequency and tag rarity (furry-themed tags are downweighted to 0.05), finally re-ranking by the cosine similarity between the seed\'s and each finalist\'s expression-tag frequency profiles. Pass examples>0 to attach each candidate\'s sample post URLs so the caller can read_image and visually confirm; tag/expression similarity is only a candidate generator, not proof of visual style. Example selection is a soft rule: prefer posts that carry the required tags (default: seed expression tags) and show the face; set allow_no_face=true only when the user explicitly asks for back views, silhouettes or other face-hidden examples. When the final deliverable is an artist list, attach examples=3 and keep three sample images per artist; when it is a post list, keep one sample per post. Judge style similarity on rendering (shading, highlights, palette), body build/pose (proportions, fleshiness, height), face features (face shape, eyes, nose, mouth, blush) and expressions, not on tags alone.',
      parameters: parameters({
        artist: { type: 'string', description: 'Seed artist tag, e.g. "satou_kuuki". Use danbooru_search_tags if unsure of the canonical name.' },
        limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Artists to return (default 10).' },
        profile_tags: { type: 'integer', minimum: 3, maximum: 10, description: 'Seed style tags used as the similarity profile (default 6).' },
        min_shared: { type: 'integer', minimum: 1, maximum: 10, description: 'Minimum shared style tags for a candidate (default 2).' },
        examples: { type: 'integer', minimum: 0, maximum: 3, description: 'Sample posts to attach per candidate for visual confirmation (default 0 = none; each costs one request).' },
        example_tags: { type: 'string', description: 'Comma-separated tags every example post should carry (default: the seed expression tags).' },
        allow_no_face: { type: 'boolean', description: 'Soft rule override: set true only when the user explicitly asks for back views, silhouettes, lower-body close-ups or other face-hidden examples; otherwise examples prefer posts where the face (and thus the expression) is visible.' },
        expression_tags: { type: 'integer', minimum: 0, maximum: 6, description: 'Seed expression tags used to build the expression profile and expand candidates (default 4; 0 disables expression matching).' },
        expression_weight: { type: 'number', minimum: 0, maximum: 1, description: 'Weight of expression similarity in the final score (default 0.5).' },
      }, ['artist']),
      output,
      async execute(args, exec) {
        const artist = String(args?.artist ?? '').trim().toLowerCase().replace(/\s+/g, '_')
        if (!artist) throw new Error('artist is required')
        const limit = clamp(args?.limit, 1, 25, 10)
        const profileTagCount = clamp(args?.profile_tags, 3, 10, 6)
        const minShared = clamp(args?.min_shared, 1, 10, 2)
        const exampleCount = clamp(args?.examples, 0, 3, 0)
        const exampleRequired = String(args?.example_tags ?? '')
          .split(/[,\s]+/)
          .map((tag) => tag.trim())
          .filter(Boolean)
        const expressionTagCount = clamp(args?.expression_tags, 0, 6, 4)
        const expressionWeight = clampFloat(args?.expression_weight, 0, 1, 0.5)

        const seed = await request('/related_tag.json', { query: artist, limit: 100 }, { signal: exec?.signal, ttlMs: TTL.related })
        const seedRows = Array.isArray(seed?.related_tags) ? seed.related_tags : []
        const profile = seedRows
          .filter((row) => row?.tag?.name && row.tag.category === 0)
          .filter((row) => !SIMILARITY_STOPLIST.has(row.tag.name))
          .filter((row) => (row.tag.post_count ?? 0) >= 1000 && (row.tag.post_count ?? 0) < SIMILARITY_TOTAL_POSTS / 8)
          .filter((row) => Number(row.frequency ?? 0) >= 0.25)
          .sort((left, right) => Number(right.frequency ?? 0) - Number(left.frequency ?? 0))
          .slice(0, profileTagCount)
          .map((row) => ({ name: row.tag.name, frequency: Number(row.frequency ?? 0), post_count: row.tag.post_count ?? 0 }))
        if (profile.length === 0) {
          throw new Error(`No characteristic tags found for "${artist}"; check the artist tag with danbooru_search_tags.`)
        }

        const scored = new Map()
        for (const row of profile) {
          const cooccurring = await request('/related_tag.json', { query: row.name, category: CATEGORY_IDS.artist, limit: 25 }, { signal: exec?.signal, ttlMs: TTL.related })
          const rows = Array.isArray(cooccurring?.related_tags) ? cooccurring.related_tags : []
          const weight = (1 + Math.log10(SIMILARITY_TOTAL_POSTS / Math.max(1000, row.post_count))) * tagDownweight(row.name)
          for (const entry of rows) {
            const name = String(entry?.tag?.name ?? '')
            if (!name || name === artist) continue
            if ((entry.tag.post_count ?? 0) < 20) continue
            const current = scored.get(name) ?? { name, score: 0, shared: [], post_count: entry.tag.post_count ?? 0 }
            current.score += weight * Number(entry.frequency ?? 0)
            if (!current.shared.includes(row.name)) current.shared.push(row.name)
            current.post_count = Math.max(current.post_count, entry.tag.post_count ?? 0)
            scored.set(name, current)
          }
        }

        const seedExpression = new Map()
        for (const row of seedRows) {
          if (row?.tag?.name && EXPRESSION_TAGS.has(row.tag.name)) {
            const frequency = Number(row.frequency ?? 0)
            if (frequency > 0) seedExpression.set(row.tag.name, { frequency, post_count: row.tag.post_count ?? 0 })
          }
        }
        const expressionProfile = [...seedExpression.entries()]
          .sort((left, right) => right[1].frequency - left[1].frequency)
          .slice(0, expressionTagCount)
        const expressionRarity = (postCount) => 1 + Math.log10(SIMILARITY_TOTAL_POSTS / Math.max(1000, postCount ?? 0))
        const seedExpressionVector = new Map()
        for (const [tag, info] of seedExpression) seedExpressionVector.set(tag, info.frequency * expressionRarity(info.post_count))

        // Expression expansion: artists who share the seed's expression habits.
        const expressionScored = new Map()
        for (const [tagName] of expressionProfile) {
          try {
            const cooccurring = await request('/related_tag.json', { query: tagName, category: CATEGORY_IDS.artist, limit: 25 }, { signal: exec?.signal, ttlMs: TTL.related })
            const rows = Array.isArray(cooccurring?.related_tags) ? cooccurring.related_tags : []
            const weight = 1 + Math.log10(SIMILARITY_TOTAL_POSTS / Math.max(1000, cooccurring?.post_count ?? 1000))
            for (const entry of rows) {
              const name = String(entry?.tag?.name ?? '')
              if (!name || name === artist) continue
              if ((entry.tag.post_count ?? 0) < 20) continue
              const current = expressionScored.get(name) ?? { expScore: 0, expTags: [] }
              current.expScore += weight * Number(entry.frequency ?? 0)
              if (!current.expTags.includes(tagName)) current.expTags.push(tagName)
              expressionScored.set(name, current)
            }
          } catch {
            // expression expansion is best-effort; keep the tag-profile candidates otherwise
          }
        }

        const pool = new Map()
        for (const [name, entry] of scored) {
          pool.set(name, { name, baseScore: entry.score, shared: entry.shared, post_count: entry.post_count, expScore: 0, expTags: [] })
        }
        for (const [name, entry] of expressionScored) {
          const current = pool.get(name) ?? { name, baseScore: 0, shared: [], post_count: 0, expScore: 0, expTags: [] }
          current.expScore = entry.expScore
          current.expTags = entry.expTags
          pool.set(name, current)
        }

        const poolCandidates = [...pool.values()].filter((entry) => entry.shared.length >= minShared || entry.expTags.length >= minShared)
        const maxBase = poolCandidates.reduce((max, entry) => Math.max(max, entry.baseScore), 0) || 1
        const maxExp = poolCandidates.reduce((max, entry) => Math.max(max, entry.expScore), 0) || 1
        const preRanked = poolCandidates
          .map((entry) => ({ ...entry, preScore: 0.6 * (entry.baseScore / maxBase) + 0.4 * (entry.expScore / maxExp) }))
          .sort((left, right) => right.preScore - left.preScore || right.post_count - left.post_count || left.name.localeCompare(right.name))
          .slice(0, limit * 2)

        // Expression cosine: rarity-weighted expression-tag profile similarity, plus a style-overlap
        // check on the same related_tag fetch so expression-only candidates still need shared style tags.
        const expressionCosine = async (name) => {
          try {
            const data = await request('/related_tag.json', { query: name, limit: 100 }, { signal: exec?.signal, ttlMs: TTL.related })
            const rows = Array.isArray(data?.related_tags) ? data.related_tags : []
            const byTag = new Map()
            const candidateVector = new Map()
            for (const row of rows) {
              if (!row?.tag?.name) continue
              byTag.set(row.tag.name, row)
              if (EXPRESSION_TAGS.has(row.tag.name)) {
                candidateVector.set(row.tag.name, Number(row.frequency ?? 0) * expressionRarity(row.tag.post_count))
              }
            }
            let dot = 0
            let seedNorm = 0
            let candidateNorm = 0
            for (const [tag, value] of seedExpressionVector) {
              seedNorm += value * value
              const other = candidateVector.get(tag)
              if (other) dot += value * other
            }
            for (const [, value] of candidateVector) candidateNorm += value * value
            const denominator = Math.sqrt(seedNorm) * Math.sqrt(candidateNorm)
            const styleShared = profile.filter((row) => byTag.has(row.name)).map((row) => row.name)
            return {
              score: denominator > 0 ? dot / denominator : 0,
              tags: [...candidateVector.keys()],
              styleShared,
              styleScore: profile.length > 0 ? styleShared.length / profile.length : 0,
            }
          } catch {
            return { score: 0, tags: [], styleShared: [], styleScore: 0 }
          }
        }

        const candidates = []
        for (const entry of preRanked) {
          const cosine = expressionTagCount > 0 && expressionWeight > 0 ? await expressionCosine(entry.name) : null
          const sharedCount = cosine ? Math.max(entry.shared.length, cosine.styleShared.length) : entry.shared.length
          if (sharedCount < minShared && (!cosine || entry.expTags.length < minShared)) continue
          const baseNorm = cosine ? Math.max(entry.baseScore / maxBase, cosine.styleScore) : entry.baseScore / maxBase
          const cosScore = cosine ? Math.max(0, Math.min(1, cosine.score)) : 0
          const combined = cosine ? (1 - expressionWeight) * baseNorm + expressionWeight * cosScore : baseNorm
          candidates.push({
            name: entry.name,
            artist_url: artistPostsUrl(entry.name),
            score: round(combined * 100, 1),
            tag_score: round(baseNorm * 100, 1),
            shared_tags: entry.shared.length > 0 ? entry.shared : cosine ? cosine.styleShared : [],
            post_count: entry.post_count,
            ...(cosine
              ? { expression: { cosine: round(cosScore, 3), tags: cosine.tags.length > 0 ? cosine.tags : entry.expTags } }
              : {}),
          })
        }
        candidates.sort((left, right) => right.score - left.score || right.post_count - left.post_count || left.name.localeCompare(right.name))
        candidates.splice(limit)

        // Visual confirmation is left to the caller. Soft rule: prefer examples that carry the
        // required tags and show the face; face-hidden compositions are used only when
        // allow_no_face is set (e.g. the user asked for back views or silhouettes).
        if (exampleCount > 0) {
          const requiredTags = exampleRequired.length > 0 ? exampleRequired : [...seedExpression.keys()]
          const allowNoFace = args?.allow_no_face === true
          for (const candidate of candidates) {
            try {
              const samplePosts = await request('/posts.json', { tags: `${candidate.name} order:score`, limit: Math.min(100, exampleCount * 8) }, { signal: exec?.signal, ttlMs: TTL.posts })
              const rows = (Array.isArray(samplePosts) ? samplePosts : [])
                .filter((post) => (post.large_file_url || post.file_url) && !isVideoPost(post))
                .map((post) => ({ post, general: splitTags(post.tag_string_general) }))
              const hasRequired = (row) => requiredTags.length === 0 || requiredTags.some((tag) => row.general.includes(tag))
              const hidesFace = (row) => [...FACE_HIDDEN_TAGS].some((tag) => row.general.includes(tag))
              const preferred = rows.filter((row) => hasRequired(row) && (allowNoFace || !hidesFace(row)))
              const expressionOnly = rows.filter((row) => hasRequired(row))
              const picked = (preferred.length > 0 ? preferred : expressionOnly.length > 0 ? expressionOnly : rows).slice(0, exampleCount)
              candidate.examples = picked.map((row) => ({
                post_id: row.post.id,
                post_url: `${ORIGIN}/posts/${row.post.id}`,
                sample_url: row.post.large_file_url ?? row.post.file_url ?? null,
                preview_url: row.post.preview_file_url ?? null,
                rating: row.post.rating ?? null,
                matched_tags: requiredTags.filter((tag) => row.general.includes(tag)),
              }))
            } catch {
              candidate.examples = []
            }
          }
        }

        return {
          seed: {
            artist,
            artist_url: artistPostsUrl(artist),
            tag_count: seed?.post_count ?? 0,
            profile: profile.map((row) => ({ tag: row.name, frequency: round(row.frequency, 2), post_count: row.post_count })),
            expression_profile: expressionProfile.map(([tag, info]) => ({ tag, frequency: round(info.frequency, 2), post_count: info.post_count })),
          },
          method: 'tag-profile similarity (co-occurrence) + expression cosine',
          candidates,
          note: 'Candidate generation uses shared Danbooru tags (frequent, non-universal seed tags), and expression similarity is measured separately: the seed\'s expression tags (smile, blush, half-closed_eyes, ...) are expanded to artists sharing them, then each finalist\'s expression-tag frequency profile is compared with the seed by cosine and folded into score (expression_weight, default 0.5). This is a heuristic, not visual embedding similarity. Confirm candidates visually on rendering (shading, highlights, palette), body build/pose, face features and expressions; for an artist-list deliverable keep three sample images per artist, for a post list keep one sample per post.',
        }
      },
    },
    {
      name: 'danbooru_artists_from_image',
      description: 'Reverse-search artists from an image that the caller has described with Danbooru tags (the plugin has no vision; the agent looks at the image and groups the tags). Every tag in every group is searched separately and the results are aggregated per artist, so line quality, lighting, palette and material all enter the score. mode="person" (default): person/character style 0.30 > expression style 0.18 > rendering technique 0.20 > lineart 0.12 > color palette 0.08 > lighting 0.07 > general tags 0.05. mode="style": rendering technique 0.26 > lineart 0.18 > color palette 0.18 > lighting 0.14 > person style 0.14 > expression 0.05 > tags 0.05. It is a tag/search-frequency heuristic, not an image embedding; confirm candidates visually. Pass examples>0 to attach sample posts (soft rule: prefer the required tags and a visible face; allow_no_face=true only when the user asks for back views/silhouettes/lower-body crops).',
      parameters: parameters({
        image_tags: { type: 'string', description: 'Required. Comma-separated Danbooru tags describing the image, e.g. "latex bodysuit, blue hair, white background".' },
        person_tags: { type: 'string', description: 'Tags for the person/character style: body proportions, face features, character design, e.g. "huge_breasts, thick_thighs, mature_female".' },
        expression_tags: { type: 'string', description: 'Tags for the facial expression, e.g. "half-closed_eyes, blush, closed_mouth".' },
        technique_tags: { type: 'string', description: 'Tags for rendering technique/material, e.g. "latex, shiny_clothes, shiny_skin".' },
        lineart_tags: { type: 'string', description: 'Tags for line quality, e.g. "lineart, colored_lineart, thick_lineart, no_lineart, gradient_lineart".' },
        color_tags: { type: 'string', description: 'Tags for palette/color style, e.g. "colorful, iridescent, blue_theme, gradient, colorful_background".' },
        lighting_tags: { type: 'string', description: 'Tags for light/shadow handling, e.g. "dappled_sunlight, backlighting, lens_flare, chromatic_aberration, sunlight".' },
        mode: { type: 'string', enum: ['person', 'style'], description: 'Priority mode: person (default) ranks character/expression style first; style ranks rendering technique and color palette first.' },
        year: { type: 'integer', minimum: MIN_YEAR, description: 'Optional calendar year to search (default: all time).' },
        limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Artists to return (default 10).' },
        examples: { type: 'integer', minimum: 0, maximum: 3, description: 'Sample posts to attach per candidate (default 0; each costs one request).' },
        example_tags: { type: 'string', description: 'Comma-separated tags examples should carry (default: expression_tags, else image_tags).' },
        allow_no_face: { type: 'boolean', description: 'Set true only when the user explicitly wants back views, silhouettes or lower-body crops; otherwise examples prefer a visible face.' },
      }, ['image_tags']),
      output,
      async execute(args, exec) {
        const imageTags = parseTagList(args?.image_tags)
        if (imageTags.length === 0) throw new Error('image_tags is required')
        const mode = args?.mode === 'style' ? 'style' : 'person'
        const weights = mode === 'style'
          ? { technique: 0.26, lineart: 0.18, color: 0.18, lighting: 0.14, person: 0.14, expression: 0.05, tag: 0.05 }
          : { person: 0.3, expression: 0.18, technique: 0.2, lineart: 0.12, color: 0.08, lighting: 0.07, tag: 0.05 }
        const year = parseYear(args?.year)
        const yearFilter = year ? ` ${yearTag(year)}` : ''
        const limit = clamp(args?.limit, 1, 25, 10)
        const exampleCount = clamp(args?.examples, 0, 3, 0)

        const groups = [
          { key: 'person', tags: parseTagList(args?.person_tags) },
          { key: 'expression', tags: parseTagList(args?.expression_tags) },
          { key: 'technique', tags: parseTagList(args?.technique_tags) },
          { key: 'lineart', tags: parseTagList(args?.lineart_tags) },
          { key: 'color', tags: parseTagList(args?.color_tags) },
          { key: 'lighting', tags: parseTagList(args?.lighting_tags) },
          { key: 'tag', tags: imageTags },
        ].filter((group) => group.tags.length > 0)
        const totalWeight = groups.reduce((sum, group) => sum + (weights[group.key] ?? 0), 0) || 1

        const standing = new Map()
        const groupStats = []
        for (const group of groups) {
          const tagQueries = group.tags.slice(0, 4)
          const perTagWeight = ((weights[group.key] ?? 0) / totalWeight) / tagQueries.length
          const seenInGroup = new Set()
          const tagStats = []
          for (const tag of tagQueries) {
            let rows
            try {
              rows = await request('/posts.json', { tags: `${tag}${yearFilter} order:score`, limit: 100 }, { signal: exec?.signal, ttlMs: TTL.posts })
            } catch {
              // Anonymous accounts allow fewer tag tokens; retry without the order metatag.
              rows = await request('/posts.json', { tags: `${tag}${yearFilter}`, limit: 100 }, { signal: exec?.signal, ttlMs: TTL.posts })
            }
            const data = onlyImages(rows)
            tagStats.push({ tag, posts: data.length })
            for (const post of data) {
              if (seenInGroup.has(post.id)) continue
              seenInGroup.add(post.id)
              const threeD = isThreeDPost(post)
              for (const name of splitTags(post.tag_string_artist).filter(isIllustratorTag)) {
                const entry = standing.get(name) ?? { name, score: 0, posts: 0, three_d: 0, dimensions: {} }
                entry.score += perTagWeight / data.length
                entry.posts += 1
                if (threeD) entry.three_d += 1
                entry.dimensions[group.key] = (entry.dimensions[group.key] ?? 0) + 1
                standing.set(name, entry)
              }
            }
          }
          groupStats.push({ key: group.key, tags: tagStats })
        }

        const candidates = [...standing.values()]
          .sort((left, right) => right.score - left.score || right.posts - left.posts || left.name.localeCompare(right.name))
          .slice(0, limit)
          .map((entry) => {
            const threeDShare = entry.posts > 0 ? entry.three_d / entry.posts : 0
            return {
              name: entry.name,
              artist_url: artistPostsUrl(entry.name, year),
              // Candidates leaning on 3D/photoreal renders are pushed down: the target is a 2D drawing.
              score: round(entry.score * 100 * (1 - 0.7 * threeDShare), 2),
              posts: entry.posts,
              three_d_share: round(threeDShare, 3),
              dimensions: entry.dimensions,
            }
          })

        if (exampleCount > 0) {
          const requested = parseTagList(args?.example_tags)
          const requiredTags = requested.length > 0 ? requested : (groups.find((group) => group.key === 'expression')?.tags ?? imageTags)
          const allowNoFace = args?.allow_no_face === true
          for (const candidate of candidates) {
            try {
              const data = await request('/posts.json', { tags: `${candidate.name}${yearFilter} order:score`, limit: Math.min(100, exampleCount * 8) }, { signal: exec?.signal, ttlMs: TTL.posts })
              const rows = (Array.isArray(data) ? data : [])
                .filter((post) => (post.large_file_url || post.file_url) && !isVideoPost(post))
                .map((post) => ({ post, general: splitTags(post.tag_string_general) }))
              const photoRows = rows.filter((row) => !isThreeDPost(row.post))
              const hasRequired = (row) => requiredTags.length === 0 || requiredTags.some((tag) => row.general.includes(tag))
              const hidesFace = (row) => [...FACE_HIDDEN_TAGS].some((tag) => row.general.includes(tag))
              const preferred = photoRows.filter((row) => hasRequired(row) && (allowNoFace || !hidesFace(row)))
              const expressionOnly = photoRows.filter((row) => hasRequired(row))
              const picked = (preferred.length > 0 ? preferred : expressionOnly.length > 0 ? expressionOnly : photoRows.length > 0 ? photoRows : rows).slice(0, exampleCount)
              candidate.examples = picked.map((row) => ({
                post_id: row.post.id,
                post_url: `${ORIGIN}/posts/${row.post.id}`,
                sample_url: row.post.large_file_url ?? row.post.file_url ?? null,
                preview_url: row.post.preview_file_url ?? null,
                rating: row.post.rating ?? null,
                matched_tags: requiredTags.filter((tag) => row.general.includes(tag)),
              }))
            } catch {
              candidate.examples = []
            }
          }
        }

        return toLossless({
          method: 'image tags → year-scoped artist frequency, layered priority',
          mode,
          year,
          weights,
          groups: groupStats,
          candidates,
          note: 'The agent must look at the image and supply the tag groups; this tool only aggregates Danbooru search results for those tags (optionally year-scoped). It is a heuristic, not visual embedding similarity — confirm candidates visually on rendering, body build/pose, face features and expressions.',
        })
      },
    },
    {
      name: 'danbooru_part_specialists',
      description: 'Rank artists and posts specialized in one body part (hands, feet, thighs, eyes, ...) using the part-focus tags. It searches the part tag ordered by favorites (order:favcount), aggregates the part-tagged posts per artist, ranks artists by total favorites (or avg_favorites / posts), and also returns the highest-favorited part-tagged images. Use it when the user wants "who draws good hands / feet / thighs" or wants top part-focused images. Image-only: video posts are filtered. This is a favorites heuristic; confirm the part rendering visually.',
      parameters: parameters({
        part: { type: 'string', enum: Object.keys(PART_PRESETS), description: 'Body part preset, e.g. "hands".' },
        year: { type: 'integer', minimum: MIN_YEAR, description: 'Optional calendar year limit (default: all time).' },
        rating: { type: 'string', enum: ['g', 's', 'q', 'e', 'all'], description: 'Rating filter; all (default) = no filter, R18 included.' },
        artists_limit: { type: 'integer', minimum: 1, maximum: 25, description: 'Artists to return (default 8).' },
        posts_limit: { type: 'integer', minimum: 1, maximum: 50, description: 'Top part-tagged images to return (default 6).' },
        sample: { type: 'integer', minimum: 20, maximum: 100, description: 'Posts scanned per preset tag, highest favorites first (default 100).' },
        min_posts: { type: 'integer', minimum: 1, maximum: 20, description: 'Minimum part-tagged posts for an artist to be ranked (default 2).' },
        rank_by: { type: 'string', enum: ['total_favorites', 'avg_favorites', 'posts'], description: 'Artist ranking: total favorites (default), average favorites, or part-tagged post count.' },
        include_posts: { type: 'boolean', description: 'Also return the top part-tagged images (default true).' },
      }, ['part']),
      output,
      async execute(args, exec) {
        const part = String(args?.part ?? '').toLowerCase()
        const preset = PART_PRESETS[part]
        if (!preset) throw new Error(`Unknown part "${part}"; choose one of: ${Object.keys(PART_PRESETS).join(', ')}`)
        const year = parseYear(args?.year)
        const rating = ['g', 's', 'q', 'e', 'all'].includes(args?.rating) ? args.rating : 'all'
        const sample = clamp(args?.sample, 20, 100, 100)
        const artistsLimit = clamp(args?.artists_limit, 1, 25, 8)
        const postsLimit = clamp(args?.posts_limit, 1, 50, 6)
        const minPosts = clamp(args?.min_posts, 1, 20, 2)
        const rankBy = ['total_favorites', 'avg_favorites', 'posts'].includes(args?.rank_by) ? args.rank_by : 'total_favorites'
        const includePosts = args?.include_posts !== false

        const byArtist = new Map()
        const allPosts = new Map()
        const tagStats = []
        const tagsToQuery = preset.slice(0, 2)
        for (const tag of tagsToQuery) {
          const baseParts = [tag, year ? yearTag(year) : '', rating !== 'all' ? `rating:${rating}` : ''].filter(Boolean)
          let rows
          try {
            rows = await request('/posts.json', { tags: [...baseParts, 'order:favcount'].join(' '), limit: sample }, { signal: exec?.signal, ttlMs: TTL.posts })
          } catch {
            // Anonymous accounts may not allow the extra order metatag; fall back and sort client-side.
            rows = await request('/posts.json', { tags: baseParts.join(' '), limit: sample }, { signal: exec?.signal, ttlMs: TTL.posts })
          }
          const photos = onlyImages(rows).filter((post) => !isThreeDPost(post))
          tagStats.push({ tag, posts: photos.length })
          for (const post of photos) {
            const postId = post.id
            if (allPosts.has(postId)) continue
            const favorites = Number(post.fav_count) || 0
            const reference = {
              post_id: postId,
              post_url: `${ORIGIN}/posts/${postId}`,
              preview_url: post.preview_file_url ?? null,
              sample_url: post.large_file_url ?? post.file_url ?? null,
              fav_count: favorites,
              score: Number(post.score) || 0,
              rating: post.rating ?? null,
            }
            allPosts.set(postId, { ...reference, post })
            for (const name of splitTags(post.tag_string_artist).filter(isIllustratorTag)) {
              const entry = byArtist.get(name) ?? { name, posts: 0, total: 0, refs: [] }
              entry.posts += 1
              entry.total += favorites
              entry.refs.push(reference)
              byArtist.set(name, entry)
            }
          }
        }

        const compare = {
          total_favorites: (left, right) => right.total - left.total,
          avg_favorites: (left, right) => right.total / Math.max(1, right.posts) - left.total / Math.max(1, left.posts),
          posts: (left, right) => right.posts - left.posts,
        }[rankBy]
        const artists = [...byArtist.values()]
          .filter((entry) => entry.posts >= minPosts)
          .sort((left, right) => compare(left, right) || left.name.localeCompare(right.name))
          .slice(0, artistsLimit)
          .map((entry) => ({
            name: entry.name,
            artist_url: artistPostsUrl(entry.name, year),
            part_posts: entry.posts,
            total_favorites: entry.total,
            avg_favorites: round(entry.total / Math.max(1, entry.posts), 1),
            best: entry.refs.sort((left, right) => right.fav_count - left.fav_count).slice(0, 3),
          }))

        const posts = includePosts
          ? [...allPosts.values()]
            .sort((left, right) => right.fav_count - left.fav_count || right.score - left.score)
            .slice(0, postsLimit)
            .map((entry) => ({
              post_id: entry.post_id,
              post_url: entry.post_url,
              sample_url: entry.sample_url,
              preview_url: entry.preview_url,
              fav_count: entry.fav_count,
              score: entry.score,
              rating: entry.rating,
              artists: splitTags(entry.post.tag_string_artist).filter(isIllustratorTag),
            }))
          : []

        return {
          part,
          tags: preset,
          year: year ?? null,
          rating,
          rank_by: rankBy,
          sample,
          scanned: tagStats,
          scanned_posts: allPosts.size,
          artists,
          posts,
          note: 'Artists are ranked by favorites of posts carrying the part-focus tag(s); parts are tagged, so a good part drawing without the focus tag is missed. Confirm the part rendering visually before deciding.',
        }
      },
    },
    {
      name: 'danbooru_get_post',
      description: 'Read one Danbooru post by id: categorized tag sets plus preview, sample and original image URLs. Read-only; combine with read_image to look at a result.',
      parameters: parameters({
        id: { type: 'integer', minimum: 1, description: 'Danbooru post id, e.g. 12531879.' },
      }, ['id']),
      output,
      async execute(args, exec) {
        const id = clamp(args?.id, 1, Number.MAX_SAFE_INTEGER, 0)
        if (!id) throw new Error('id must be a positive integer')
        const data = await request(`/posts/${id}.json`, {}, { signal: exec?.signal, ttlMs: TTL.posts })
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`Danbooru returned no post for id ${id}`)
        return mapPost(data)
      },
    },
    {
      name: 'danbooru_auth_status',
      description: 'Report whether Danbooru credentials are configured and where they come from, without exposing any value. Read-only; use it after saving credentials or to diagnose anonymous limits.',
      parameters: parameters({}),
      output,
      async execute() {
        return authStatus()
      },
    },
    {
      name: 'danbooru_save_credentials',
      description: 'Save the Danbooru login and API key into the Harness credentials store so requests authenticate. Values are written to the private credentials file (owner-only permissions) and are never returned or echoed. Pass clear=true to remove both entries instead.',
      parameters: parameters({
        login: { type: 'string', description: 'Danbooru user name.' },
        apiKey: { type: 'string', description: 'Danbooru API key from the user profile page.' },
        clear: { type: 'boolean', description: 'Remove both stored values instead of saving.' },
      }),
      output,
      async execute(args) {
        if (!credentials) {
          throw new Error('The credentials service is not mounted in this profile; set DANBOORU_LOGIN and DANBOORU_API_KEY in the launch environment instead.')
        }
        if (args?.clear === true) {
          await credentials.unset('DANBOORU_LOGIN')
          await credentials.unset('DANBOORU_API_KEY')
        } else {
          const login = String(args?.login ?? '').trim()
          const apiKey = String(args?.apiKey ?? '').trim()
          if (!login && !apiKey) throw new Error('Provide login and apiKey, or clear=true to remove stored credentials')
          if (login) await credentials.set('DANBOORU_LOGIN', login)
          if (apiKey) await credentials.set('DANBOORU_API_KEY', apiKey)
        }
        return authStatus()
      },
    },
  ]

  ctx.effect(() => {
    const disposers = tools.map((tool) => ctx.tools.register(tool))
    return () => {
      for (const dispose of disposers) dispose()
    }
  })
}

/** Test seam: lets verify.mjs exercise the client without mounting the plugin. */
export const __internals = { createClient, normalizeConfig, mapPost, httpMessage }
