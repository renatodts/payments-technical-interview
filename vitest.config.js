/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import path from "path";

export default {
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
