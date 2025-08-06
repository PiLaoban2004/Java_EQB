// functions/api/[[path]].js

// This function acts as a proxy to forward requests from the Cloudflare Pages site
// to the target API, solving CORS issues in production.
export async function onRequest(context) {
  // The original request URL
  const url = new URL(context.request.url);

  // The path segments captured by the file-based routing (e.g., ['v1beta', 'models', 'gemini-pro:generateContent'])
  const pathSegments = context.params.path;

  // The target API endpoint we want to proxy to.
  const targetApiBase = 'https://pilaoban.dpdns.org';

  // Reconstruct the full target URL
  // It takes the base, adds the captured path segments, and preserves the original query parameters.
  const targetUrl = `${targetApiBase}/${pathSegments.join('/')}${url.search}`;

  // Create a new request to the target API, preserving the method, headers, and body
  // from the original client request.
  const newRequest = new Request(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: 'follow' // Follow any redirects from the target API
  });

  // Forward the request to the target API and return its response directly to the client.
  return fetch(newRequest);
}
