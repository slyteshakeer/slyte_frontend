/**
 * Slyte Centralized Application Configuration
 *
 * Serving all static website images directly through Cloudflare static hosting.
 */
(function() {
    var config = {
        // Supabase Edge Functions API base URL
        API_BASE_URL: "https://iqdtfllkdtjypiseklzt.supabase.co/functions/v1",

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
        window.getImageUrl = config.getImageUrl.bind(config);
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = config;
    }
})();
