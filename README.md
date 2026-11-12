# D站搜索装置（dsh-danbooru-tools）

给 DeepSeek Harness 用的**只读 Danbooru 工具插件**：纯 Host 插件、零运行时依赖、不写任何文件，只用官方 JSON API。

它的目标是「AI 绘画提示词调研 + 画师调研」：把一个模糊想法变成可用的 Danbooru tag，再看真实作品如何用这些 tag；也可以按整年总收藏找画师（带体型 tag 闸门与年份范围链接），或用 HOT / 周榜 / 参考权重三级采样找参考画师。

## 安装（DSH profile）

1. 克隆本仓库到任意目录：`git clone https://github.com/big-fat-fish-agent/danbooru-search-device.git`
2. 在 `$DSH_HOME/profiles/<profile>/package.json` 的 `dependencies` 里加：`"@local/dsh-danbooru-tools": "link:<克隆路径>"`
3. 把 `"@local/dsh-danbooru-tools"` 加进同一文件的 `dsh.bundles` 列表
4. 重启 DSH（首次安装需要重启；之后改动只需在 `plugin_manager` 里关→开热重载）

## 工具

| 工具 | 作用 | 主要参数 |
|---|---|---|
| `danbooru_search_posts` | 按 tag 搜索作品，返回按分类拆好的 tag 集与图片 URL；可加 `year` 限定年份、`order=score` 按热度 / `order=rank` 按 Hot 排序 | `tags`、`limit`(1–100)、`page`、`rating`、`year`、`order` |
| `danbooru_top_artists` | **参考权重算法（HOT 优先）**：HOT 区权重 3 → 一周收藏增长权重 2 → 全年新图权重 1 | `year`(必填)、`tags`、`limit`、`sample`、`hot_sample`、`rising_sample`、`rating`、`weighting`、`rank_by`、`include_total` |
| `danbooru_year_artists` | **整年总收藏算法（独立于 HOT）**：按月采样整年、按该年作品**总收藏数**降序排画师；默认 5% 体型 tag 闸门（只认体型 tag，不认构图） | `year`(必填)、`tags`、`rating`、`limit`、`monthly_sample`、`style_tags`、`style_preset`、`style_match`、`style_threshold`、`style_min_posts`、`style_min_hits`、`style_max_checks`、`compact` |
| `danbooru_search_tags` | tag 自动补全：规范名、分类、作品数 | `query`、`category`、`limit` |
| `danbooru_get_tag` | 单个 tag 详情 + wiki 摘要 + 别名/中日文名 | `name` |
| `danbooru_related_tags` | 共现相关 tag（含作品数、共现频率、余弦相似度） | `query`、`category`、`limit` |
| `danbooru_similar_artists` | **相似画师（tag 画像 + 表情画像）**：由种子画师的「特色 tag」与「表情 tag 画像」找候选，再按表情 tag 频率余弦重排 | `artist`(必填)、`limit`、`profile_tags`、`min_shared`、`examples`、`expression_tags`、`expression_weight` |
| `danbooru_artists_from_image` | **以图搜画师**：Agent 看图后给出 tag 分组，按分层优先级（人物→表情→绘制手法→色彩→tag；`mode="style"` 时手法/色彩优先）聚合该年画师 | `image_tags`(必填)、`person_tags`、`expression_tags`、`technique_tags`、`color_tags`、`mode`、`year`、`limit`、`examples`、`example_tags`、`allow_no_face` |
| `danbooru_get_post` | 单个作品：分类 tag 集 + 预览/大图/原图 URL | `id` |
| `danbooru_auth_status` | 看凭据是否已配置、来自哪里（不返回值） | 无 |
| `danbooru_save_credentials` | 把登录名与 API key 存进 Harness 凭据库（私有文件） | `login`、`apiKey`、`clear` |

典型用法：「初音未来的水手服怎么打 tag」→ `danbooru_search_tags("hatsune miku")` 拿到 `hatsune_miku` → `danbooru_get_tag("hatsune_miku")` 看 wiki 与别名 → `danbooru_related_tags("hatsune_miku")` 找常见服饰/构图 tag → `danbooru_search_posts(tags="hatsune_miku sailor_dress")` 看真实作品。

返回的图片 URL 可以直接交给 `read_image` 或 `web_fetch` 打开查看。

## 年份查询

D 站没有独立的「年份表」，年份过滤用的是 `date:` 元标签：`date:2025-01-01..2025-12-31`。注意三点：

- 单独写 `date:2025` 无效（返回 0 条），必须写完整日期范围；本插件的 `year` 参数会自动展开成范围并校验 2005–今年+1。
- D 站另有一个普通 tag `2025`（约 6,683 作品），含义是「以 2025 年为主题」的作品，**不代表**「2025 年发布」，不要拿它做年份筛选。
- `date:`、`rating:`、`order:` 都是元标签，**不占**真实 tag 额度；匿名/会员的 2/3 个 tag 限制只算真实 tag。

用法：

- 查某年某画师/角色的作品：`danbooru_search_posts(tags="gogogo_(gogogorx)", year=2025, order="score")`（配 `rating=all` 可放开分级）
- 查某年热门画师：`danbooru_top_artists(year=2025)` → 默认采样该年最高分的 200 张，按「总分 → 上榜作品数」排序；`tags` 可再限定角色/版权/主题，`sample` 调样本量（默认 200 = 1 次请求，上限 600 = 3 次请求），`rank_by` 切换口径（`total_score` 默认 / `avg_score` / `posts` 按高产），`include_total` 额外返回该年作品总数（多 1 次请求）
- 返回里每个画师都带 `posts`（样内作品数）、`total_score`、`avg_score`、`top_score` 和 `example`（最高分作品 id/链接/预览图）

## 参考权重（三级采样，默认开启）

`danbooru_top_artists` 默认按参考优先级给画师加权，模拟人工挑参考的顺序：

| 层级 | 数据源 | 权重 | 说明 |
|---|---|---|---|
| Hot | `posts.json?tags=order:rank`（D 站「Hot」页） | 3 | 只覆盖**近期上传**；过去年份查询会自动跳过，并在 `tiers.hot.skipped` 里说明 |
| 一周收藏增长 | `/explore/posts/popular.json?scale=week&date=<锚点>`（Popular 页周榜，按该周新增收藏排序） | 2 | 锚点：当年 = 今天；过去年份 = 该年 12-31 所在周。该接口不支持服务端 tag/rating 过滤，插件在客户端过滤 |
| 全年新图 | `posts.json`：最新一页 + 最高分一页（含 `date:` 年份与用户 tag） | 1 | 兜底采样：默认 2 次请求（200 张新图 + 200 张高分图），既覆盖全年又不丢新图 |
| 兜底（uniform 模式） | `posts.json` + `order:score` | 1 | 仅 `weighting="uniform"`：按分数采样全年图，无三级权重 |

- **排序默认 `reference_priority`**：HOT 命中数 → 周榜命中数 → 兜底样本数 → 总分（完全按你说的优先级）；`rank_by` 可切 `weighted_score`（Σ 权重×得分）/ `total_score` / `avg_score` / `posts`
- **同一画师尽量取新图**：`example` 是该画师采样到的最新作品，`top` 是最高分作品
- 每个画师返回 `artist_url`（D 站画师页；带年份时自动附 `date:YYYY-01-01..YYYY-12-31` 时间范围）、`tier_posts`（各层级命中数）、`weighted_posts`、`weighted_score`
- 成本：默认 4 次请求（Hot 1 + 周榜 1 + 兜底 2）；`hot_sample` / `rising_sample` 调样本量
- 注意：周榜以 R18 为主；默认 `rating=all` 时周榜正常生效，若把 `rating` 收窄到 `g` 会被过滤空（`tiers.rising.sampled = 0`）

## 整年总收藏算法（独立于 HOT）

`danbooru_year_artists` 是另一套算法，**不使用 HOT/周榜权重**，专门回答「某一年里哪些画师最受欢迎」：

- 数据源：`posts.json` 按月分批（`date:YYYY-MM-01..月末` + `order:favcount`），取每月收藏数最高的一批作品（默认 200 张 = 每月 1 次请求）
- 聚合：把样本内每张图的 `fav_count` 累加到画师身上，按**该年总收藏数**降序排名；同时给出 `artist_url`（画师页，自动带该年份 `date:` 范围）、`posts`（样本内作品数）、`avg_favorites`、`months`（覆盖月份数）、`best`（最高收藏作品）、`newest`（最新作品）
- 覆盖范围：过去年份 = 12 个月；当年 = 1 月到当前月；整年都算上，不做「最近才上传」的偏向
- 代价与偏差：总收藏是**样本估算**——每月只取收藏榜前 `monthly_sample` 张，榜外作品不计；因此会漏掉「刚上传还没积累收藏」的优秀图（这正是你要的取舍）
- 成本：每覆盖一个月 1 次请求（2025 年 = 12 次；2026 年 11 月 = 11 次）
- 默认 `rating=all`（**含 R18**，收藏/热榜的真实分布如此）；需要安全内容时显式传 `rating="g"`

## 风格占比测量（按 tag 比例标注，默认 5% 闸门）

想找「肉感画师」时，用 `style_tags` 或 `style_preset` 让工具核验并标注每位画师的风格 tag 占比：

- `style_preset="fleshy"` = `thick_thighs` + `plump` + `curvy` + `wide_hips` + `pear-shaped_figure`（**只用体型 tag**）
- 也可以传 `style_tags="thick_thighs,plump"`；`style_match="any"`（默认，命中任一即算）或 `"all"`（必须全中）
- **只认体型 tag，不认姿态/构图 tag**：`ass_focus` / `from_behind` / `bent_over` / `spread_legs` 这类构图不会算作肉感证据，只作为 `style.pose_posts` 诊断项返回——避免「构图肉」冒充「体型肉」
- **判定方式**：按总收藏从高到低核验候选画师——拉该画师**同一年**最多 100 张高收藏作品（1 次请求/人），算「带体型 tag 的图 / 核验图数」
- `style_threshold`：**默认 0.05（5%）**；传 0 则只测量不淘汰
- `style_min_hits`（默认 2）：至少要有 2 张带 tag 的图才可能通过，避免「1 张图刚好 2%」的噪声
- `style_min_posts`（默认 3）：该年作品少于这个数不做判定
- `style_max_checks`（默认 40）：最多核验多少位候选，够 `limit` 位就提前停
- `compact=true`：只返回名字/总收藏/作品数/风格占比，不返回作品引用，适合批量看比例
- 加了年份就只核验**该年份**的作品（`year` 本来就是必填）
- 返回里每位画师带 `style: { tags, match, threshold, min_hits, checked_posts, hit_posts, ratio, pose_posts, best }`；`best` = 该画师**带风格 tag 的**最高收藏作品（最多 3 张），可直接点开参考（"优先看带 tag 的图"）；顶层 `style_filter` 说明核验几人、通过几人
- 成本：基础每月 1 次请求 + 每核验 1 人 1 次请求（默认最多 40 次）

## 相似画师（tag 画像 + 表情画像）

`danbooru_similar_artists` 用 Danbooru 的 tag 共现数据找「风格相近」的画师（**不是图像 embedding**）：

1. 取种子画师的 `related_tag`，筛出「对 TA 高频、但全站不算通用」的 general tag（排除 `1girl`、`highres`、背景色等结构性 tag），作为风格画像（`profile_tags`，默认取 6 个）
2. **表情画像**：从种子画师的 tag 画像里挑出表情 tag（`smile`、`blush`、`open_mouth`、`half-closed_eyes`、`tongue_out` 等，`expression_tags` 默认 4 个），用它们把「表情习惯相近」的画师也拉进候选池
3. 对每个画像 tag 查 `related_tag&category=artist`，收集共享该 tag 的画师，按 `频率 × tag 稀有度` 加权累加
4. 候选 = 风格画像候选 ∪ 表情画像候选；表情候选必须通过「风格 tag 重叠检查」（同一批 `related_tag` 里能查到种子风格 tag），避免只表情像、画风完全不像
5. 最终分数：`(1 - expression_weight) × 风格分 + expression_weight × 表情余弦分`；表情余弦对表情 tag 频率做**稀有度加权**（`expression_weight` 默认 0.5）

- 成本：1 次（种子画像）+ `profile_tags` 次 + `expression_tags` 次 + 最多 `2 × limit` 次（表情余弦/风格重叠检查），默认约 1 + 6 + 4 + 20 = 31 次请求
- **例图软规则**：`examples>0` 时默认优先「带需求 tag（表情/体型）+ 能看到脸」的作品；只有用户明确要求背影、剪影、下半身特写等无脸构图时才传 `allow_no_face=true`；`example_tags` 可覆盖需求 tag，每条例图带 `matched_tags` 便于核对；没有可用样图的帖子会被跳过
- **题材降权**：相似度计算里 `furry` / `furry_female` / `furry_male` / `anthro` / `humanoid_furry` 的权重乘 **0.05**，避免兽向题材拉动画师相似度
- 局限：tag 层面的表情相似（用哪些表情、多常用）仍不等于「表情画法」相似（眼型、嘴形、腮红画法）；必须 `read_image` 目视后才能下结论
- 用法：`danbooru_similar_artists(artist="satou_kuuki", limit=10, examples=3)`

## 以图搜画师（图 → 画师）

`danbooru_artists_from_image` 把「以图搜画师」固化为**分层优先级检索**（插件没有视觉能力，由 Agent 看图后提供 tag 分组）：

| 维度 | 说明 | `mode="person"` 权重 | `mode="style"` 权重 |
|---|---|---|---|
| `person` 人物风格 | 体型比例、面部特征、角色设计 | 0.40 | 0.20 |
| `expression` 表情 | 表情 tag | 0.25 | 0.10 |
| `technique` 绘制手法 | 材质/上色/线条（`latex`、`shiny_clothes`…） | 0.20 | 0.40 |
| `color` 色彩 | 背景/主色/饱和度 | 0.10 | 0.25 |
| `tag` 泛 tag | 其余描述 tag | 0.05 | 0.05 |

- **强调「画风类似」**：用 `mode="style"` → 绘制手法 → 色彩 → 人物 → 表情 → tag
- **强调「人物方面」或未说明**：`mode="person"`（默认）→ 人物 → 表情 → 绘制手法 → 色彩 → tag
- 每个维度取前两个 tag 做一次「该年 + `order:score`」检索（100 条），按画师出现频率加权累加；空结果自动回退到单 tag 检索
- 成本：约 5–10 次请求（维度数 × 1–2 次）+ `examples` 次
- 用法：
  `danbooru_artists_from_image(image_tags="latex bodysuit, leopard_print", person_tags="huge_breasts, thick_thighs", expression_tags="closed_mouth, half-closed_eyes", technique_tags="latex, shiny_clothes", color_tags="white_background, blue_theme", year=2025, limit=10, examples=3)`
- 局限：仍是 tag 检索聚合，不是图像 embedding；最终必须 `read_image` 目视确认

## 输出约定（画师 vs 图片）

- **画师列表**：每位画师保留 **3 张例图**（不同作品），并**分行纵向排版**（每人一个块：渲染 / 体态 / 面部 / 主页 / 例图），不要用宽表格，避免被横向裁切
- **例图软规则**：默认优先取「带需求 tag（表情/体型）+ 能看到脸」的作品；只有用户明确要求背影、剪影、下半身特写等无脸构图时，才传 `allow_no_face=true` 允许无脸例图；`example_tags` 可覆盖需求 tag。`danbooru_similar_artists` 的 `examples` 会返回 `matched_tags` 便于核对
- **气质降权**：相似度计算里 `furry` / `furry_female` / `furry_male` / `anthro` / `humanoid_furry` 的权重乘 **0.05**，避免兽向题材拉动画师相似度
- **图片列表**：每张图保留 **1 张样图**即可
- **画风相似判定维度**（目视，不只看 tag）：
  1. **渲染**：上色/软硬阴影、高光与材质（乳胶、亮面布料）、饱和度与色调
  2. **体态**：胸腰臀/腿比例、肉感与脂肪分布、身高体型、常用姿态
  3. **面部特征与表情**：脸型、眼型/眼距/瞳孔高光、鼻嘴画法、腮红、常用表情（笑/半闭眼/吐舌/害羞等）
  4. **构图**：立绘/多视图/近景裁切等

## 凭据（登录后解除 2-tag 限制）

调用 `danbooru_save_credentials` 提供 `login` 与 `apiKey`：值写入 DSH 凭据库（`$DSH_HOME/.credentials.yaml`，仅当前系统用户可读），不会出现在插件配置或工具返回值里。插件每次请求都会重新解析凭据，保存后立即生效、无需重启。

- 查看状态：`danbooru_auth_status`（只报 configured / source / writable，不返回值）
- 移除：`danbooru_save_credentials({ clear: true })`
- 也可以用环境变量 `DANBOORU_LOGIN` / `DANBOORU_API_KEY`（启动环境或 `$DSH_HOME/.env`）；凭据库中的值优先。

## 合规与限速（内建）

- 每个请求都带可识别 `User-Agent`：`dsh-danbooru-tools/0.9.0 (DeepSeek Harness; <contact>)`。
- 所有请求走**单一串行闸门**，默认间隔 1.1 秒；遇到 429 会按 `Retry-After` 退避重试一次。
- 结果有内存 TTL 缓存（作品 5 分钟 / 自动补全 6 小时 / 相关 tag 1 小时 / wiki 24 小时），减少重复请求。
- **对 Danbooru 只读**：只发 GET 请求，不点赞、不收藏、不上传、不写 profile；不产生任何对站点的写入。

## 配置

全部可选。可用环境变量或 bundle patch 的 `config` 提供：

| 键 | 默认 | 说明 |
|---|---|---|
| `contact` | 空 | 加进 User-Agent 的身份说明，建议填 `user #12345` 或邮箱 |
| `minIntervalMs` | `1100` | 两次请求启动的最小间隔（毫秒） |
| `timeoutMs` | `20000` | 单请求超时 |
| `cacheTtlMs` | `600000` | 内存缓存寿命；`0` 关闭缓存 |
| `defaultRating` | `all` | 默认分级；`all` 含 R18，`g` 只看全年龄 |
| `maxWikiChars` | `4000` | `danbooru_get_tag` 返回的 wiki 摘要上限 |

环境变量：

| 变量 | 说明 |
|---|---|
| `DANBOORU_LOGIN` | Danbooru 用户名；与 API key 同时提供时提高限额（匿名最多 2 个 tag） |
| `DANBOORU_API_KEY` | 个人页的 API key |
| `DANBOORU_USER_AGENT` | 完整覆盖 User-Agent（仍要保留可识别身份） |
| `DANBOORU_CONTACT` | 等同 `contact` 配置项 |
| `DANBOORU_MIN_INTERVAL_MS` | 等同 `minIntervalMs` |

改 `config` 需要改本目录的 `cordis.patch.yml` 并重装 bundle；改环境变量则重启 DSH 即可。

## 卸载

`plugin_manager` 的 `remove_bundle`，或从 profile 的 `package.json` 里移除 `@local/dsh-danbooru-tools` 依赖与 `dsh.bundles` 条目后重启 DSH。装好后新会话可看到 10 个 `danbooru_*` 工具；之后改动只需 `plugin_manager` 关→开热重载。

## 自检

```bash
node verify.mjs
```

会真实请求各查询工具（工具注册、凭据降级、年份过滤、三级加权、整年总收藏、风格闸门、表情画像与余弦、例图软规则等 39 项检查）并校验返回结构与排序，约 2 分钟（受串行限速影响）。不产生写入。

## 已知限制

- 匿名搜索最多 2 个 tag（Danbooru 服务端限制）；错误信息会提示加凭据。
- 只读 ≠ 不能看图：插件只读 Danbooru、不提供图片下载工具，但**返回作品/样本 URL**（`urls.sample`、`preview_url` 等）。目视核验时由 Agent 用 `curl` / `pwsh` 从这些 URL 临时下载到本地、看完即删；插件自身不发起图片下载。

### 图片核验（Agent 侧工作流）

1. 用 `danbooru_search_posts`（`urls.sample`）或 `danbooru_year_artists`（`best` / `newest` / `style.best` 里的 `sample_url`）拿到可下载的样图 URL；
2. 用 `curl` 下载（CDN 有防盗链，**必须带 Referer**，否则 403）：
   `curl.exe -L -e "https://danbooru.donmai.us/" -o sample.jpg "<sample_url>"`
3. 用 `read_image` 查看；核验完删除临时文件（不进入插件目录、不长期保存）。

- 插件没有「批量下载图片」的工具；下载发生在 Agent 的 shell 侧，属于会话临时操作，不是插件能力。
- 内容分级**默认返回全部（含 R18）**；需要全年龄内容时显式传 `rating="g"`，结果可能不适合所有场景。
- wiki 摘要是截断后的纯文本，保留了 Danbooru 的 wiki 标记（如 `[[tag]]`），不是渲染后的富文本。

## 更新记录

- **0.9.0**：新增 `danbooru_artists_from_image`（以图搜画师，分层优先级：人物→表情→绘制手法→色彩→tag；`mode="style"` 时手法/色彩优先）
- **0.8.3**：清理过时文档（重复的安装章节、旧的自检耗时、工具数量），DSH 内与仓库说明同步为当前能力（表情画像/余弦、例图软规则、furry 降权）
- **0.8.2**：例图改为软规则（默认优先带脸，`allow_no_face=true` 放行无脸构图）；`furry` 类 tag 相似度权重 ×0.05；过滤无 `sample_url` 的例图
- **0.8.1**：例图强制匹配需求 tag 并跳过隐藏脸的构图（已由 0.8.2 改为软规则）
- **0.8.0**：相似画师新增表情画像、表情 tag 扩展、稀有度加权表情余弦与风格重叠检查
- **0.7.2**：例图按需附带样图 URL（`examples`）
- **0.7.0**：新增 `danbooru_similar_artists`（tag 画像相似画师）
