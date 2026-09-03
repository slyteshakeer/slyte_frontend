/**
 * slyte checkout → backend /api/create-order
 * Set your API URL once (or override before load): window.SLYTE_API_BASE = 'https://your-host/api';
 */
(function () {
    const DEFAULT_API = "https://api.slyte.in";

    function apiBase() {
        if (typeof window !== "undefined" && window.SLYTE_CONFIG && window.SLYTE_CONFIG.API_BASE_URL) {
            return String(window.SLYTE_CONFIG.API_BASE_URL).replace(/\/$/, "");
        }
        const b = (typeof window !== "undefined" && window.SLYTE_API_BASE) || DEFAULT_API;
        return String(b).replace(/\/$/, "");
    }

    /**
     * One cart row → backend cart_details line (must include size OR measurements).
     */
    function buildCartDetailLine(item) {
        if (!item || typeof item !== "object") return null;

        const line = {
            id: item.id,
            name: item.name || item.title || "Item",
            quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
            price: item.price != null ? Number(item.price) : undefined
        };

        const size =
            item.size ??
            item.selectedSize ??
            item.selected_size ??
            item.variant ??
            item.option1 ??
            item.productSize;

        if (size != null && String(size).trim() !== "") {
            line.size = String(size).trim();
        }

        const measSource =
            item.measurements ||
            item.customMeasurements ||
            item.custom_measurements ||
            item.customFit ||
            item.custom_fit ||
            item.fit ||
            null;

        if (measSource && typeof measSource === "object" && !Array.isArray(measSource)) {
            line.measurements = { ...measSource };
        }

        const topKeys = [
            "waist",
            "inseam",
            "outseam",
            "ankle",
            "chest",
            "sleeve",
            "shoulder",
            "length"
        ];
        for (const k of topKeys) {
            if (item[k] != null && String(item[k]).trim() !== "") {
                line.measurements = line.measurements || {};
                line.measurements[k] = item[k];
            }
        }

        return line;
    }

    function buildCartDetailsForApi(items) {
        const arr = Array.isArray(items) ? items : [];
        return arr.map(buildCartDetailLine).filter(Boolean);
    }

    /**
     * Try common localStorage keys used across product/cart pages.
     */
    function loadCartFromStorage() {
        const keys = [
            "slyte_cart",
            "slyteCart",
            "slyteBag",
            "dash_cart",
            "dashCart",
            "cart",
            "bag",
            "shoppingCart",
            "shopping_cart",
            "dashBag"
        ];
        for (const k of keys) {
            try {
                const raw = localStorage.getItem(k);
                if (!raw) continue;
                const p = JSON.parse(raw);
                if (Array.isArray(p)) return p;
                if (p && Array.isArray(p.items)) return p.items;
            } catch (e) {
                /* ignore */
            }
        }
        return [];
    }

    async function initiateCheckout(options) {
        const {
            amount,
            customerPhone,
            customerName,
            customerEmail,
            cartItems,
            delivery_address,
            deliveryAddress,
            customer_details
        } = options || {};

        const items = cartItems != null ? cartItems : loadCartFromStorage();
        const cart_details = buildCartDetailsForApi(items);

        console.log("Initiating checkout for amount:", amount);
        console.log("Sending checkout request to backend:", {
            cart_details,
            amount,
            customerPhone
        });

        const body = {
            amount: Number(amount),
            customerPhone: customerPhone || undefined,
            customerName: customerName || undefined,
            customerEmail: customerEmail || undefined,
            cart_details
        };
        if (delivery_address || deliveryAddress) {
            body.delivery_address = delivery_address || deliveryAddress;
        }
        if (customer_details && typeof customer_details === "object") {
            body.customer_details = customer_details;
        }

        const res = await fetch(`${apiBase()}/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            console.error("Backend error response:", data);
            const msg =
                data.message ||
                data.error ||
                `Checkout failed (${res.status})`;
            const err = new Error(msg);
            err.details = data;
            throw err;
        }

        // ── Auto-login: save checkout phone + name to localStorage ────────
        // No tokens needed — my-orders page queries MongoDB directly by phone.
        if (data.data && data.data.user && data.data.user.phone && data.data.user.phone !== "9999999999") {
            try {
                localStorage.setItem("userPhone", data.data.user.phone);
                localStorage.setItem("userName",  data.data.user.name || "Customer");
                console.log("[slyte] Auto-login: phone saved →", data.data.user.phone);
            } catch (e) {
                console.warn("[slyte] Could not save user info:", e);
            }
        }

        return data;
    }

    async function loginByPhone(phone) {
        if (!phone) throw new Error("Phone number is required");
        
        const res = await fetch(`${apiBase()}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: phone.replace(/\D/g, '') })
        });
        
        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
            throw new Error(data.message || "No order found for this number.");
        }
        
        if (data.success && data.user) {
            const phoneVal = String(data.user.phone).replace(/\D/g, '');
            localStorage.setItem('slyte_phone', phoneVal);
            localStorage.setItem('slyteUser', phoneVal);
            localStorage.setItem('username', data.user.name || 'Customer');
            return data.user;
        }
        throw new Error("Login failed");
    }

    window.SLYTE_API = {
        apiBase,
        buildCartDetailLine,
        buildCartDetailsForApi,
        loadCartFromStorage,
        initiateCheckout,
        loginByPhone
    };
    window.DASH_API = window.SLYTE_API;
    window.buildCartDetailsForApi = buildCartDetailsForApi;
    window.initiateCheckout = initiateCheckout;
    window.loginByPhone = loginByPhone;
})();
