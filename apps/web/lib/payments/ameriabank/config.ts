import type { AmeriaConfig } from "./types";
import {
  AMERIA_BASE_URL_TEST,
  AMERIA_BASE_URL_LIVE,
} from "./constants";

function getAmeriaConfig(): AmeriaConfig {
  const isTest = process.env.AMERIA_TEST_MODE === "true";
  const clientId = isTest
    ? (process.env.AMERIA_CLIENT_ID ?? "")
    : (process.env.AMERIA_LIVE_CLIENT_ID ?? "");
  const username = isTest
    ? (process.env.AMERIA_USERNAME ?? "")
    : (process.env.AMERIA_LIVE_USERNAME ?? "");
  const password = isTest
    ? (process.env.AMERIA_PASSWORD ?? "")
    : (process.env.AMERIA_LIVE_PASSWORD ?? "");
  const baseUrl = isTest ? AMERIA_BASE_URL_TEST : AMERIA_BASE_URL_LIVE;

  return { isTest, clientId, username, password, baseUrl };
}

let cachedConfig: AmeriaConfig | null = null;

export function getConfig(): AmeriaConfig {
  if (!cachedConfig) {
    cachedConfig = getAmeriaConfig();
  }
  return cachedConfig;
}

export function isAmeriaConfigured(): boolean {
  const c = getConfig();
  return Boolean(c.clientId && c.username && c.password);
}

/**
 * Convert merchant order number (P374) to vPOS OrderID (integer only).
 * Strips leading "P" so bank SMS/statement shows the real number, not a hash.
 */
export function toAmeriaOrderId(orderNumber: string): number {
  const digits = orderNumber.trim().replace(/^P/i, "");
  const parsed = Number.parseInt(digits, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new Error(`Invalid Ameriabank OrderID from order number: ${orderNumber}`);
  }
  return parsed;
}
