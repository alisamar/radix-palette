/**
 * ColorScaleGenerator - A class that generates CSS color scale files with support for both sRGB and P3 color spaces
 * Handles conversion of hex colors to RGB format and generates appropriate CSS custom properties
 */

const fs = require("fs");
const path = require("path");
const allColorScales = require("../dist/index");

class ColorScaleGenerator {
  /**
   * Initialize the ColorScaleGenerator with an output directory
   * @param {string} outputDir - Directory where CSS files will be generated
   */
  constructor(outputDir) {
    this.outputDir = outputDir;
    // CSS at-rules for checking P3 color space support
    this.supportsP3AtRule = "@supports (color: color(display-p3 1 1 1))";
    this.matchesP3MediaRule = "@media (color-gamut: p3)";
  }

  /**
   * Checks if a given value is a valid hex color code
   * Supports #RGB, #RRGGBB, and #RRGGBBAA formats
   * @param {string} value - The color value to check
   * @returns {boolean} - True if valid hex color
   */
  isHex(value) {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    return hexRegex.test(value);
  }

  /**
   * Converts hex color codes to RGB format
   * @param {string} hex - Hex color code to convert
   * @returns {string} - Space-separated RGB values
   * @throws {Error} - If hex format is unsupported
   */
  hexToRGB(hex) {
    hex = hex.replace(/^#/, "");

    // Convert 3-digit hex (#RGB)
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return `${r} ${g} ${b}`;
    }

    // Convert 6-digit hex (#RRGGBB)
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r} ${g} ${b}`;
    }

    // Convert 8-digit hex (#RRGGBBAA) with alpha
    if (hex.length === 8) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const a = (parseInt(hex.substring(6, 8), 16) / 255).toFixed(2);
      return `${r} ${g} ${b} ${a}`;
    }

    throw new Error("Unsupported hex format");
  }

  /**
   * Main method to generate CSS files for all color scales
   */
  generateCssFiles() {
    try {
      const colorScales = this.getRegularColorScales();
      colorScales.forEach((key) => {
        try {
          this.processColorScale(key);
        } catch (error) {
          console.error(`Error processing color scale ${key}:`, error);
        }
      });
    } catch (error) {
      console.error("Error generating CSS files:", error);
    }
  }

  /**
   * Gets all regular (non-P3) color scale keys
   * @returns {string[]} Array of color scale keys
   * @throws {Error} If color scales data is not properly loaded
   */
  getRegularColorScales() {
    if (!allColorScales || typeof allColorScales !== "object") {
      throw new Error("Color scales data is not properly loaded");
    }
    return Object.keys(allColorScales).filter((key) => !key.includes("P3"));
  }

  /**
   * Determines the appropriate CSS selector based on the color scale key
   * @param {string} key - Color scale key
   * @returns {string} CSS selector
   */
  getSelector(key) {
    if (key === "blackA" || key === "whiteA") {
      return ":root";
    }
    if (key.includes("Dark")) {
      return ".dark, .dark-theme";
    }
    return ":root, .light, .light-theme";
  }

  /**
   * Generates CSS custom properties from color values
   * @param {Object} values - Color values object
   * @param {number} indentation - Number of spaces for indentation
   * @returns {string} Formatted CSS properties
   */
  generateCssProperties(values, indentation = 2) {
    if (!values || typeof values !== "object") {
      throw new Error("Invalid values provided for CSS properties");
    }
    return Object.entries(values)
      .map(([name, value]) => [this.toCssCasing(name), value])
      .map(
        ([name, value]) => `${" ".repeat(indentation)}--${name}: ${this.isHex(value) ? this.hexToRGB(value) : value};`
      )
      .join("\n");
  }

  /**
   * Generates CSS rule for sRGB color space
   * @param {string} key - Color scale key
   * @returns {string} CSS rule
   */
  generateSrgbCssRule(key) {
    const selector = this.getSelector(key);
    const srgbValues = this.findColorValues(key);
    if (!srgbValues) {
      throw new Error(`No sRGB values found for key: ${key}`);
    }
    const properties = this.generateCssProperties(srgbValues, 2);
    return `${selector} {\n${properties}\n}`;
  }

  /**
   * Generates CSS rule for P3 color space
   * @param {string} key - Color scale key
   * @returns {string} CSS rule or empty string if no P3 values found
   */
  generateP3CssRule(key) {
    const selector = this.getSelector(key);
    const p3Key = this.getP3Key(key);
    const p3Values = this.findColorValues(p3Key);

    if (!p3Values) {
      console.warn(`No P3 values found for key: ${p3Key}`);
      return "";
    }

    const properties = this.generateCssProperties(p3Values, 6);
    let rule = `    ${selector} {\n${properties}\n    }`;
    rule = `  ${this.matchesP3MediaRule} {\n${rule}\n  }`;
    rule = `${this.supportsP3AtRule} {\n${rule}\n}`;

    return rule;
  }

  /**
   * Gets the corresponding P3 key for a given color scale key
   * @param {string} key - Original color scale key
   * @returns {string|null} P3 key or null if not found
   */
  getP3Key(key) {
    // Try direct P3 version first
    const directP3Key = key + "P3";
    if (allColorScales[directP3Key]) {
      return directP3Key;
    }

    // Try replacing last character with P3A
    const p3aKey = key.replace(/.$/, "P3A");
    if (allColorScales[p3aKey]) {
      return p3aKey;
    }

    return null;
  }

  /**
   * Finds color values for a given key in the color scales
   * @param {string} key - Color scale key
   * @returns {Object|null} Color values object or null if not found
   */
  findColorValues(key) {
    if (!key) return null;

    const result = Object.entries(allColorScales).find(([name]) => name === key);
    if (!result) {
      return null;
    }

    const [, values] = result;
    return values;
  }

  /**
   * Processes a single color scale and generates its CSS file
   * @param {string} key - Color scale key
   * @throws {Error} If processing fails
   */
  processColorScale(key) {
    try {
      const srgbCssRule = this.generateSrgbCssRule(key);
      const p3CssRule = this.generateP3CssRule(key);

      const content = p3CssRule ? `${srgbCssRule}\n\n${p3CssRule}` : srgbCssRule;

      this.writeCssFile(key, content);
    } catch (error) {
      throw new Error(`Error processing color scale ${key}: ${error.message}`);
    }
  }

  /**
   * Writes the generated CSS content to a file
   * @param {string} key - Color scale key
   * @param {string} content - CSS content to write
   * @throws {Error} If file writing fails
   */
  writeCssFile(key, content) {
    try {
      const fileName = this.toFileName(key);
      const filePath = path.join(this.outputDir, `${fileName}.css`);
      fs.writeFileSync(filePath, content);
    } catch (error) {
      throw new Error(`Error writing CSS file for ${key}: ${error.message}`);
    }
  }

  /**
   * Converts a string to CSS-compatible casing (kebab-case)
   * @param {string} str - Input string
   * @returns {string} Kebab-cased string
   */
  toCssCasing(str) {
    return str
      .replace(/([a-z])(\d)/, "$1-$2")
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase();
  }

  /**
   * Converts a key to a valid filename
   * @param {string} str - Input string
   * @returns {string} Formatted filename
   */
  toFileName(str) {
    return this.toCssCasing(str).replace(/-a$/, "-alpha");
  }
}

// Main execution block
try {
  const outputDir = require("../tsconfig.json").compilerOptions.outDir;
  const generator = new ColorScaleGenerator(outputDir);
  generator.generateCssFiles();
} catch (error) {
  console.error("Fatal error:", error);
  process.exit(1);
}
