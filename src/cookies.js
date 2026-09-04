/** Clica em Aceitar/Accept se o banner de cookies aparecer. Não falha se não houver banner. */
export async function aceitarCookiesSePedido(page) {
  const botaoAceitar = page
    .locator("#onetrust-accept-btn-handler")
    .or(
      page.getByRole("button", {
        name: /^(Accept( All)?|Aceitar( todos)?|Allow All|I Agree)$/i,
      }),
    )
    .first();

  try {
    await botaoAceitar.waitFor({ state: "visible", timeout: 8_000 });
    await botaoAceitar.click();
    await botaoAceitar.waitFor({ state: "hidden", timeout: 8_000 }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
