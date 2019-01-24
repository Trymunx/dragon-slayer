module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "max-len": [
      "error",
      {
        code: 100,
        tabWidth: 2,
        ignoreTrailingComments: true,
      },
    ],
    "no-trailing-spaces": ["error"],
  },
};
