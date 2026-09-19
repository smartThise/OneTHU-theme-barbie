/**
 * 芭比粉主题离线自检：令牌名合法性、必覆盖项、CSS 作用域、文字对比度阈值。
 * 跑法：node test.mjs
 *
 * 自检的目的不是「跑通」，而是把主题的边界契约钉成断言：令牌名必须真实存在
 * （否则静默失效）、CSS 必须全作用域限定（否则污染其他主题）、文字必须可读
 * （配色靠肉眼判断最容易翻车的一环）。
 */
import { manifest, theme } from "./plugin.js";

let pass = 0, fail = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++;
  else { fail++; console.error(`✗ ${name}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }
};
const ok = (name, cond) => eq(name, !!cond, true);

/* ── tokens.css 的全部令牌名（theme.vars 只允许覆盖这些） ── */
const TOKENS = new Set([
  "bg", "bg-soft", "surface", "surface-2", "surface-3", "skeleton",
  "border", "border-soft", "border-strong",
  "text-1", "text-2", "text-3", "text-dim",
  "primary", "primary-hover", "on-primary", "accent", "accent-soft", "accent-border",
  "red", "red-soft", "amber", "amber-soft", "green", "green-soft",
  "hover", "active", "ring", "shadow-1", "shadow-2", "shadow-3",
  "font-ui", "font-mono",
  "text-xxs", "text-xs", "text-sm", "text-base", "text-md", "text-lg", "text-xl",
  "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6",
  "r-sm", "r-md", "r-lg", "r-pill", "sidebar-w",
].map((k) => `--${k}`));

/* ── 对比度（WCAG 2.1 相对亮度；仅支持不透明色，半透明令牌不参与） ── */
function luminance(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const isHex = (v) => /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(v);
const contrastOk = (name, fg, bg, min) => {
  if (!isHex(fg) || !isHex(bg)) { eq(`${name}（非纯色跳过）`, true, true); return; }
  const r = ratio(fg, bg);
  ok(`${name} 对比度 ${r.toFixed(2)}:1 ≥ ${min}:1`, r >= min);
};

/* ── 清单 ── */
eq("manifest.id", manifest.id, "onethu.theme.barbie");
eq("category=theme", manifest.category, "theme");
eq("不申请权限", manifest.permissions, []);
ok("有版本号", /^\d+\.\d+\.\d+$/.test(manifest.version));
ok("有仓库地址", typeof manifest.repo === "string" && manifest.repo.includes("github.com"));

/* ── theme 定义 ── */
eq("theme.id 与清单一致", theme.id, manifest.id);
eq("theme.name 与清单一致", theme.name, manifest.name);
eq("theme.version 与清单一致", theme.version, manifest.version);
ok("非暗色主题（亮粉）", theme.dark !== true);
ok("有描述", typeof theme.description === "string" && theme.description.length > 8);

/* ── 令牌 ── */
const keys = Object.keys(theme.vars);
ok("令牌覆盖数量 ≥ 20", keys.length >= 20);
for (const k of keys) ok(`令牌名合法 ${k}`, TOKENS.has(k));
for (const k of keys) ok(`令牌值非空 ${k}`, typeof theme.vars[k] === "string" && theme.vars[k].trim() !== "");
for (const k of ["--bg", "--surface", "--text-1", "--text-2", "--primary", "--on-primary",
                 "--accent", "--accent-soft", "--accent-border", "--border", "--hover", "--ring"]) {
  ok(`必覆盖 ${k}`, k in theme.vars);
}
ok("主按钮不是白底白字", theme.vars["--primary"] !== theme.vars["--on-primary"]);

/* ── 对比度 ── */
const v = theme.vars;
contrastOk("正文 / 底色", v["--text-1"], v["--bg"], 7);
contrastOk("正文 / 卡片面", v["--text-1"], v["--surface"], 7);
contrastOk("次要字 / 底色", v["--text-2"], v["--bg"], 4.5);
contrastOk("三级字 / 底色", v["--text-3"], v["--bg"], 4.5);
contrastOk("链接强调 / 底色", v["--accent"], v["--bg"], 4.5);
contrastOk("按钮字 / 主按钮", v["--on-primary"], v["--primary"], 4.5);
contrastOk("按钮字 / hover", v["--on-primary"], v["--primary-hover"], 4.5);

/* 附加 CSS 里的渐变按钮：两端都得留住白字 */
const grads = [...theme.css.matchAll(/linear-gradient\(135deg,\s*(#[0-9a-f]{3,6})\s+0%,\s*(#[0-9a-f]{3,6})\s+100%\)/gi)];
ok("找到渐变按钮规则", grads.length >= 1);
for (const [, a, b] of grads) {
  contrastOk(`渐变起点 ${a} / 白字`, "#ffffff", a, 4.5);
  contrastOk(`渐变终点 ${b} / 白字`, "#ffffff", b, 4.5);
}

/* ── 品牌 logo ── */
ok("logo 是 inline SVG", theme.logo.includes("<svg") && theme.logo.includes("</svg>"));
ok("logo viewBox 24×24", theme.logo.includes('viewBox="0 0 24 24"'));
ok("logo 跟随 currentColor", theme.logo.includes("currentColor"));
ok("logo 无脚本 / 外链", !/<script|href=|xlink:href/i.test(theme.logo));

/* ── 附加 CSS 的作用域 ── */
const SCOPE = `:root[data-theme="${theme.id}"]`;
const rules = [...theme.css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
ok("CSS 规则数 ≥ 4", rules.length >= 4);
for (const [, selector] of rules) {
  ok(`作用域限定 ${selector.trim().slice(0, 48)}`, selector.trim().startsWith(SCOPE));
}
const scoped = theme.css.split(SCOPE).length - 1;
eq("每条规则各带一次作用域前缀", scoped, rules.length);

console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
process.exit(fail === 0 ? 0 : 1);
