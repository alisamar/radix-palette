[![npm package][npm-img]][npm-url]
[![Downloads][downloads-img]][downloads-url]
[![Build Status][build-img]][build-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

# Radix Palette

Radix Palette is a TailwindCSS utility that enhances Radix Colors by solving key integration challenges. It provides a seamless, flexible color management solution for web developers, supporting alpha value injection, P3 color display, and unified light/dark mode color systems. The project simplifies color design by offering a more intuitive and technically robust approach to color implementation in modern web development.

## Implementation Progress

- [x] **Opacity Modifier**  
       Supports opacity adjustments directly in classes, allowing for convenient transparency control (e.g., `bg-gray-4/50`, `text-blue-12/80`).

- [x] **Composability**  
       Enables light and dark mode configurations in a single declaration, streamlining the setup for dynamic theming.

- [ ] **P3 Display Support**  
       Working towards P3 color display compatibility. Current challenges exist with Tailwind’s flexibility, particularly around retaining alpha value adjustments across different contexts.

## Usage

### Install

```sh
npm install radix-palette
# Or with Yarn
yarn add radix-palette
# Or with PNPM
pnpm add radix-palette
```

### Import in CSS

```css
/*
 * CSS Color Import Best Practices
 *
 * Selective Color Importing: Optimizing Your Stylesheet
 *
 * Instead of importing entire color libraries or palettes,
 * import only the specific colors you need to:
 * 1. Reduce stylesheet file size
 * 2. Improve performance
 * 3. Keep your design clean and intentional
 *
 */

/* slate */
@import "radix-palette/dist/slate.css";
@import "radix-palette/dist/slate-alpha.css";
@import "radix-palette/dist/slate-dark.css";
@import "radix-palette/dist/slate-dark-alpha.css";

/* Purple - only light colors for branding */
@import "radix-palette/dist/purple.css";
/* @import "radix-palette/dist/purple-alpha.css"; */
/* @import "radix-palette/dist/purple-dark.css"; */
/* @import "radix-palette/dist/purple-dark-alpha.css"; */

/* Red - full color palette required */
@import "radix-palette/dist/red.css";
@import "radix-palette/dist/red-alpha.css";
@import "radix-palette/dist/red-dark.css";
@import "radix-palette/dist/red-dark-alpha.css";

/* Orange - no need alpha */
@import "radix-palette/dist/orange.css";
/* @import "radix-palette/dist/orange-alpha.css"; */
@import "radix-palette/dist/orange-dark.css";
/* @import "radix-palette/dist/orange-dark-alpha.css"; */
```

### Import in Tailwind CSS Config

```js
const { radixPaletteToTailwind } = require("radix-palette/utils");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  theme: {
    extend: {
      // ...
      colors: {
        brand: {
          // If a specific color number is provided,
          // return the transformed single color
          light: radixPaletteToTailwind({ palette: "purple", number: 8 }),
          DEFAULT: radixPaletteToTailwind({ palette: "purple", number: 10 }),
          dark: radixPaletteToTailwind({ palette: "purple", number: 12 }),
        },

        // If no number is provided, return all colors in the family
        // (optionally with alpha and additional colors)

        // slate with alpha and additional colors
        slate: radixPaletteToTailwind({ palette: "slate" }),
        // red with alpha colors
        red: radixPaletteToTailwind({ palette: "red", includeAlpha: true, includeAdditionalColors: false }),
        // orange with additional colors only
        orange: radixPaletteToTailwind({ palette: "orange", includeAlpha: false, includeAdditionalColors: true }),
        // ...
      },
      // ...
    },
  },
  // ...
};
```

## Reference

- Tailwind configuration: https://tailwindcss.com/docs/configuration
- Original radix palette: https://github.com/radix-ui/colors

[build-img]: https://github.com/alisamar/radix-palette/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/alisamar/radix-palette/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/radix-palette
[downloads-url]: https://www.npmtrends.com/radix-palette
[npm-img]: https://img.shields.io/npm/v/radix-palette
[npm-url]: https://www.npmjs.com/package/radix-palette
[issues-img]: https://img.shields.io/github/issues/alisamar/radix-palette
[issues-url]: https://github.com/alisamar/radix-palette/issues
[codecov-img]: https://codecov.io/gh/alisamar/radix-palette/graph/badge.svg?token=BSRY4CULXZ
[codecov-url]: https://codecov.io/gh/alisamar/radix-palette
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
