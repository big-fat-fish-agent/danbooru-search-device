# DSH-D绔欐悳绱㈣缃紙dsh-danbooru-tools锛?
缁?DeepSeek Harness 鐢ㄧ殑**鍙 Danbooru 宸ュ叿鎻掍欢**锛氱函 Host 鎻掍欢銆侀浂杩愯鏃朵緷璧栥€佷笉鍐欎换浣曟枃浠讹紝鍙敤瀹樻柟 JSON API銆?
> 鈿狅笍 **杩欐槸 DSH 鎻掍欢锛坆undle锛夛紝涓嶆槸鍙互鐩存帴鍙屽嚮/鍛戒护琛岃繍琛岀殑鏈湴绋嬪簭銆?* `index.js` 渚濊禆 DSH 娉ㄥ叆鐨?`ctx`锛堝伐鍏锋敞鍐屻€佸嚟鎹湇鍔★級锛岀洿鎺?`node index.js` 浼氭姤閿欙紝涔熸病鏈夌嫭绔?CLI锛涘繀椤绘寜涓嬮潰鐨勩€屽畨瑁呫€嶇珷鑺傝杩?DeepSeek Harness 鐨?profile 鎵嶈兘鐢紙鍚嶇О閲岀殑 `dsh-` 鍓嶇紑灏辨槸杩欎釜鎰忔€濓級銆?
> **AI 鍒朵綔璇存槑**锛氭湰椤圭洰鐢?**AI Agent**锛圖eepSeek Harness 涓殑浼氳瘽 Agent锛夎璁°€佸疄鐜颁笌娴嬭瘯鈥斺€斾唬鐮併€佹枃妗ｃ€佹绱㈢畻娉曚笌鑷鑴氭湰鍧囦负 AI 鐢熸垚锛屽苟缁忕湡瀹?API 璇锋眰楠岃瘉锛涗汉绫诲彧璐熻矗鎻愰渶姹備笌楠屾敹缁撴灉銆?
瀹冪殑鐩爣鏄€孉I 缁樼敾鎻愮ず璇嶈皟鐮?+ 鐢诲笀璋冪爺銆嶏細鎶婁竴涓ā绯婃兂娉曞彉鎴愬彲鐢ㄧ殑 Danbooru tag锛屽啀鐪嬬湡瀹炰綔鍝佸浣曠敤杩欎簺 tag锛涗篃鍙互鎸夋暣骞存€绘敹钘忔壘鐢诲笀锛堝甫浣撳瀷 tag 闂搁棬涓庡勾浠借寖鍥撮摼鎺ワ級锛屾垨鐢?HOT / 鍛ㄦ / 鍙傝€冩潈閲嶄笁绾ч噰鏍锋壘鍙傝€冪敾甯堛€?
## 瀹囧畽鍏嶈矗澹版槑锛圕osmic Disclaimer锛?
> 鏈彃浠舵槸銆屾煡璇㈡惉鐮栧伐銆嶏紝涓嶆槸鍐呭鎻愪緵鑰咃紱瀹冨彧璐熻矗鎶?Danbooru 鐨勫叕寮€妫€绱㈢粨鏋滄惉杩囨潵銆?
1. **鐗堟潈褰掑睘**锛氭墍鏈変綔鍝佷笌鏁版嵁鏉ヨ嚜 Danbooru 鍏紑 API锛岀増鏉冨綊鍚勭敾甯堛€佹潈鍒╀汉涓?Danbooru 鎵€鏈夛紱鏈」鐩笉瀛樺偍銆佷笉杞敭銆佷笉鍐嶅垎鍙戜换浣曞浘鐗囥€?2. **浣跨敤鑼冨洿**锛氫粎渚涗釜浜哄涔犮€佺爺绌朵笌 AI 缁樼敾鎻愮ず璇嶅弬鑰冿紱璇烽伒瀹?Danbooru 鏈嶅姟鏉℃涓庡綋鍦版硶寰嬨€傛彃浠跺唴缃覆琛岄檺閫燂細**鍖垮悕 1.1 绉?/ 鐧诲綍鍚?0.4 绉?*锛堜粛杩滀綆浜?D 绔欑害 10 娆?绉掍笂闄愶級鈥斺€斿埆鎷垮畠鍘?D 绔欏埛灞忥紝琚檺娴佷簡鑷繁鏀?`minIntervalMs` 鍐烽潤涓€涓嬨€?3. **鍑嵁瀹夊叏**锛欰PI key 鍙瓨鍦ㄤ綘鏈満鐨?DSH 鍑嵁搴擄紙owner-only锛夛紝鎻掍欢涓嶆敹闆嗐€佷笉涓婁紶銆佷笉鎵撳嵃銆佷笉鍐欒繘缂撳瓨/浠撳簱/鍙戝竷鍖呫€?4. **缁撴灉涓嶄繚璇?*锛氭绱㈡槸 tag 棰戠巼/鏀惰棌鏁扮殑鍚彂寮忥紝鍙兘涓嶅噯銆佸彲鑳借繃鏃躲€佸彲鑳姐€岃繃浜庡啓瀹?鏈夌偣 3D銆嶁€斺€旇繖灞炰簬姝ｅ父娉㈠姩锛屼笉鏄彃浠跺湪閽堝浣犮€?5. **渚垫潈澶勭悊**锛氬鏋滀綘鏄潈鍒╀汉鎴栧彂鐜拌鏍囷紝娆㈣繋鎻?issue 鎴栬仈绯讳綔鑰咃紱鎴戜滑浼氬湪璺戣矾涔嬪墠鍏堥厤鍚堜笅鏋?淇锛堥『搴忓緢閲嶈锛夈€?6. **璺戣矾鏉℃**锛氳嫢鍥犱娇鐢ㄦ湰鎻掍欢浜х敓浠讳綍浜夎銆佺储璧斻€侀檺娴併€佸皝鍙枫€佷笘鐣屾湯鏃ユ垨瀹囧畽鐑瘋锛屼綔鑰咃紙AI Agent 鍙婂叾浜虹被鐢叉柟锛夊皢鍦?**0.5 绉掑唴鍘熷湴璺戣矾**锛屼笉鎵挎媴浠讳綍璐ｄ换锛涘眾鏃舵湰鍏嶈矗澹版槑鑷姩鍗囩骇涓恒€屽畤瀹欑骇銆嶏紝骞朵繚鐣欐渶缁堣В閲婃潈锛堣В閲婃潈涔熶細涓€璧疯窇璺級銆?
鈥斺€?绁濊皟鍙傛剦蹇紝鏀惰棌姘告定 馃搱

## 澶ц嚧浣跨敤鏁欑▼锛堟埅鍥剧増锛?
> 鈿狅笍 **杩欏彧鏄€屽ぇ鑷存暀绋嬨€?*锛氭埅鍥炬潵鑷彃浠跺紑鍙戣皟璇曟椂鐨勭湡瀹炰細璇濓紝浠呮紨绀恒€屾€庝箞鎻愰棶 / 宸ュ叿杈撳嚭闀夸粈涔堟牱銆嶏紝涓嶆槸涓ユ牸姝ラ鏂囨。锛涘叿浣撳弬鏁般€佸勾浠藉拰缁撴灉浠ュ疄闄呮煡璇负鍑嗐€?
**鈶?浠ュ浘鎼滅敾甯堬細缁欏畠涓€寮犲浘锛屾壘鐢婚鐩歌繎鐨勭敾甯?*

![浠ュ浘鎼滅敾甯堢ず渚媇(docs/tutorial/01-image-to-artist.png)

**鈶?鎸夊勾浠芥壘銆岀儹闂?+ 鑹插僵鑹充附 + 浜虹墿娌逛寒涓版弧銆嶇殑浣滃搧**

![骞村害鑹插僵鑹充附浣滃搧绀轰緥](docs/tutorial/02-year-colorful-posts.png)

**鈶?鎵俱€岀敾椋庤创杩戞煇鐢诲笀銆嶄笖闄愬畾涓婁紶骞翠唤锛?025锛?*

![鐩镐技鐢诲笀 + 骞翠唤闄愬畾绀轰緥](docs/tutorial/03-similar-artists-2025.png)

## 瀹夎锛圖SH profile锛?
鏈彃浠舵槸 DSH bundle锛堢函 Host銆侀浂杩愯鏃朵緷璧栵級锛屼互涓嬩笁绉嶆柟寮忎换閫夊叾涓€銆傞娆¤瀹岄渶閲嶅惎 DSH锛涗箣鍚庢洿鏂版彃浠舵枃浠跺彧闇€鍦?`plugin_manager` 閲屽叧鈫掑紑鐑噸杞斤紝涓嶇敤閲嶅惎銆?
### 鏂规 A锛氫笅杞藉寘锛堟帹鑽愶紝涓嶉渶瑕?git锛?
1. 涓嬭浇鏈€鏂?zip锛歔Releases 鈫?v0.12.1 鈫?`danbooru-tools-0.12.1.zip`](https://github.com/big-fat-fish-agent/danbooru-search-device/releases/latest)
2. 瑙ｅ帇鍒颁换鎰忕洰褰曪紝寰楀埌 `danbooru-tools/`
3. 瀹夎锛氬 Agent 璇淬€岀敤 `plugin_manager` 鐨?`install_bundle` 瀹夎 `<瑙ｅ帇鐩綍缁濆璺緞>`銆嶏紝鎴栧湪 DSH 鎻掍欢绠＄悊鐣岄潰閫夋嫨璇ョ洰褰?4. 閲嶅惎 DSH

- 閫傚悎锛氫笉鎯宠 git銆佸彧鎯宠兘鐢?- 鏇存柊鏂瑰紡锛氶噸鏂颁笅杞?zip 瑕嗙洊鐩綍 鈫?鍏斥啋寮€鐑噸杞?
### 鏂规 B锛欸it 鍏嬮殕 + profile link锛堟帹鑽愰暱鏈熶娇鐢?/ 浜屾寮€鍙戯級

1. `git clone https://github.com/big-fat-fish-agent/danbooru-search-device.git`
2. 鍦?`$DSH_HOME/profiles/<profile>/package.json` 鐨?`dependencies` 閲屽姞锛歚"@local/dsh-danbooru-tools": "link:<鍏嬮殕璺緞>"`
3. 鎶?`"@local/dsh-danbooru-tools"` 鍔犺繘鍚屼竴鏂囦欢鐨?`dsh.bundles` 鍒楄〃
4. 閲嶅惎 DSH

- 閫傚悎锛氭兂璺熻釜鏇存柊銆佹敼浠ｇ爜銆佺湅 git 鍘嗗彶
- 鏇存柊鏂瑰紡锛歚git pull` 鈫?鍏斥啋寮€鐑噸杞斤紙涓嶇敤閲嶈锛?
### 鏂规 C锛欸itHub 婧愮爜 zip锛圧elease 涓嶅彲鐢ㄦ椂鐨勫厹搴曪級

浠撳簱椤?**Code 鈫?Download ZIP**锛岃В鍘嬪悗鎸?**鏂规 A 鐨勭 3鈥? 姝?*瀹夎銆傚唴瀹逛笌 Release 鍖呯浉鍚岋紝鍙槸涓嶅甫鐗堟湰鍙锋爣璁般€?
### 鍗歌浇

`plugin_manager` 鐨?`remove_bundle`锛涙垨鍒犻櫎 profile `package.json` 閲岀殑渚濊禆涓?`dsh.bundles` 鏉＄洰鍚庨噸鍚?DSH銆?
瑁呭ソ鍚庡彲閫夎嚜妫€锛歚node verify.mjs`锛堢害 3鈥? 鍒嗛挓锛岀湡瀹炶姹傦紝涓嶅啓鏂囦欢锛夈€?
## 宸ュ叿

| 宸ュ叿 | 浣滅敤 | 涓昏鍙傛暟 |
|---|---|---|
| `danbooru_search_posts` | 鎸?tag 鎼滅储浣滃搧锛岃繑鍥炴寜鍒嗙被鎷嗗ソ鐨?tag 闆嗕笌鍥剧墖 URL锛涘彲鍔?`year` 闄愬畾骞翠唤銆乣order=score` 鎸夌儹搴?/ `order=rank` 鎸?Hot 鎺掑簭 | `tags`銆乣limit`(1鈥?00)銆乣page`銆乣rating`銆乣year`銆乣order` |
| `danbooru_top_artists` | **鍙傝€冩潈閲嶇畻娉曪紙HOT 浼樺厛锛?*锛欻OT 鍖烘潈閲?3 鈫?涓€鍛ㄦ敹钘忓闀挎潈閲?2 鈫?鍏ㄥ勾鏂板浘鏉冮噸 1 | `year`(蹇呭～)銆乣tags`銆乣limit`銆乣sample`銆乣hot_sample`銆乣rising_sample`銆乣rating`銆乣weighting`銆乣rank_by`銆乣include_total` |
| `danbooru_year_artists` | **鏁村勾鎬绘敹钘忕畻娉曪紙鐙珛浜?HOT锛?*锛氭寜鏈堥噰鏍锋暣骞淬€佹寜璇ュ勾浣滃搧**鎬绘敹钘忔暟**闄嶅簭鎺掔敾甯堬紱榛樿 5% 浣撳瀷 tag 闂搁棬锛堝彧璁や綋鍨?tag锛屼笉璁ゆ瀯鍥撅級锛涘彲閫夊姞鑲よ壊/鑲よ川銆屼汉浣撳弬鑰冦€嶅拰銆屾暣浣撹壊璋冦€嶅弬鑰?| `year`(蹇呭～)銆乣tags`銆乣rating`銆乣limit`銆乣monthly_sample`銆乣style_tags`銆乣style_preset`銆乣style_match`銆乣style_threshold`銆乣style_min_posts`銆乣style_min_hits`銆乣style_max_checks`銆乣appearance_tags`銆乣appearance_match`銆乣appearance_threshold`銆乣color_tags`銆乣color_match`銆乣color_threshold`銆乣compact` |
| `danbooru_search_tags` | tag 鑷姩琛ュ叏锛氳鑼冨悕銆佸垎绫汇€佷綔鍝佹暟 | `query`銆乣category`銆乣limit` |
| `danbooru_get_tag` | 鍗曚釜 tag 璇︽儏 + wiki 鎽樿 + 鍒悕/涓棩鏂囧悕 | `name` |
| `danbooru_related_tags` | 鍏辩幇鐩稿叧 tag锛堝惈浣滃搧鏁般€佸叡鐜伴鐜囥€佷綑寮︾浉浼煎害锛?| `query`銆乣category`銆乣limit` |
| `danbooru_similar_artists` | **鐩镐技鐢诲笀锛坱ag 鐢诲儚 + 琛ㄦ儏鐢诲儚锛?*锛氱敱绉嶅瓙鐢诲笀鐨勩€岀壒鑹?tag銆嶄笌銆岃〃鎯?tag 鐢诲儚銆嶆壘鍊欓€夛紝鍐嶆寜琛ㄦ儏 tag 棰戠巼浣欏鸡閲嶆帓 | `artist`(蹇呭～)銆乣limit`銆乣profile_tags`銆乣min_shared`銆乣examples`銆乣expression_tags`銆乣expression_weight` |
| `danbooru_artists_from_image` | **浠ュ浘鎼滅敾甯?*锛欰gent 鐪嬪浘鍚庣粰鍑?tag 鍒嗙粍锛屾寜鍒嗗眰浼樺厛绾э紙浜虹墿鈫掕〃鎯呪啋缁樺埗鎵嬫硶鈫掔嚎鏉♀啋鑹插僵鈫掑厜鐓р啋tag锛沗mode="style"` 鏃舵墜娉?绾挎潯/鑹插僵/鍏夌収浼樺厛锛夎仛鍚堢敾甯?| `image_tags`(蹇呭～)銆乣person_tags`銆乣expression_tags`銆乣technique_tags`銆乣lineart_tags`銆乣color_tags`銆乣lighting_tags`銆乣mode`銆乣year`銆乣limit`銆乣examples`銆乣example_tags`銆乣allow_no_face` |
| `danbooru_style_match` | **鏁翠綋鐢婚鍖归厤锛堢敾椋庝紭鍏堬紝瑙掕壊鍙€夛級**锛氶粯璁?`mode="style"` 涓嶇敤瑙掕壊 tag鈥斺€擿style_tags`锛堢嚎/涓婅壊/鑹茶皟/鏉愯川锛? `subject_tags`锛堜綋鍨?鑲よ壊/鑴哥瓑銆屼汉鐗╃被鍨嬨€嶏級+ `genre_tags` 鎵叏绔欓珮鍒嗕綔鍝侊紝骞跺仛 `鐢婚脳鐢婚 / 鐢婚脳浜虹墿绫诲瀷 / 鐢婚脳棰樻潗` 閰嶅锛屽啀鎸?`鐢诲笀脳閿氱偣鐢婚 tag` 鏍搁獙骞堕檮渚嬪浘锛沗mode="character"` 鎵嶇敤瑙掕壊閿氬畾銆傝緭鍑哄叚椤圭洰瑙嗘牳瀵规竻鍗曚笌 `prefer_artists`/`avoid_artists` 杩唬鎺ュ彛銆?*灏忎綋閲忕敾甯?*锛歴tyle-tag 鍏辩幇锛坮elated_tag锛夐€氶亾浼氭妸浣庣儹搴︾敾甯堟媺杩涘€欓€夛紙鈮min_artist_posts` 榛樿 50 甯栵級锛宍small_artist_slots`锛堥粯璁?3锛変负瀹冧滑淇濈暀鍚嶉锛沗seed_artists` 鍙樉寮忕偣鍚嶅皬鐢诲笀锛堝 `eigaka`锛夛紝寮哄埗绾冲叆骞舵寜鍚屾 style/genre 璁＄畻鍚诲悎搴?| `mode`銆乣style_tags`銆乣subject_tags`銆乣genre_tags`銆乣character`(浠?`mode="character"`)銆乣year`銆乣rating`銆乣limit`銆乣per_query`銆乣examples`銆乣prefer_artists`銆乣avoid_artists`銆乣verify_same_character`銆乣discover_small_artists`銆乣min_artist_posts`銆乣small_artist_slots`銆乣seed_artists` |
| `danbooru_image_artist_consensus` | **澶氭柟妗堝叡璇?*锛氳瀺鍚堝涓绱㈡柟妗堬紙style_match / artists_from_image / similar_artists锛夌殑鍊欓€夊悕鍗曪紝鍙繚鐣欒 鈮min_hits` 涓柟妗堝悓鏃跺懡涓殑鐢诲笀锛岃繃婊ゅ崟鏂规璇垽锛涙棤浜ら泦鏃惰繑鍥為儴鍒嗛噸鍙犳骞舵爣 `fallback_used=true` | `lists`(蹇呭～, JSON 鏁扮粍)銆乣source_names`銆乣min_hits`銆乣limit`銆乣examples`銆乣example_tags`銆乣allow_no_face` |
| `danbooru_part_specialists` | **閮ㄤ綅鐗瑰寲鎼滅储**锛氭寜閮ㄤ綅鐒︾偣 tag锛坄hand_focus`/`foot_focus`/`thigh_focus`鈥︼級妫€绱㈣閮ㄤ綅楂樻敹钘忎綔鍝侊紝鎸夋敹钘忚仛鍚堢敾甯堟帓鍚嶏紝骞惰繑鍥為儴浣嶉珮鏀惰棌鍥剧墖 | `part`(蹇呭～)銆乣year`銆乣rating`銆乣artists_limit`銆乣posts_limit`銆乣sample`銆乣min_posts`銆乣rank_by`銆乣include_posts` |
| `danbooru_get_post` | 鍗曚釜浣滃搧锛氬垎绫?tag 闆?+ 棰勮/澶у浘/鍘熷浘 URL | `id` |
| `danbooru_auth_status` | 鐪嬪嚟鎹槸鍚﹀凡閰嶇疆銆佹潵鑷摢閲岋紙涓嶈繑鍥炲€硷級 | 鏃?|
| `danbooru_save_credentials` | 鎶婄櫥褰曞悕涓?API key 瀛樿繘 Harness 鍑嵁搴擄紙绉佹湁鏂囦欢锛?| `login`銆乣apiKey`銆乣clear` |

鍏稿瀷鐢ㄦ硶锛氥€屽垵闊虫湭鏉ョ殑姘存墜鏈嶆€庝箞鎵?tag銆嶁啋 `danbooru_search_tags("hatsune miku")` 鎷垮埌 `hatsune_miku` 鈫?`danbooru_get_tag("hatsune_miku")` 鐪?wiki 涓庡埆鍚?鈫?`danbooru_related_tags("hatsune_miku")` 鎵惧父瑙佹湇楗?鏋勫浘 tag 鈫?`danbooru_search_posts(tags="hatsune_miku sailor_dress")` 鐪嬬湡瀹炰綔鍝併€?
杩斿洖鐨勫浘鐗?URL 鍙互鐩存帴浜ょ粰 `read_image` 鎴?`web_fetch` 鎵撳紑鏌ョ湅銆?
## 骞翠唤鏌ヨ

D 绔欐病鏈夌嫭绔嬬殑銆屽勾浠借〃銆嶏紝骞翠唤杩囨护鐢ㄧ殑鏄?`date:` 鍏冩爣绛撅細`date:2025-01-01..2025-12-31`銆傛敞鎰忎笁鐐癸細

- 鍗曠嫭鍐?`date:2025` 鏃犳晥锛堣繑鍥?0 鏉★級锛屽繀椤诲啓瀹屾暣鏃ユ湡鑼冨洿锛涙湰鎻掍欢鐨?`year` 鍙傛暟浼氳嚜鍔ㄥ睍寮€鎴愯寖鍥村苟鏍￠獙 2005鈥撲粖骞?1銆?- D 绔欏彟鏈変竴涓櫘閫?tag `2025`锛堢害 6,683 浣滃搧锛夛紝鍚箟鏄€屼互 2025 骞翠负涓婚銆嶇殑浣滃搧锛?*涓嶄唬琛?*銆?025 骞村彂甯冦€嶏紝涓嶈鎷垮畠鍋氬勾浠界瓫閫夈€?- `date:`銆乣rating:`銆乣order:` 閮芥槸鍏冩爣绛撅紝**涓嶅崰**鐪熷疄 tag 棰濆害锛涘尶鍚?浼氬憳鐨?2/3 涓?tag 闄愬埗鍙畻鐪熷疄 tag銆?
鐢ㄦ硶锛?
- 鏌ユ煇骞存煇鐢诲笀/瑙掕壊鐨勪綔鍝侊細`danbooru_search_posts(tags="gogogo_(gogogorx)", year=2025, order="score")`锛堥厤 `rating=all` 鍙斁寮€鍒嗙骇锛?- 鏌ユ煇骞寸儹闂ㄧ敾甯堬細`danbooru_top_artists(year=2025)` 鈫?榛樿閲囨牱璇ュ勾鏈€楂樺垎鐨?200 寮狅紝鎸夈€屾€诲垎 鈫?涓婃浣滃搧鏁般€嶆帓搴忥紱`tags` 鍙啀闄愬畾瑙掕壊/鐗堟潈/涓婚锛宍sample` 璋冩牱鏈噺锛堥粯璁?200 = 1 娆¤姹傦紝涓婇檺 600 = 3 娆¤姹傦級锛宍rank_by` 鍒囨崲鍙ｅ緞锛坄total_score` 榛樿 / `avg_score` / `posts` 鎸夐珮浜э級锛宍include_total` 棰濆杩斿洖璇ュ勾浣滃搧鎬绘暟锛堝 1 娆¤姹傦級
- 杩斿洖閲屾瘡涓敾甯堥兘甯?`posts`锛堟牱鍐呬綔鍝佹暟锛夈€乣total_score`銆乣avg_score`銆乣top_score` 鍜?`example`锛堟渶楂樺垎浣滃搧 id/閾炬帴/棰勮鍥撅級

## 鍙傝€冩潈閲嶏紙涓夌骇閲囨牱锛岄粯璁ゅ紑鍚級

`danbooru_top_artists` 榛樿鎸夊弬鑰冧紭鍏堢骇缁欑敾甯堝姞鏉冿紝妯℃嫙浜哄伐鎸戝弬鑰冪殑椤哄簭锛?
| 灞傜骇 | 鏁版嵁婧?| 鏉冮噸 | 璇存槑 |
|---|---|---|---|
| Hot | `posts.json?tags=order:rank`锛圖 绔欍€孒ot銆嶉〉锛?| 3 | 鍙鐩?*杩戞湡涓婁紶**锛涜繃鍘诲勾浠芥煡璇細鑷姩璺宠繃锛屽苟鍦?`tiers.hot.skipped` 閲岃鏄?|
| 涓€鍛ㄦ敹钘忓闀?| `/explore/posts/popular.json?scale=week&date=<閿氱偣>`锛圥opular 椤靛懆姒滐紝鎸夎鍛ㄦ柊澧炴敹钘忔帓搴忥級 | 2 | 閿氱偣锛氬綋骞?= 浠婂ぉ锛涜繃鍘诲勾浠?= 璇ュ勾 12-31 鎵€鍦ㄥ懆銆傝鎺ュ彛涓嶆敮鎸佹湇鍔＄ tag/rating 杩囨护锛屾彃浠跺湪瀹㈡埛绔繃婊?|
| 鍏ㄥ勾鏂板浘 | `posts.json`锛氭渶鏂颁竴椤?+ 鏈€楂樺垎涓€椤碉紙鍚?`date:` 骞翠唤涓庣敤鎴?tag锛?| 1 | 鍏滃簳閲囨牱锛氶粯璁?2 娆¤姹傦紙200 寮犳柊鍥?+ 200 寮犻珮鍒嗗浘锛夛紝鏃㈣鐩栧叏骞村張涓嶄涪鏂板浘 |
| 鍏滃簳锛坲niform 妯″紡锛?| `posts.json` + `order:score` | 1 | 浠?`weighting="uniform"`锛氭寜鍒嗘暟閲囨牱鍏ㄥ勾鍥撅紝鏃犱笁绾ф潈閲?|

- **鎺掑簭榛樿 `reference_priority`**锛欻OT 鍛戒腑鏁?鈫?鍛ㄦ鍛戒腑鏁?鈫?鍏滃簳鏍锋湰鏁?鈫?鎬诲垎锛堝畬鍏ㄦ寜浣犺鐨勪紭鍏堢骇锛夛紱`rank_by` 鍙垏 `weighted_score`锛埼?鏉冮噸脳寰楀垎锛? `total_score` / `avg_score` / `posts`
- **鍚屼竴鐢诲笀灏介噺鍙栨柊鍥?*锛歚example` 鏄鐢诲笀閲囨牱鍒扮殑鏈€鏂颁綔鍝侊紝`top` 鏄渶楂樺垎浣滃搧
- 姣忎釜鐢诲笀杩斿洖 `artist_url`锛圖 绔欑敾甯堥〉锛涘甫骞翠唤鏃惰嚜鍔ㄩ檮 `date:YYYY-01-01..YYYY-12-31` 鏃堕棿鑼冨洿锛夈€乣tier_posts`锛堝悇灞傜骇鍛戒腑鏁帮級銆乣weighted_posts`銆乣weighted_score`
- 鎴愭湰锛氶粯璁?4 娆¤姹傦紙Hot 1 + 鍛ㄦ 1 + 鍏滃簳 2锛夛紱`hot_sample` / `rising_sample` 璋冩牱鏈噺
- 娉ㄦ剰锛氬懆姒滀互 R18 涓轰富锛涢粯璁?`rating=all` 鏃跺懆姒滄甯哥敓鏁堬紝鑻ユ妸 `rating` 鏀剁獎鍒?`g` 浼氳杩囨护绌猴紙`tiers.rising.sampled = 0`锛?
## 鏁村勾鎬绘敹钘忕畻娉曪紙鐙珛浜?HOT锛?
`danbooru_year_artists` 鏄彟涓€濂楃畻娉曪紝**涓嶄娇鐢?HOT/鍛ㄦ鏉冮噸**锛屼笓闂ㄥ洖绛斻€屾煇涓€骞撮噷鍝簺鐢诲笀鏈€鍙楁杩庛€嶏細

- 鏁版嵁婧愶細`posts.json` 鎸夋湀鍒嗘壒锛坄date:YYYY-MM-01..鏈堟湯` + `order:favcount`锛夛紝鍙栨瘡鏈堟敹钘忔暟鏈€楂樼殑涓€鎵逛綔鍝侊紙榛樿 200 寮?= 姣忔湀 1 娆¤姹傦級
- 鑱氬悎锛氭妸鏍锋湰鍐呮瘡寮犲浘鐨?`fav_count` 绱姞鍒扮敾甯堣韩涓婏紝鎸?*璇ュ勾鎬绘敹钘忔暟**闄嶅簭鎺掑悕锛涘悓鏃剁粰鍑?`artist_url`锛堢敾甯堥〉锛岃嚜鍔ㄥ甫璇ュ勾浠?`date:` 鑼冨洿锛夈€乣posts`锛堟牱鏈唴浣滃搧鏁帮級銆乣avg_favorites`銆乣months`锛堣鐩栨湀浠芥暟锛夈€乣best`锛堟渶楂樻敹钘忎綔鍝侊級銆乣newest`锛堟渶鏂颁綔鍝侊級
- 瑕嗙洊鑼冨洿锛氳繃鍘诲勾浠?= 12 涓湀锛涘綋骞?= 1 鏈堝埌褰撳墠鏈堬紱鏁村勾閮界畻涓婏紝涓嶅仛銆屾渶杩戞墠涓婁紶銆嶇殑鍋忓悜
- 浠ｄ环涓庡亸宸細鎬绘敹钘忔槸**鏍锋湰浼扮畻**鈥斺€旀瘡鏈堝彧鍙栨敹钘忔鍓?`monthly_sample` 寮狅紝姒滃浣滃搧涓嶈锛涘洜姝や細婕忔帀銆屽垰涓婁紶杩樻病绉疮鏀惰棌銆嶇殑浼樼鍥撅紙杩欐鏄綘瑕佺殑鍙栬垗锛?- 鎴愭湰锛氭瘡瑕嗙洊涓€涓湀 1 娆¤姹傦紙2025 骞?= 12 娆★紱2026 骞?11 鏈?= 11 娆★級
- 榛樿 `rating=all`锛?*鍚?R18**锛屾敹钘?鐑鐨勭湡瀹炲垎甯冨姝わ級锛涢渶瑕佸畨鍏ㄥ唴瀹规椂鏄惧紡浼?`rating="g"`

## 椋庢牸鍗犳瘮娴嬮噺锛堟寜 tag 姣斾緥鏍囨敞锛岄粯璁?5% 闂搁棬锛?
鎯虫壘銆岃倝鎰熺敾甯堛€嶆椂锛岀敤 `style_tags` 鎴?`style_preset` 璁╁伐鍏锋牳楠屽苟鏍囨敞姣忎綅鐢诲笀鐨勯鏍?tag 鍗犳瘮锛?
- `style_preset="fleshy"` = `thick_thighs` + `plump` + `curvy` + `wide_hips` + `pear-shaped_figure`锛?*鍙敤浣撳瀷 tag**锛?- 涔熷彲浠ヤ紶 `style_tags="thick_thighs,plump"`锛沗style_match="any"`锛堥粯璁わ紝鍛戒腑浠讳竴鍗崇畻锛夋垨 `"all"`锛堝繀椤诲叏涓級
- **鍙浣撳瀷 tag锛屼笉璁ゅЭ鎬?鏋勫浘 tag**锛歚ass_focus` / `from_behind` / `bent_over` / `spread_legs` 杩欑被鏋勫浘涓嶄細绠椾綔鑲夋劅璇佹嵁锛屽彧浣滀负 `style.pose_posts` 璇婃柇椤硅繑鍥炩€斺€旈伩鍏嶃€屾瀯鍥捐倝銆嶅啋鍏呫€屼綋鍨嬭倝銆?- **鍒ゅ畾鏂瑰紡**锛氭寜鎬绘敹钘忎粠楂樺埌浣庢牳楠屽€欓€夌敾甯堚€斺€旀媺璇ョ敾甯?*鍚屼竴骞?*鏈€澶?100 寮犻珮鏀惰棌浣滃搧锛? 娆¤姹?浜猴級锛岀畻銆屽甫浣撳瀷 tag 鐨勫浘 / 鏍搁獙鍥炬暟銆?- `style_threshold`锛?*榛樿 0.05锛?%锛?*锛涗紶 0 鍒欏彧娴嬮噺涓嶆窐姹?- `style_min_hits`锛堥粯璁?2锛夛細鑷冲皯瑕佹湁 2 寮犲甫 tag 鐨勫浘鎵嶅彲鑳介€氳繃锛岄伩鍏嶃€? 寮犲浘鍒氬ソ 2%銆嶇殑鍣０
- `style_min_posts`锛堥粯璁?3锛夛細璇ュ勾浣滃搧灏戜簬杩欎釜鏁颁笉鍋氬垽瀹?- `style_max_checks`锛堥粯璁?40锛夛細鏈€澶氭牳楠屽灏戜綅鍊欓€夛紝澶?`limit` 浣嶅氨鎻愬墠鍋?- `compact=true`锛氬彧杩斿洖鍚嶅瓧/鎬绘敹钘?浣滃搧鏁?椋庢牸鍗犳瘮锛屼笉杩斿洖浣滃搧寮曠敤锛岄€傚悎鎵归噺鐪嬫瘮渚?- 鍔犱簡骞翠唤灏卞彧鏍搁獙**璇ュ勾浠?*鐨勪綔鍝侊紙`year` 鏈潵灏辨槸蹇呭～锛?- 杩斿洖閲屾瘡浣嶇敾甯堝甫 `style: { tags, match, threshold, min_hits, checked_posts, hit_posts, ratio, pose_posts, best }`锛沗best` = 璇ョ敾甯?*甯﹂鏍?tag 鐨?*鏈€楂樻敹钘忎綔鍝侊紙鏈€澶?3 寮狅級锛屽彲鐩存帴鐐瑰紑鍙傝€冿紙"浼樺厛鐪嬪甫 tag 鐨勫浘"锛夛紱椤跺眰 `style_filter` 璇存槑鏍搁獙鍑犱汉銆侀€氳繃鍑犱汉

## 浜轰綋闄勫姞鍙傝€冿紙鑲よ壊 / 鐨偆璐ㄦ劅锛?
浣撳瀷涔嬪锛宍danbooru_year_artists` 杩樻敮鎸佸湪**鍚屼竴鎵规牳楠屼綔鍝?*涓婄粺璁°€屼汉浣撳弬鑰冦€峵ag锛屼笉棰濆鍙戣姹傦細

- `appearance_tags`锛氶€楀彿/绌烘牸鍒嗛殧锛屼緥濡?`pale_skin, shiny_skin`
  - 鑲よ壊锛歚pale_skin`銆乣dark_skin`銆乣tan`銆乣tanlines`銆乣grey_skin`銆乣blue_skin`鈥?  - 鐨偆璐ㄦ劅锛歚shiny_skin`銆乣sweat`銆乣wet`銆乣oiled_skin`銆乣lotion`銆乣dimples_of_venus`鈥?  - **涓嶅惈鐪肩潧棰滆壊**锛氱溂鐫涘睘浜庤鑹茬壒寰侊紝鏁翠綋瑙嗚鍙傝€冭鐢ㄤ笅闈㈢殑 `color_tags`
- `appearance_match`锛歚any`锛堥粯璁わ紝鍛戒腑浠讳竴鍗崇畻锛夋垨 `all`锛堝繀椤诲叏涓級
- `appearance_threshold`锛氶粯璁?0 = **鍙粺璁′笉娣樻卑**锛涗紶 0.1~0.3 杩欑被姣斾緥鎵嶆寜銆屽甫鍙傝€?tag 鐨勫崰姣斻€嶅姞涓€閬撻椄闂?- 杩斿洖閲屾瘡浣嶇敾甯堝甫 `appearance: { tags, match, threshold, checked_posts, hit_posts, ratio, per_tag, best }`
  - `per_tag`锛氭瘡涓弬鑰?tag 鍦ㄦ牳楠屼綔鍝侀噷鐨勫懡涓暟锛堟瘮濡?`shiny_skin: 6`锛?  - `best`锛氬甫鍙傝€?tag 鐨勬渶楂樻敹钘忎綔鍝侊紙鏈€澶?3 寮狅級锛屽彲鐩存帴鐐瑰紑鐪嬭偆鑹?鑲よ川鏄惁鐪熺殑璐村悎
- 椤跺眰 `appearance_filter` 涓?`style_filter` 骞跺垪锛岃鏄庢牳楠屼汉鏁般€侀€氳繃浜烘暟
- 鍏稿瀷鐢ㄦ硶锛歚style_preset="fleshy"` + `appearance_tags="pale_skin,shiny_skin"`锛屼竴娆℃煡璇㈡寜銆屼綋鍨?+ 鑲よ壊 + 鑲よ川銆嶇粰鐢诲笀鎵撳垎

## 鏁翠綋鑹茶皟鍙傝€冿紙鐢婚潰瑙傛劅锛?
銆屾暣浣撳弬鑰冦€嶄笉鍐嶆寕鍦ㄤ汉浣撲笂锛岃€屾槸鍗曠嫭缁熻**鏁村紶鐢婚潰鐨勮壊璋?*鈥斺€斿悓鏍峰鐢ㄩ偅鎵规牳楠屼綔鍝侊紝涓嶉澶栧彂璇锋眰锛?
- `color_tags`锛氶€楀彿/绌烘牸鍒嗛殧锛屼緥濡?`monochrome, blue_theme`
  - 鍗曡壊/浣庨ケ鍜岋細`monochrome`銆乣monochrome_background`銆乣partially_colored`銆乣limited_palette`
  - 涓婚鑹诧細`blue_theme`銆乣red_theme`銆乣green_theme`銆乣purple_theme`銆乣pink_theme`銆乣yellow_theme`
  - 鑹插僵椋庢牸锛歚colorful`銆乣colorful_background`銆乣pastel_colors`銆乣iridescent`銆乣gradient_background`
- `color_match`锛歚any`锛堥粯璁わ級鎴?`all`
- `color_threshold`锛氶粯璁?0 = 鍙粺璁′笉娣樻卑锛涗紶姣斾緥鍒欏姞闂搁棬
- 杩斿洖閲屾瘡浣嶇敾甯堝甫 `color: { tags, match, threshold, checked_posts, hit_posts, ratio, per_tag, best }`
  - `per_tag`锛氭瘡涓壊璋?tag 鐨勫懡涓暟锛堟瘮濡?`blue_theme: 9`锛?  - `best`锛氬甫鑹茶皟 tag 鐨勬渶楂樻敹钘忎綔鍝侊紙鏈€澶?3 寮狅級锛岀偣寮€灏辫兘鐪嬫暣浣撹壊璋冩槸鍚﹀鍛?- 椤跺眰 `color_filter` 璇存槑鏍搁獙浜烘暟銆侀€氳繃浜烘暟
- 鍏稿瀷鐢ㄦ硶锛歚color_tags="monochrome,limited_palette"` + `color_threshold=0.2`锛岀瓫鍑恒€屾暣浣撳亸鍗曡壊/闄愬畾鑹层€嶇殑鐢诲笀
- 鎴愭湰锛氬拰 `appearance_tags` 鍏辩敤鏍搁獙璇锋眰锛屼笉棰濆澧炲姞璇锋眰鏁?
## 鐩镐技鐢诲笀锛坱ag 鐢诲儚 + 琛ㄦ儏鐢诲儚锛?
`danbooru_similar_artists` 鐢?Danbooru 鐨?tag 鍏辩幇鏁版嵁鎵俱€岄鏍肩浉杩戙€嶇殑鐢诲笀锛?*涓嶆槸鍥惧儚 embedding**锛夛細

1. 鍙栫瀛愮敾甯堢殑 `related_tag`锛岀瓫鍑恒€屽 TA 楂橀銆佷絾鍏ㄧ珯涓嶇畻閫氱敤銆嶇殑 general tag锛堟帓闄?`1girl`銆乣highres`銆佽儗鏅壊绛夌粨鏋勬€?tag锛夛紝浣滀负椋庢牸鐢诲儚锛坄profile_tags`锛岄粯璁ゅ彇 6 涓級
2. **琛ㄦ儏鐢诲儚**锛氫粠绉嶅瓙鐢诲笀鐨?tag 鐢诲儚閲屾寫鍑鸿〃鎯?tag锛坄smile`銆乣blush`銆乣open_mouth`銆乣half-closed_eyes`銆乣tongue_out` 绛夛紝`expression_tags` 榛樿 4 涓級锛岀敤瀹冧滑鎶娿€岃〃鎯呬範鎯浉杩戙€嶇殑鐢诲笀涔熸媺杩涘€欓€夋睜
3. 瀵规瘡涓敾鍍?tag 鏌?`related_tag&category=artist`锛屾敹闆嗗叡浜 tag 鐨勭敾甯堬紝鎸?`棰戠巼 脳 tag 绋€鏈夊害` 鍔犳潈绱姞
4. 鍊欓€?= 椋庢牸鐢诲儚鍊欓€?鈭?琛ㄦ儏鐢诲儚鍊欓€夛紱琛ㄦ儏鍊欓€夊繀椤婚€氳繃銆岄鏍?tag 閲嶅彔妫€鏌ャ€嶏紙鍚屼竴鎵?`related_tag` 閲岃兘鏌ュ埌绉嶅瓙椋庢牸 tag锛夛紝閬垮厤鍙〃鎯呭儚銆佺敾椋庡畬鍏ㄤ笉鍍?5. 鏈€缁堝垎鏁帮細`(1 - expression_weight) 脳 椋庢牸鍒?+ expression_weight 脳 琛ㄦ儏浣欏鸡鍒哷锛涜〃鎯呬綑寮﹀琛ㄦ儏 tag 棰戠巼鍋?*绋€鏈夊害鍔犳潈**锛坄expression_weight` 榛樿 0.5锛?
- 鎴愭湰锛? 娆★紙绉嶅瓙鐢诲儚锛? `profile_tags` 娆?+ `expression_tags` 娆?+ 鏈€澶?`2 脳 limit` 娆★紙琛ㄦ儏浣欏鸡/椋庢牸閲嶅彔妫€鏌ワ級锛岄粯璁ょ害 1 + 6 + 4 + 20 = 31 娆¤姹?- **渚嬪浘杞鍒?*锛歚examples>0` 鏃堕粯璁や紭鍏堛€屽甫闇€姹?tag锛堣〃鎯?浣撳瀷锛? 鑳界湅鍒拌劯銆嶇殑浣滃搧锛涘彧鏈夌敤鎴锋槑纭姹傝儗褰便€佸壀褰便€佷笅鍗婅韩鐗瑰啓绛夋棤鑴告瀯鍥炬椂鎵嶄紶 `allow_no_face=true`锛沗example_tags` 鍙鐩栭渶姹?tag锛屾瘡鏉′緥鍥惧甫 `matched_tags` 渚夸簬鏍稿锛涙病鏈夊彲鐢ㄦ牱鍥剧殑甯栧瓙浼氳璺宠繃
- **棰樻潗闄嶆潈**锛氱浉浼煎害璁＄畻閲?`furry` / `furry_female` / `furry_male` / `anthro` / `humanoid_furry` 鐨勬潈閲嶄箻 **0.05**锛岄伩鍏嶅吔鍚戦鏉愭媺鍔ㄧ敾甯堢浉浼煎害
- 灞€闄愶細tag 灞傞潰鐨勮〃鎯呯浉浼硷紙鐢ㄥ摢浜涜〃鎯呫€佸甯哥敤锛変粛涓嶇瓑浜庛€岃〃鎯呯敾娉曘€嶇浉浼硷紙鐪煎瀷銆佸槾褰€佽叜绾㈢敾娉曪級锛涘繀椤?`read_image` 鐩鍚庢墠鑳戒笅缁撹
- 鐢ㄦ硶锛歚danbooru_similar_artists(artist="satou_kuuki", limit=10, examples=3)`

## 浠ュ浘鎼滅敾甯堬紙鍥?鈫?鐢诲笀锛?
**鎺ㄨ崘宸ヤ綔娴侊紙鎸?2026-11 瀹炴祴璋冧紭锛?*锛?
1. **鍏堣窇 `danbooru_style_match`锛堟暣浣撶敾椋庡尮閰嶏級**鈥斺€斿畠鎵叏绔欓珮鍒嗕綔鍝併€佸仛 `鐢婚脳鐢婚 / 鐢婚脳浜虹墿绫诲瀷 / 鐢婚脳棰樻潗` 閰嶅锛堥粯璁?*涓嶇敤瑙掕壊**锛夛紝鏈€璐磋繎銆屾暣浣撹鎰熴€嶏紱瀹炴祴姣旂函 tag 鍔犳潈鏇寸ǔ锛堣兘閬垮紑銆屽彧闈犵嚎鏉″儚銆嶇殑璇垽锛屼篃涓嶄細鍥犱负銆岀敾杩囧悓涓€瑙掕壊銆嶅氨琚綋鎴愬悓鎵嬶級銆傜敤 `style_tags` 鎻忚堪娓叉煋鎵嬫硶銆乣subject_tags` 鎻忚堪浜虹墿绫诲瀷銆乣genre_tags` 鎻忚堪棰樻潗锛屽埆濉炶鑹茬壒寰?tag銆?2. **鍐嶇敤 `danbooru_artists_from_image`锛堝垎灞?tag锛変氦鍙夐獙璇?*鈥斺€旇嫢涓よ竟閮藉嚭鐜板悓涓€鐢诲笀锛屽彲淇″害鏈€楂橈紱鍙湁鍒嗗眰琛ㄥ嚭鐜般€佷笖 `single_dimension=true` 鐨勫€欓€夌洿鎺ュ拷鐣ャ€?
`danbooru_artists_from_image` 鎶娿€屼互鍥炬悳鐢诲笀銆嶅浐鍖栦负**鍒嗗眰浼樺厛绾ф绱?*锛堟彃浠舵病鏈夎瑙夎兘鍔涳紝鐢?Agent 鐪嬪浘鍚庢彁渚?tag 鍒嗙粍锛夛細

| 缁村害 | 璇存槑 | `mode="person"` 鏉冮噸 | `mode="style"` 鏉冮噸 |
|---|---|---|---|
| `person` 浜虹墿椋庢牸 | 浣撳瀷姣斾緥銆侀潰閮ㄧ壒寰併€佽鑹茶璁?| 0.22 | 0.08 |
| `expression` 琛ㄦ儏 | 琛ㄦ儏 tag | 0.12 | 0.02 |
| `technique` 缁樺埗鎵嬫硶 | 鏉愯川/涓婅壊锛坄latex`銆乣shiny_clothes`鈥︼級 | **0.22** | **0.28** |
| `lineart` 绾挎潯 | 绾跨绮楃粏/鏈夋棤/褰╄壊绾匡紙`lineart`銆乣colored_lineart`鈥︼級 | **0.18** | **0.24** |
| `clothing` 鏈嶈鏉愯川鏁堟灉 | 鍙祴**鏉愯川鏁堟灉**锛氬弽鍏?楂樺厜锛坄latex`銆乣shiny_clothes`锛夈€侀€忔槑锛坄see-through_clothes`锛夈€佹箍韬紙`wet_clothes`锛夈€佽暰涓?涓濈桓鍘氬害鎰燂紙`lace`銆乣silk`锛夛紱鏈嶈娆惧紡锛坄lingerie`銆乣bra`銆乣shirt`銆乣dress`鈥︼級涓嶈鍒嗐€佷細琚繃婊?| **0.10** | **0.12** |
| `color` 鑹插僵 | 涓昏壊/楗卞拰搴?澶氬僵/铏瑰僵锛坄colorful`銆乣iridescent`鈥︼級 | 0.06 | 0.12 |
| `lighting` 鍏夌収 | 閫嗗厜/鏂戦┏鍏?闀滃ご鍏夛紙`dappled_sunlight`銆乣backlighting`鈥︼級 | 0.05 | 0.10 |
| `tag` 娉?tag | 鍏朵綑鎻忚堪 tag | 0.05 | 0.04 |

> 绾挎潯/缁樺埗鎵嬫硶鏉冮噸楂樹簬鏃ч粯璁わ紙person 妯″紡 lineart 0.18銆乼echnique 0.22锛泂tyle 妯″紡 0.24 / 0.28锛夛紱`clothing` 缁村害鍙　閲?*鏈嶈鏉愯川鏁堟灉**锛?.10 / 0.12锛夆€斺€斿弽鍏夈€侀€忔槑搴︺€佹箍韬€佽暰涓?涓濈桓鐨勫帤搴︿笌瑜剁毐锛?*涓嶈　閲忔湇瑁呮寮?*锛沗lingerie`銆乣bra`銆乣shirt` 杩欑被娆惧紡鍚嶈瘝灞炰簬瑙掕壊韬唤鐗瑰緛锛屼細琚繃婊ゆ帀銆?
- **瑙掕壊韬唤/瑁呴グ鐗瑰緛涓嶈鍒?*锛氬彂鑹层€佺灣鑹层€佽銆佸厜鐜€佸吔鑰炽€佸熬宸淬€侀グ鍝併€佹湇瑁呮寮忓悕璇嶏紙`lingerie`銆乣bra`銆乣shirt`鈥︼級浼氬湪璇勫垎鍓嶈鍓旈櫎锛屽苟鍦ㄨ繑鍥炵殑 `excluded_identity_tags` 閲屽垪鍑猴紱**鏈嶈鏉愯川鏁堟灉 tag**锛坄latex`銆乣shiny_clothes`銆乣see-through_clothes`銆乣lace`銆乣silk`锛変繚鐣欏苟璁″叆 `clothing` 缁村害銆備互鍥炬悳鐢诲笀鍙鎻忚堪銆屾€庝箞鐢荤殑銆嶏紝鑰屼笉鏄€岀敾鐨勬槸璋?绌夸簡鍝欢娆惧紡鐨勮。鏈嶃€嶃€?- **鍗曠淮搴﹁瘉鎹檷鏉?*锛氭悳绱簡澶氫釜缁村害鏃讹紝鍙涓€涓淮搴﹀懡涓殑鐢诲笀锛堝鍙湁 `lineart` 鍍忕殑 tayuido锛夊垎鏁?脳0.55 骞舵爣 `single_dimension=true`銆乣dimensions_used`鈥斺€旈伩鍏嶃€岀嚎鏉″儚灏辨暣寮犲儚銆嶇殑璇垽
- **寮鸿皟銆岀敾椋庣被浼笺€?*锛氱敤 `mode="style"` 鈫?缁樺埗鎵嬫硶 鈫?绾挎潯 鈫?鏈嶈璐ㄦ劅 鈮?鑹插僵 鈫?鍏夌収 鈫?浜虹墿 鈫?琛ㄦ儏 鈫?tag
- **寮鸿皟銆屼汉鐗╂柟闈€嶆垨鏈鏄?*锛歚mode="person"`锛堥粯璁わ級鈫?浜虹墿 鈮?缁樺埗鎵嬫硶 鈫?绾挎潯 鈫?琛ㄦ儏 鈫?鏈嶈璐ㄦ劅 鈫?鑹插僵 鈫?鍏夌収 鈫?tag
- 姣忎釜缁村害**鏈€澶氬彇 4 涓?tag锛岄€愪釜 tag 鍗曠嫭妫€绱?*锛堝悇 100 鏉★紝`order:score`锛夛紱鍚屼竴缁村害鍐呮寜甯栧瓙鍘婚噸锛屽啀鎸夌敾甯堝嚭鐜伴鐜囧姞鏉冪疮鍔?- `year` 鍙€夛細**涓嶅～榛樿鍏ㄦ椂闂?*锛堜笉闄愬勾浠斤級锛屽～浜嗘墠鎸夎骞磋繃婊?- 鎴愭湰锛氱害 5鈥?0 娆¤姹傦紙鍚勭粍 tag 鏁颁箣鍜岋紝鏈€澶?4脳7锛? `examples` 娆?- 鐢ㄦ硶锛?  `danbooru_artists_from_image(image_tags="white_shirt, lying, white_background", person_tags="blue_hair, yellow_eyes", expression_tags="half-closed_eyes, blush", technique_tags="shiny_skin, realistic", lineart_tags="lineart, colored_lineart", clothing_tags="latex, shiny_clothes", color_tags="colorful, blue_theme", lighting_tags="dappled_sunlight, backlighting", mode="style", limit=10, examples=3)`
- 灞€闄愶細浠嶆槸 tag 妫€绱㈣仛鍚堬紝涓嶆槸鍥惧儚 embedding锛涙渶缁堝繀椤?`read_image` 鐩纭

### 鍊熼壌涓庢斁寮冿紙瀵圭収 Google 浠ュ浘鎼滃浘锛?
- **鍊熼壌骞跺凡瀹炵幇锛氳繎閲嶅/鍚屾簮鍥捐仛绫?*鈥斺€斿悓涓€寮犵敾鐨勬敼鑹层€佽鍒囥€乿ariant 甯栧湪 Danbooru 涓婂叡浜?`parent_id` 鎴?`md5`锛宍artists_from_image` 鍏堟寜銆岃瑙夌皣銆嶅幓閲嶅啀璁″垎锛岄伩鍏嶅悓涓€寮犵敾缁欏悓涓€鐢诲笀鍙犲姞澶氭璇佹嵁锛涗緥鍥句篃鍙粠涓嶅悓绨囬噷鎸戙€俙part_specialists` 鍚屾牱鎶樺彔閲嶅鍥撅紙椤跺眰杩斿洖 `deduped_posts`锛?- **鍊熼壌骞跺凡鏈夛細澶氫俊鍙锋帓搴?+ 鍏滃簳**鈥斺€斿垎灞傜淮搴﹀姞鏉冦€佹敹钘忕儹搴︽帓搴忥紱渚嬪浘浼樺厛銆屽甫闇€姹?tag + 鏈夎劯銆嶏紝鎵句笉鍒版墠閫愮骇鏀惧
- **鏀惧純锛氳瑙?embedding 妫€绱?*鈥斺€旈渶瑕佹湰鍦?CLIP/BLIP 绾фā鍨嬶紙鍑?GB 渚濊禆锛夛紝鍜屻€岄浂杩愯鏃朵緷璧栥€佽交閲忋€佸彧璇?API銆嶇殑瀹氫綅鍐茬獊锛汥anbooru 涔熸病鏈夊叕寮€鐨勭浉浼煎浘/鍚戦噺妫€绱?API
- **鏀惧純锛歄CR 璇嗗埆绛惧悕/姘村嵃**鈥斺€旈渶瑕?OCR 渚濊禆锛涜€屼細璇濋噷 Agent 鏈韩灏辫兘鐪嬪浘涓婄殑鏂囧瓧锛屾病蹇呰濉炶繘鎻掍欢
- 鑻ヤ互鍚庣湡瑕佸仛瑙嗚鍚戦噺妫€绱紝搴?*鍗曞紑涓€涓瓙鎻掍欢**锛堟湰鍦拌瑙夋湇鍔¤礋璐ｅ浘 鈫?embedding锛屽啀鍚戞湰鎻掍欢鎻愪緵鍊欓€夛級锛岃€屼笉鏄妸閲嶄緷璧栧杩涜繖涓彃浠?
## 鏁翠綋鐢婚鍖归厤锛堢敾椋庝紭鍏堬紝瑙掕壊鍙€夛級

`danbooru_style_match` 鏄€屽悓涓€浣滆€?鍚屼竴濂楀浘鍙嶆帹鐢诲笀涓层€嶈繖绫讳换鍔℃矇娣€涓嬫潵鐨勬绱㈡柟妗堬細**涓嶉棶銆岃皝鐢昏繃鍚屼竴涓鑹层€嶏紝鑰岄棶銆岃皝鐨勭敾闈㈡暣浣撳儚銆嶁€斺€旂嚎绋裤€佷笂鑹层€佽壊璋冦€佷汉浣撱€佽劯銆佹瀯鍥句竴璧峰儚锛岃€屼笉鍙槸瑙掕壊鐩稿悓**銆?
瑙掕壊鐩稿悓涓嶇瓑浜庣敾椋庣浉鍚岋細鍚屼竴涓鑹诧紝涓嶅悓鐢诲笀鑳界敾鍑哄畬鍏ㄤ笉鍚岀殑鎵嬶紱鍙嶈繃鏉ワ紝鐢婚楂樺害涓€鑷寸殑鐢诲笀鏈繀鐢昏繃浣犲弬鑰冨浘閲岀殑瑙掕壊锛堝疄娴嬶細鍙寜 Firefly/Kafka 妫€绱細婕忔帀 `nyantcha`銆乣merunyaa` 杩欑被鍚屾墜鐢诲笀锛岃€岀敾椋庝紭鍏堟绱㈣兘鎶婂畠浠帓鍒版渶鍓嶏級銆傛墍浠ラ粯璁?`mode="style"` **瀹屽叏涓嶇敤瑙掕壊 tag**锛涘彧鏈夌‘璁ゃ€屽繀椤诲悓涓€涓鑹插嚭鐜般€嶆椂鎵嶇敤 `mode="character"`銆?
**涓轰粈涔堜笉鑳藉彧鎸夌壒寰?tag 鎵?*锛歚half-closed_eyes`銆乣eyeshadow`銆乣dark-skinned_male`銆乣sparkle`銆乣shiny_skin` 杩欑被 tag 鍦?AI 鍥鹃噷澶氬崐鏄?prompt 鏁堟灉锛屽悓棰樻潗鐢诲笀鍑犱箮浜轰汉閮芥湁锛涙寜瀹冧滑鑱氬悎鍙細寰楀埌銆屽悓棰樻潗鐢诲笀姒溿€嶏紝鑰屼笉鏄€屽悓鐢婚鐢诲笀姒溿€嶃€傜敾甯堢湡姝ｅ喅瀹氱殑鏄細**绾跨銆佷笂鑹层€佽壊璋冦€佷汉浣撴瘮渚嬨€佽劯閮ㄦ瀯閫犮€佹瀯鍥?*銆?
**宸ュ叿鍐呴儴鐨勬绱㈤『搴忥紙`mode="style"`锛岄粯璁わ級**锛?
1. **鍏ㄧ珯楂樺垎閿氱偣锛堟牳蹇冿級**锛氱涓€涓?`style_tag` 涓庣涓€涓?`subject_tag` 鍚勬煡涓€娆?`order:score` 鍓?200 寮狅紝鎸夊悕娆¤“鍑忓姞鏉冣€斺€斿悕娆¤秺闈犲墠鏉冮噸瓒婇珮銆傚崟 tag + `order:score` 鍙崰涓や釜 tag 棰濆害锛?*鍖垮悕涔熻兘鐢?*锛岃€屼笖鑳借鐩栧嚑骞村墠鐨勯珮鍒嗚€佸浘銆?2. **pair 鏌ヨ鍏滃簳**锛歚鐢婚脳鐢婚`銆乣鐢婚脳浜虹墿绫诲瀷`銆乣鐢婚脳棰樻潗`銆乣浜虹墿绫诲瀷脳棰樻潗` 鍚勬渶澶?2 缁勶紙姣忕粍姝ｅソ涓や釜鐪熷疄 tag锛夛紱pair 鍙兘鍙栨渶鏂伴〉锛屽鎴风鍐嶆寜鍒嗘暟鎺掑簭锛岀敤鏉ヨˉ杩戞湡/鏂扮敾甯堛€?3. **鐢婚鏍搁獙**锛氬鍊欓€夐€愪釜鏌?`鐢诲笀脳閿氱偣鐢婚 tag`锛岀粺璁¤鐢诲笀鑷繁甯﹁繖涓敾椋庣殑甯栧瓙鏁扳€斺€旂洿鎺ヨ　閲忋€屼粬鏄笉鏄敾杩欑鎵嬨€嶏紝涓庤鑹叉棤鍏筹紱杩欐鏌ヨ杩斿洖鐨勪綔鍝佸悓鏃跺氨鏄渶濂界殑渚嬪浘銆?4. **鍔犳潈鎺掑簭**锛歚0.45脳閿氱偣鍒?+ 0.18脳pair 鍒?+ 0.15脳鐢婚鏍搁獙鍒?+ 0.1脳灏忕敾甯堝叡鐜?+ 0.12脳seed`锛沗chart_top`锛堝叏绔欏墠 10锛壝?.3锛沗prefer_artists` 棰濆鍔犲垎銆乣avoid_artists` 鍓旈櫎銆?5. 杩斿洖 `verify.checklist`锛堢嚎绋?/ 涓婅壊 / 鑹茶皟 / 浜轰綋 / 鑴?/ 鏋勫浘 鍏」鐩鏍稿娓呭崟锛変笌 `iterate.hint`锛屾柟渚夸笅涓€杞帴鐫€杩唬銆?
**鍥涙潯鍏抽敭缁忛獙锛堝凡鍐欒繘瀹炵幇锛?*锛?
- **涓嶈鐢ㄨ鑹插綋鍒ゆ柇鍩虹偣**锛氬悓瑙掕壊鍙鏄庛€岀敾杩囥€嶏紝涓嶈鏄庛€岀敾寰楀儚銆嶏紱`subject_tags`锛堜綋鍨?鑲よ壊/鑴?琛ㄦ儏锛夌敤鏉ヤ繚鎸併€屼汉鐗╃被鍨嬨€嶆帴杩戯紝浣嗗畠鎻忚堪鐨勬槸琚敾鐨勪汉锛屼笉鏄韩浠姐€?- 鍙寜鏈€鏂伴〉鎼?pair 浼氭紡鎺夊嚑骞村墠鐨勯珮鍒嗚€佸浘锛堜緥锛氭煇鐢诲笀鐨勫悓瑙掕壊浣滃搧鍦ㄦ敹钘忓墠鍒楋紝浣嗗彂甯冧簬涓ゅ勾鍓嶏級鈥斺€旀墍浠ュ繀椤绘湁 `order:score` 閿氱偣鎵弿銆?- 鍚屼竴濂楀浘璺ㄥ涓鑹叉椂锛岀敤 `mode="style"` 鍒嗗嚑杞窇锛堟瘡杞崲 `style_tags` 鐨勪富閿氱偣锛夛紝**鍚屽悕鐢诲笀璺ㄨ疆鍑虹幇**鐨勪紭鍏堛€?- 渚嬪浘蹇呴』**鏁翠綋**姣斿锛氱嚎绋库啋涓婅壊鈫掕壊璋冣啋浜轰綋鈫掕劯鈫掓瀯鍥鹃€愰」杩囷紝涓嶈兘鍥犱负銆屽崐闂溂/绾㈢溂褰便€嶅涓婁簡灏卞畾妗堛€?
鐢ㄦ硶锛堥粯璁ょ敾椋庝紭鍏堬級锛?
- 鐢婚浼樺厛锛歚danbooru_style_match(style_tags="shiny_skin, sweat, oiled_skin", subject_tags="huge_breasts, dark_nipples, pale_skin", genre_tags="sex, hetero, cum", limit=12, examples=2)`
- 瑙掕壊妯″紡锛堜粎褰撳繀椤诲悓瑙掕壊锛夛細`danbooru_style_match(mode="character", character="firefly_(honkai:_star_rail)", style_tags="shiny_skin", genre_tags="sex")`
- 杩唬锛氫笂涓€杞湅涓殑鐢诲笀鏀捐繘 `prefer_artists`銆佺湅閿欑殑鏀捐繘 `avoid_artists`锛屽啀璺戜竴娆″嵆鍙敹鏁?- 鎴愭湰锛氱害 `1 + 6 + 2脳limit + 灏戦噺渚嬪浘` 娆¤姹傦紙榛樿绾?30 娆★紱鍖垮悕闄愰€熶笅绾?30鈥?0 绉掞級

### 澶氬紶鍙傝€冨浘 / 澶氳鑹诧紙0.18.0 璧凤紝浠?`mode="character"`锛?
鍚屼竴浣滆€呯殑涓€濂楀浘甯稿父妯法濂藉嚑涓鑹层€?*娉ㄦ剰锛氳繖鍙湪 `mode="character"` 涓嬬敓鏁?*鈥斺€旂敾椋庝紭鍏堟ā寮忔湰鏉ュ氨涓嶉渶瑕佽鑹诧紱鍙湁褰撲綘纭疄瑕併€屽悓涓€涓鑹层€嶆椂鎵嶇敤澶氳鑹查敋瀹氥€俙character` 鎺ュ彈**閫楀彿鍒嗛殧鐨勫涓鑹?*锛堟渶澶?3 涓紝鍓嶄袱涓細鍚勮窇涓€娆″叏绔欓珮鍒嗛敋鐐瑰苟鍙備笌鍚岃鑹叉牳楠岋級锛?
- 澶氳鑹茶緭鍏ワ細`danbooru_style_match(character="firefly_(honkai:_star_rail), kafka_(honkai:_star_rail)", style_tags="shiny_skin, sweat", genre_tags="sex, hetero", limit=10, examples=2)`
- 杈撳嚭锛歚reference.characters` 鏄В鏋愬悗鐨勮鑹插垪琛紱`anchor_scans` 姣忎釜瑙掕壊涓€鏉★紱姣忎釜鍊欓€夊甯?`same_character_breakdown`锛堥€愯鑹蹭綔鍝佹暟锛夛紝`same_character_posts` 鏄悇瑙掕壊涔嬪拰銆?- 鎺ㄨ崘娴佺▼锛堟湰杞疄娴嬫敹鏁涙渶蹇級锛氣憼 鍙傝€冨浘鎸夎鑹?鏈嶈鍒嗙粍锛屾瘡缁勬寫鏈€鎺ヨ繎鐨?`style_tags` 鍚勮窇涓€娆★紱鈶?姹囨€诲杞€欓€夛紝**鍚屽悕鐢诲笀璺ㄨ疆鍑虹幇**鐨勪紭鍏堬紱鈶?瀵?finalist 鎶?2鈥? 寮犱唬琛ㄤ綔鍜屽弬鑰冨浘鎷煎浘锛屾寜鍏」娓呭崟鏁翠綋姣斿锛涒懀 鐢?`prefer_artists` 鎶婂叆閫夎€呭甫鍥炲啀璺戜竴杞紱鈶?鏈€鍚庢墠鍐欑敾甯堜覆鏉冮噸銆?- 鎴愭湰锛氭瘡澶氫竴涓鑹茬害澶?`1 + 2 + 2脳limit` 娆¤姹傦紙鍓嶄袱涓鑹插弬涓庢牳楠岋級銆?
**鏈疆妗堜緥锛?5 寮犲悓涓€ AI 浣滆€呭弬鑰冨浘锛?*锛欶irefly 9 寮犮€佽摑鍙戞吵瑁?3 寮狅紝妫曞彂钃濇寫鏌?/ 娣辩传鍙?/ 绾㈠彂鍐涜 / 绮夊彂鍜屾湇鍚?1 寮犮€?
- 0.17鈥?.18 鐢ㄨ鑹查敋瀹氬緱鍒扮殑缁撹鏄?`hews` / `0haribo0` / `harin_05` / `greem_bang`鈥斺€斿畠浠‘瀹炵敾杩欎簺瑙掕壊锛屼絾**鏄€屽悓瑙掕壊銆嶇瓫鍑烘潵鐨勶紝涓嶆槸銆屽悓鐢婚銆嶇瓫鍑烘潵鐨?*銆?- 0.23.0 鏀规垚鐢婚浼樺厛鍚庯紝鍚屾牱鐨?15 寮犲浘璺戝嚭 `nyantcha`锛?7.6锛屽叏绔欏墠 10 + 鐢婚鏍搁獙 27 甯栵級`piutahayo`銆乣mochirong`銆乣elocca`銆乣norza`銆乣merunyaa`锛沗nyantcha` / `merunyaa` 杩欑被銆屽悓鎵嬩絾娌＄敾杩?Firefly/Kafka銆嶇殑鐢诲笀锛屾棫鏂规瀹屽叏鐪嬩笉鍒般€?- 鏈€缁堢敾甯堜覆鎸夈€岀敾椋庝紭鍏堝€欓€?鈭?瑙掕壊妯″紡鍊欓€夈€嶇殑浜ら泦涓庡叚椤圭洰瑙嗘牳瀵瑰喅瀹氾紝璇﹁ [docs/case-2026-11-15-15refs.md](docs/case-2026-11-15-15refs.md)銆?
### 灏忎綋閲忕敾甯堝彂鐜帮紙0.21.0 璧凤紝0.22.0 琛?`seed_artists`锛?
楂樺垎閿氱偣/pair 鎵弿鍙噰鏍枫€岀儹搴﹀墠鍑犵櫨銆嶇殑浣滃搧锛?*150 甯栫骇鍒殑灏忕敾甯堟案杩滆繘涓嶄簡鍊欓€夋睜**锛堝吀鍨嬶細eigaka锛屽叏绔?167 甯栵紝鏈€楂樺垎鍙湁 776锛夈€傜幇鍦?`style_match` 澧炲姞涓ゆ潯閫氶亾锛?
1. **style-tag 鍏辩幇锛堣嚜鍔級**锛氬姣忎釜 `style_tags` 璋冧竴娆?`related_tag?category=artist`锛屾嬁鍒般€屾墍鏈夌敾杩囪繖绉嶉鏍?tag 鐨勭敾甯堛€嶏紝涓庣儹搴︽棤鍏筹紱鍙繚鐣欏叏绔?**鈮?`min_artist_posts`锛堥粯璁?50 甯栵級** 鐨勭敾甯堬紱鍊欓€夊瓧娈?`discovered_via_style_cooccurrence` / `artist_posts` / `small_artist` / `reserved_slot`锛宍small_artist_slots`锛堥粯璁?3锛変繚璇佸皬鐢诲笀涓嶈鎸ゅ嚭鍚嶅崟锛涜繑鍥?`small_artist_discovery.top`锛?1000 甯栫殑楂樺垎灏忕敾甯堝墠 10锛?2. **`seed_artists`锛堟樉寮忕偣鍚嶏紝纭畾鎬э級**锛氬叡鐜?API 鍙繑鍥炴瘡涓?tag 鐨?**鍓?100 鍚?*鐢诲笀锛屽儚 eigaka 杩欑銆岀浉鍏冲笘鍒嗘暟閮藉緢浣庛€佸叡鐜伴鐜囦篃浣庛€嶇殑璐﹀彿浠嶄細琚紡鎺夆€斺€旇繖鏃剁洿鎺?`seed_artists="eigaka"`锛屾彃浠朵細鏌ュ畠鐨勫笘鏁帮紙鈮?0 鎵嶇撼鍏ワ級銆佹姄瀹冭嚜宸辩殑浣滃搧绠?style/genre 鍚诲悎搴︼紝骞?*寮哄埗鏀捐繘缁撴灉**锛坄seed_artist: true`銆乣seed_style_overlap`锛?
鐢ㄦ硶锛?
```text
danbooru_style_match(style_tags="shiny_skin, sweat, lace, colored_lineart",
                     genre_tags="sex, cum", discover_small_artists=true,
                     min_artist_posts=50, small_artist_slots=3,
                     seed_artists="eigaka", limit=12)
```

- 浠ｄ环锛氬叡鐜版瘡涓?style tag +1 璇锋眰锛堟渶澶?3 娆★級锛涙瘡涓?seed +2 璇锋眰锛堝笘鏁?+ 浣滃搧鍚诲悎搴︼級

## 澶氭柟妗堝叡璇嗭紙0.20.0 璧凤級

`danbooru_image_artist_consensus` 瑙ｅ喅銆屽崟鏂规鎬讳細鏈夎鍒ゃ€嶇殑闂锛氬鍚屼竴寮犲弬鑰冨浘璺?2鈥? 涓笉鍚屾柟妗堬紝鍚勮嚜鍙栫煭鍚嶅崟锛屽啀**鍙繚鐣欒 鈮? 涓柟妗堝悓鏃跺懡涓殑鐢诲笀**銆?
```text
danbooru_style_match(...)            鈫?["elocca,mignon,piutahayo"]
danbooru_artists_from_image(...)     鈫?["hews,nyantcha,asou"]
danbooru_similar_artists(artist=...) 鈫?["m-da_s-tarou,sincos,hara"]

danbooru_image_artist_consensus(
  lists='["elocca,mignon,piutahayo","hews,nyantcha,asou","m-da_s-tarou,sincos,hara"]',
  source_names="style_match,artists_from_image,similar_artists",
  min_hits=2, limit=10, examples=3)
```

- 姣忎釜鍊欓€変汉甯?`hits`锛堣鍑犱釜鏂规鍛戒腑锛夈€乣hit_sources`锛堝懡涓柟妗堝悕锛夈€乣avg_rank`锛堝悇鏂规鍐呯殑骞冲潎鍚嶆锛岃秺灏忚秺闈犲墠锛?- 鎺掑簭锛歚hits` 闄嶅簭 鈫?`avg_rank` 鍗囧簭 鈫?鐢诲笀鍚?- **娌℃湁鐢诲笀杈惧埌 `min_hits` 鏃?*锛氳繑鍥炴寜 `hits` 鎺掑簭鐨勯儴鍒嗛噸鍙犳锛屽苟璁?`fallback_used=true`锛屾彁绀烘崲鏇寸浉杩戠殑鏂规鎴栭檷浣庨棬妲?- 瀹冩湰韬笉鍙戞绱㈣姹傦紙鍙负渚嬪浘鍙戣姹傦級锛屾墍浠ュ緢蹇紱鍏堣窇鍚勬柟妗堝啀鍠傜粰瀹?- 灞€闄愶細鍏辫瘑鍙兘闄嶄綆闅忔満璇垽锛屼笉鑳借瘉鏄庣敾椋庣湡鐨勫儚鈥斺€旀渶缁堜粛瑕?`read_image` 鐩鏍稿

## 閮ㄤ綅鐗瑰寲鎼滅储锛堢敾鎵?/ 鐢昏剼 / 鐢昏吙鈥︼級

`danbooru_part_specialists` 鐢?D 绔欑殑**閮ㄤ綅鐒︾偣 tag** 妫€绱€岃閮ㄤ綅 + 楂樻敹钘忋€嶄綔鍝侊紝鍐嶆寜鐢诲笀鑱氬悎锛屼笓闂ㄥ洖绛斻€岃皝鐢绘墜/鑴?鑵?鐪肩潧鐢诲緱濂姐€嶈繖绫婚棶棰樸€?
- `part` 鍙€夛細`hands`銆乣feet`銆乣thighs`銆乣legs`銆乣ass`銆乣breasts`銆乣hips`銆乣eyes`銆乣mouth`銆乣back`銆乣armpits`銆乣navel`銆乣belly`銆乣abs`銆乣hair`銆乣neck`銆乣pectorals`
- 姣忎釜閮ㄤ綅鍙栧墠涓や釜 tag锛堝 `hand_focus` + `hands`锛夛紝鎸?`order:favcount` 鍚勬壂涓€閬嶏紙榛樿 100 鏉★級锛岀粺璁＄敾甯堝湪璇ラ儴浣嶄綔鍝佷笂鐨?*鏀惰棌鎬绘暟**
- `rank_by`锛歚total_favorites`锛堥粯璁わ紝鏀惰棌鎬婚噺锛? `avg_favorites`锛堝崟鍥惧潎鍊硷級/ `posts`锛堜綔鍝佹暟閲忥級
- `min_posts`锛氱敾甯堣嚦灏戣鏈夊嚑寮犻儴浣嶄綔鍝佹墠鍏ユ锛堥粯璁?2锛?- 鍚屾椂杩斿洖 `posts`锛氳閮ㄤ綅 tag 涓嬫敹钘忔渶楂樼殑鍥剧墖锛堥粯璁?6 寮狅紝鍚?`sample_url`锛?- 鍙€夊浘鐗囷紝瑙嗛鑷姩杩囨护锛沗year` 鍙檺瀹氬勾浠斤紙榛樿鍏ㄦ椂闂达級
- 鐢ㄦ硶锛歚danbooru_part_specialists(part="hands", year=2025, rank_by="total_favorites", artists_limit=10, posts_limit=8)`
- 灞€闄愶細渚濊禆浣滆€呮墦浜嗛儴浣嶇劍鐐?tag锛屾病鎵?tag 鐨勫ソ鍥句細婕忥紱鏈€缁堜粛闇€鐩纭閮ㄤ綅鐢绘硶

## 杈撳嚭绾﹀畾锛堢敾甯?vs 鍥剧墖锛?
- **鐢诲笀鍒楄〃**锛氭瘡浣嶇敾甯堜繚鐣?**3 寮犱緥鍥?*锛堜笉鍚屼綔鍝侊級锛屽苟**鍒嗚绾靛悜鎺掔増**锛堟瘡浜轰竴涓潡锛氭覆鏌?/ 浣撴€?/ 闈㈤儴 / 涓婚〉 / 渚嬪浘锛夛紝涓嶈鐢ㄥ琛ㄦ牸锛岄伩鍏嶈妯悜瑁佸垏
- **渚嬪浘杞鍒?*锛氶粯璁や紭鍏堝彇銆屽甫闇€姹?tag锛堣〃鎯?浣撳瀷锛? 鑳界湅鍒拌劯銆嶇殑浣滃搧锛涘彧鏈夌敤鎴锋槑纭姹傝儗褰便€佸壀褰便€佷笅鍗婅韩鐗瑰啓绛夋棤鑴告瀯鍥炬椂锛屾墠浼?`allow_no_face=true` 鍏佽鏃犺劯渚嬪浘锛沗example_tags` 鍙鐩栭渶姹?tag銆俙danbooru_similar_artists` 鐨?`examples` 浼氳繑鍥?`matched_tags` 渚夸簬鏍稿
- **姘旇川闄嶆潈**锛氱浉浼煎害璁＄畻閲?`furry` / `furry_female` / `furry_male` / `anthro` / `humanoid_furry` 鐨勬潈閲嶄箻 **0.05**锛岄伩鍏嶅吔鍚戦鏉愭媺鍔ㄧ敾甯堢浉浼煎害
- **閬垮厤杩囧害鍐欏疄/3D**锛歚3d`銆乣photorealistic`銆乣faux_3d` 杩欑被 tag 鍦ㄧ浉浼煎害涓檷鏉冨埌 0.05锛涗互鍥炬悳鐢诲笀浼氭寜鍊欓€夌殑 3D 浣滃搧鍗犳瘮鎵ｅ垎锛堣繑鍥?`three_d_share`锛夛紱渚嬪浘鍜岄儴浣嶇壒鍖栫粨鏋滀紭鍏堟帓闄?3D 浣滃搧锛堟壘涓嶅埌 2D 鍥炬椂鎵嶅洖閫€锛?- **鍥剧墖鍒楄〃**锛氭瘡寮犲浘淇濈暀 **1 寮犳牱鍥?*鍗冲彲
- **鐢婚鐩镐技鍒ゅ畾缁村害**锛堢洰瑙嗭紝涓嶅彧鐪?tag锛夛細
  1. **娓叉煋**锛氫笂鑹?杞‖闃村奖銆侀珮鍏変笌鏉愯川锛堜钩鑳躲€佷寒闈㈠竷鏂欙級銆侀ケ鍜屽害涓庤壊璋?  2. **浣撴€?*锛氳兏鑵拌噣/鑵挎瘮渚嬨€佽倝鎰熶笌鑴傝偑鍒嗗竷銆佽韩楂樹綋鍨嬨€佸父鐢ㄥЭ鎬?  3. **闈㈤儴鐗瑰緛涓庤〃鎯?*锛氳劯鍨嬨€佺溂鍨?鐪艰窛/鐬冲瓟楂樺厜銆侀蓟鍢寸敾娉曘€佽叜绾€佸父鐢ㄨ〃鎯咃紙绗?鍗婇棴鐪?鍚愯垖/瀹崇緸绛夛級
  4. **鏋勫浘**锛氱珛缁?澶氳鍥?杩戞櫙瑁佸垏绛?
## 鍑嵁锛堢櫥褰曞悗瑙ｉ櫎 2-tag 闄愬埗锛?
璋冪敤 `danbooru_save_credentials` 鎻愪緵 `login` 涓?`apiKey`锛氬€煎啓鍏?DSH 鍑嵁搴擄紙`$DSH_HOME/.credentials.yaml`锛屼粎褰撳墠绯荤粺鐢ㄦ埛鍙锛夛紝涓嶄細鍑虹幇鍦ㄦ彃浠堕厤缃垨宸ュ叿杩斿洖鍊奸噷銆傛彃浠舵瘡娆¤姹傞兘浼氶噸鏂拌В鏋愬嚟鎹紝淇濆瓨鍚庣珛鍗崇敓鏁堛€佹棤闇€閲嶅惎銆?
- 鏌ョ湅鐘舵€侊細`danbooru_auth_status`锛堝彧鎶?configured / source / writable锛屼笉杩斿洖鍊硷級
- 绉婚櫎锛歚danbooru_save_credentials({ clear: true })`
- 涔熷彲浠ョ敤鐜鍙橀噺 `DANBOORU_LOGIN` / `DANBOORU_API_KEY`锛堝惎鍔ㄧ幆澧冩垨 `$DSH_HOME/.env`锛夛紱鍑嵁搴撲腑鐨勫€间紭鍏堛€?
## 鍚堣涓庨檺閫燂紙鍐呭缓锛?
- 姣忎釜璇锋眰閮藉甫鍙瘑鍒?`User-Agent`锛歚dsh-danbooru-tools/0.23.0 (DeepSeek Harness; <contact>)`銆?- 鎵€鏈夎姹傝蛋**鍗曚竴涓茶闂搁棬**锛氬尶鍚嶉粯璁ら棿闅?1.1 绉掞紱妫€娴嬪埌宸蹭繚瀛樺嚟鎹椂鑷姩鍒囨垚 0.4 绉掞紙绾?2.5 娆?绉掞紝浠嶅彧鏈?D 绔?10 娆?绉掍笂闄愮殑 1/4锛屽璇锋眰宸ュ叿鏁翠綋蹇害 2鈥?.7 鍊嶏級锛涢亣鍒?429 浼氭寜 `Retry-After` 閫€閬块噸璇曚竴娆°€?- 缁撴灉鏈夊唴瀛?TTL 缂撳瓨锛堜綔鍝?5 鍒嗛挓 / 鑷姩琛ュ叏 6 灏忔椂 / 鐩稿叧 tag 1 灏忔椂 / wiki 24 灏忔椂锛夛紝鍑忓皯閲嶅璇锋眰銆?- **瀵?Danbooru 鍙**锛氬彧鍙?GET 璇锋眰锛屼笉鐐硅禐銆佷笉鏀惰棌銆佷笉涓婁紶銆佷笉鍐?profile锛涗笉浜х敓浠讳綍瀵圭珯鐐圭殑鍐欏叆銆?
## 閰嶇疆

鍏ㄩ儴鍙€夈€傚彲鐢ㄧ幆澧冨彉閲忔垨 bundle patch 鐨?`config` 鎻愪緵锛?
| 閿?| 榛樿 | 璇存槑 |
|---|---|---|
| `contact` | 绌?| 鍔犺繘 User-Agent 鐨勮韩浠借鏄庯紝寤鸿濉?`user #12345` 鎴栭偖绠?|
| `minIntervalMs` | `1100` | 鍖垮悕璇锋眰鐨勫惎鍔ㄩ棿闅旓紙姣锛?|
| `minIntervalMsAuthenticated` | `400` | 宸蹭繚瀛樺嚟鎹椂鐨勫惎鍔ㄩ棿闅旓紙姣锛夛紝蹇呴』灏忎簬绔欑偣闄愰€?|
| `timeoutMs` | `20000` | 鍗曡姹傝秴鏃?|
| `cacheTtlMs` | `600000` | 鍐呭瓨缂撳瓨瀵垮懡锛沗0` 鍏抽棴缂撳瓨 |
| `defaultRating` | `all` | 榛樿鍒嗙骇锛沗all` 鍚?R18锛宍g` 鍙湅鍏ㄥ勾榫?|
| `maxWikiChars` | `4000` | `danbooru_get_tag` 杩斿洖鐨?wiki 鎽樿涓婇檺 |

鐜鍙橀噺锛?
| 鍙橀噺 | 璇存槑 |
|---|---|
| `DANBOORU_LOGIN` | Danbooru 鐢ㄦ埛鍚嶏紱涓?API key 鍚屾椂鎻愪緵鏃舵彁楂橀檺棰濓紙鍖垮悕鏈€澶?2 涓?tag锛?|
| `DANBOORU_API_KEY` | 涓汉椤电殑 API key |
| `DANBOORU_USER_AGENT` | 瀹屾暣瑕嗙洊 User-Agent锛堜粛瑕佷繚鐣欏彲璇嗗埆韬唤锛?|
| `DANBOORU_CONTACT` | 绛夊悓 `contact` 閰嶇疆椤?|
| `DANBOORU_MIN_INTERVAL_MS` | 绛夊悓 `minIntervalMs` |
| `DANBOORU_MIN_INTERVAL_AUTH_MS` | 绛夊悓 `minIntervalMsAuthenticated` |

鏀?`config` 闇€瑕佹敼鏈洰褰曠殑 `cordis.patch.yml` 骞堕噸瑁?bundle锛涙敼鐜鍙橀噺鍒欓噸鍚?DSH 鍗冲彲銆?
## 鑷

```bash
node verify.mjs
```

浼氱湡瀹炶姹傚悇鏌ヨ宸ュ叿锛堝伐鍏锋敞鍐屻€佸嚟鎹檷绾с€佸勾浠借繃婊ゃ€佷笁绾у姞鏉冦€佹暣骞存€绘敹钘忋€侀鏍奸椄闂ㄣ€佷汉浣撻檮鍔犲弬鑰冦€佹暣浣撹壊璋冨弬鑰冦€佽〃鎯呯敾鍍忎笌浣欏鸡銆佷緥鍥捐蒋瑙勫垯銆侀儴浣嶇壒鍖栥€佺嚎鏉?鎵嬫硶/鏈嶈鏉愯川鏁堟灉鏉冮噸銆佽鑹茶韩浠借繃婊ゃ€佸崟缁村害闄嶆潈銆佹暣浣撶敾椋庡尮閰嶇殑閿氱偣/鍚岃鑹?娓呭崟銆佺敾椋庝紭鍏堝拷鐣ヨ鑹层€佸皬浣撻噺鐢诲笀鍏辩幇涓?seed 鐐瑰悕銆佸鏂规鍏辫瘑绛?62 椤规鏌ワ級骞舵牎楠岃繑鍥炵粨鏋勪笌鎺掑簭锛岀害 3鈥? 鍒嗛挓锛堝彈涓茶闄愰€熷奖鍝嶏級銆備笉浜х敓鍐欏叆銆?
## 宸茬煡闄愬埗

- 鍖垮悕鎼滅储鏈€澶?2 涓?tag锛圖anbooru 鏈嶅姟绔檺鍒讹級锛涢敊璇俊鎭細鎻愮ず鍔犲嚟鎹€?- 鍙 鈮?涓嶈兘鐪嬪浘锛氭彃浠跺彧璇?Danbooru銆佷笉鎻愪緵鍥剧墖涓嬭浇宸ュ叿锛屼絾**杩斿洖浣滃搧/鏍锋湰 URL**锛坄urls.sample`銆乣preview_url` 绛夛級銆傜洰瑙嗘牳楠屾椂鐢?Agent 鐢?`curl` / `pwsh` 浠庤繖浜?URL 涓存椂涓嬭浇鍒版湰鍦般€佺湅瀹屽嵆鍒狅紱鎻掍欢鑷韩涓嶅彂璧峰浘鐗囦笅杞姐€?
### 鍥剧墖鏍搁獙锛圓gent 渚у伐浣滄祦锛?
1. 鐢?`danbooru_search_posts`锛坄urls.sample`锛夋垨 `danbooru_year_artists`锛坄best` / `newest` / `style.best` 閲岀殑 `sample_url`锛夋嬁鍒板彲涓嬭浇鐨勬牱鍥?URL锛?2. 鐢?`curl` 涓嬭浇锛圕DN 鏈夐槻鐩楅摼锛?*蹇呴』甯?Referer**锛屽惁鍒?403锛夛細
   `curl.exe -L -e "https://danbooru.donmai.us/" -o sample.jpg "<sample_url>"`
3. 鐢?`read_image` 鏌ョ湅锛涙牳楠屽畬鍒犻櫎涓存椂鏂囦欢锛堜笉杩涘叆鎻掍欢鐩綍銆佷笉闀挎湡淇濆瓨锛夈€?
- 鎻掍欢娌℃湁銆屾壒閲忎笅杞藉浘鐗囥€嶇殑宸ュ叿锛涗笅杞藉彂鐢熷湪 Agent 鐨?shell 渚э紝灞炰簬浼氳瘽涓存椂鎿嶄綔锛屼笉鏄彃浠惰兘鍔涖€?- 鍐呭鍒嗙骇**榛樿杩斿洖鍏ㄩ儴锛堝惈 R18锛?*锛涢渶瑕佸叏骞撮緞鍐呭鏃舵樉寮忎紶 `rating="g"`锛岀粨鏋滃彲鑳戒笉閫傚悎鎵€鏈夊満鏅€?- **鍙繑鍥炲浘鐗?*锛氭墍鏈夊伐鍏烽兘浼氳繃婊ゆ帀瑙嗛涓庡姩鐢讳綔鍝侊紙`mp4`/`webm`/`mkv`/`mov`/`avi`/`m4v`銆乽goira 鐨?`zip`锛屼互鍙?`meta` 閲屽甫 `ugoira`/`video` 鐨勫笘瀛愶級锛屾悳绱€佺敾甯堝弬鑰冨浘銆佷緥鍥鹃兘鍙粰闈欐€佸浘锛沗danbooru_get_post` 鎸?id 鏌ヨ闄ゅ锛堟樉寮忚姹備粛鍙湅鍒板師甯栦俊鎭級
- wiki 鎽樿鏄埅鏂悗鐨勭函鏂囨湰锛屼繚鐣欎簡 Danbooru 鐨?wiki 鏍囪锛堝 `[[tag]]`锛夛紝涓嶆槸娓叉煋鍚庣殑瀵屾枃鏈€?
## 鏇存柊璁板綍

- **0.23.0**锛歚style_match` 鏀逛负**鐢婚浼樺厛锛坰tyle-first锛?*鈥斺€旈粯璁?`mode="style"` **涓嶄娇鐢ㄨ鑹?tag**锛堝悓瑙掕壊鈮犲悓鐢婚锛涘疄娴嬫棫鐨勮鑹查敋瀹氭紡鎺?`nyantcha`/`merunyaa` 杩欑被鍚屾墜鐢诲笀锛夛紝鏂板 `subject_tags`锛堜綋鍨?鑲よ壊/鑴?琛ㄦ儏绛夈€屼汉鐗╃被鍨嬨€嶏紝涓嶆槸韬唤锛夈€乣mode="character"` 鎵嶇敤瑙掕壊閿氱偣锛沺air 鏀逛负 `鐢婚脳鐢婚`/`鐢婚脳浜虹墿绫诲瀷`/`鐢婚脳棰樻潗`/`浜虹墿绫诲瀷脳棰樻潗`锛屾牳楠屾敼涓?`鐢诲笀脳閿氱偣鐢婚 tag`锛坄style_posts`锛夛紝鎺掑簭 `0.45 閿氱偣 + 0.18 pair + 0.15 鐢婚鏍搁獙 + 0.1 鍏辩幇 + 0.12 seed`锛涜緭鍑烘柊澧?`reference.mode` / `reference.subject_tags` / `candidates[].style_posts`锛沗verify.mjs` 澧炲姞銆宻tyle 妯″紡蹇界暐瑙掕壊銆嶈嚜妫€锛堝叡 62 椤癸級锛汻EADME 閲嶅啓銆屾暣浣撶敾椋庡尮閰嶃€嶇珷鑺?- **0.22.0**锛歚style_match` 鏂板 **`seed_artists` 鏄惧紡鐐瑰悕绉?*鈥斺€斿叡鐜?API 鍙鐩栨瘡涓?style tag 鍓?100 鍚嶇敾甯堬紝eigaka 杩欑銆岀浉鍏冲笘鍒嗘暟浣庛€佸叡鐜伴鐜囦綆銆嶇殑 167 甯栧皬鍙蜂粛浼氭紡锛涚幇鍦ㄥ彲 `seed_artists="eigaka"` 寮哄埗绾冲叆锛堝厛鏍￠獙 鈮min_artist_posts`锛屽啀鎶撳叾浣滃搧绠?style/genre 鍚诲悎搴︼紝杈撳嚭 `seed_artist` / `seed_style_overlap`锛夛紱鍚屾椂淇灏忕敾甯堜繚鐣欏悕棰濆彧鍒嗛厤缁?<1000 甯栫殑璐﹀彿锛屽苟鍦?`small_artist_discovery.top` 鍒楀嚭鍏辩幇鍙戠幇鐨勫皬鐢诲笀鍓?10锛沗verify.mjs` 澧炲姞 1 椤硅嚜妫€锛堝叡 61 椤癸級
- **0.21.0**锛歚style_match` 鏂板**灏忎綋閲忕敾甯堝彂鐜?*鈥斺€攕tyle-tag 鍏辩幇锛坮elated_tag锛夐€氶亾鎶婁綆浜庣儹搴﹂棬妲涚殑灏忕敾甯堬紙濡?eigaka锛?67 甯栵級鎷夎繘鍊欓€夛紱`min_artist_posts`锛堥粯璁?50锛夎繃婊よ繃灏忚处鍙凤紝`small_artist_slots`锛堥粯璁?3锛変繚璇佸畠浠笉琚尋鍑哄悕鍗曪紝鍊欓€夎緭鍑?`discovered_via_style_cooccurrence` / `artist_posts` / `small_artist` / `reserved_slot`锛沗verify.mjs` 澧炲姞 1 椤硅嚜妫€
- **0.20.0**锛氭柊澧?`danbooru_image_artist_consensus`锛?*澶氭柟妗堝叡璇?*锛夆€斺€旇瀺鍚?style_match / artists_from_image / similar_artists 绛夊浠藉€欓€夊悕鍗曪紝鍙繚鐣欒 鈮min_hits` 涓柟妗堝懡涓殑鐢诲笀锛涘甫 `hits`/`hit_sources`/`avg_rank`锛屾棤浜ら泦鏃惰繑鍥為儴鍒嗛噸鍙犳骞舵爣 `fallback_used`锛沗verify.mjs` 澧炲姞 1 椤硅嚜妫€
- **0.19.1**锛歚clothing` 缁村害鏄庣‘鏀逛负銆?*鏈嶈鏉愯川鏁堟灉**銆嶁€斺€斿彧琛￠噺鍙嶅厜/楂樺厜銆侀€忔槑搴︺€佹箍韬€佽暰涓?涓濈桓鍘氬害涓庤ざ鐨憋紱鏈嶈娆惧紡鍚嶈瘝锛坄lingerie`銆乣bra`銆乣shirt`鈥︼級浣滀负韬唤鐗瑰緛琚繃婊わ紝涓嶅啀褰卞搷璇ラ」鏉冮噸锛涙枃妗ｄ笌鍙傛暟璇存槑鍚屾
- **0.19.0**锛氭寜銆屾暣浣撶敾椋庡尮閰嶏紙style_match锛夈€嶇殑瀹炴祴缁撹浼樺寲璇嗗浘鈥斺€擱EADME 鎶?`danbooru_style_match` 瀹氫负浠ュ浘鎼滅敾甯堥閫夈€乣artists_from_image` 闄嶄负浜ゅ弶楠岃瘉锛沗artists_from_image` 鏂板**鍗曠淮搴﹁瘉鎹檷鏉?*锛堝缁村害鎼滅储鏃?脳0.55锛岃緭鍑?`single_dimension` / `dimensions_used`锛夛紝淇帀銆屽彧闈?lineart 鍍忓氨涓婃銆嶇殑闂
- **0.18.1**锛歚artists_from_image` 涓嶅啀鎶?*瑙掕壊韬唤/瑁呴グ鐗瑰緛**褰撴垚鐢婚璇佹嵁鈥斺€斿彂鑹层€佺灣鑹层€佽銆佸厜鐜€佸吔鑰炽€佸熬宸淬€侀グ鍝併€佹湇瑁呭悕璇嶏紙`lingerie`銆乣bra`銆乣shirt`鈥︼級鍦ㄨ瘎鍒嗗墠鍓旈櫎骞惰繑鍥?`excluded_identity_tags`锛涙潗璐?tag锛坄latex`銆乣lace`銆乣see-through_clothes`锛変繚鐣欍€傚叏閮?tag 閮芥槸韬唤鐗瑰緛鏃舵槑纭姤閿欙紝鎻愮ず鏀逛紶缁樺埗鎵嬫硶绫?tag
- **0.18.0**锛歚danbooru_style_match` 鏀寔**澶氳鑹?*鈥斺€擿character` 鍙紶閫楀彿鍒嗛殧鐨勫涓鑹诧紙鏈€澶?3 涓紝鍓嶄袱涓悇璺戝叏绔欓珮鍒嗛敋鐐瑰苟鍙備笌鍚岃鑹叉牳楠岋級锛涙柊澧?`reference.characters` 涓?`same_character_breakdown`锛堥€愯鑹蹭綔鍝佹暟锛屾€绘暟浠嶄负 `same_character_posts`锛夛紱`verify.mjs` 澧炲姞澶氳鑹茶嚜妫€锛汻EADME 澧炲姞銆屽寮犲弬鑰冨浘 / 澶氳鑹层€嶅伐浣滄祦涓?15 鍥炬渚?- **0.17.0**锛氭柊澧?`danbooru_style_match`锛堟暣浣撶敾椋庡尮閰嶏級锛氳鑹查敋瀹?+ 鍏ㄧ珯楂樺垎 `order:score` 鎵弿锛堝悕娆¤“鍑忓姞鏉冿級+ `瑙掕壊脳棰樻潗/鐢婚`銆乣鐢婚脳棰樻潗` pair 鍏滃簳 + `鐢诲笀脳瑙掕壊` 鍚岃鑹叉牳楠?+ 渚嬪浘锛涜緭鍑哄叚椤圭洰瑙嗘牳瀵规竻鍗曚笌 `prefer_artists`/`avoid_artists` 杩唬鍙傛暟锛岃繑鍥炴柊澧?`anchor_scans`銆乣anchor_score`/`pair_score`/`chart_top` 瀛楁锛堝叏绔欏墠 10 鍚嶄綔鍝侀澶?脳1.3锛夛紱`verify.mjs` 澧炲姞 5 椤硅嚜妫€
- **0.16.1**锛歊EADME 鍦ㄣ€屽畤瀹欏厤璐ｅ０鏄庛€嶄笌銆屽畨瑁呫€嶄箣闂存柊澧炪€屽ぇ鑷翠娇鐢ㄦ暀绋嬶紙鎴浘鐗堬級銆嶄笁寮犵ず渚嬪浘锛堜互鍥炬悳鐢诲笀 / 鎸夊勾浠芥壘鑹插僵鑹充附浣滃搧 / 鐩镐技鐢诲笀+骞翠唤闄愬畾锛夛紝鍥剧墖瀛樹簬 `docs/tutorial/`
- **0.16.0**锛歚artists_from_image` 鏂板 **鏈嶈璐ㄦ劅** 缁村害 `clothing_tags`锛坧erson 0.10 / style 0.12锛屼笓鍚?`latex`銆乣leather`銆乣shiny_clothes`銆乣see-through_clothes` 绛夋潗璐?tag锛夛紱绾挎潯/鎵嬫硶鏉冮噸寰皟锛坧erson 0.18/0.22銆乻tyle 0.24/0.28锛夛紝鍏朵綑缁村害绛夋瘮涓嬭皟锛屾€诲拰浠嶄负 1
- **0.15.2**锛氬姞寮虹嚎鏉′笌缁樺埗鎵嬫硶鐨勫弬鑰冩潈閲嶁€斺€擿artists_from_image` person 妯″紡 lineart 0.12鈫?*0.20**銆乼echnique 0.20鈫?*0.24**锛泂tyle 妯″紡 lineart 0.18鈫?*0.26**銆乼echnique 0.26鈫?*0.30**锛堝叾浣欑淮搴︾瓑姣斾笅璋冿紝鎬诲拰浠嶄负 1锛?- **0.15.1**锛氭€ц兘浼樺寲鈥斺€旂櫥褰曞悗鑷姩浣跨敤 0.4 绉掗檺閫熼棿闅旓紙鍖垮悕浠?1.1 绉掞級锛屽璇锋眰宸ュ叿鏁翠綋蹇害 2鈥?.7 鍊嶏紙瀹炴祴 12 璇锋眰鐨?`year_artists` 12.8s 鈫?6.4s锛夛紱鏂板 `minIntervalMsAuthenticated` / `DANBOORU_MIN_INTERVAL_AUTH_MS`锛涘叾浠栬涓恒€佽緭鍑轰笌鎺掑簭涓嶅彉
- **0.15.0**锛氬€熼壌浠ュ浘鎼滃浘鐨勩€岃繎閲嶅鑱氱被銆嶁€斺€斾互 `parent_id`/`md5` 鎶婂悓涓€寮犵敾鐨勪笉鍚屽彉浣擄紙鏀硅壊銆佽鍒囥€乿ariant 甯栵級褰掍负涓€涓瑙夌皣锛沗artists_from_image` 鎸夌皣鍘婚噸鍚庡啀鑱氬悎璇佹嵁锛屼緥鍥惧彧鍙栦笉鍚岀皣锛沗part_specialists` 涔熸寜绨囨姌鍙犻噸澶嶅浘锛涜緭鍑哄鍔?`dedupe` 涓庢瘡缁?`unique_clusters` / `deduped_posts`
- **0.14.0**锛氱溂鐫涜壊褰╀粠銆屼汉浣撻檮鍔犲弬鑰冦€嶄腑绉婚櫎锛涙柊澧炪€屾暣浣撹壊璋冨弬鑰冦€峘color_tags` / `color_match` / `color_threshold`锛坄monochrome`銆乣limited_palette`銆乣pastel_colors`銆乣blue_theme`銆乣colorful`銆乣iridescent` 绛夛級锛岃繑鍥?`color.per_tag` 涓?`color.best` 鍙傝€冨浘
- **0.13.0**锛歚danbooru_year_artists` 鏂板銆屼汉浣撻檮鍔犲弬鑰冦€峘appearance_tags` / `appearance_match` / `appearance_threshold`锛氬湪鍚屼竴鎵规牳楠屼綔鍝佷笂缁熻鑲よ壊銆佺毊鑲よ川鎰?tag锛坄per_tag` 鍛戒腑鏁?+ `ratio` + `appearance.best` 鍙傝€冨浘锛夛紝鍙彧缁熻鎴栨寜姣斾緥鍔犻椄闂?- **0.12.2**锛氭彃浠舵爣棰?浠嬬粛缁熶竴鍔?`DSH-` 鍓嶇紑锛屽苟鏄庣‘鏍囨敞銆孌SH bundle锛屼笉鏄彲鐙珛杩愯鐨勭▼搴忋€?- **0.12.1**锛氫粨搴撹浆涓哄叕寮€锛汻EADME 涓庢彃浠朵粙缁嶆爣娉ㄣ€孉I 鍒朵綔銆嶏紱瀹夎绔犺妭鎷嗗垎涓恒€屼笅杞藉寘 / git clone + link / 婧愮爜 zip銆嶄笁绉嶆柟妗堬紱鏂板銆屽畤瀹欏厤璐ｅ０鏄庛€嶏紙璺戣矾鏉℃锛?- **0.12.0**锛氳繃婊?闄嶆潈 3D 娓叉煋锛坄3d`/`photorealistic`/`faux_3d`锛夛細鐩镐技搴﹂檷鏉?0.05銆佷互鍥炬悳鐢诲笀鎸?`three_d_share` 鎵ｅ垎銆佷緥鍥句笌閮ㄤ綅鍥句紭鍏堟帓闄?3D
- **0.11.0**锛氫互鍥炬悳鐢诲笀鏂板 `lineart_tags`锛堢嚎鏉★級涓?`lighting_tags`锛堝厜鐓э級缁村害锛屼笖姣忎釜缁村害鏈€澶?4 涓?tag 鍏ㄩ儴鍙備笌妫€绱紙涔嬪墠鍙煡鍓嶄袱涓級锛岀嚎鏉?鑹插僵/鍏夌収姝ｅ紡杩涘叆璇勫垎
- **0.10.1**锛氫互鍥炬悳鐢诲笀榛樿涓嶉檺骞翠唤锛坄year` 涓嶅～=鍏ㄦ椂闂达級锛屼慨澶嶈緭鍑洪噷鐨勯潪 JSON 鍊煎鑷?`not lossless JSON` 鐨勯棶棰?- **0.10.0**锛氭柊澧?`danbooru_part_specialists`锛堥儴浣嶇壒鍖栵細鎸夐儴浣嶇劍鐐?tag 鐨勯珮鏀惰棌浣滃搧鑱氬悎鐢诲笀鎺掑悕 + 閮ㄤ綅楂樻敹钘忓浘鐗囷級
- **0.9.1**锛氬叏宸ュ叿鍙繑鍥炲浘鐗囷紙杩囨护 `mp4`/`webm` 绛夎棰戯紱鎼滅储銆佺敾甯堝弬鑰冨浘銆佷緥鍥惧潎璺宠繃瑙嗛锛?- **0.9.0**锛氭柊澧?`danbooru_artists_from_image`锛堜互鍥炬悳鐢诲笀锛屽垎灞備紭鍏堢骇锛氫汉鐗┾啋琛ㄦ儏鈫掔粯鍒舵墜娉曗啋鑹插僵鈫抰ag锛沗mode="style"` 鏃舵墜娉?鑹插僵浼樺厛锛?- **0.8.3**锛氭竻鐞嗚繃鏃舵枃妗ｏ紙閲嶅鐨勫畨瑁呯珷鑺傘€佹棫鐨勮嚜妫€鑰楁椂銆佸伐鍏锋暟閲忥級锛孌SH 鍐呬笌浠撳簱璇存槑鍚屾涓哄綋鍓嶈兘鍔涳紙琛ㄦ儏鐢诲儚/浣欏鸡銆佷緥鍥捐蒋瑙勫垯銆乫urry 闄嶆潈锛?- **0.8.2**锛氫緥鍥炬敼涓鸿蒋瑙勫垯锛堥粯璁や紭鍏堝甫鑴革紝`allow_no_face=true` 鏀捐鏃犺劯鏋勫浘锛夛紱`furry` 绫?tag 鐩镐技搴︽潈閲?脳0.05锛涜繃婊ゆ棤 `sample_url` 鐨勪緥鍥?- **0.8.1**锛氫緥鍥惧己鍒跺尮閰嶉渶姹?tag 骞惰烦杩囬殣钘忚劯鐨勬瀯鍥撅紙宸茬敱 0.8.2 鏀逛负杞鍒欙級
- **0.8.0**锛氱浉浼肩敾甯堟柊澧炶〃鎯呯敾鍍忋€佽〃鎯?tag 鎵╁睍銆佺█鏈夊害鍔犳潈琛ㄦ儏浣欏鸡涓庨鏍奸噸鍙犳鏌?- **0.7.2**锛氫緥鍥炬寜闇€闄勫甫鏍峰浘 URL锛坄examples`锛?- **0.7.0**锛氭柊澧?`danbooru_similar_artists`锛坱ag 鐢诲儚鐩镐技鐢诲笀锛?