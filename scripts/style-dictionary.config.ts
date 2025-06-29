import StyleDictionary from 'style-dictionary';
import type { Config } from 'style-dictionary/types';

const config: Config = {
  source: ['src/tokens/data/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/tokens/css-vars/',
      files: [
        {
          destination: 'index.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        },
        {
          destination: 'themes.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
            themeable: true
          }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/tokens/dist/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations'
        }
      ]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'src/tokens/dist/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat'
        }
      ]
    }
  }
};

// Register custom transforms for W3C format
StyleDictionary.registerTransform({
  name: 'name/cti/kebab-w3c',
  type: 'name',
  transformer: function(token, options) {
    return token.path.join('-');
  }
});

// Register format for CSS variables with proper prefixing
StyleDictionary.registerFormat({
  name: 'css/variables-prefixed',
  formatter: function(dictionary) {
    return `:root {\n${dictionary.allTokens
      .map(token => `  --${token.name}: ${token.value};`)
      .join('\n')}\n}`;
  }
});

export default config;
