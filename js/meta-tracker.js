/**
 * Slyte Meta Pixel & First-Party Attribution Engine
 * 
 * Provides:
 * - Centralized Meta Pixel loader & PageView dispatcher
 * - 1st-party cookie & localStorage attribution persistence (fbclid, _fbp, _fbc, UTMs)
 * - Deterministic event_id deduplication (SLYTE_PURCHASE_<ORDER_ID>)
 * - Purchase idempotency guard against page refreshes/revisits
 * - Standard & Custom funnel event telemetry (ViewContent, AddToCart, InitiateCheckout, StartFit, PantPhotoUploaded, WaistEntered)
 */
(function () {
    if (typeof window === 'undefined') return;

    // ── 1. CONFIGURATION & ATTRIBUTION SETUP ───────────────────────────────
    var PIXEL_ID = (window.SLYTE_CONFIG && window.SLYTE_CONFIG.META_PIXEL_ID) || '1637211777821079';
    const ATTRIBUTION_STORAGE_KEY = 'slyte_attribution';
    const PURCHASED_ORDERS_KEY = 'slyte_meta_purchased_orders';

    // Helper: Cookie utilities
    function getCookie(name) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days = 90) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const domain = window.location.hostname.includes('slyte.in') ? '; domain=.slyte.in' : '';
        document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/' + domain + '; SameSite=Lax';
    }

    // Capture or load 1st-party attribution params
    function initAttribution() {
        let currentAttr = {};
        try {
            const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
            if (raw) currentAttr = JSON.parse(raw) || {};
        } catch (e) {
            currentAttr = {};
        }

        // Parse query params from current URL
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get('fbclid');
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmContent = urlParams.get('utm_content');
        const utmTerm = urlParams.get('utm_term');

        // Update with new campaign/ad click params if present
        if (fbclid) {
            currentAttr.fbclid = fbclid;
            // Format standard _fbc: fb.1.creationTime.fbclid
            const fbcValue = 'fb.1.' + Date.now() + '.' + fbclid;
            currentAttr.fbc = fbcValue;
            setCookie('_fbc', fbcValue, 90);
        } else if (!currentAttr.fbc) {
            const existingFbc = getCookie('_fbc');
            if (existingFbc) currentAttr.fbc = existingFbc;
        }

        if (utmSource) currentAttr.utm_source = utmSource;
        if (utmMedium) currentAttr.utm_medium = utmMedium;
        if (utmCampaign) currentAttr.utm_campaign = utmCampaign;
        if (utmContent) currentAttr.utm_content = utmContent;
        if (utmTerm) currentAttr.utm_term = utmTerm;

        // Ensure _fbp exists or generate
        let fbp = getCookie('_fbp');
        if (!fbp) {
            fbp = 'fb.1.' + Date.now() + '.' + Math.floor(Math.random() * 10000000000);
            setCookie('_fbp', fbp, 90);
        }
        currentAttr.fbp = fbp;
        currentAttr.last_updated = new Date().toISOString();

        try {
            localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(currentAttr));
        } catch (e) {}

        return currentAttr;
    }

    const attribution = initAttribution();

    // ── 2. BASE META PIXEL INITIALIZATION ─────────────────────────────────
    function initMetaPixel() {
        if (window._fbq_initialized) return;

        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        try {
            // Advanced matching if user phone/name is stored
            const userPhone = localStorage.getItem('userPhone') || localStorage.getItem('slyte_phone');
            const userName = localStorage.getItem('userName') || localStorage.getItem('username');
            const advancedMatching = {};
            if (userPhone && /^[6-9]\d{9}$/.test(userPhone.replace(/\D/g, '').slice(-10))) {
                advancedMatching.ph = '+91' + userPhone.replace(/\D/g, '').slice(-10);
            }
            if (userName) {
                advancedMatching.fn = userName.split(' ')[0];
            }

            fbq('init', PIXEL_ID, advancedMatching);
            fbq('track', 'PageView');
            window._fbq_initialized = true;
            console.log('[SlyteMeta] Initialized Pixel ID:', PIXEL_ID);
        } catch (err) {
            console.warn('[SlyteMeta] Pixel initialization error:', err);
        }
    }

    initMetaPixel();

    // ── 3. TRACKING API METHODS ───────────────────────────────────────────
    const SlyteMeta = {
        pixelId: PIXEL_ID,

        getAttribution: function () {
            try {
                const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
                return raw ? JSON.parse(raw) : attribution;
            } catch (e) {
                return attribution;
            }
        },

        track: function (eventName, params, eventId) {
            params = params || {};
            try {
                if (typeof fbq === 'function') {
                    if (eventId) {
                        fbq('track', eventName, params, { eventID: eventId });
                        console.log('[SlyteMeta] track ' + eventName + ' with eventID: ' + eventId, params);
                    } else {
                        fbq('track', eventName, params);
                        console.log('[SlyteMeta] track ' + eventName, params);
                    }
                }
            } catch (e) {
                console.warn('[SlyteMeta] Error tracking ' + eventName + ':', e);
            }
        },

        trackCustom: function (eventName, params, eventId) {
            params = params || {};
            try {
                if (typeof fbq === 'function') {
                    if (eventId) {
                        fbq('trackCustom', eventName, params, { eventID: eventId });
                    } else {
                        fbq('trackCustom', eventName, params);
                    }
                    console.log('[SlyteMeta] trackCustom ' + eventName, params);
                }
            } catch (e) {
                console.warn('[SlyteMeta] Error tracking custom ' + eventName + ':', e);
            }
        },

        // Standard Event: ViewContent (product view)
        trackViewContent: function (product) {
            if (!product) return;
            var pId = String(product.id || '1');
            var price = typeof product.price === 'number'
                ? product.price
                : parseFloat(String(product.price || '1799').replace(/[^\d.]/g, '') || 1799);

            this.track('ViewContent', {
                content_ids: [pId],
                content_name: product.name || 'Slyte Trouser',
                content_type: 'product',
                value: price,
                currency: 'INR'
            });
        },

        // Standard Event: AddToCart
        trackAddToCart: function (item) {
            if (!item) return;
            var pId = String(item.id || item.productId || '1');
            var price = typeof item.price === 'number'
                ? item.price
                : parseFloat(String(item.price || '1799').replace(/[^\d.]/g, '') || 1799);

            this.track('AddToCart', {
                content_ids: [pId],
                content_name: item.name || item.title || 'Slyte Trouser',
                content_type: 'product',
                value: price,
                currency: 'INR'
            });
        },

        // Standard Event: InitiateCheckout
        trackInitiateCheckout: function (cartItems, totalAmount) {
            cartItems = cartItems || [];
            totalAmount = totalAmount || 1799;
            var contentIds = Array.isArray(cartItems) && cartItems.length > 0
                ? cartItems.map(function(it) { return String(it.id || it.productId || '1'); })
                : ['1'];
            var numItems = Array.isArray(cartItems)
                ? cartItems.reduce(function(acc, it) { return acc + (Number(it.quantity) || 1); }, 0)
                : 1;

            this.track('InitiateCheckout', {
                content_ids: contentIds,
                content_type: 'product',
                value: Number(totalAmount) || 1799,
                currency: 'INR',
                num_items: numItems
            });
        },

        // Standard Event: Purchase (with strict idempotency guard)
        trackPurchase: function (order, isVerified) {
            if (!order) return;
            var orderId = String(order.id || order.order_id || order.orderId || '').trim();
            if (!orderId) {
                console.warn('[SlyteMeta] Cannot track Purchase without order ID.');
                return;
            }

            // Only track if genuinely confirmed/verified
            var st = (order.order_status || order.payment_status || order.orderLifecycleStatus || '').toUpperCase();
            if (!isVerified && st !== 'PAID' && st !== 'SUCCESS') {
                console.warn('[SlyteMeta] Purchase event deferred: Order status is not confirmed PAID.', st);
                return;
            }

            // Deduplication Guard: Check if order ID was already tracked
            var purchasedOrders = [];
            try {
                purchasedOrders = JSON.parse(localStorage.getItem(PURCHASED_ORDERS_KEY) || '[]');
                if (!Array.isArray(purchasedOrders)) purchasedOrders = [];
            } catch (e) {
                purchasedOrders = [];
            }

            if (purchasedOrders.indexOf(orderId) !== -1) {
                console.log('[SlyteMeta] Purchase event already recorded for order ' + orderId + '. Skipping duplicate.');
                return;
            }

            var amount = Number(order.total_amount || order.amount || order.order_amount || 1799);
            var items = order.items || order.cart_details || [{ id: '1' }];
            var contentIds = items.map(function(it) { return String(it.id || it.productId || '1'); });
            var eventId = 'SLYTE_PURCHASE_' + orderId;

            this.track('Purchase', {
                value: amount,
                currency: 'INR',
                content_ids: contentIds,
                content_type: 'product',
                order_id: orderId
            }, eventId);

            // Record as tracked
            purchasedOrders.push(orderId);
            try {
                localStorage.setItem(PURCHASED_ORDERS_KEY, JSON.stringify(purchasedOrders));
            } catch (e) {}

            console.log('✅ [SlyteMeta] Purchase event tracked successfully for order ' + orderId + ' (eventID: ' + eventId + ')');
        },

        // Custom Funnel Event: StartFit
        trackStartFit: function (location) {
            location = location || 'ai-fit-page';
            this.trackCustom('StartFit', {
                source: location,
                timestamp: new Date().toISOString()
            });
        },

        // Custom Funnel Event: PantPhotoUploaded
        trackPantPhotoUploaded: function (source) {
            source = source || 'camera';
            this.trackCustom('PantPhotoUploaded', {
                capture_source: source,
                timestamp: new Date().toISOString()
            });
        },

        // Custom Funnel Event: WaistEntered
        trackWaistEntered: function (waist, name) {
            this.trackCustom('WaistEntered', {
                waist_value: Number(waist) || 32,
                timestamp: new Date().toISOString()
            });
        }
    };

    window.SlyteMeta = SlyteMeta;
})();
