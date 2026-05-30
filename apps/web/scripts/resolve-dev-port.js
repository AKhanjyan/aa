const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DEFAULT_DEV_PORT = 3000;

/** Dev server port parsed from APP_URL; default 3000 when URL has no explicit port. */
function resolveDevPort() {
  const appUrl = process.env.APP_URL;
  if (appUrl) {
    try {
      const port = new URL(appUrl).port;
      if (port) {
        return port;
      }
    } catch {
      // ignore invalid APP_URL
    }
  }

  return String(DEFAULT_DEV_PORT);
}

module.exports = { resolveDevPort, DEFAULT_DEV_PORT };
