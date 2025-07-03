import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.node,
        ...globals.browser,
      },
    },
    ...pluginJs.configs.recommended,
    rules: {
      'eqeqeq': 'warn',                // Yêu cầu sử dụng toán tử so sánh nghiêm ngặt (=== và !==)
      'no-unused-vars': 'warn',        // Cảnh báo khi có biến không sử dụng
      'no-undef': 'warn',              // Cấm việc sử dụng các biến không được định nghĩa
      'prefer-const': 'warn',          // Khuyến khích việc sử dụng const thay vì let cho các biến không thay đổi
      'arrow-body-style': ['warn', 'as-needed'], // Khuyến khích sử dụng các hàm mũi tên mà không cần cặp {}
      'no-console': 'warn',            // Cảnh báo khi sử dụng console
    },
  },
];
