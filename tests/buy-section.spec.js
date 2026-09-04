import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { aceitarCookiesSePedido } from "../src/cookies.js";
import { coletarTextoVisivel, encontrarTyposNoTexto } from "../src/typos.js";

const HOME = "https://www.remax.com/bra/en";
const CAPTURAS = path.resolve("screenshots");

async function irParaHome(page) {
  await page.goto(HOME, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await aceitarCookiesSePedido(page);
}

async function abrirMenuBuy(page) {
  await page.getByRole("button", { name: /^buy$/i }).click();
  await page.getByRole("heading", { name: /find your home/i }).waitFor({
    state: "visible",
    timeout: 10_000,
  });
}

async function rolarPagina(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
}

async function procurarTypos(page, slug) {
  const texto = await coletarTextoVisivel(page);
  const typos = encontrarTyposNoTexto(texto);
  const arquivos = [];

  for (let i = 0; i < typos.length; i += 1) {
    const { trecho, motivo } = typos[i];
    const alvo = page.getByText(trecho, { exact: false }).first();
    await alvo.scrollIntoViewIfNeeded().catch(() => {});
    const arquivo = path.join(CAPTURAS, `typo-${slug}-${i + 1}.png`);
    await page.screenshot({ path: arquivo, fullPage: false });
    arquivos.push({ ...typos[i], screenshot: arquivo });
    console.log(`TYPO [${slug}]: ${motivo} | "${trecho}" | ${arquivo}`);
  }

  return arquivos;
}

test.describe("Home page > BUY section", () => {
  test.beforeAll(async () => {
    await mkdir(CAPTURAS, { recursive: true });
  });

  test("1-5 BUY links, scroll, typos e logo", async ({ page }) => {
    test.setTimeout(240_000);

    await irParaHome(page);
    await expect(page).toHaveURL(/remax\.com\/bra\/en\/?$/i);
    await page.screenshot({
      path: path.join(CAPTURAS, "01-home.png"),
      fullPage: false,
    });

    await abrirMenuBuy(page);
    await page.getByRole("button", { name: /find a home/i }).first().click();
    await aceitarCookiesSePedido(page);
    await expect(page).toHaveURL(
      "https://www.remax.com/bra/en/real-estate/118941",
    );
    await rolarPagina(page);
    const typosHomeSearch = await procurarTypos(page, "find-your-home");
    await page.screenshot({
      path: path.join(CAPTURAS, "02-find-your-home.png"),
      fullPage: false,
    });

    await irParaHome(page);
    await abrirMenuBuy(page);
    await page.getByRole("button", { name: /find a remax agent/i }).first().click();
    await aceitarCookiesSePedido(page);
    await expect(page).toHaveURL(
      "https://www.remax.com/bra/en/real-estate-agents",
    );
    await rolarPagina(page);
    const typosAgents = await procurarTypos(page, "find-agent");
    await page.screenshot({
      path: path.join(CAPTURAS, "03-find-agent.png"),
      fullPage: false,
    });

    await irParaHome(page);
    await abrirMenuBuy(page);
    await page
      .getByRole("button", { name: /expert advice for buyers/i })
      .first()
      .click();
    await aceitarCookiesSePedido(page);
    await expect(page).toHaveURL("https://blog.remax.com/homebuyers-hub/");
    await rolarPagina(page);
    const typosBlog = await procurarTypos(page, "expert-advice");
    await page.screenshot({
      path: path.join(CAPTURAS, "04-expert-advice.png"),
      fullPage: false,
    });

    const logo = page.getByRole("link", { name: /remax-logo|remax/i }).first();
    await logo.click();
    await aceitarCookiesSePedido(page);
    console.log("URL apos logo:", page.url());
    await expect.soft(page).toHaveURL(/https:\/\/www\.remax\.com\/bra\/en\/?$/);
    await page.screenshot({
      path: path.join(CAPTURAS, "05-logo-home.png"),
      fullPage: false,
    });

    const relatorio = {
      findYourHome: typosHomeSearch,
      findAgent: typosAgents,
      expertAdvice: typosBlog,
    };
    console.log("RELATORIO_TYPOS", JSON.stringify(relatorio, null, 2));
  });
});
