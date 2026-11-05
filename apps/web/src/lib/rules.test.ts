import { test } from "node:test";
import assert from "node:assert/strict";
import { checkBirthDate, creditBand, defaultChartStyle, normaliseIndianPhone, signOfHouse, SOUTH_SIGN_CELLS, dayPartOf } from "./rules.ts";

test("chart style follows birthplace", () => {
  assert.equal(defaultChartStyle("Chennai, Tamil Nadu, India"), "south");
  assert.equal(defaultChartStyle("Bengaluru, Karnataka, India"), "south");
  assert.equal(defaultChartStyle("Jaipur, Rajasthan, India"), "north");
  assert.equal(defaultChartStyle("London, United Kingdom"), "north");
});

test("phone numbers", () => {
  assert.equal(normaliseIndianPhone("98765 43210"), "+919876543210");
  assert.equal(normaliseIndianPhone("+91 98765-43210"), "+919876543210");
  assert.equal(normaliseIndianPhone("09876543210"), "+919876543210");
  assert.equal(normaliseIndianPhone("12345 67890"), null);
  assert.equal(normaliseIndianPhone("98765"), null);
});

test("birth dates", () => {
  const today = new Date(2026, 10, 5);
  assert.equal(checkBirthDate("1995-02-31", today), "invalid");
  assert.equal(checkBirthDate("2027-01-01", today), "future");
  assert.equal(checkBirthDate("2026-11-05", today), null);
  assert.equal(checkBirthDate("1996-02-29", today), null);
  assert.equal(checkBirthDate("1995-2-3", today), "invalid");
});

test("credit bands", () => {
  assert.equal(creditBand(0.5), "ok");
  assert.equal(creditBand(0.2), "low");
  assert.equal(creditBand(0), "empty");
});

test("houses and signs", () => {
  assert.equal(signOfHouse(1, 1), 1);
  assert.equal(signOfHouse(11, 3), 1);
  assert.equal(signOfHouse(12, 12), 11);
  assert.equal(new Set(SOUTH_SIGN_CELLS.map((c) => c.join())).size, 12);
});

test("day parts", () => {
  assert.equal(dayPartOf(7), "morning");
  assert.equal(dayPartOf(13), "afternoon");
  assert.equal(dayPartOf(19), "evening");
  assert.equal(dayPartOf(2), "night");
});
