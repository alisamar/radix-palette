const { radixPaletteToTailwind } = require("../dist/utils");

const colors = [
  "gray",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
];

test(`Colors with alpha 1 to 12`, () => {
  colors.map((m) => {
    Array.from({ length: 12 }, (_, i) => i + 1).map((i) => {
      const _color = radixPaletteToTailwind({ palette: m, number: i });
      expect(_color).toBe(`rgb(var(--${m}-${i}) / <alpha-value>)`);

      const _alpha = radixPaletteToTailwind({ palette: `${m}Alpha`, number: i });
      expect(_alpha).toBe(`rgb(var(--${m}-a${i}))`);
    });
  });
});

test(`Monochrome colors`, () => {
  const monochromeColors = ["white", "black"];
  monochromeColors.map((m) => {
    const _color = radixPaletteToTailwind({ palette: m });

    const _template = {
      DEFAULT: `rgb(var(--${m}))`,
      a1: `rgb(var(--${m}-a1))`,
      a2: `rgb(var(--${m}-a2))`,
      a3: `rgb(var(--${m}-a3))`,
      a4: `rgb(var(--${m}-a4))`,
      a5: `rgb(var(--${m}-a5))`,
      a6: `rgb(var(--${m}-a6))`,
      a7: `rgb(var(--${m}-a7))`,
      a8: `rgb(var(--${m}-a8))`,
      a9: `rgb(var(--${m}-a9))`,
      a10: `rgb(var(--${m}-a10))`,
      a11: `rgb(var(--${m}-a11))`,
      a12: `rgb(var(--${m}-a12))`,
    };

    expect(_color).toStrictEqual(_template);
  });
});

test(`Monochrome colors alpha`, () => {
  const monochromeColors = ["whiteAlpha", "blackAlpha"];
  monochromeColors.map((m) => {
    const _color = radixPaletteToTailwind({ palette: m });
    const isAlpha = m.endsWith("Alpha");
    const cleanedPalette = m.replace(/Alpha$/, "");
    const palette = isAlpha ? cleanedPalette : m;

    const _template = {
      DEFAULT: `rgb(var(--${palette}))`,
      a1: `rgb(var(--${palette}-a1))`,
      a2: `rgb(var(--${palette}-a2))`,
      a3: `rgb(var(--${palette}-a3))`,
      a4: `rgb(var(--${palette}-a4))`,
      a5: `rgb(var(--${palette}-a5))`,
      a6: `rgb(var(--${palette}-a6))`,
      a7: `rgb(var(--${palette}-a7))`,
      a8: `rgb(var(--${palette}-a8))`,
      a9: `rgb(var(--${palette}-a9))`,
      a10: `rgb(var(--${palette}-a10))`,
      a11: `rgb(var(--${palette}-a11))`,
      a12: `rgb(var(--${palette}-a12))`,
    };

    expect(_color).toStrictEqual(_template);
  });
});
