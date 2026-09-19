/**
 * 芭比粉主题 —— OneTHU 主题插件示例
 *
 * 主题插件是最简形态：`manifest.category === "theme"` + `export const theme`，
 * 没有激活函数、不申请任何权限。能力边界只有三样：
 *   ① `vars`  覆盖 tokens.css 的设计令牌（配色 / 圆角 / 阴影）
 *   ② `logo`  替换品牌标识（inline SVG）
 *   ③ `css`   作用域限定的附加规则（只碰颜色，不碰结构）
 *
 * 想换配色：改 `theme.vars` 即可；想加细节：往 `theme.css` 里加一条带
 * `:root[data-theme="onethu.theme.barbie"]` 前缀的规则。
 */

export const manifest = {
  id: "onethu.theme.barbie",
  name: "芭比粉",
  version: "1.0.0",
  author: "OneTHU",
  category: "theme",
  description: "品红强调 + 粉纸面 + 深梅字色：亮粉但不刺眼的一套粉调外观。",
  repo: "https://github.com/smartThise/OneTHU-theme-barbie",
  // 主题插件不需要任何能力：没有 ctx、没有命令、没有网络与存储访问
  permissions: [],
};

export const theme = {
  id: "onethu.theme.barbie",
  name: "芭比粉",
  version: "1.0.0",
  author: "OneTHU",
  description: "品红强调 + 粉纸面 + 深梅字色：亮粉但不刺眼的一套粉调外观。",

  vars: {
    /* 面：粉纸面，卡片保持纯白以留住层次 */
    "--bg": "#fff7fb",
    "--bg-soft": "#ffeef7",
    "--surface": "#ffffff",
    "--surface-2": "#fff4f9",
    "--surface-3": "#ffe3f1",
    "--skeleton": "rgba(216, 27, 127, 0.06)",

    /* 线：品红描边，软硬三档 */
    "--border": "rgba(216, 27, 127, 0.16)",
    "--border-soft": "rgba(216, 27, 127, 0.07)",
    "--border-strong": "rgba(216, 27, 127, 0.30)",

    /* 字：深梅正文 + 玫瑰次要字，三档都在 4.5:1 以上 */
    "--text-1": "#3a0a24",
    "--text-2": "#7a3f5e",
    "--text-3": "#96607c",
    "--text-dim": "#f2cadf",

    /* 品牌与强调：主按钮品红，白字对比 4.8:1 */
    "--primary": "#d81b7f",
    "--primary-hover": "#bd156d",
    "--on-primary": "#ffffff",
    "--accent": "#d0247f",
    "--accent-soft": "#ffe8f4",
    "--accent-border": "#ffc2e0",

    /* 交互态与焦点环 */
    "--hover": "rgba(216, 27, 127, 0.07)",
    "--active": "rgba(216, 27, 127, 0.12)",
    "--ring": "0 0 0 3px rgba(216, 27, 127, 0.25)",

    /* 阴影：带粉调的投影，比灰色更贴底色 */
    "--shadow-1": "0 2px 4px rgba(150, 18, 90, 0.07)",
    "--shadow-2": "0 2px 8px rgba(150, 18, 90, 0.06), 0 6px 16px rgba(150, 18, 90, 0.04)",
    "--shadow-3": "0 0 1px rgba(110, 10, 62, 0.20), 0 12px 32px rgba(150, 18, 90, 0.13)",

    /* 形状：圆角整体放松一档，观感更软 */
    "--r-sm": "7px",
    "--r-md": "10px",
    "--r-lg": "14px",
  },

  /* 品牌标识：四角星 + 小星，currentColor 跟随使用处颜色
   * （侧栏取 --text-1，附加 CSS 里另把它点成品红） */
  logo: `<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" aria-hidden="true">
  <path fill="currentColor" d="M9.4 1.6c.72 3.3 1.94 4.52 5.24 5.24-3.3.72-4.52 1.94-5.24 5.24-.72-3.3-1.94-4.52-5.24-5.24 3.3-.72 4.52-1.94 5.24-5.24Z"/>
  <path fill="currentColor" opacity=".55" d="M16.9 12.4c.55 2.5 1.48 3.43 3.98 3.98-2.5.55-3.43 1.48-3.98 3.98-.55-2.5-1.48-3.43-3.98-3.98 2.5-.55 3.43-1.48 3.98-3.98Z"/>
  <path fill="currentColor" opacity=".35" d="M6.6 14.6c.42 1.9 1.13 2.61 3.03 3.03-1.9.42-2.61 1.13-3.03 3.03-.42-1.9-1.13-2.61-3.03-3.03 1.9-.42 2.61-1.13 3.03-3.03Z"/>
</svg>`,

  /* 附加 CSS：每条规则都以 :root[data-theme="onethu.theme.barbie"] 限定作用域，
   * 且只改颜色 / 背景 / 阴影，不改尺寸与布局。 */
  css: `
:root[data-theme="onethu.theme.barbie"] .sidebar {
  background: linear-gradient(180deg, #fff8fc 0%, #ffeff8 58%, #ffe4f2 100%);
}
:root[data-theme="onethu.theme.barbie"] .nav-item.is-active {
  background: linear-gradient(90deg, #ffdcee 0%, #ffeff8 100%);
  box-shadow: inset 0 0 0 1px var(--accent-border);
}
:root[data-theme="onethu.theme.barbie"] .brand-logo-themed {
  color: var(--accent);
}
:root[data-theme="onethu.theme.barbie"] .btn-primary {
  background: linear-gradient(135deg, #db1a80 0%, #b8146a 100%);
  border-color: #c8176f;
}
:root[data-theme="onethu.theme.barbie"] .btn-primary:hover {
  background: linear-gradient(135deg, #c8176f 0%, #a21160 100%);
  border-color: #a21160;
}
:root[data-theme="onethu.theme.barbie"] .chip {
  border-color: var(--accent-border);
}
`,
};
