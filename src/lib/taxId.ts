// Spanish tax ids: is this NIF, NIE or CIF well formed?
//
// Same check the API runs (km0lab-api `app/services/tax_id.py`): done here
// too so the form can say "mal escrit" when the person leaves the field,
// without waiting for the server. The check digit tells a typo or an
// invented number from a real one; it does not tell whose it is.
//
// Three shapes, nine characters once spaces, dots and dashes are removed:
// - NIF (a person): 8 digits and a letter.
// - NIE (a foreign resident): X, Y or Z, 7 digits and a letter.
// - CIF (a company or organisation): a letter, 7 digits and a digit or letter.

const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const CIF_CONTROL_LETTERS = "JABCDEFGHI";
const NIF = /^(\d{8})([A-Z])$/;
const NIE = /^([XYZ])(\d{7})([A-Z])$/;
// The special K, L, M follow the NIF rule on their 7 digits.
const NIF_KLM = /^([KLM])(\d{7})([A-Z])$/;
const CIF = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/;
// Organisations whose control is always a letter, and those always a digit.
const CIF_LETTER_ONLY = "PQRSNW";
const CIF_DIGIT_ONLY = "ABEH";

/** As people type it -> nine characters, upper case. */
export function normalizeTaxId(value: string | null | undefined): string {
  return (value ?? "").replace(/[\s.\-_/]/g, "").toUpperCase();
}

const nifLetter = (n: number) => NIF_LETTERS[n % 23];

function cifControl(digits: string): number {
  let even = 0;
  let odd = 0;
  for (let i = 0; i < digits.length; i += 1) {
    const d = Number(digits[i]);
    if (i % 2 === 1) even += d;
    else {
      const doubled = d * 2;
      odd += Math.floor(doubled / 10) + (doubled % 10);
    }
  }
  return (10 - ((even + odd) % 10)) % 10;
}

/** A well-formed NIF, NIE or CIF with the right check digit. */
export function isValidTaxId(value: string | null | undefined): boolean {
  const taxId = normalizeTaxId(value);

  let m = NIF.exec(taxId);
  if (m) return nifLetter(Number(m[1])) === m[2];

  m = NIE.exec(taxId);
  if (m) return nifLetter("XYZ".indexOf(m[1]) * 10_000_000 + Number(m[2])) === m[3];

  m = NIF_KLM.exec(taxId);
  if (m) return nifLetter(Number(m[2])) === m[3];

  m = CIF.exec(taxId);
  if (m) {
    const [, kind, digits, control] = m;
    const expected = cifControl(digits);
    const asDigit = control === String(expected);
    const asLetter = control === CIF_CONTROL_LETTERS[expected];
    if (CIF_LETTER_ONLY.includes(kind)) return asLetter;
    if (CIF_DIGIT_ONLY.includes(kind)) return asDigit;
    return asDigit || asLetter;
  }
  return false;
}
