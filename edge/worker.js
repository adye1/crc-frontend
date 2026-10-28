// Cloudflare Worker: serves adamdye.dev from the Azure Storage static website.
// Why a Worker: the storage endpoint rejects requests whose Host header is not its own
// hostname, and Cloudflare's free plan cannot rewrite the Host header with an Origin Rule.
// A Worker's fetch() sets the Host header from the target URL, so it works on the free plan.

const ORIGIN_HOST = "stcrcfront99661.z13.web.core.windows.net";
const APEX = "adamdye.dev";
const API_ORIGIN = "https://func-crc-86960.azurewebsites.net";

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    // Cloudflare Web Analytics (cookieless) is injected automatically on proxied zones.
    "script-src 'self' https://static.cloudflareinsights.com",
    `connect-src 'self' ${API_ORIGIN} https://cloudflareinsights.com`,
    "img-src 'self' data:",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; "),
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX}` || url.protocol === "http:") {
      url.hostname = APEX;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const originUrl = new URL(url.pathname + url.search, `https://${ORIGIN_HOST}`);
    const originResponse = await fetch(originUrl, {
      method: request.method,
      headers: { Accept: request.headers.get("Accept") ?? "*/*" },
      // Edge-cache static files for 5 minutes, so updates appear without a manual purge.
      cf: { cacheEverything: true, cacheTtl: 300 },
    });

    const response = new Response(originResponse.body, originResponse);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }
    response.headers.delete("x-ms-request-id");
    response.headers.delete("x-ms-version");
    return response;
  },
};
