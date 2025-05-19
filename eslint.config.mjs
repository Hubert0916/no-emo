import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // ✅ 關閉必須 import React 的規則（React 17+ 不需要）
      "react/react-in-jsx-scope": "off",
      // ✅ 關閉 prop-types 的規則（除非你想加）
      "react/prop-types": "off",
      // ✅ 可選：關閉 require/process 的錯誤
      "no-undef": "off",

      "no-unused-vars": "off"
    }
  },

  // ✅ React plugin 建議設定（flat config 下使用）
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReact
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      // 可在這裡加強 jsx 或 hooks 檢查
    }
  }
]);
