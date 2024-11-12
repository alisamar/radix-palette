import { radixPaletteToTailwind } from "../src/utils.ts";

type RadixPaletteFamily = {
  [key: string]: string;
};

// Test to cover error when palette is missing
test("Throws error when palette is missing", () => {
  expect(() => {
    radixPaletteToTailwind({ palette: "" });
  }).toThrow("The 'palette' is required.");
});

// Test for monochrome color with alpha channel
test("Monochrome color with alpha channel", () => {
  const result = radixPaletteToTailwind({
    palette: "whiteAlpha",
    includeAlpha: true,
  });

  const expected = {
    DEFAULT: `rgb(var(--white))`,
    a1: `rgb(var(--white-a1))`,
    a2: `rgb(var(--white-a2))`,
    a3: `rgb(var(--white-a3))`,
    a4: `rgb(var(--white-a4))`,
    a5: `rgb(var(--white-a5))`,
    a6: `rgb(var(--white-a6))`,
    a7: `rgb(var(--white-a7))`,
    a8: `rgb(var(--white-a8))`,
    a9: `rgb(var(--white-a9))`,
    a10: `rgb(var(--white-a10))`,
    a11: `rgb(var(--white-a11))`,
    a12: `rgb(var(--white-a12))`,
  };

  expect(result).toStrictEqual(expected);
});

// Test for transformed family with alpha values included for non-monochrome color
test("Non-monochrome color with alpha values included", () => {
  const result = radixPaletteToTailwind({
    palette: "blue",
    includeAlpha: true,
  });

  const expected: RadixPaletteFamily = {
    1: `rgb(var(--blue-1) / <alpha-value>)`,
    2: `rgb(var(--blue-2) / <alpha-value>)`,
    3: `rgb(var(--blue-3) / <alpha-value>)`,
    4: `rgb(var(--blue-4) / <alpha-value>)`,
    5: `rgb(var(--blue-5) / <alpha-value>)`,
    6: `rgb(var(--blue-6) / <alpha-value>)`,
    7: `rgb(var(--blue-7) / <alpha-value>)`,
    8: `rgb(var(--blue-8) / <alpha-value>)`,
    9: `rgb(var(--blue-9) / <alpha-value>)`,
    10: `rgb(var(--blue-10) / <alpha-value>)`,
    11: `rgb(var(--blue-11) / <alpha-value>)`,
    12: `rgb(var(--blue-12) / <alpha-value>)`,
    a1: `rgb(var(--blue-a1))`,
    a2: `rgb(var(--blue-a2))`,
    a3: `rgb(var(--blue-a3))`,
    a4: `rgb(var(--blue-a4))`,
    a5: `rgb(var(--blue-a5))`,
    a6: `rgb(var(--blue-a6))`,
    a7: `rgb(var(--blue-a7))`,
    a8: `rgb(var(--blue-a8))`,
    a9: `rgb(var(--blue-a9))`,
    a10: `rgb(var(--blue-a10))`,
    a11: `rgb(var(--blue-a11))`,
    a12: `rgb(var(--blue-a12))`,
    contrast: `rgb(var(--blue-contrast))`,
    surface: `rgb(var(--blue-surface))`,
    focus: `rgb(var(--blue-8))`,
    selection: `rgb(var(--blue-a5))`,
  };

  expect(result).toStrictEqual(expected);
});

// Test for single color transformation when a specific color number is provided
test("Transforms single color when specific number is provided", () => {
  const result = radixPaletteToTailwind({
    palette: "blue",
    number: 5,
  });

  // Expected CSS value for the color number 5 in 'blue' palette
  const expected = `rgb(var(--blue-5) / <alpha-value>)`;
  expect(result).toBe(expected);
});
