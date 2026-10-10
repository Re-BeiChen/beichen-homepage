# 北尘的主页

[beichen.icu](https://www.beichen.icu) 的源码 —— 一个用 Vue 3 + Vite 构建的静态单页站点。

> My personal homepage, built with Vue 3, Vite and Tailwind CSS.

## 页面

| 路由 | 内容 |
| :-- | :-- |
| `/` | 自我介绍、涉猎、正在使用的项目、致谢 |
| `/links` | 友情链接 |
| `/socials` | 社交平台 |
| `/donate` | 打赏支持 |
| `/projects` | GitHub 贡献图、我的团队、我的项目 |

## 技术栈

| 用途 | 选型 |
| :-- | :-- |
| 框架 | Vue 3（`<script setup>` + Composition API） |
| 构建 | Vite 5 |
| 语言 | TypeScript（`npm run build` 会先跑 `vue-tsc` 类型检查） |
| 样式 | Tailwind CSS 3，`darkMode: 'class'` |
| 组件 | `radix-vue`，UI 层是 shadcn-vue 风格的自有封装 |
| 路由 | vue-router 4，history 模式，按路由懒加载 |
| 图标 | lucide-vue-next |

## 功能

- **主题**：默认跟随系统的 `prefers-color-scheme`；手动切换后写入 `localStorage`，此后不再跟随系统
- **入场动画**：首屏标题从下方缩放淡入，正文各区块随后错峰浮现；路由切换有过渡
- **桌面歌词**：可拖动，可右键调整字号与颜色；位置记录在 `localStorage`
- **逐词高亮**：歌词取 AMLL 歌词库的逐词 TTML，按每个字的时间轴做渐变扫过高亮
- **音乐播放器**：播放列表与歌词均在运行时拉取

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 类型检查 + 构建，输出到 dist/
npm run preview    # 预览构建产物
```

## 部署

纯静态站点，任意静态托管都可以。以 Cloudflare Pages 为例：

| 配置项 | 值 |
| :-- | :-- |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |

[`public/_redirects`](public/_redirects) 提供 SPA 路由兜底：

```
/*    /index.html   200
```

没有它的话，直接访问或刷新 `/projects` 这类路径会 404 —— 因为 `dist/` 里并不存在这些物理文件。注意结尾必须是 `200`（rewrite），写成 `301`/`302` 会变成真跳转。

## 关于第三方数据

播放列表和歌词都是**运行时**从第三方服务拉取的，仓库里不含任何歌曲或歌词文件。所以两件事取决于外部服务，不是代码能决定的：

- **音源**：网易云对需要会员或版权受限的曲目不向匿名接口发放播放地址，这类曲目会拿到空响应并被播放器跳过。
- **逐词覆盖**：AMLL 是社区共建的歌词库，收录量有限（对当前歌单抽样约 13%）。库里没有的歌会退回网易云的逐行歌词，因此没有逐字效果，只能整句切换。

| 数据 | 来源 |
| :-- | :-- |
| 播放列表 | `api.i-meto.com` 的公开 meting 实例 |
| 逐词歌词 | [amll-dev/amll-ttml-db](https://github.com/amll-dev/amll-ttml-db)，经 jsDelivr 与社区镜像读取 |
| 兜底歌词 | 网易云，经上述 meting 实例 |

## 项目结构

```
src/
├── components/
│   ├── music/       # 播放器、桌面歌词、播放列表
│   └── ui/          # 基础 UI 组件
├── composables/     # 主题、音频、歌词、拖拽、入场动画
├── data/            # 手写数据：友链、项目、社交平台
├── views/           # 五个页面
├── router/
└── assets/
```
