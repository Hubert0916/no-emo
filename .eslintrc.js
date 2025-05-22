// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  ignorePatterns: ["/dist/*"],
  plugins: ["import"],
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
  },
};
