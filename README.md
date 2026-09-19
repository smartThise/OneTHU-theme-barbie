# OneTHU-theme-barbie

OneTHU 主题插件示例：**芭比粉**——用最少的代码展示主题插件的完整形态，可作为新主题
的模板。

## 主题构成

| 部分 | 做法 |
|---|---|
| 配色 | `vars` 覆盖 `tokens.css` 设计令牌：品红强调、粉纸面、深梅字色 |
| 品牌标识 | `logo` 把侧栏 / 顶栏 / 登录页的 OneTHU 字样换成四角星标，`currentColor` 跟随主题 |
| 细节 | `css` 附加作用域规则：侧栏渐变、激活项粉底、主按钮渐变、标签描边 |
| 形状 | 圆角令牌整体放松一档（`--r-sm/md/lg`），观感更软 |

配色不是随手调的：正文、次要字、三级字、链接、按钮白字都按 WCAG 对比度阈值选值
（正文 ≥ 7:1，其余 ≥ 4.5:1），`test.mjs` 会把这些阈值钉成断言。

## 安装与启用

OneTHU → 插件 → 安装面板「GitHub 仓库」输入 `smartThise/OneTHU-theme-barbie`，
或在插件市场搜索「芭比粉」。安装后在 插件页 → 主题 中选中「芭比粉」生效；设置 →
外观 可把它设为「白天主题」，配合昼夜调度自动切换。

主题插件没有激活函数、不申请任何权限（`permissions: []`），安装即可用。

## 文件

- `plugin.js`：主题本体（`manifest` + `theme`，单文件 ES 模块）
- `test.mjs`：离线自检（令牌名合法性、必覆盖项、CSS 作用域、对比度阈值），`node test.mjs` 直跑
- `package.json`：仅为 `node test.mjs` 的模块解析与 `npm test` 提供，应用不读取

## 边界

主题只做令牌覆盖与颜色层面的附加 CSS，不改组件结构、不改布局骨架；附加 CSS 的每条
规则都以 `:root[data-theme="onethu.theme.barbie"]` 限定作用域。

开发文档见 OneTHU 主仓库 `docs/plugin-development.md` §3.4 主题插件。
