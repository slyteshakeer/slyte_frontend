/**
 * Slyte Centralized Application Configuration
 *
 * Configures static asset serving and the secure Cloudflare Worker API endpoint.
 */
(function() {
    // Determine API Base URL dynamically:
    // Uses custom domain https://api.slyte.in in production or localhost:8787 during local wrangler dev
    var defaultApiUrl = "https://api.slyte.in";
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        defaultApiUrl = "http://localhost:8787";
    }

    var config = {
        // Secure Cloudflare Worker API Base URL
        API_BASE_URL: defaultApiUrl,

        /**
         * Normalizes image path for static local serving from images/ directory.
         * @param {string} path - Image path (e.g. 'images/products/white-relaxed-fit-trouser-front.webp')
         * @returns {string} Clean relative image URL
         */
        getImageUrl: function(path) {
            if (!path) return "";
            if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
                return path;
            }
            return path.startsWith("/") ? path.substring(1) : path;
        }
    };

    if (typeof window !== "undefined") {
        window.SLYTE_CONFIG = config;
        window.SLYTE_API_BASE = config.API_BASE_URL;
        window.getImageUrl = config.getImageUrl.bind(config);
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = config;
    }
})();
