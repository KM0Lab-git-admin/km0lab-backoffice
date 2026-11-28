import { describe, expect, it } from "vitest";

import { isValidTaxId, normalizeTaxId } from "@/lib/taxId";

// The same examples as the API's tests (km0lab-api tests/test_tax_id.py):
// the form and the server have to agree on what is well written.
describe("NIF, NIE y CIF bien escritos", () => {
  it.each([
    "12345678Z",
    "00000000T",
    "X1234567L",
    "Y1234567X",
    "Z1234567R",
    "B12345674",
    "A58818501",
    "B00000000",
    "Q2826000H",
    "P0808300H",
    "G12345674",
    "G1234567D",
  ])("%s vale", (value) => {
    expect(isValidTaxId(value)).toBe(true);
  });

  it.each([
    "12345678A",
    "X1234567A",
    "B12345678",
    "B1234567D",
    "Q28260008",
    "1234567Z",
    "123456789",
    "I1234567A",
    "",
    "no tinc nif",
  ])("%s no vale", (value) => {
    expect(isValidTaxId(value)).toBe(false);
  });

  it("como lo escribe la gente", () => {
    expect(normalizeTaxId(" b-12.345.674 ")).toBe("B12345674");
    expect(isValidTaxId("b-12.345.674")).toBe(true);
    expect(isValidTaxId("12 345 678 z")).toBe(true);
    expect(isValidTaxId(null)).toBe(false);
  });
});
