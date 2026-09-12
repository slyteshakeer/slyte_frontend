// Product data - 3 Products with optimized local static image assets
window.productsData = [
    {
        id: 1,
        name: "Slyte 24H Black Trouser",
        price: "₹199",
        image: "images/products/blackpant_1.jpeg",
        images: [
            "images/products/blackpant_1.jpeg",
            "images/products/blackpant_4.jpeg",
            "images/products/blackpant-3.jpeg",
            "images/products/blackpant-2.jpeg"
        ],
        tags: ["black", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        link: "product.html?id=1"
    },
    {
        id: 2,
        name: "Slyte 24H Beige Trouser",
        price: "₹1,699",
        image: "images/products/BEIGE_1.jpeg",
        images: [
            "images/products/BEIGE_1.jpeg",
            "images/products/BEIGE_2.jpeg",
            "images/products/BEIGE_3.jpeg",
            "images/products/BEIGE_4.jpeg"
        ],
        tags: ["beige", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        link: "product.html?id=2"
    },
    {
        id: 3,
        name: "Slyte 24H Navy Trouser",
        price: "₹1,699",
        image: "images/products/NAVY_1.jpeg",
        images: [
            "images/products/NAVY_1.jpeg",
            "images/products/NAVY_2.jpeg",
            "images/products/NAVY_3.jpeg",
            "images/products/NAVY_4.jpeg"
        ],
        tags: ["navy", "blue", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        link: "product.html?id=3"
    }
];

// Central 2-Chamber Inventory:
// Chamber 1: "all" -> Accessible by BOTH Custom Fit and Standard Fit buyers.
// Chamber 2: "standard" -> Accessible by Standard Fit buyers ONLY.
const DEFAULT_INVENTORY = {
    "1": {
        name: "Slyte 24H Black Trouser",
        all: { "28": 2, "30": 4, "32": 8, "34": 5, "36": 3, "38": 2 },
        standard: { "28": 1, "30": 2, "32": 4, "34": 3, "36": 2, "38": 0 }
    },
    "2": {
        name: "Slyte 24H Beige Trouser",
        all: { "28": 3, "30": 5, "32": 10, "34": 6, "36": 3, "38": 1 },
        standard: { "28": 2, "30": 3, "32": 5, "34": 4, "36": 1, "38": 0 }
    },
    "3": {
        name: "Slyte 24H Navy Trouser",
        all: { "28": 2, "30": 6, "32": 12, "34": 7, "36": 4, "38": 1 },
        standard: { "28": 1, "30": 4, "32": 6, "34": 5, "36": 2, "38": 0 }
    }
};

window.SlyteInventory = {
    getAll: function() {
        try {
            const stored = localStorage.getItem('slyte_inventory_v2');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed["1"] && parsed["1"].all) return parsed;
            }
        } catch(e) {}
        return JSON.parse(JSON.stringify(DEFAULT_INVENTORY));
    },
    getForProduct: function(pid) {
        const inv = this.getAll();
        return inv[String(pid)] || DEFAULT_INVENTORY[String(pid)] || {
            all: { "28": 2, "30": 4, "32": 8, "34": 5, "36": 3, "38": 2 },
            standard: { "28": 1, "30": 2, "32": 4, "34": 3, "36": 2, "38": 0 }
        };
    },
    saveForProduct: function(pid, allChamber, standardChamber) {
        const inv = this.getAll();
        inv[String(pid)] = {
            name: inv[String(pid)]?.name || `Product ${pid}`,
            all: allChamber,
            standard: standardChamber
        };
        try {
            localStorage.setItem('slyte_inventory_v2', JSON.stringify(inv));
            window.dispatchEvent(new CustomEvent('slytestockchange', { detail: { productId: pid, inventory: inv[String(pid)] } }));
        } catch(e) {
            console.warn('Storage save error:', e);
        }
        return inv[String(pid)];
    },
    // Stock available for "ALL" (Custom Fit + Standard Fit)
    getAllStock: function(pid, size) {
        const p = this.getForProduct(pid);
        return p.all ? (Number(p.all[String(size)]) || 0) : 0;
    },
    // Stock available specifically in "STANDARD ONLY"
    getStandardOnlyStock: function(pid, size) {
        const p = this.getForProduct(pid);
        return p.standard ? (Number(p.standard[String(size)]) || 0) : 0;
    },
    // Total stock accessible by Standard buyers = ALL[size] + STANDARD[size]
    getTotalStandardStock: function(pid, size) {
        return this.getAllStock(pid, size) + this.getStandardOnlyStock(pid, size);
    },
    // Helper to find closest standard even size
    getClosestBaseSize: function(waist) {
        const w = parseFloat(waist);
        if (isNaN(w)) return "32";
        if (w <= 28) return "28";
        if (w >= 38) return "38";
        // Round to nearest standard even size: 28, 30, 32, 34, 36, 38
        const even = Math.round(w / 2) * 2;
        return String(Math.min(38, Math.max(28, even)));
    },
    // Validate custom fit measurements:
    // 1. Waist must be between 28 and 38
    // 2. Length/Outseam must be between 36 and 44
    // 3. Base size must have stock in "ALL" pool
    validateCustomFit: function(waist, length, pid = 1) {
        const w = parseFloat(waist);
        const l = parseFloat(length);

        if (isNaN(w) || w < 28 || w > 38) {
            return {
                valid: false,
                error: 'Sorry, we are not available at this size (Waist must be between 28" and 38").'
            };
        }

        if (isNaN(l) || l < 36 || l > 44) {
            return {
                valid: false,
                error: 'Sorry, we are not available at this size (Length must be between 36" and 44").'
            };
        }

        const baseSize = this.getClosestBaseSize(w);
        const allStock = this.getAllStock(pid, baseSize);

        if (allStock <= 0) {
            return {
                valid: false,
                error: `Sorry, out of stock (Size ${baseSize} fabric currently unavailable).`
            };
        }

        return {
            valid: true,
            baseSize: baseSize,
            allStockRemaining: allStock
        };
    }
};

var productsData = window.productsData;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { productsData: window.productsData, SlyteInventory: window.SlyteInventory };
}
