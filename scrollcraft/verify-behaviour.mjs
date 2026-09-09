// Behaviour checks the scrollcraft harness does not cover: accordion, hash
// deep links, sidebar status, keyboard travel, rail overflow, tab order.
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://localhost:3000";
const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const results = [];
const check = (name, ok, detail = "") =>
  results.push({ name, ok: Boolean(ok), detail: String(detail) });

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector("html.sc-ready", { timeout: 10000 });

check("engine mounted", await page.evaluate(() => window.ScrollCraft?.instances.length === 1));

const overflow = await page.evaluate(() => {
  const rail = document.querySelector(".stack-rail");
  return rail ? rail.scrollWidth - innerWidth : -1;
});
check("stack rail overflow >= half viewport", overflow >= 720, `${overflow}px`);

const order = await page.evaluate(() =>
  [...document.querySelectorAll("#builds ol > li h3 button")].map((b) => b.id),
);
check("builds order daysi, vantage, raphel, sentry, twenty", order.join(",") === "build-daysi-button,build-vantage-button,build-raphel-button,build-sentry-button,build-twenty-button", order.join(","));

await page.click("#build-vantage-button");
await page.waitForTimeout(600);
check("vantage expanded", await page.getAttribute("#build-vantage-button", "aria-expanded") === "true");
check("hash updated", await page.evaluate(() => location.hash) === "#builds/vantage", await page.evaluate(() => location.hash));
check("panel not aria-hidden", await page.getAttribute("#build-vantage-panel", "aria-hidden") === "false");
check("live link tabbable when open", await page.evaluate(() => document.querySelector("#build-vantage-panel a")?.tabIndex) === 0);
check("sidebar status shows open", (await page.textContent("aside")).includes("open: vantage"));
const panelHeight = await page.evaluate(() => document.querySelector("#build-vantage-panel").getBoundingClientRect().height);
check("panel has height", panelHeight > 200, `${panelHeight}px`);

await page.click("#build-raphel-button");
await page.waitForTimeout(600);
check("one open at a time", await page.getAttribute("#build-vantage-button", "aria-expanded") === "false" && await page.getAttribute("#build-raphel-button", "aria-expanded") === "true");

await page.focus("#build-raphel-button");
await page.keyboard.press("ArrowDown");
check("ArrowDown moves focus", await page.evaluate(() => document.activeElement?.id) === "build-sentry-button");
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
check("Escape closes and refocuses", await page.getAttribute("#build-raphel-button", "aria-expanded") === "false" && await page.evaluate(() => document.activeElement?.id) === "build-raphel-button");
check("status back to receiving", (await page.textContent("aside")).includes("receiving"));
check("closed panel links not tabbable", await page.evaluate(() => document.querySelector("#build-raphel-panel a")?.tabIndex) === -1);

await page.goto(`${url}/#builds/sentry`.replace("//#","/#"), { waitUntil: "networkidle" });
await page.waitForTimeout(800);
check("deep link opens sentry", await page.getAttribute("#build-sentry-button", "aria-expanded") === "true");
const sentryTop = await page.evaluate(() => document.getElementById("build-sentry-button").getBoundingClientRect().top);
check("deep link scrolled row near top fifth", sentryTop > 0 && sentryTop < 400, `${Math.round(sentryTop)}px`);

await page.goto(url, { waitUntil: "networkidle" });
await page.click('aside a[href="#stack"]');
await page.waitForTimeout(1200);
check("jump list reaches stack", await page.evaluate(() => document.querySelector('aside a[href="#stack"]').className.includes("bg-surface")));

await page.goto(url, { waitUntil: "networkidle" });
const tabs = [];
for (let i = 0; i < 9; i += 1) {
  await page.keyboard.press("Tab");
  tabs.push(await page.evaluate(() => {
    const el = document.activeElement;
    return `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.getAttribute("href") ? "[" + el.getAttribute("href") + "]" : ""}`;
  }));
}
check("tab order starts in sidebar chrome", tabs[0].includes("#identity") && tabs[1].includes("#identity") && tabs[2].includes("#builds"), tabs.join(" > "));

await page.fill("#line", "hello");
check("prompt accepts input", await page.inputValue("#line") === "hello");

await browser.close();
for (const r of results) console.log(`${r.ok ? "ok  " : "FAIL"} ${r.name}${r.detail ? `  (${r.detail})` : ""}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
