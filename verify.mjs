/**
 * Self-check for the Danbooru tools bundle: mounts the plugin against a fake
 * Context, then calls every tool once against the live public API.
 *
 * Run with: node verify.mjs
 * It is read-only and only touches danbooru.donmai.us.
 */
import { apply } from './index.js'

const registered = new Map()
const ctx = {
  tools: {
    register(definition) {
      registered.set(definition.name, definition)
      return () => registered.delete(definition.name)
    },
  },
  effect(callback) {
    const dispose = callback()
    return () => dispose?.()
  },
}

apply(ctx, { minIntervalMs: 1200, contact: 'self-check' })

const signal = new AbortController().signal
async function call(name, args) {
  const definition = registered.get(name)
  if (!definition) throw new Error(`tool not registered: ${name}`)
  return definition.execute(args, { signal })
}

const failures = []
function check(label, condition, detail) {
  if (condition) {
    console.log(`ok   ${label}`)
  } else {
    failures.push(`${label}: ${detail}`)
    console.log(`FAIL ${label} — ${detail}`)
  }
}

check('registers ten tools', registered.size === 10, `registered=${[...registered.keys()].join(', ')}`)
const status = await call('danbooru_auth_status')
check('auth_status reports unconfigured without a credentials service', status.configured === false && status.login.configured === false, JSON.stringify(status))
let saveRefused = false
try {
  await call('danbooru_save_credentials', { login: 'nobody', apiKey: 'nokey' })
} catch (error) {
  saveRefused = /credentials service is not mounted/.test(String(error))
}
check('save_credentials refuses without a credentials service', saveRefused, 'expected a missing-service error')

const tagResult = await call('danbooru_search_tags', { query: 'hatsune', limit: 3 })
check('search_tags returns suggestions', tagResult.count > 0 && tagResult.tags.every((tag) => tag.name && tag.category), JSON.stringify(tagResult).slice(0, 300))
check('search_tags finds hatsune_miku', tagResult.tags.some((tag) => tag.name === 'hatsune_miku'), JSON.stringify(tagResult.tags))

const cachedStart = Date.now()
const cachedAgain = await call('danbooru_search_tags', { query: 'hatsune', limit: 3 })
const cachedMs = Date.now() - cachedStart
check('second identical search_tags is cached', cachedMs < 100 && cachedAgain.count === tagResult.count, `${cachedMs}ms`)

const tag = await call('danbooru_get_tag', { name: 'hatsune_miku' })
check('get_tag finds the tag', tag.found === true && tag.post_count > 0, JSON.stringify(tag).slice(0, 200))
check('get_tag returns a wiki excerpt', Boolean(tag.wiki?.summary), JSON.stringify(tag.wiki).slice(0, 120))
check('get_tag returns localized names', Array.isArray(tag.wiki?.other_names) && tag.wiki.other_names.includes('初音ミク'), JSON.stringify(tag.wiki?.other_names?.slice(0, 6)))

const related = await call('danbooru_related_tags', { query: 'hatsune_miku', limit: 5 })
check('related_tags returns rows', related.count > 0 && related.related.every((row) => row.name && row.name !== 'hatsune_miku'), JSON.stringify(related).slice(0, 300))

const similarArtists = await call('danbooru_similar_artists', { artist: 'satou_kuuki', limit: 5, profile_tags: 5 })
check('similar_artists builds a seed tag profile', similarArtists.seed.profile.length >= 3 && similarArtists.seed.profile.every((row) => row.frequency > 0 && row.post_count > 0), JSON.stringify(similarArtists.seed).slice(0, 300))
check('similar_artists ranks candidates by shared tags', similarArtists.candidates.length > 0 && similarArtists.candidates.every((candidate, index, all) => index === 0 || all[index - 1].score >= candidate.score) && similarArtists.candidates.every((candidate) => candidate.shared_tags.length >= 2 && String(candidate.artist_url).includes('/posts?tags=')), JSON.stringify(similarArtists.candidates.map((candidate) => [candidate.name, candidate.score])).slice(0, 300))

const similarWithExamples = await call('danbooru_similar_artists', { artist: 'satou_kuuki', limit: 2, profile_tags: 3, examples: 1 })
check('similar_artists attaches visual examples on request', similarWithExamples.candidates.length > 0 && similarWithExamples.candidates.every((candidate) => Array.isArray(candidate.examples) && candidate.examples.length === 1 && typeof candidate.examples[0].sample_url === 'string'), JSON.stringify(similarWithExamples.candidates.map((candidate) => candidate.examples)).slice(0, 300))

const posts = await call('danbooru_search_posts', { tags: 'hatsune_miku solo', limit: 3 })
check('search_posts returns posts', posts.count > 0, JSON.stringify(posts).slice(0, 300))
const first = posts.posts[0]
check('post exposes categorized tags and URLs', first.id > 0 && first.urls.post.endsWith(`/posts/${first.id}`) && Array.isArray(first.tags.general), JSON.stringify(first).slice(0, 300))

const single = await call('danbooru_get_post', { id: first.id })
check('get_post returns the same id', single.id === first.id, `${single.id} != ${first.id}`)

const yearPosts = await call('danbooru_search_posts', { tags: 'hatsune_miku', year: 2025, rating: 'all', order: 'score', limit: 3 })
check('year filter scopes posts to the calendar year', yearPosts.count > 0 && yearPosts.posts.every((post) => post.created_at.startsWith('2025')), JSON.stringify(yearPosts.posts.map((post) => post.created_at)))
check('score order is descending', yearPosts.posts.every((post, index, all) => index === 0 || all[index - 1].score >= post.score), JSON.stringify(yearPosts.posts.map((post) => post.score)))

const topArtists = await call('danbooru_top_artists', { year: 2025, sample: 100, limit: 5 })
check('top_artists ranks artists for the year', topArtists.artists.length > 0 && topArtists.sampled_posts > 0, JSON.stringify(topArtists).slice(0, 400))
check('top_artists exposes weighted tiers', topArtists.weighting?.mode === 'weighted' && typeof topArtists.tiers?.rising?.sampled === 'number' && topArtists.tiers?.recent?.sampled > 0, JSON.stringify(topArtists.tiers).slice(0, 400))
check('past-year hot tier is reported as skipped', /past year/.test(topArtists.tiers?.hot?.skipped ?? ''), JSON.stringify(topArtists.tiers?.hot).slice(0, 200))
check('top_artists example is the newest sampled post', topArtists.artists.every((artist) => artist.name && artist.example?.post_id > 0 && artist.example.created_at && String(artist.example.created_at) >= String(artist.top?.created_at ?? '')), JSON.stringify(topArtists.artists.map((artist) => [artist.example?.created_at, artist.top?.created_at])).slice(0, 300))
check('top_artists exposes a year-scoped artist page link', topArtists.artists.every((artist) => String(artist.artist_url).includes('2025-01-01')), JSON.stringify(topArtists.artists[0]?.artist_url))
function priorityOrdered(artists) {
  return artists.every((artist, index, all) => {
    if (index === 0) return true
    const before = all[index - 1]
    const keys = [
      [before.tier_posts.hot, artist.tier_posts.hot],
      [before.tier_posts.rising, artist.tier_posts.rising],
      [before.tier_posts.recent, artist.tier_posts.recent],
      [before.total_score, artist.total_score],
      [before.posts, artist.posts],
    ]
    for (const [left, right] of keys) {
      if (left !== right) return left > right
    }
    return true
  })
}

check('top_artists uses reference-priority ordering', topArtists.query?.rank_by === 'reference_priority' && priorityOrdered(topArtists.artists), JSON.stringify(topArtists.artists.map((artist) => artist.tier_posts)))

const uniform = await call('danbooru_top_artists', { year: 2025, sample: 100, limit: 5, weighting: 'uniform' })
check('uniform weighting ranks by total score', uniform.weighting?.mode === 'uniform' && uniform.artists.every((artist, index, all) => index === 0 || all[index - 1].total_score >= artist.total_score), JSON.stringify(uniform).slice(0, 400))

const activeArtists = await call('danbooru_top_artists', { year: 2025, sample: 100, limit: 5, rank_by: 'posts' })
check('top_artists can rank by post count', activeArtists.artists.length > 0 && activeArtists.artists.every((artist, index, all) => index === 0 || all[index - 1].posts >= artist.posts), JSON.stringify(activeArtists.artists.map((artist) => artist.posts)))

const hotPosts = await call('danbooru_search_posts', { order: 'rank', limit: 2 })
check('hot order returns ranked posts', hotPosts.count > 0 && hotPosts.posts.every((post) => post.id > 0), JSON.stringify(hotPosts).slice(0, 200))

const yearArtists = await call('danbooru_year_artists', { year: 2025, limit: 5, monthly_sample: 20 })
check('year_artists covers every month of the year', yearArtists.months_sampled.length === 12 && yearArtists.sampled_posts > 0, JSON.stringify(yearArtists).slice(0, 300))
check('year_artists ranks by total favorites', yearArtists.artists.length > 0 && yearArtists.artists.every((artist, index, all) => index === 0 || all[index - 1].total_favorites >= artist.total_favorites), JSON.stringify(yearArtists.artists.map((artist) => artist.total_favorites)))
check('year_artists is independent of the hot weighting', yearArtists.method === 'year_favorites' && yearArtists.tiers === undefined && yearArtists.artists.every((artist) => artist.tier_posts === undefined), 'unexpected weighting fields')
check('year_artists returns best and newest references', yearArtists.artists.every((artist) => artist.best?.post_id > 0 && artist.newest?.post_id > 0 && typeof artist.best.sample_url === 'string'), JSON.stringify(yearArtists.artists[0]).slice(0, 300))
check('year_artists exposes a year-scoped artist page link', yearArtists.artists.every((artist) => String(artist.artist_url).includes('2025-01-01')), JSON.stringify(yearArtists.artists[0]?.artist_url))

const styleArtists = await call('danbooru_year_artists', { year: 2025, limit: 2, monthly_sample: 20, style_preset: 'fleshy', style_threshold: 0.33, style_min_posts: 2, style_max_checks: 3, compact: true })
check('style filter verifies candidates on year posts', Boolean(styleArtists.style_filter) && styleArtists.style_filter.checked_artists <= 3, JSON.stringify(styleArtists.style_filter).slice(0, 300))
check('style-qualified artists meet the threshold', styleArtists.artists.every((artist) => artist.style?.ratio >= 0.33 && Array.isArray(artist.style?.best) && artist.style.best.length <= 3 && artist.style?.min_hits === 2 && artist.style.best.every((reference) => typeof reference.sample_url === 'string')), JSON.stringify(styleArtists.artists.map((artist) => artist.style)).slice(0, 300))
check('compact mode drops post references', styleArtists.artists.every((artist) => !('best' in artist) && !('newest' in artist)), JSON.stringify(styleArtists.artists[0] ?? {}).slice(0, 200))

const defaultStyle = await call('danbooru_year_artists', { year: 2025, limit: 1, monthly_sample: 20, style_preset: 'fleshy', style_max_checks: 2 })
check('style gate defaults to 5 percent with two required hits', defaultStyle.style_filter?.threshold === 0.05 && defaultStyle.style_filter?.min_hits === 2, JSON.stringify(defaultStyle.style_filter))

let yearRejected = false
try {
  await call('danbooru_search_posts', { year: 1990, limit: 1 })
} catch (error) {
  yearRejected = /year must be between/.test(String(error))
}
check('out-of-range year is rejected', yearRejected, 'expected a year range error')

if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`)
  process.exitCode = 1
} else {
  console.log('\nall checks passed')
}
