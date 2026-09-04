import { test, expect } from "@playwright/test";
import { URL_INICIAL } from "../src/config.js";
import { aceitarCookiesSePedido } from "../src/cookies.js";

test("abre a URL inicial e aceita cookies se pedidos", async ({ page }) => {
  await page.goto(URL_INICIAL, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });

  await aceitarCookiesSePedido(page);

  await expect(page).toHaveURL(/remax\.com/i);
  await expect(
    page
      .locator("#onetrust-accept-btn-handler")
      .or(
        page.getByRole("button", {
          name: /^(Accept( All)?|Aceitar( todos)?|Allow All|I Agree)$/i,
        }),
      )
      .first(),
  ).toBeHidden();
});
