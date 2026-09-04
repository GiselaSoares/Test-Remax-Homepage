/** Palavras e trechos visíveis que costumam ser erro de digitação/gramática. */
const PADROES = [
  { re: /\brecieve\b/i, motivo: "typo: recieve → receive" },
  { re: /\bocured\b/i, motivo: "typo: occured → occurred" },
  { re: /\bseperate\b/i, motivo: "typo: seperate → separate" },
  { re: /\bdefinately\b/i, motivo: "typo: definately → definitely" },
  { re: /\baccomodat/i, motivo: "typo: accomodate → accommodate" },
  { re: /\bwich\b/i, motivo: "typo: wich → which" },
  { re: /\bbeleive\b/i, motivo: "typo: beleive → believe" },
  { re: /\bteh\b/i, motivo: "typo: teh → the" },
  { re: /\bthier\b/i, motivo: "typo: thier → their" },
  { re: /\baquire\b/i, motivo: "typo: aquire → acquire" },
  { re: /\bneccessary\b/i, motivo: "typo: neccessary → necessary" },
  { re: /\bavailible\b/i, motivo: "typo: availible → available" },
  { re: /\benviroment\b/i, motivo: "typo: enviroment → environment" },
  { re: /\bSome buyer.s search\b/i, motivo: "grammar: 'Some buyer’s search' → 'Some buyers search'" },
  { re: /\bbuyer.s search for a week\b/i, motivo: "grammar: subject/verb agreement (buyers search)" },
];

export function encontrarTyposNoTexto(texto) {
  const achados = [];
  const visto = new Set();

  for (const { re, motivo } of PADROES) {
    const m = texto.match(re);
    if (m && !visto.has(m[0].toLowerCase() + motivo)) {
      visto.add(m[0].toLowerCase() + motivo);
      achados.push({ trecho: m[0], motivo });
    }
  }

  return achados;
}

export async function coletarTextoVisivel(page) {
  return page.locator("body").innerText();
}

