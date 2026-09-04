import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { URL_INICIAL } from "./config.js";
import { aceitarCookiesSePedido } from "./cookies.js";

const headed = process.argv.includes("--headed");

async function executar() {
  const browser = await chromium.launch({
    headless: !headed,
  });

  const context = await browser.newContext({
    locale: "en-US",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  console.log(`Abrindo URL inicial: ${URL_INICIAL}`);
  await page.goto(URL_INICIAL, { waitUntil: "domcontentloaded" });
  await aceitarCookiesSePedido(page);

  const titulo = await page.title();
  const urlAtual = page.url();

  const pastaCapturas = path.resolve("screenshots");
  await mkdir(pastaCapturas, { recursive: true });
  const arquivoCaptura = path.join(pastaCapturas, "remax-inicio.png");
  await page.screenshot({ path: arquivoCaptura, fullPage: true });

  console.log(`Título: ${titulo}`);
  console.log(`URL atual: ${urlAtual}`);
  console.log(`Captura salva em: ${arquivoCaptura}`);

  await browser.close();
}

executar().catch((erro) => {
  console.error("Falha na automação:", erro.message);
  process.exit(1);
});
