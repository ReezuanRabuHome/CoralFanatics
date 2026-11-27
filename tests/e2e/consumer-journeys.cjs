/**
 * Consumer journey checks for the prototype, written from a shopper's point of view.
 *
 * Run against a running site:   npm run build && npm start   (then, in another terminal)
 *                               BASE_URL=http://localhost:3000 node tests/e2e/consumer-journeys.cjs
 * Requires Playwright with Chromium available (`require("playwright")`).
 * Exits non-zero if any check fails.
 */
const { chromium, devices } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3000";

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", `${name}: ${e.message.split("\n")[0]}`]);
  }
}
function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const watch = (page) => {
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  };

  /* ───────── Mobile shopper: coral + dry goods, delivery ───────── */
  const m = await (await browser.newContext({ ...devices["iPhone 13"] })).newPage();
  watch(m);

  await check("Homepage loads with hero headline", async () => {
    await m.goto(BASE + "/", { waitUntil: "load" });
    expect(await m.getByRole("heading", { name: "A world beneath the surface." }).isVisible(), "hero headline missing");
  });

  await check("Mobile menu opens, shows links and closes on navigation", async () => {
    await m.getByRole("button", { name: "Open menu" }).click();
    const nav = m.getByRole("navigation", { name: "Mobile" });
    await nav.getByRole("link", { name: "Corals" }).waitFor();
    await nav.getByRole("link", { name: "Corals" }).click();
    await m.waitForURL(/\/corals\/sps/);
    await m.getByRole("link", { name: "Check an order" }).waitFor({ state: "hidden", timeout: 2000 });
  });

  await check("Coral listing filter narrows results and can be cleared", async () => {
    const cards = m.locator("main ul li a[href*='/corals/']");
    const before = await cards.count();
    await m.getByRole("button", { name: /^Filter/ }).click();
    await m.getByRole("dialog", { name: "Filter corals" }).getByRole("button", { name: /^Montipora/ }).click();
    await m.getByRole("button", { name: /^Show \d+ results/ }).click();
    await m.waitForTimeout(300);
    const after = await cards.count();
    expect(after > 0 && after < before, `filter did not narrow (${before} → ${after})`);
    await m.getByRole("button", { name: "Clear all" }).click();
    await m.waitForTimeout(200);
    expect((await cards.count()) === before, "clear all did not restore results");
  });

  await check("Coral page: add to bag, cannot add the same piece twice", async () => {
    await m.goto(BASE + "/corals/lps/hammer-coral/cf-lps-0089", { waitUntil: "load" });
    await m.getByRole("button", { name: "Add to bag" }).last().click();
    await m.getByRole("dialog", { name: "Your bag" }).waitFor();
    await m.getByRole("button", { name: "Continue shopping" }).click();
    const btn = m.getByRole("button", { name: /In your bag/ }).last();
    expect(await btn.isDisabled(), "specimen button should be disabled once in bag");
  });

  await check("Reserved coral cannot be bought", async () => {
    await m.goto(BASE + "/corals/sps/fox-flame-acropora/cf-sps-0139", { waitUntil: "load" });
    expect((await m.getByRole("button", { name: "Add to bag" }).count()) === 0, "reserved piece shows Add to bag");
    expect(await m.getByText(/Someone is checking out with this piece/).isVisible(), "reserved explanation missing");
  });

  await check("Dry goods: choose size, quantity capped at stock with a message", async () => {
    await m.goto(BASE + "/equipment/reef-salt-mix", { waitUntil: "load" });
    await m.getByRole("button", { name: /22 kg/ }).click();
    const inc = m.getByRole("button", { name: "Increase quantity" }).last();
    while (!(await inc.isDisabled())) await inc.click();
    await m.getByRole("button", { name: "Add to bag" }).last().click();
    await m.getByRole("button", { name: "Continue shopping" }).click();
    await m.getByRole("button", { name: "Add to bag" }).last().click();
    const notice = m.getByRole("dialog", { name: "Your bag" }).getByRole("status");
    expect(/Only 3 available/.test(await notice.innerText()), "no stock-limit message");
  });

  await check("Checkout: missing details are pointed out, not silently blocked", async () => {
    await m.getByRole("link", { name: "Checkout" }).click();
    await m.waitForURL(/\/checkout$/);
    await m.getByRole("button", { name: /^Pay/ }).click();
    expect(await m.getByRole("alert").filter({ hasText: "highlighted" }).isVisible(), "no validation message");
    expect(m.url().endsWith("/checkout"), "should stay on checkout");
  });

  await check("Checkout: phone number with a space is accepted", async () => {
    await m.fill("#phone", "8123 4567");
    expect(await m.$eval("#phone", (el) => el.checkValidity()), "'8123 4567' rejected");
  });

  await check("Checkout: delivery, pay, confirmation, bag emptied", async () => {
    await m.fill("#email", "shopper@example.com");
    await m.fill("#name", "Alex Tan");
    await m.getByText("Deliver to me").click();
    await m.fill("#postal", "123456");
    await m.fill("#street", "Blk 123 Example Street 45");
    await m.locator("input[type=checkbox][required]").check();
    await m.getByRole("button", { name: /^Pay/ }).click();
    await m.getByText("Securing your order").waitFor();
    await m.waitForURL(/\/checkout\/confirmation/, { timeout: 8000 });
    await m.getByRole("heading", { name: /Thank you, Alex/ }).waitFor({ timeout: 3000 });
    expect(await m.getByText("Reef Salt Mix").isVisible(), "ordered item missing on confirmation");
    expect((await m.getByRole("button", { name: /Bag, 0 items/ }).count()) === 1, "bag not emptied");
  });

  await check("Order lookup finds the order just placed", async () => {
    const number = (await m.locator("[data-order-number]").innerText()).trim();
    await m.goto(BASE + "/order-lookup", { waitUntil: "load" });
    await m.fill("#number", number);
    await m.fill("#email", "shopper@example.com");
    await m.getByRole("button", { name: "Check order" }).click();
    expect(await m.getByText("Payment confirmed").isVisible(), "order status not shown");
  });

  /* ───────── Desktop shopper: search, browse, collection ───────── */
  const d = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  watch(d);

  await check("Search finds by name and by specimen ID", async () => {
    await d.goto(BASE + "/search", { waitUntil: "load" });
    await d.getByPlaceholder(/Search corals/).fill("tang");
    expect(await d.getByText("Regal Blue Tang").first().isVisible(), "name search failed");
    await d.getByPlaceholder(/Search corals/).fill("0146");
    expect(await d.getByText("Lime Acropora").first().isVisible(), "specimen ID search failed");
  });

  await check("Homepage shelf scrolls with arrow buttons", async () => {
    await d.goto(BASE + "/", { waitUntil: "load" });
    const fwd = d.getByRole("button", { name: "Scroll forward" }).first();
    await fwd.scrollIntoViewIfNeeded();
    expect(!(await fwd.isDisabled()), "forward arrow disabled at start");
    await fwd.click();
    await d.waitForTimeout(900);
    expect(!(await d.getByRole("button", { name: "Scroll back" }).first().isDisabled()), "did not scroll");
  });

  await check("Equipment category links filter the listing", async () => {
    await d.goto(BASE + "/equipment?sub=Filtration", { waitUntil: "load" });
    const names = await d.locator("main ul li h3").allInnerTexts();
    expect(names.length === 1 && /Skimmer/.test(names[0]), `unexpected results: ${names.join(", ")}`);
  });

  await check("Desktop: fish to bag to collection checkout", async () => {
    await d.goto(BASE + "/marine-life/fish/yellow-watchman-goby", { waitUntil: "load" });
    await d.getByRole("button", { name: "Add to bag" }).first().click();
    await d.getByRole("dialog", { name: "Your bag" }).getByRole("link", { name: "Checkout" }).click();
    await d.waitForURL(/\/checkout$/);
    await d.fill("#email", "desk@example.com");
    await d.fill("#name", "Sam Lim");
    await d.fill("#phone", "91234567");
    await d.locator("input[type=checkbox][required]").check();
    await d.getByRole("button", { name: /^Pay/ }).click();
    await d.waitForURL(/\/checkout\/confirmation/, { timeout: 8000 });
    await d.getByText(/ready to collect/).waitFor({ timeout: 3000 });
  });

  await check("Escape closes the bag drawer", async () => {
    await d.goto(BASE + "/equipment/alkalinity-test-kit", { waitUntil: "load" });
    await d.getByRole("button", { name: "Add to bag" }).first().click();
    await d.getByRole("dialog", { name: "Your bag" }).waitFor();
    await d.keyboard.press("Escape");
    await d.waitForTimeout(400);
    expect(await d.locator("[aria-hidden=true] [role=dialog][aria-label='Your bag']").count() === 1, "drawer did not close");
  });

  await check("Unknown pages show a friendly 404", async () => {
    const r = await d.goto(BASE + "/no-such-page", { waitUntil: "load" });
    expect(r.status() === 404, "expected 404 status");
    expect(await d.getByRole("heading", { name: /drifted away/ }).isVisible(), "404 page missing");
  });

  await check("No JavaScript errors during the journeys", async () => {
    const real = errors.filter((e) => !/404 \(Not Found\)/.test(e));
    expect(real.length === 0, real.slice(0, 3).join(" | "));
  });

  await browser.close();
  for (const [s, n] of results) console.log(`${s === "PASS" ? "✓" : "✗"} ${n}`);
  const failed = results.filter(([s]) => s === "FAIL").length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})();
