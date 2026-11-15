/**
 * Self-check for the Danbooru tools bundle: mounts the plugin against a fake
 * Context, then calls every tool once against the live public API.
 *
 * Run with: node verify.mjs
 * It is read-only and only touches danbooru.donmai.us.
 */
import { apply, __internals } from './index.js'

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

apply(ctx, { minIntervalMs: 1200, contact: 'self-check', toolPreset: 'full' })

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

check('full preset registers sixteen tools', registered.size === 16, `registered=${[...registered.keys()].join(', ')}`)

const coreRegistered = new Map()
const coreCtx = {
  tools: {
    register(definition) {
      coreRegistered.set(definition.name, definition)
      return () => coreRegistered.delete(definition.name)
    },
  },
  effect(callback) {
    const dispose = callback()
    return () => dispose?.()
  },
}
apply(coreCtx, { contact: 'self-check-core' })
const coreNames = [...coreRegistered.keys()]
check('default preset registers twelve core tools', coreNames.length === 12 && coreNames.includes('danbooru_surface_profile') && !coreNames.includes('danbooru_image_artist_consensus') && !coreNames.includes('danbooru_part_specialists') && !coreNames.includes('danbooru_top_artists') && !coreNames.includes('danbooru_get_post'), `registered=${coreNames.join(', ')}`)
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
check('similar_artists ranks candidates by shared tags', similarArtists.candidates.length > 0 && similarArtists.candidates.every((candidate, index, all) => index === 0 || all[index - 1].score >= candidate.score) && similarArtists.candidates.every((candidate) => (candidate.shared_tags.length >= 2 || (candidate.expression && candidate.expression.tags.length >= 2)) && String(candidate.artist_url).includes('/posts?tags=')), JSON.stringify(similarArtists.candidates.map((candidate) => [candidate.name, candidate.score])).slice(0, 300))
check('similar_artists reports expression similarity', similarArtists.seed.expression_profile.length > 0 && similarArtists.candidates.every((candidate) => candidate.expression && candidate.expression.cosine >= 0 && candidate.expression.cosine <= 1), JSON.stringify(similarArtists.candidates.map((candidate) => [candidate.name, candidate.expression])).slice(0, 300))

const similarWithExamples = await call('danbooru_similar_artists', { artist: 'satou_kuuki', limit: 2, profile_tags: 3, examples: 1 })
check('similar_artists attaches visual examples on request', similarWithExamples.candidates.length > 0 && similarWithExamples.candidates.every((candidate) => Array.isArray(candidate.examples) && candidate.examples.length === 1 && typeof candidate.examples[0].sample_url === 'string' && Array.isArray(candidate.examples[0].matched_tags)), JSON.stringify(similarWithExamples.candidates.map((candidate) => candidate.examples)).slice(0, 300))

const imageArtists = await call('danbooru_artists_from_image', {
  image_tags: 'latex bodysuit, white background',
  person_tags: 'huge_breasts, thick_thighs',
  expression_tags: 'half-closed_eyes, blush',
  technique_tags: 'latex, shiny_clothes',
  lineart_tags: 'lineart, colored_lineart',
  clothing_tags: 'latex, shiny_clothes',
  color_tags: 'white_background, blue_theme',
  lighting_tags: 'dappled_sunlight, backlighting',
  year: 2025,
  limit: 5,
})
check('image artist search ranks by weighted dimensions', imageArtists.candidates.length > 0 && imageArtists.candidates.every((candidate, index, all) => index === 0 || all[index - 1].score >= candidate.score) && imageArtists.candidates.every((candidate) => candidate.dimensions && typeof candidate.score === 'number' && typeof candidate.three_d_share === 'number' && String(candidate.artist_url).includes('date%3A2025')) && imageArtists.groups.some((group) => group.key === 'lineart') && imageArtists.groups.some((group) => group.key === 'lighting'), JSON.stringify(imageArtists.candidates.map((candidate) => [candidate.name, candidate.score])).slice(0, 300))
check('image search collapses near-duplicate clusters', imageArtists.dedupe?.method?.includes('parent_id') && imageArtists.groups.every((group) => typeof group.unique_clusters === 'number' && typeof group.deduped_posts === 'number' && group.unique_clusters <= 400), JSON.stringify(imageArtists.dedupe).slice(0, 300))
const imageWeightSum = Object.values(imageArtists.weights).reduce((sum, value) => sum + value, 0)
check('image search weights lineart, technique and clothing', imageArtists.weights.lineart >= 0.18 && imageArtists.weights.technique >= 0.22 && imageArtists.weights.clothing >= 0.1 && imageArtists.groups.some((group) => group.key === 'clothing') && Math.abs(imageWeightSum - 1) < 1e-9, JSON.stringify(imageArtists.weights))

const identityArtists = await call('danbooru_artists_from_image', { image_tags: 'pink_hair, horns, white_lingerie', technique_tags: 'shiny_skin', limit: 3 })
check('image search drops character identity features', Array.isArray(identityArtists.excluded_identity_tags) && identityArtists.excluded_identity_tags.includes('pink_hair') && identityArtists.excluded_identity_tags.includes('horns') && identityArtists.excluded_identity_tags.includes('white_lingerie') && identityArtists.groups.every((group) => group.key !== 'tag') && identityArtists.candidates.length > 0, JSON.stringify(identityArtists.excluded_identity_tags))

const materialArtists = await call('danbooru_artists_from_image', { image_tags: 'latex, shiny_clothes', clothing_tags: 'lingerie, latex, silk', limit: 3 })
check('clothing dimension measures material effect, not garment type', materialArtists.excluded_identity_tags.includes('lingerie') && materialArtists.groups.some((group) => group.key === 'clothing' && group.tags.some((tag) => tag.tag === 'latex')) && materialArtists.groups.every((group) => group.tags.every((tag) => tag.tag !== 'lingerie')), JSON.stringify(materialArtists.excluded_identity_tags))
check('image search demotes single-dimension evidence', imageArtists.candidates.every((candidate) => typeof candidate.dimensions_used === 'number' && candidate.dimensions_used >= 1 && typeof candidate.single_dimension === 'boolean') && imageArtists.candidates.some((candidate) => candidate.single_dimension === false), JSON.stringify(imageArtists.candidates.map((candidate) => [candidate.name, candidate.dimensions_used, candidate.single_dimension])))

// "以图找画师" 的交付物是画师串：六槽构成，槽位顺序固定，同一位画师不重复占槽。
check('image search emits a six-slot artist string', typeof imageArtists.artist_string === 'string' && /^0\.85::/.test(imageArtists.artist_string) && Array.isArray(imageArtists.artist_string_slots) && imageArtists.artist_string_slots.length >= 1 && imageArtists.artist_string_slots[0].slot === 'body' && imageArtists.artist_string_slots.every((slot) => typeof slot.weight === 'number' && typeof slot.artist === 'string' && Array.isArray(slot.matched_dimensions) && slot.matched_dimensions.length > 0), JSON.stringify(imageArtists.artist_string))
check('artist string slots use distinct artists and fixed role keys', imageArtists.artist_string_slots.every((slot, index, array) => index === 0 || array[index - 1].slot !== slot.slot) && new Set(imageArtists.artist_string_slots.map((slot) => slot.artist)).size === imageArtists.artist_string_slots.length && imageArtists.artist_string_slots.every((slot) => ['body', 'skin', 'brush', 'material', 'accent', 'theme'].includes(slot.slot)), JSON.stringify(imageArtists.artist_string_slots.map((slot) => [slot.slot, slot.artist, slot.weight])))
check('artist string escapes parentheses for NAI weights', !/[^\\]\((?!\\)/.test(imageArtists.artist_string || ''), imageArtists.artist_string)

const prefixedString = await call('danbooru_artists_from_image', { image_tags: 'shiny_skin, sweat', technique_tags: 'shiny_skin', string_style: 'artist_prefix', string_slots: 2, limit: 5 })
check('artist string supports the artist: prefix form', prefixedString.artist_string === '' || /^\d(\.\d+)?::artist:[^:]+::$/.test(prefixedString.artist_string), JSON.stringify(prefixedString.artist_string))

// 每个维度独立成榜：某一维度最强的画师不能被全局排名截掉；没进槽的进 try_next 提示"先加再比"。
check('image search reports one aspect leader board', Array.isArray(imageArtists.aspect_leaders) && imageArtists.aspect_leaders.length > 0 && imageArtists.aspect_leaders.length <= imageArtists.groups.length && imageArtists.aspect_leaders.every((leader) => typeof leader.dimension === 'string' && typeof leader.artist === 'string' && leader.evidence > 0 && typeof leader.global_rank === 'number' && leader.global_rank >= 1 && typeof leader.in_string === 'boolean'), JSON.stringify(imageArtists.aspect_leaders))
check('aspect leaders never vanish: each is in the string, in candidates, or queued in try_next', imageArtists.aspect_leaders.every((leader) => leader.in_string || imageArtists.candidates.some((candidate) => candidate.name === leader.artist) || (imageArtists.try_next || []).some((entry) => entry.artist === leader.artist) || leader.global_rank > 0), JSON.stringify({ leaders: imageArtists.aspect_leaders.map((leader) => [leader.dimension, leader.artist, leader.global_rank, leader.in_string]), tryNext: (imageArtists.try_next || []).map((entry) => entry.artist) }))
check('unfitted aspect leaders are suggested with a low weight instead of dropped', Array.isArray(imageArtists.try_next) && imageArtists.try_next.every((entry) => entry.suggested_weight > 0 && entry.suggested_weight <= 0.2 && typeof entry.reason === 'string' && entry.reason.length > 20) && ((imageArtists.try_next).length === 0 || imageArtists.try_next.every((entry) => !imageArtists.aspect_leaders.find((leader) => leader.artist === entry.artist)?.in_string)), JSON.stringify(imageArtists.try_next))
check('slots mark whether the artist came from an aspect leader board', imageArtists.artist_string_slots.every((slot) => typeof slot.from_aspect_leader === 'boolean'), JSON.stringify(imageArtists.artist_string_slots.map((slot) => [slot.slot, slot.artist, slot.from_aspect_leader])))

// Weight-1 tags must be emitted bare (no `::` wrapper); other weights keep the w::tag:: form.
const { formatWeightedTag, joinArtistString } = __internals
check('unit-weight tags are emitted without the :: wrapper', formatWeightedTag('hews 2024 2025', 1) === 'hews 2024 2025' && formatWeightedTag('hews', 1.0) === 'hews' && formatWeightedTag('artist:hews 2025', 1) === 'artist:hews 2025' && formatWeightedTag('hews', 0.85) === '0.85::hews::' && formatWeightedTag('hews 2024', 0.5) === '0.5::hews 2024 ::' && formatWeightedTag('artist2', 0.85) === '0.85::artist2 ::', JSON.stringify([formatWeightedTag('hews', 1), formatWeightedTag('hews', 0.85), formatWeightedTag('artist2', 0.85), formatWeightedTag('hews 2024', 0.5)]))
check('artist strings put a space before the comma after a digit-ending tag', joinArtistString(['hews 2024', 'hews 2025', 'hew2', '0.85::hew2 ::', 'elocca']) === 'hews 2024 , hews 2025 , hew2 , 0.85::hew2 ::, elocca' && joinArtistString(['a2', 'b2']) === 'a2 , b2' && joinArtistString(['hews 2024']) === 'hews 2024', JSON.stringify([joinArtistString(['hews 2024', 'hews 2025', 'hew2', '0.85::hew2 ::', 'elocca']), joinArtistString(['a2', 'b2']), joinArtistString(['hews 2024'])]))

const consensus = await call('danbooru_image_artist_consensus', { lists: JSON.stringify(['hews,nyantcha,tayuido', 'nyantcha,shexyo', 'hews,asou']), source_names: 'a,b,c', min_hits: 2, limit: 5, examples: 0 })
check('consensus keeps artists found by at least two schemes', consensus.candidates.map((candidate) => candidate.name).sort().join(',') === 'hews,nyantcha' && consensus.candidates.every((candidate) => candidate.hits >= 2) && consensus.fallback_used === false, JSON.stringify(consensus.candidates.map((candidate) => [candidate.name, candidate.hits])))

const styleMatch = await call('danbooru_style_match', {
  mode: 'character',
  character: 'firefly_(honkai:_star_rail)',
  style_tags: 'shiny_skin, sweat',
  genre_tags: 'sex',
  limit: 4,
  per_query: 40,
  examples: 1,
})
check('style match scans the character all-time top works', styleMatch.anchor_scans.length === 1 && styleMatch.anchor_scans[0].kind === 'character-top' && styleMatch.anchor_scans[0].sampled > 0, JSON.stringify(styleMatch.anchor_scans))
check('style match ranks candidates with same-character evidence', styleMatch.candidates.length > 0 && styleMatch.candidates.every((candidate) => candidate.name && typeof candidate.score === 'number' && String(candidate.artist_url).includes('/posts?tags=')) && styleMatch.candidates.every((candidate) => typeof candidate.same_character_posts === 'number'), JSON.stringify(styleMatch.candidates.map((candidate) => [candidate.name, candidate.score])).slice(0, 300))
check('style match reports anchor and pair evidence', styleMatch.candidates.every((candidate) => typeof candidate.anchor_score === 'number' && typeof candidate.pair_score === 'number' && typeof candidate.chart_top === 'boolean') && styleMatch.queries.some((query) => query.kind.startsWith('character+')), JSON.stringify(styleMatch.queries).slice(0, 300))
check('style match exposes a visual checklist and iteration hint', Array.isArray(styleMatch.verify?.checklist) && styleMatch.verify.checklist.length >= 5 && typeof styleMatch.iterate?.hint === 'string' && Array.isArray(styleMatch.iterate.prefer_artists), JSON.stringify(styleMatch.iterate).slice(0, 200))
check('style match attaches sample posts', styleMatch.candidates.every((candidate) => Array.isArray(candidate.examples) && candidate.examples.length >= 1 && candidate.examples.every((example) => example.sample_url && example.post_url)), JSON.stringify(styleMatch.candidates.map((candidate) => candidate.examples.length)))

const styleMatchMulti = await call('danbooru_style_match', {
  mode: 'character',
  character: 'firefly_(honkai:_star_rail), kafka_(honkai:_star_rail)',
  style_tags: 'shiny_skin, sweat',
  genre_tags: 'sex, hetero',
  limit: 2,
  per_query: 30,
  examples: 0,
})
check('style match aggregates several reference characters', styleMatchMulti.anchor_scans.length === 2 && styleMatchMulti.reference.characters.length === 2 && styleMatchMulti.candidates.every((candidate) => candidate.same_character_breakdown && Object.keys(candidate.same_character_breakdown).length === 2), JSON.stringify(styleMatchMulti.anchor_scans))

const styleMatchLook = await call('danbooru_style_match', {
  character: 'firefly_(honkai:_star_rail)',
  style_tags: 'shiny_skin, sweat',
  body_tags: 'huge_breasts, dark_nipples',
  subject_tags: 'white_hair, blonde_hair',
  genre_tags: 'sex, hetero',
  limit: 3,
  per_query: 30,
  examples: 0,
})
const lookBodyTags = (styleMatchLook.reference.body_tags ?? []).join(',')
const lookRejected = (styleMatchLook.reference.rejected_body_tags ?? []).map((row) => row.tag).join(',')
check('style mode rejects identity/appearance but keeps body-detail evidence', styleMatchLook.reference.mode === 'style' && styleMatchLook.reference.characters.length === 0 && /huge_breasts/.test(lookBodyTags) && /dark_nipples/.test(lookBodyTags) && /white_hair/.test(lookRejected) && /blonde_hair/.test(lookRejected) && styleMatchLook.anchor_scans.every((scan) => scan.kind === 'style-top' || scan.kind === 'genre-top' || scan.kind === 'body-top') && styleMatchLook.queries.some((query) => query.kind === 'style+body' && /huge_breasts/.test(String(query.tags))) && styleMatchLook.queries.every((query) => !/white_hair|blonde_hair/.test(String(query.tags))) && styleMatchLook.candidates.every((candidate) => typeof candidate.style_posts === 'number' && candidate.same_character_posts === null), JSON.stringify({ anchors: styleMatchLook.anchor_scans.map((scan) => scan.kind), body: lookBodyTags, rejected: lookRejected, queries: styleMatchLook.queries.map((query) => query.tags) }))
const lookSoup = styleMatchLook.artist_soup ?? {}
const soupShape = [1, 0.85, 0.6, 0.5, 0.4, 0.3, 0.2]
check('style match emits a ready-to-paste artist string', typeof lookSoup.string === 'string' && lookSoup.string.endsWith(',') && Array.isArray(lookSoup.artists) && lookSoup.artists.length >= 1 && lookSoup.artists.length <= 7 && lookSoup.artists.every((row, index) => row.weight === soupShape[index] && typeof row.name === 'string' && row.name.length > 0) && lookSoup.artists.map((row) => row.name).join(',') === styleMatchLook.candidates.slice(0, lookSoup.artists.length).map((candidate) => candidate.name).join(','), JSON.stringify({ string: lookSoup.string, artists: lookSoup.artists }))
check('artist string keeps the 1.0 anchor bare and never glues a digit to ::', /^[^\d:]/.test(lookSoup.string ?? '') && !/(\d)::[^:]*[0-9]::/.test(lookSoup.string ?? '') && lookSoup.artists.every((row) => row.weight !== 1 || !lookSoup.string.startsWith(`${row.weight}::`)), JSON.stringify({ string: lookSoup.string }))
check('artist string concentration lands in the tuned band', typeof lookSoup.top3_share === 'number' && (lookSoup.artists.length <= 3 || (lookSoup.top3_share >= 0.4 && lookSoup.top3_share <= 0.9)) && typeof lookSoup.total_weight === 'number' && lookSoup.total_weight > 0, JSON.stringify({ top3_share: lookSoup.top3_share, total_weight: lookSoup.total_weight, artists: lookSoup.artists.length }))

const styleMatchSmall = await call('danbooru_style_match', {
  style_tags: 'shiny_skin',
  limit: 8,
  examples: 0,
  verify_same_character: false,
  discover_small_artists: true,
  min_artist_posts: 50,
  small_artist_slots: 2,
})
check('style match discovers small artists through style-tag co-occurrence', styleMatchSmall.small_artist_discovery?.enabled === true && styleMatchSmall.small_artist_discovery.discovered > 0 && styleMatchSmall.candidates.some((candidate) => candidate.discovered_via_style_cooccurrence) && styleMatchSmall.candidates.every((candidate) => candidate.artist_posts == null || candidate.artist_posts >= 50), JSON.stringify(styleMatchSmall.small_artist_discovery))

const styleMatchSeed = await call('danbooru_style_match', {
  style_tags: 'shiny_skin, sweat',
  seed_artists: 'eigaka',
  limit: 6,
  examples: 0,
  verify_same_character: false,
})
check('style match forces explicit seed artists into the result', styleMatchSeed.candidates.some((candidate) => candidate.name === 'eigaka' && candidate.seed_artist === true && typeof candidate.artist_posts === 'number' && candidate.artist_posts >= 50), JSON.stringify(styleMatchSeed.seed_artists))

const styleMatchWide = await call('danbooru_style_match', {
  style_tags: 'shiny_skin',
  limit: 4,
  examples: 0,
  verify_same_character: false,
  anchor_pages: 3,
  deep_scan_pages: 6,
})
check('style match deep-scans a wider candidate pool', styleMatchWide.pool_stats?.anchor_pages === 3 && styleMatchWide.pool_stats?.deep_scan_pages === 6 && styleMatchWide.anchor_scans.every((row) => row.pages === 6) && styleMatchWide.pool_stats.anchor_posts_scanned > 200 && styleMatchWide.pool_stats.unique_artists_seen > 0, JSON.stringify(styleMatchWide.pool_stats))

const pixelMatch = await call('danbooru_pixel_style_match', {
  reference_images: 'https://cdn.donmai.us/sample/fe/8c/sample-fe8ce3a3785d35e161074779a433c0e2.jpg',
  candidate_artists: 'hews,ohisashiburi',
  limit: 2,
  samples_per_artist: 1,
})
check('pixel match ranks artists by visual similarity', pixelMatch.candidates.length > 0 && pixelMatch.candidates.every((candidate) => typeof candidate.similarity === 'number' && candidate.samples.length > 0) && pixelMatch.candidates.every((candidate, index, all) => index === 0 || all[index - 1].similarity >= candidate.similarity), JSON.stringify(pixelMatch.candidates?.map((candidate) => [candidate.name, candidate.similarity])))

const pixelPostRef = await call('danbooru_pixel_style_match', {
  reference_images: 'https://danbooru.donmai.us/posts/11172979',
  candidate_artists: 'hews',
  limit: 1,
  samples_per_artist: 1,
  year_check: false,
})
check('pixel match accepts a Danbooru post URL as reference', pixelPostRef.candidates?.length === 1 && pixelPostRef.candidates[0].similarity > 0 && pixelPostRef.candidates[0].samples.length > 0, JSON.stringify(pixelPostRef.candidates?.[0] ? [pixelPostRef.candidates[0].name, pixelPostRef.candidates[0].similarity] : pixelPostRef))

const pixelYear = await call('danbooru_pixel_style_match', {
  reference_images: 'https://cdn.donmai.us/sample/fe/8c/sample-fe8ce3a3785d35e161074779a433c0e2.jpg',
  candidate_artists: 'hews',
  limit: 1,
  samples_per_artist: 1,
  years: '2025',
  year_samples: 1,
})
const pixelYearCandidate = pixelYear.candidates?.[0]
check('pixel match annotates the closest year', Boolean(pixelYearCandidate) && Array.isArray(pixelYearCandidate.years) && typeof pixelYearCandidate.artist_with_years === 'string' && pixelYearCandidate.artist_with_years.startsWith('hews') && (pixelYearCandidate.years.length === 0 || pixelYearCandidate.artist_with_years.endsWith(String(pixelYearCandidate.years[0]))) && typeof pixelYear.artist_string === 'string' && pixelYear.artist_string.includes('hews'), JSON.stringify({ years: pixelYearCandidate?.years, artist_with_years: pixelYearCandidate?.artist_with_years, artist_string: pixelYear.artist_string }))

// Rejection memory: remembered rejects are filtered from AUTOMATIC discovery, but explicitly
// naming one again (seed_artists) reinstates it — the memory is not a permanent block.
await call('danbooru_style_match', { style_tags: 'shiny_skin', avoid_artists: 'hews', limit: 3, examples: 0, verify_same_character: false })
const rejectionSuppressed = await call('danbooru_image_artist_consensus', { lists: JSON.stringify(['hews,nyantcha', 'hews,asou']), min_hits: 2, examples: 0 })
check('remembered rejections are filtered from automatic discovery', rejectionSuppressed.rejected_excluded.includes('hews') && !rejectionSuppressed.candidates.some((candidate) => candidate.name === 'hews'), JSON.stringify(rejectionSuppressed.rejected_excluded))
const rejectionReinstated = await call('danbooru_style_match', { style_tags: 'shiny_skin', seed_artists: 'hews', limit: 6, examples: 0, verify_same_character: false })
check('explicitly naming a rejected artist reinstates it', rejectionReinstated.candidates.some((candidate) => candidate.name === 'hews' && candidate.seed_artist === true) && Array.isArray(rejectionReinstated.rejection_memory?.reinstated_this_call) && rejectionReinstated.rejection_memory.reinstated_this_call.includes('hews'), JSON.stringify(rejectionReinstated.rejection_memory))
const styleMatchRestored = await call('danbooru_style_match', { style_tags: 'shiny_skin', seed_artists: 'hews', allow_rejected_artists: true, limit: 6, examples: 0, verify_same_character: false })
check('allow_rejected_artists restores an artist for one call', styleMatchRestored.candidates.some((candidate) => candidate.name === 'hews'), JSON.stringify(styleMatchRestored.rejection_memory))
await call('danbooru_style_match', { style_tags: 'shiny_skin', forget_artists: 'hews', limit: 2, examples: 0, verify_same_character: false })

const posts = await call('danbooru_search_posts', { tags: 'hatsune_miku solo', limit: 3 })
check('search_posts returns posts', posts.count > 0, JSON.stringify(posts).slice(0, 300))
const first = posts.posts[0]
check('post exposes categorized tags and URLs', first.id > 0 && first.urls.post.endsWith(`/posts/${first.id}`) && Array.isArray(first.tags.general), JSON.stringify(first).slice(0, 300))

const single = await call('danbooru_get_post', { id: first.id })
check('get_post returns the same id', single.id === first.id, `${single.id} != ${first.id}`)

const yearPosts = await call('danbooru_search_posts', { tags: 'hatsune_miku', year: 2025, rating: 'all', order: 'score', limit: 3 })
check('year filter scopes posts to the calendar year', yearPosts.count > 0 && yearPosts.posts.every((post) => post.created_at.startsWith('2025')), JSON.stringify(yearPosts.posts.map((post) => post.created_at)))
check('score order is descending', yearPosts.posts.every((post, index, all) => index === 0 || all[index - 1].score >= post.score), JSON.stringify(yearPosts.posts.map((post) => post.score)))
const VIDEO_EXTS = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'm4v']
check('search results are images only', [...posts.posts, ...yearPosts.posts].every((post) => !VIDEO_EXTS.includes(String(post.image?.file_ext ?? '').toLowerCase())), JSON.stringify([...posts.posts, ...yearPosts.posts].map((post) => post.image?.file_ext)))

const partSearch = await call('danbooru_part_specialists', { part: 'hands', year: 2025, artists_limit: 5, posts_limit: 5 })
check('part specialists ranks artists by part-post favorites', partSearch.artists.length > 0 && partSearch.artists.every((artist, index, all) => index === 0 || all[index - 1].total_favorites >= artist.total_favorites) && partSearch.artists.every((artist) => artist.part_posts >= 2 && Array.isArray(artist.best) && artist.best.length > 0), JSON.stringify(partSearch.artists.map((artist) => [artist.name, artist.total_favorites, artist.part_posts])).slice(0, 300))
check('part specialists returns top part-tagged images', partSearch.posts.length > 0 && partSearch.posts.every((post, index, all) => index === 0 || all[index - 1].fav_count >= post.fav_count) && partSearch.posts.every((post) => !VIDEO_EXTS.includes(String(post.sample_url ?? '').toLowerCase().split('.').pop())), JSON.stringify(partSearch.posts.map((post) => [post.post_id, post.fav_count])).slice(0, 300))

const topArtists = await call('danbooru_top_artists', { year: 2025, sample: 100, limit: 5 })
check('top_artists ranks artists for the year', topArtists.artists.length > 0 && topArtists.sampled_posts > 0, JSON.stringify(topArtists).slice(0, 400))
check('top_artists exposes weighted tiers', topArtists.weighting?.mode === 'weighted' && typeof topArtists.tiers?.rising?.sampled === 'number' && topArtists.tiers?.recent?.sampled > 0, JSON.stringify(topArtists.tiers).slice(0, 400))
check('past-year hot tier is reported as skipped', /past year/.test(topArtists.tiers?.hot?.skipped ?? ''), JSON.stringify(topArtists.tiers?.hot).slice(0, 200))
check('top_artists references are images only', topArtists.artists.every((artist) => !VIDEO_EXTS.includes(String(artist.example?.sample_url ?? '').toLowerCase().split('.').pop())), JSON.stringify(topArtists.artists.map((artist) => artist.example?.sample_url)))
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

const appearanceArtists = await call('danbooru_year_artists', { year: 2025, limit: 2, monthly_sample: 20, appearance_tags: 'shiny_skin', appearance_match: 'any', style_max_checks: 3, compact: true })
check('appearance block measures skin reference tags', Boolean(appearanceArtists.appearance_filter) && appearanceArtists.artists.length > 0 && appearanceArtists.artists.every((artist) => typeof artist.appearance?.ratio === 'number' && artist.appearance.ratio >= 0 && Array.isArray(artist.appearance?.best) && (artist.appearance.per_tag?.shiny_skin ?? -1) >= 0), JSON.stringify(appearanceArtists.artists[0]?.appearance ?? {}).slice(0, 300))
check('appearance defaults to report-only without gating', appearanceArtists.appearance_filter?.threshold === 0 && appearanceArtists.appearance_filter?.match === 'any', JSON.stringify(appearanceArtists.appearance_filter))

const colorArtists = await call('danbooru_year_artists', { year: 2025, limit: 2, monthly_sample: 20, color_tags: 'blue_theme,monochrome', color_match: 'any', style_max_checks: 3, compact: true })
check('color block measures overall palette tags', Boolean(colorArtists.color_filter) && colorArtists.artists.length > 0 && colorArtists.artists.every((artist) => typeof artist.color?.ratio === 'number' && artist.color.ratio >= 0 && Array.isArray(artist.color?.best) && (artist.color.per_tag?.blue_theme ?? -1) >= 0), JSON.stringify(colorArtists.artists[0]?.color ?? {}).slice(0, 300))
check('color defaults to report-only without gating', colorArtists.color_filter?.threshold === 0 && colorArtists.color_filter?.match === 'any', JSON.stringify(colorArtists.color_filter))

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
