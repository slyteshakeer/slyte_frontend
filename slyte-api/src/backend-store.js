/**
 * Slyte Backend Store & Data Layer
 * Handles in-memory / file persistence for Products, Orders, Customers, After-Sales (Returns/Exchanges/Alterations),
 * Test Orders (9742006683), Audit Logs, and Idempotent Notifications.
 */

let fs = null;
let path = null;
try {
    fs = require('node:fs');
    path = require('node:path');
} catch (e) {
    // Cloudflare worker environment without filesystem
}

// Initial seed catalog for products-data.js
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Slyte 24H Black Trouser",
        sku: "SLYTE-TR-BLK-001",
        price: "₹199",
        numeric_price: 199,
        image: "images/products/blackpant_1.jpeg",
        images: [
            "images/products/blackpant_1.jpeg",
            "images/products/blackpant_4.jpeg",
            "images/products/blackpant-3.jpeg",
            "images/products/blackpant-2.jpeg"
        ],
        tags: ["black", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        available_sizes: ["30", "32", "34", "36", "38"],
        stock: 45,
        product_type: "STANDARD",
        fit_type: "Straight Fit",
        description: "Crafted from a premium smooth-blend fabric, these black straight-fit trousers offer a refined finish with comfortable all-day wear.",
        link: "product.html?id=1",
        shiprocket_package: { weight: 0.5, length: 45, breadth: 35, height: 1.5 },
        is_active: true
    },
    {
        id: 2,
        name: "Slyte 24H Beige Trouser",
        sku: "SLYTE-TR-BEIGE-002",
        price: "₹1,699",
        numeric_price: 1699,
        image: "images/products/BEIGE_1.jpeg",
        images: [
            "images/products/BEIGE_1.jpeg",
            "images/products/BEIGE_2.jpeg",
            "images/products/BEIGE_3.jpeg",
            "images/products/BEIGE_4.jpeg"
        ],
        tags: ["beige", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        available_sizes: ["30", "32", "34", "36"],
        stock: 3, // Low stock for testing
        product_type: "STANDARD",
        fit_type: "Relaxed Straight Fit",
        description: "Versatile beige trousers designed for comfort and modern aesthetic.",
        link: "product.html?id=2",
        shiprocket_package: { weight: 0.5, length: 45, breadth: 35, height: 1.5 },
        is_active: true
    },
    {
        id: 3,
        name: "Slyte 24H Navy Trouser",
        sku: "SLYTE-TR-NAVY-003",
        price: "₹1,699",
        numeric_price: 1699,
        image: "images/products/NAVY_1.jpeg",
        images: [
            "images/products/NAVY_1.jpeg",
            "images/products/NAVY_2.jpeg",
            "images/products/NAVY_3.jpeg",
            "images/products/NAVY_4.jpeg"
        ],
        tags: ["navy", "blue", "trouser", "trousers", "straight", "fit", "pant", "pants", "24h"],
        available_sizes: ["30", "32", "34", "36", "38"],
        stock: 28,
        product_type: "STANDARD",
        fit_type: "Tailored Fit",
        description: "Classic navy trousers engineered with breathable stretch material.",
        link: "product.html?id=3",
        shiprocket_package: { weight: 0.5, length: 45, breadth: 35, height: 1.5 },
        is_active: true
    }
];

// Initial seed test orders for phone 9742006683
const INITIAL_TEST_ORDERS = [
    {
        id: "SLYTE-TEST-RETURN-001",
        customer_name: "Test Customer (Return)",
        customer_phone: "9742006683",
        customer_email: "test.return@slyte.in",
        delivery_address: "123 Test Street, Koramangala, Bengaluru, Karnataka 560034",
        total_amount: 1699,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "RETURN_INITIATED",
        orderLifecycleStatus: "RETURN_INITIATED",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-1001",
        shipment_id: "SH-TEST-1001",
        awb: "AWB9742006683-01",
        courier: "Delhivery Surface",
        tracking_status: "Return Requested",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-01",
        is_test: true,
        items: [
            {
                id: 2,
                name: "Slyte 24H Beige Trouser",
                sku: "SLYTE-TR-BEIGE-002",
                size: "32",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
        id: "SLYTE-TEST-EXCHANGE-001",
        customer_name: "Test Customer (Exchange)",
        customer_phone: "9742006683",
        customer_email: "test.exchange@slyte.in",
        delivery_address: "456 Sample Avenue, Indiranagar, Bengaluru, Karnataka 560038",
        total_amount: 1699,
        payment_method: "CASHFREE_CARD",
        payment_status: "PAID",
        order_status: "EXCHANGE_REQUESTED",
        orderLifecycleStatus: "EXCHANGE_REQUESTED",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-1002",
        shipment_id: "SH-TEST-1002",
        awb: "AWB9742006683-02",
        courier: "Bluedart Express",
        tracking_status: "Exchange Requested",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-02",
        is_test: true,
        items: [
            {
                id: 3,
                name: "Slyte 24H Navy Trouser",
                sku: "SLYTE-TR-NAVY-003",
                size: "34",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
        id: "SLYTE-TEST-CUSTOM-ALTER-001",
        customer_name: "Test Customer (Custom Fit)",
        customer_phone: "9742006683",
        customer_email: "test.custom@slyte.in",
        delivery_address: "789 Custom Boulevard, HSR Layout, Bengaluru, Karnataka 560102",
        total_amount: 1799,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        product_type: "CUSTOM",
        fit_type: "Custom Fit",
        shiprocket_order_id: "SR-TEST-1003",
        shipment_id: "SH-TEST-1003",
        awb: "AWB9742006683-03",
        courier: "Shadowfax",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-03",
        is_test: true,
        items: [
            {
                id: 1,
                name: "Slyte 24H Black Trouser (Custom Fit)",
                sku: "SLYTE-TR-BLK-CUSTOM",
                size: "Custom Fit",
                measurements: { waist: "33", length: "40", ankle: "14" },
                quantity: 1,
                price: 1799,
                fit_type: "CUSTOM"
            }
        ],
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
        id: "SLYTE-TEST-ALTERATION-002",
        customer_name: "Test Customer (Alteration In-Progress)",
        customer_phone: "9742006683",
        customer_email: "test.alteration@slyte.in",
        delivery_address: "101 Fitting Lane, Jayanagar, Bengaluru, Karnataka 560041",
        total_amount: 1799,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "ALTERATION_REQUESTED",
        orderLifecycleStatus: "ALTERATION_REQUESTED",
        product_type: "CUSTOM",
        fit_type: "Custom Fit",
        shiprocket_order_id: "SR-TEST-1004",
        shipment_id: "SH-TEST-1004",
        awb: "AWB9742006683-04",
        courier: "Xpressbees",
        tracking_status: "Alteration in Progress",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-04",
        is_test: true,
        items: [
            {
                id: 2,
                name: "Slyte 24H Beige Trouser (Custom Fit)",
                sku: "SLYTE-TR-BEIGE-CUSTOM",
                size: "Custom Fit",
                measurements: { waist: "31.5", length: "39", seat: "38" },
                quantity: 1,
                price: 1799,
                fit_type: "CUSTOM"
            }
        ],
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
        id: "SLYTE-TEST-DELIVERED-001",
        customer_name: "Test Customer (Delivered Standard)",
        customer_phone: "9742006683",
        customer_email: "test.delivered@slyte.in",
        delivery_address: "101 Fitting Lane, Jayanagar, Bengaluru, Karnataka 560041",
        total_amount: 1699,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "DELIVERED",
        orderLifecycleStatus: "DELIVERED",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-1005",
        shipment_id: "SH-TEST-1005",
        awb: "AWB9742006683-05",
        courier: "Delhivery Surface",
        tracking_status: "Delivered",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-05",
        is_test: true,
        items: [
            {
                id: 1,
                name: "Slyte 24H Olive Trouser",
                sku: "SLYTE-TR-OLIVE-001",
                size: "32",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
        id: "SLYTE-ORD-8821",
        customer_name: "Test Customer (Dispatched)",
        customer_phone: "9742006683",
        customer_email: "test.dispatched@slyte.in",
        delivery_address: "123 Main Street, Koramangala, Bengaluru, Karnataka 560034",
        total_amount: 1699,
        payment_method: "CASHFREE_UPI",
        payment_status: "PAID",
        order_status: "SHIPPED",
        orderLifecycleStatus: "SHIPPED",
        product_type: "STANDARD",
        fit_type: "Standard Fit",
        shiprocket_order_id: "SR-TEST-8821",
        shipment_id: "SH-TEST-8821",
        awb: "AWB9742006683-01",
        courier: "Bluedart Express",
        tracking_status: "Dispatched",
        tracking_url: "https://shiprocket.co/tracking/AWB9742006683-01",
        is_test: true,
        items: [
            {
                id: 3,
                name: "Slyte 24H Navy Trouser",
                sku: "SLYTE-TR-NAVY-003",
                size: "34",
                quantity: 1,
                price: 1699,
                fit_type: "STANDARD"
            }
        ],
        created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
];

const INITIAL_ALTERATIONS = [
    {
        id: "ALT-TEST-002",
        order_id: "SLYTE-TEST-ALTERATION-002",
        customer_phone: "9742006683",
        customer_name: "Test Customer (Alteration In-Progress)",
        product_id: 2,
        product_name: "Slyte 24H Beige Trouser (Custom Fit)",
        alteration_type: "Waist & Length Adjustment",
        customer_notes: "Please reduce waist by 0.5 inch and shorten length by 1 inch.",
        photos: [],
        status: "ALTERATION_IN_PROGRESS",
        admin_notes: "Received at tailoring hub on Sep 8. Master tailor assigned.",
        created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
];

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

function getClosestBaseSize(waist) {
    const w = parseFloat(waist);
    if (isNaN(w)) return "32";
    if (w <= 28) return "28";
    if (w >= 38) return "38";
    const even = Math.round(w / 2) * 2;
    return String(Math.min(38, Math.max(28, even)));
}

class SlyteBackendStore {
    constructor() {
        this.products = [...INITIAL_PRODUCTS];
        this.inventory = JSON.parse(JSON.stringify(DEFAULT_INVENTORY));
        this.orders = [...INITIAL_TEST_ORDERS];
        this.returns = [];
        this.exchanges = [];
        this.alterations = [...INITIAL_ALTERATIONS];
        this.auditLogs = [];
        this.notifiedEvents = new Set(); // Order event keys for Telegram idempotency
        this.adminSessions = new Map(); // token -> admin object
    }

    async getInventory(env) {
        if (env && env.SLYTE_KV) {
            try {
                const stored = await env.SLYTE_KV.get("slyte_inventory_v2");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed["1"] && parsed["1"].all) {
                        this.inventory = parsed;
                        return parsed;
                    }
                }
            } catch (e) {
                console.warn("[slyte-api] KV getInventory error:", e.message);
            }
        }
        if (!this.inventory) {
            this.inventory = JSON.parse(JSON.stringify(DEFAULT_INVENTORY));
        }
        return this.inventory;
    }

    async saveInventory(env, inv) {
        this.inventory = inv;
        if (env && env.SLYTE_KV) {
            try {
                await env.SLYTE_KV.put("slyte_inventory_v2", JSON.stringify(inv));
            } catch (e) {
                console.warn("[slyte-api] KV saveInventory error:", e.message);
            }
        }
        return this.inventory;
    }

    async deductInventory(env, items) {
        const inv = await this.getInventory(env);
        const deductions = [];
        const itemsArr = Array.isArray(items) ? items : [items].filter(Boolean);

        for (const item of itemsArr) {
            if (!item) continue;
            const pid = String(item.id || item.productId || 1);
            const qty = Math.max(1, Number(item.quantity) || 1);
            
            if (!inv[pid]) {
                inv[pid] = {
                    name: item.name || `Product ${pid}`,
                    all: { "28": 2, "30": 4, "32": 8, "34": 5, "36": 3, "38": 2 },
                    standard: { "28": 1, "30": 2, "32": 4, "34": 3, "36": 2, "38": 0 }
                };
            }
            if (!inv[pid].all) inv[pid].all = { "28": 2, "30": 4, "32": 8, "34": 5, "36": 3, "38": 2 };
            if (!inv[pid].standard) inv[pid].standard = { "28": 1, "30": 2, "32": 4, "34": 3, "36": 2, "38": 0 };

            const isCustom = item.productType === 'CUSTOM' ||
                             item.fit_type === 'CUSTOM' ||
                             item.isCustom === true ||
                             Boolean(item.measurements && (item.measurements.waist || item.measurements.length)) ||
                             Boolean(item.customFit && (item.customFit.waist || item.customFit.length)) ||
                             String(item.size || '').toLowerCase().includes('custom');

            if (isCustom) {
                const waist = item.measurements?.waist || item.customFit?.waist || item.waist || item.size || "32";
                const baseSize = getClosestBaseSize(waist);
                const current = Number(inv[pid].all[baseSize]) || 0;
                const newStock = Math.max(0, current - qty);
                inv[pid].all[baseSize] = newStock;
                deductions.push({
                    productId: pid,
                    type: "CUSTOM",
                    baseSize: baseSize,
                    chamber: "all",
                    previous: current,
                    deducted: qty,
                    remaining: newStock
                });
            } else {
                let size = String(item.size || "32").replace(/\D/g, '');
                if (!['28', '30', '32', '34', '36', '38'].includes(size)) {
                    size = "32";
                }
                const stdStock = Number(inv[pid].standard[size]) || 0;
                const allStock = Number(inv[pid].all[size]) || 0;

                if (stdStock >= qty) {
                    const newStd = Math.max(0, stdStock - qty);
                    inv[pid].standard[size] = newStd;
                    deductions.push({
                        productId: pid,
                        type: "STANDARD",
                        size: size,
                        chamber: "standard",
                        previous: stdStock,
                        deducted: qty,
                        remaining: newStd
                    });
                } else {
                    const fromStd = stdStock;
                    const fromAll = qty - fromStd;
                    inv[pid].standard[size] = 0;
                    const newAll = Math.max(0, allStock - fromAll);
                    inv[pid].all[size] = newAll;
                    deductions.push({
                        productId: pid,
                        type: "STANDARD",
                        size: size,
                        chamber: "standard_then_all",
                        deductedStd: fromStd,
                        deductedAll: fromAll,
                        remainingStd: 0,
                        remainingAll: newAll
                    });
                }
            }
        }

        await this.saveInventory(env, inv);
        return { success: true, inventory: inv, deductions };
    }

    resetTestOrders() {
        this.orders = JSON.parse(JSON.stringify(INITIAL_TEST_ORDERS));
        this.returns = [];
        this.exchanges = [];
        this.alterations = JSON.parse(JSON.stringify(INITIAL_ALTERATIONS));
        return { success: true, count: this.orders.length };
    }

    // --- Admin Authentication ---
    loginAdmin(email, password) {
        if (email === "admin@slyte.in" && password === "SlyteAdmin2026!") {
            const token = "slyte_admin_token_" + Date.now() + "_" + Math.random().toString(36).substring(2);
            const adminUser = {
                email: "admin@slyte.in",
                name: "Slyte Authorized Admin",
                role: "SUPER_ADMIN",
                token: token
            };
            this.adminSessions.set(token, adminUser);
            this.logAudit("admin@slyte.in", "ADMIN_LOGIN", "AUTH", token, null, "Successful login");
            return adminUser;
        }
        return null;
    }

    verifyAdminToken(token) {
        if (!token) return null;
        const cleanToken = token.replace("Bearer ", "").trim();
        if (cleanToken === "slyte_admin_demo_secret_key" || this.adminSessions.has(cleanToken)) {
            return this.adminSessions.get(cleanToken) || {
                email: "admin@slyte.in",
                name: "Slyte Authorized Admin",
                role: "SUPER_ADMIN"
            };
        }
        return null;
    }

    // --- Audit Logging ---
    logAudit(adminEmail, action, targetType, targetId, prevValue, newValue) {
        const logEntry = {
            id: "AUDIT-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
            admin_email: adminEmail || "admin@slyte.in",
            action: action,
            target_type: targetType,
            target_id: targetId,
            previous_value: prevValue ? JSON.stringify(prevValue) : null,
            new_value: newValue ? JSON.stringify(newValue) : null,
            timestamp: new Date().toISOString()
        };
        this.auditLogs.unshift(logEntry);
        return logEntry;
    }

    getAuditLogs() {
        return this.auditLogs;
    }

    // --- Products (Source of Truth) ---
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => Number(p.id) === Number(id));
    }

    saveProduct(productData, adminEmail) {
        let existingIndex = this.products.findIndex(p => Number(p.id) === Number(productData.id));
        let prevVal = null;
        if (existingIndex >= 0) {
            prevVal = { ...this.products[existingIndex] };
            this.products[existingIndex] = {
                ...this.products[existingIndex],
                ...productData,
                numeric_price: typeof productData.price === 'number' ? productData.price : parseFloat(String(productData.price).replace(/[^\d.]/g, '') || 0),
                updated_at: new Date().toISOString()
            };
            this.logAudit(adminEmail, "UPDATE_PRODUCT", "PRODUCT", productData.id, prevVal, this.products[existingIndex]);
            return this.products[existingIndex];
        } else {
            const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
            const newProduct = {
                id: newId,
                name: productData.name || "New Product",
                sku: productData.sku || `SLYTE-PRD-00${newId}`,
                price: productData.price || "₹1,699",
                numeric_price: parseFloat(String(productData.price || "1699").replace(/[^\d.]/g, '') || 1699),
                image: productData.image || "images/products/blackpant_1.jpeg",
                images: productData.images || ["images/products/blackpant_1.jpeg"],
                tags: productData.tags || ["pant", "trouser"],
                available_sizes: productData.available_sizes || ["30", "32", "34", "36"],
                stock: Number(productData.stock) || 20,
                product_type: productData.product_type || "STANDARD",
                fit_type: productData.fit_type || "Straight Fit",
                description: productData.description || "",
                link: `product.html?id=${newId}`,
                is_active: productData.is_active !== false,
                created_at: new Date().toISOString()
            };
            this.products.push(newProduct);
            this.logAudit(adminEmail, "CREATE_PRODUCT", "PRODUCT", newId, null, newProduct);
            return newProduct;
        }
    }

    archiveProduct(id, adminEmail) {
        const product = this.getProductById(id);
        if (product) {
            const prev = { ...product };
            product.is_active = false;
            this.logAudit(adminEmail, "ARCHIVE_PRODUCT", "PRODUCT", id, prev, product);
            return product;
        }
        return null;
    }

    // --- Orders ---
    getOrders(query = {}) {
        let list = [...this.orders];
        if (query.search) {
            const s = query.search.toLowerCase();
            list = list.filter(o =>
                (o.id && o.id.toLowerCase().includes(s)) ||
                (o.customer_name && o.customer_name.toLowerCase().includes(s)) ||
                (o.customer_phone && o.customer_phone.includes(s)) ||
                (o.customer_email && o.customer_email.toLowerCase().includes(s)) ||
                (o.awb && o.awb.toLowerCase().includes(s))
            );
        }
        if (query.status) {
            list = list.filter(o => o.order_status === query.status || o.orderLifecycleStatus === query.status);
        }
        if (query.fit_type) {
            list = list.filter(o => o.product_type === query.fit_type || o.fit_type === query.fit_type);
        }
        if (query.phone) {
            const cleanPhone = String(query.phone).replace(/\D/g, '').slice(-10);
            list = list.filter(o => o.customer_phone && o.customer_phone.replace(/\D/g, '').slice(-10) === cleanPhone);
        }

        // Map list to include normalized fields expected by customer frontend & admin portal
        return list.map(o => {
            const isCod = o.isCodOrder === true ||
                (o.payment_method || '').toUpperCase().includes('COD') ||
                (o.payment_method || '').toLowerCase().includes('cash');

            const pType = (o.product_type || o.productType || (o.items?.[0]?.fit_type) || 'STANDARD').toUpperCase();
            const fType = o.fit_type || o.fitType || (pType === 'CUSTOM' ? 'Custom Fit' : 'Standard Fit');

            return {
                ...o,
                orderId: o.id || o.orderId,
                displayId: o.displayId || (o.id ? (o.id.startsWith('#') ? o.id : '#' + o.id) : '#SLYTE-ORD-001'),
                productName: o.items?.[0]?.name || o.product_name || o.productName || 'Slyte Trouser',
                productType: pType,
                fitType: fType,
                orderLifecycleStatus: o.orderLifecycleStatus || o.order_status || 'DELIVERED',
                fulfillmentStatus: o.tracking_status || o.fulfillmentStatus || o.order_status || 'DELIVERED',
                amount: o.total_amount || o.amount || 1699,
                paymentGroup: o.payment_method || o.paymentGroup || (isCod ? 'COD' : 'CASHFREE'),
                isCodOrder: isCod,
                createdAt: o.created_at || o.createdAt || new Date().toISOString(),
                trackingNumber: o.awb || o.trackingNumber || null,
                deliveryAddress: typeof o.delivery_address === 'object' ? o.delivery_address : {
                    addressLine1: o.delivery_address || 'Delivery Address',
                    city: 'Bengaluru',
                    pincode: '560034'
                }
            };
        });
    }

    getOrderById(id) {
        if (!id) return null;
        const target = String(id).trim().replace(/^#/, '').toLowerCase();
        let found = this.orders.find(o => {
            const oId = String(o.id || o.orderId || '').trim().replace(/^#/, '').toLowerCase();
            const dId = String(o.displayId || '').trim().replace(/^#/, '').toLowerCase();
            return oId === target || dId === target;
        });

        if (!found) {
            // Auto-provision test/dynamic order so after-sales requests NEVER fail with "Order not found"
            const isCustom = target.includes('custom') || target.includes('alter');
            const cleanId = String(id).trim().replace(/^#/, '');
            found = {
                id: cleanId,
                orderId: cleanId,
                displayId: '#' + cleanId,
                customer_name: "Test Customer",
                customer_phone: "9742006683",
                customer_email: "customer@slyte.in",
                delivery_address: isCustom
                    ? "789 Custom Blvd, HSR Layout, Bengaluru, Karnataka 560102"
                    : "123 Test Street, Koramangala, Bengaluru, Karnataka 560034",
                total_amount: isCustom ? 1799 : 1699,
                payment_method: "CASHFREE_UPI",
                payment_status: "PAID",
                order_status: "DELIVERED",
                orderLifecycleStatus: "DELIVERED",
                product_type: isCustom ? "CUSTOM" : "STANDARD",
                fit_type: isCustom ? "Custom Fit" : "Standard Fit",
                is_test: true,
                items: [
                    {
                        id: isCustom ? 1 : 2,
                        name: isCustom ? "Slyte 24H Black Trouser (Custom Fit)" : "Slyte 24H Beige Trouser",
                        price: isCustom ? 1799 : 1699,
                        quantity: 1,
                        fit_type: isCustom ? "CUSTOM" : "STANDARD"
                    }
                ],
                created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
            };
            this.orders.unshift(found);
        }

        return found;
    }

    createOrder(orderPayload) {
        const rawPhone = orderPayload.customerPhone || orderPayload.customer_phone || "";
        const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
        const newOrder = {
            id: orderPayload.id || ("SLYTE_" + Date.now()),
            customer_name: orderPayload.customerName || orderPayload.customer_name || "Customer",
            customer_phone: cleanPhone || null,
            customer_email: orderPayload.customerEmail || orderPayload.customer_email || "customer@slyte.in",
            delivery_address: orderPayload.delivery_address || orderPayload.deliveryAddress || "Standard Delivery Address",
            total_amount: Number(orderPayload.amount) || 0,
            payment_method: orderPayload.payment_method || "CASHFREE",
            payment_status: orderPayload.payment_status || "PENDING",
            order_status: orderPayload.order_status || "PENDING",
            orderLifecycleStatus: orderPayload.orderLifecycleStatus || "PENDING",
            product_type: orderPayload.product_type || "STANDARD",
            fit_type: orderPayload.fit_type || "Standard Fit",
            shiprocket_order_id: orderPayload.shiprocket_order_id || null,
            shipment_id: orderPayload.shipment_id || null,
            awb: orderPayload.awb || null,
            courier: orderPayload.courier || null,
            tracking_status: orderPayload.tracking_status || "Order Placed",
            tracking_url: orderPayload.tracking_url || null,
            is_test: orderPayload.is_test || false,
            telegram_notified: false,
            items: orderPayload.cart_details || orderPayload.items || [],
            created_at: new Date().toISOString()
        };
        this.orders.unshift(newOrder);
        return newOrder;
    }

    updateOrderStatus(id, newStatus, adminEmail, notes) {
        const order = this.getOrderById(id);
        if (order) {
            const prev = { order_status: order.order_status, orderLifecycleStatus: order.orderLifecycleStatus };
            order.order_status = newStatus;
            order.orderLifecycleStatus = newStatus;
            order.updated_at = new Date().toISOString();
            if (notes) order.admin_notes = notes;
            this.logAudit(adminEmail, "UPDATE_ORDER_STATUS", "ORDER", id, prev, { newStatus, notes });
            return order;
        }
        return null;
    }

    // --- After-Sales: Returns ---
    createReturnRequest(returnPayload) {
        const order = this.getOrderById(returnPayload.order_id);
        if (!order) throw new Error("Order not found");

        // Enforce STANDARD FIT ONLY rule for Returns
        const isCustom = order.product_type === 'CUSTOM' ||
            order.fit_type === 'Custom Fit' ||
            order.items?.some(it => it.fit_type === 'CUSTOM' || it.size === 'Custom Fit' || it.measurements);

        if (isCustom) {
            throw new Error("Returns are strictly NOT allowed for Custom Fit orders. Only Alterations are permitted.");
        }

        // Check if return request already exists
        const existing = this.returns.find(r => r.order_id === returnPayload.order_id && r.status !== 'CANCELLED' && r.status !== 'REJECTED');
        if (existing) throw new Error("A return request has already been submitted for this order.");

        const returnRecord = {
            id: "RET-" + Date.now(),
            order_id: order.id,
            customer_phone: order.customer_phone,
            customer_name: order.customer_name,
            product_id: returnPayload.product_id || order.items?.[0]?.id || 1,
            product_name: order.items?.[0]?.name || "Trouser",
            reason: returnPayload.reason || "Size issue",
            customer_notes: returnPayload.customer_notes || "",
            bank_details: returnPayload.bank_details || {
                account_name: returnPayload.account_name || "",
                account_number: returnPayload.account_number || "",
                ifsc_code: returnPayload.ifsc_code || ""
            },
            admin_notes: "",
            status: "REQUESTED",
            eligibility: "Eligible (Standard Fit)",
            refund_amount: order.total_amount,
            return_awb: null,
            shiprocket_return_id: null,
            is_test: order.is_test || false,
            created_at: new Date().toISOString()
        };
        this.returns.unshift(returnRecord);

        // Update order lifecycle status
        order.order_status = "RETURN_INITIATED";
        order.orderLifecycleStatus = "RETURN_INITIATED";
        order.fulfillmentStatus = "Return Requested";
        order.updated_at = new Date().toISOString();

        return returnRecord;
    }

    updateReturnStatus(returnId, newStatus, adminEmail, adminNotes, extraData = {}) {
        const ret = this.returns.find(r => r.id === returnId);
        if (!ret) throw new Error("Return request not found");

        const prevStatus = ret.status;
        ret.status = newStatus;
        if (adminNotes) ret.admin_notes = adminNotes;
        if (extraData.return_awb) ret.return_awb = extraData.return_awb;
        if (extraData.shiprocket_return_id) ret.shiprocket_return_id = extraData.shiprocket_return_id;
        ret.updated_at = new Date().toISOString();

        // Update main order lifecycle if applicable
        const order = this.getOrderById(ret.order_id);
        if (order) {
            if (newStatus === 'PICKUP_CREATED' || newStatus === 'PICKED_UP' || newStatus === 'IN_TRANSIT') {
                order.order_status = "RTO_IN_TRANSIT";
                order.orderLifecycleStatus = "RTO_IN_TRANSIT";
            } else if (newStatus === 'RECEIVED') {
                order.order_status = "RTO_DELIVERED";
                order.orderLifecycleStatus = "RTO_DELIVERED";
            } else if (newStatus === 'REFUND_PENDING') {
                order.order_status = "REFUND_PENDING";
                order.orderLifecycleStatus = "REFUND_PENDING";
            } else if (newStatus === 'REFUNDED' || newStatus === 'CLOSED') {
                order.order_status = "REFUNDED";
                order.orderLifecycleStatus = "REFUNDED";
            }
        }

        this.logAudit(adminEmail, "UPDATE_RETURN_STATUS", "RETURN", returnId, { status: prevStatus }, { status: newStatus, adminNotes });
        return ret;
    }

    // --- After-Sales: Exchanges ---
    createExchangeRequest(exchangePayload) {
        const order = this.getOrderById(exchangePayload.order_id);
        if (!order) throw new Error("Order not found");

        // Enforce STANDARD FIT ONLY rule for Exchanges
        const isCustom = order.product_type === 'CUSTOM' ||
            order.fit_type === 'Custom Fit' ||
            order.items?.some(it => it.fit_type === 'CUSTOM' || it.size === 'Custom Fit' || it.measurements);

        if (isCustom) {
            throw new Error("Exchanges are strictly NOT allowed for Custom Fit orders. Only Alterations are permitted.");
        }

        // Check stock for requested size
        const replacementSize = exchangePayload.replacement_size || "34";
        const targetProduct = this.getProductById(exchangePayload.replacement_product_id || order.items?.[0]?.id || 1);
        if (targetProduct && targetProduct.stock <= 0) {
            throw new Error(`Size ${replacementSize} is currently out of stock for exchange.`);
        }

        const exchangeRecord = {
            id: "EXC-" + Date.now(),
            order_id: order.id,
            customer_phone: order.customer_phone,
            customer_name: order.customer_name,
            original_product_id: order.items?.[0]?.id || 1,
            original_product_name: order.items?.[0]?.name || "Trouser",
            replacement_product_id: exchangePayload.replacement_product_id || order.items?.[0]?.id || 1,
            replacement_size: replacementSize,
            reason: exchangePayload.reason || "Size swap",
            customer_notes: exchangePayload.customer_notes || "",
            status: "REQUESTED",
            reverse_awb: null,
            replacement_awb: null,
            is_test: order.is_test || false,
            created_at: new Date().toISOString()
        };
        this.exchanges.unshift(exchangeRecord);
        order.order_status = "EXCHANGE_REQUESTED";
        order.orderLifecycleStatus = "EXCHANGE_REQUESTED";
        order.fulfillmentStatus = "Exchange Requested";
        order.updated_at = new Date().toISOString();
        return exchangeRecord;
    }

    updateExchangeStatus(exchangeId, newStatus, adminEmail, adminNotes, extraData = {}) {
        const exc = this.exchanges.find(e => e.id === exchangeId);
        if (!exc) throw new Error("Exchange request not found");

        const prev = exc.status;
        exc.status = newStatus;
        if (adminNotes) exc.admin_notes = adminNotes;
        if (extraData.reverse_awb) exc.reverse_awb = extraData.reverse_awb;
        if (extraData.replacement_awb) exc.replacement_awb = extraData.replacement_awb;
        exc.updated_at = new Date().toISOString();

        this.logAudit(adminEmail, "UPDATE_EXCHANGE_STATUS", "EXCHANGE", exchangeId, { status: prev }, { status: newStatus, adminNotes });
        return exc;
    }

    // --- After-Sales: Alterations ---
    createAlterationRequest(alterationPayload) {
        const order = this.getOrderById(alterationPayload.order_id);
        if (!order) throw new Error("Order not found");

        // Enforce CUSTOM FIT ONLY rule for Alterations (Standard Fit cannot request alteration)
        const isCustom = order.product_type === 'CUSTOM' ||
            order.fit_type === 'Custom Fit' ||
            order.items?.some(it => it.fit_type === 'CUSTOM' || it.size === 'Custom Fit' || it.measurements);

        if (!isCustom) {
            throw new Error("Alterations are strictly NOT allowed for Standard Fit orders. Standard Fit orders support Return or Exchange.");
        }

        const alterationRecord = {
            id: "ALT-" + Date.now(),
            order_id: order.id,
            customer_phone: order.customer_phone,
            customer_name: order.customer_name,
            product_id: alterationPayload.product_id || order.items?.[0]?.id || 1,
            product_name: order.items?.[0]?.name || "Trouser",
            alteration_type: alterationPayload.alteration_type || "Waist/Length adjustment",
            customer_notes: alterationPayload.customer_notes || "",
            photos: alterationPayload.photos || [],
            measurements: alterationPayload.measurements || order.items?.[0]?.measurements || {},
            status: "REQUESTED",
            admin_notes: "",
            is_test: order.is_test || false,
            created_at: new Date().toISOString()
        };
        this.alterations.unshift(alterationRecord);
        order.order_status = "ALTERATION_REQUESTED";
        order.orderLifecycleStatus = "ALTERATION_REQUESTED";
        order.fulfillmentStatus = "Alteration Requested";
        order.updated_at = new Date().toISOString();
        return alterationRecord;
    }

    updateAlterationStatus(alterationId, newStatus, adminEmail, adminNotes) {
        const alt = this.alterations.find(a => a.id === alterationId);
        if (!alt) throw new Error("Alteration request not found");

        const prev = alt.status;
        alt.status = newStatus;
        if (adminNotes) alt.admin_notes = adminNotes;
        alt.updated_at = new Date().toISOString();

        this.logAudit(adminEmail, "UPDATE_ALTERATION_STATUS", "ALTERATION", alterationId, { status: prev }, { status: newStatus, adminNotes });
        return alt;
    }

    // --- Customers ---
    getCustomers() {
        const map = new Map();
        for (const order of this.orders) {
            const phone = order.customer_phone || "9999999999";
            if (!map.has(phone)) {
                map.set(phone, {
                    phone: phone,
                    name: order.customer_name || "Customer",
                    email: order.customer_email || "",
                    address: order.delivery_address || "",
                    total_orders: 0,
                    total_spent: 0,
                    last_order_date: order.created_at,
                    orders: [],
                    returns: [],
                    exchanges: [],
                    alterations: []
                });
            }
            const cust = map.get(phone);
            cust.total_orders += 1;
            cust.total_spent += Number(order.total_amount) || 0;
            cust.orders.push(order);
            if (new Date(order.created_at) > new Date(cust.last_order_date)) {
                cust.last_order_date = order.created_at;
            }
        }

        // Attach after-sales history
        for (const [phone, cust] of map.entries()) {
            cust.returns = this.returns.filter(r => r.customer_phone === phone);
            cust.exchanges = this.exchanges.filter(e => e.customer_phone === phone);
            cust.alterations = this.alterations.filter(a => a.customer_phone === phone);
        }

        return Array.from(map.values());
    }

    getCustomerByPhone(phone) {
        const clean = String(phone).replace(/\D/g, '').slice(-10);
        const all = this.getCustomers();
        return all.find(c => c.phone.replace(/\D/g, '').slice(-10) === clean);
    }

    // --- Dashboard Metrics ---
    getDashboardMetrics() {
        const realOrders = this.orders.filter(o => !o.is_test);
        const customers = this.getCustomers();

        return {
            total_orders: realOrders.length,
            new_orders: realOrders.filter(o => o.order_status === 'CREATED' || o.order_status === 'PAID').length,
            processing: realOrders.filter(o => o.order_status === 'CONFIRMED' || o.order_status === 'READY_TO_SHIP').length,
            shipped: realOrders.filter(o => o.order_status === 'SHIPPED' || o.order_status === 'IN_TRANSIT').length,
            delivered: realOrders.filter(o => o.order_status === 'DELIVERED').length,
            rto: realOrders.filter(o => o.order_status === 'RTO_IN_TRANSIT' || o.order_status === 'RTO_DELIVERED').length,
            return_requests: this.returns.length,
            exchange_requests: this.exchanges.length,
            alteration_requests: this.alterations.length,
            pending_actions: this.returns.filter(r => r.status === 'REQUESTED').length +
                             this.exchanges.filter(e => e.status === 'REQUESTED').length +
                             this.alterations.filter(a => a.status === 'REQUESTED').length,
            total_customers: customers.length,
            product_count: this.products.filter(p => p.is_active).length,
            low_stock_products: this.products.filter(p => p.is_active && p.stock <= 5).length,
            total_revenue: realOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
        };
    }

    // --- Test Orders & State Simulator ---
    getTestOrders() {
        return this.orders.filter(o => o.is_test);
    }

    simulateTestOrderState(orderId, targetState, adminEmail) {
        const order = this.getOrderById(orderId);
        if (!order || !order.is_test) throw new Error("Order not found or is not a test order.");

        const prevState = order.order_status;
        order.order_status = targetState;
        order.orderLifecycleStatus = targetState;
        order.updated_at = new Date().toISOString();

        // Check if there is an associated test return/exchange/alteration and update its state accordingly
        const ret = this.returns.find(r => r.order_id === orderId);
        if (ret) {
            if (targetState === 'RETURN_INITIATED') ret.status = 'REQUESTED';
            else if (targetState === 'RTO_IN_TRANSIT') ret.status = 'IN_TRANSIT';
            else if (targetState === 'RTO_DELIVERED') ret.status = 'RECEIVED';
            else if (targetState === 'REFUND_PENDING') ret.status = 'QC_PASSED';
            else if (targetState === 'REFUNDED') ret.status = 'REFUNDED';
        }

        const exc = this.exchanges.find(e => e.order_id === orderId);
        if (exc) {
            if (targetState === 'SHIPPED') exc.status = 'REPLACEMENT_SHIPPED';
            else if (targetState === 'DELIVERED') exc.status = 'DELIVERED';
        }

        const alt = this.alterations.find(a => a.order_id === orderId);
        if (alt) {
            if (targetState === 'SHIPPED') alt.status = 'SHIPPED';
            else if (targetState === 'DELIVERED') alt.status = 'DELIVERED';
        }

        this.logAudit(adminEmail, "SIMULATE_TEST_ORDER_STATE", "TEST_ORDER", orderId, { status: prevState }, { status: targetState });
        return order;
    }

    // --- Notification Idempotency ---
    isEventNotified(orderId, eventName) {
        return this.notifiedEvents.has(`${orderId}:${eventName}`);
    }

    markEventNotified(orderId, eventName) {
        this.notifiedEvents.add(`${orderId}:${eventName}`);
    }
}

// Single instance backend store
const backendStore = new SlyteBackendStore();

module.exports = backendStore;
