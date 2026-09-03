/**
 * slyte-api — Secure API Proxy to Supabase Edge Functions
 * Proxies frontend API requests (from api.slyte.in) to Supabase Edge Functions
 * at https://iqdtfllkdtjypiseklzt.supabase.co/functions/v1/
 * while handling CORS for slyte.in and www.slyte.in.
 */

const SUPABASE_FUNCTIONS_URL = "https://iqdtfllkdtjypiseklzt.supabase.co/functions/v1";

function getCorsHeaders(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://slyte.in";
    
    const isAllowed = origin === allowedOrigin || 
                      origin.endsWith(".slyte.in") || 
                      origin.includes("localhost") || 
                      origin.includes("127.0.0.1") ||
                      origin.includes(".pages.dev") ||
                      origin.includes(".workers.dev");

    return {
        "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400"
    };
}

export default {
    async fetch(request, env, ctx) {
        const corsHeaders = getCorsHeaders(request, env);

        // Handle CORS preflight OPTIONS request
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        // Health check endpoint
        if (path === "/health" || path === "/api/health") {
            return new Response(JSON.stringify({ status: "ok", service: "slyte-api-proxy" }), {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }

        // Target Supabase Edge Function URL
        const targetUrl = `${SUPABASE_FUNCTIONS_URL}${path}`;

        try {
            // Forward headers to Supabase (excluding host)
            const forwardHeaders = new Headers(request.headers);
            forwardHeaders.set("Host", "iqdtfllkdtjypiseklzt.supabase.co");

            const response = await fetch(targetUrl, {
                method: request.method,
                headers: forwardHeaders,
                body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : null
            });

            // Return response with original headers + CORS headers
            const responseHeaders = new Headers(response.headers);
            Object.entries(corsHeaders).forEach(([k, v]) => responseHeaders.set(k, v));

            return new Response(response.body, {
                status: response.status,
                headers: responseHeaders
            });
        } catch (err) {
            console.error("[slyte-api proxy error]:", err);
            return new Response(JSON.stringify({
                success: false,
                error: "API proxy error connecting to Supabase backend: " + err.message
            }), {
                status: 502,
                headers: { "Content-Type": "application/json", ...corsHeaders }
            });
        }
    }
};
