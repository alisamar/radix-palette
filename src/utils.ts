type RadixPaletteFamily = {
  [key: string]: string;
};

type RadixPaletteOptions = {
  palette: string;
  number?: number;
  includeAlpha?: boolean;
  includeAdditionalColors?: boolean;
};

/**
 * Transform radix colors to CSS color values used in Tailwind CSS config.
 * @param palette - The pallete name of the radix color. If it ends with `Alpha`, treats it as an alpha color.
 * @param number - Optional. Specific color number to transform, if only one color is needed.
 * @param includeAlpha - Optional. If true, includes the alpha values in the transformation.
 * @param includeAdditionalColors - Optional. If true, includes additional colors such as contrast, surface, focus, and selection.
 * @returns CSS color value(s) for Tailwind CSS config as either a single color or an object of colors.
 */
export function radixPaletteToTailwind({
  palette,
  number,
  includeAlpha = true,
  includeAdditionalColors = true,
}: RadixPaletteOptions): string | RadixPaletteFamily {
  if (!palette) {
    throw new Error("The 'palette' is required.");
  }

  const isAlpha = palette.endsWith("Alpha");
  const cleanedPalette = palette.replace(/Alpha$/, "");
  const isMonochrome = cleanedPalette === "white" || cleanedPalette === "black";

  // Helper function to create the CSS color string
  const createColorString = (name: string, num: number, alpha: boolean = false) => {
    if (isMonochrome) {
      // Special handling for monochrome colors
      if (alpha) {
        return `rgb(var(--${name}-a${num}))`;
      }
      // Return the full color as default value
      return `rgb(var(--${name}))`;
    }
    return alpha ? `rgb(var(--${name}-a${num}))` : `rgb(var(--${name}-${num}) / <alpha-value>)`;
  };

  // If a specific color number is provided, return the transformed single color
  if (number) {
    return createColorString(cleanedPalette, number, isAlpha);
  }

  // Create the color family
  let transformedFamily: RadixPaletteFamily = {};

  if (isMonochrome) {
    // For monochrome colors, only include base color and alpha values
    transformedFamily.DEFAULT = createColorString(cleanedPalette, 1);

    if (includeAlpha) {
      Array.from({ length: 12 }, (_, i) => i + 1).forEach((num) => {
        transformedFamily[`a${num}`] = createColorString(cleanedPalette, num, true);
      });
    }
  } else {
    // For regular colors, maintain existing logic
    Array.from({ length: 12 }, (_, i) => i + 1).forEach((num) => {
      transformedFamily[num] = createColorString(cleanedPalette, num);
      if (includeAlpha) {
        transformedFamily[`a${num}`] = createColorString(cleanedPalette, num, true);
      }
    });
  }

  if (includeAdditionalColors && !isMonochrome) {
    // Additional colors (only for non-monochrome colors)
    const additionalColors = {
      contrast: `rgb(var(--${cleanedPalette}-contrast))`,
      surface: `rgb(var(--${cleanedPalette}-surface))`,
      focus: `rgb(var(--${cleanedPalette}-8))`,
      selection: `rgb(var(--${cleanedPalette}-a5))`,
    };
    transformedFamily = { ...transformedFamily, ...additionalColors };
  }

  return transformedFamily;
}
