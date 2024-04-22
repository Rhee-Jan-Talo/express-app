import globals from "globals";
import pluginVue from "eslint-plugin-vue";


export default [
  {languageOptions: { globals: globals.node }},
  ...pluginVue.configs["flat/essential"],
];