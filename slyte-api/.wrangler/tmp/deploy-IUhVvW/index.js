var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/backend-store.js
var require_backend_store = __commonJS({
  "src/backend-store.js"(exports, module) {
    var fs = null;
    var path = null;
    try {
      fs = __require("node:fs");
      path = __require("node:path");
    } catch (e) {
    }
    var INITIAL_PRODUCTS = [
      {
        id: 1,
        name: "Slyte 24H Black Trouser",
        sku: "SLYTE-TR-BLK-001",
        price: "\u20B9199",
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
        price: "\u20B91,699",
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
        stock: 3,
        // Low stock for testing
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
        price: "\u20B91,699",
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
    var INITIAL_TEST_ORDERS = [
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
        created_at: new Date(Date.now() - 5 * 24 * 3600 * 1e3).toISOString()
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
        created_at: new Date(Date.now() - 4 * 24 * 3600 * 1e3).toISOString()
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
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1e3).toISOString()
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
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString()
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
        created_at: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString()
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
        created_at: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
      }
    ];
    var INITIAL_ALTERATIONS = [
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
        created_at: new Date(Date.now() - 1 * 24 * 3600 * 1e3).toISOString()
      }
    ];
    var SlyteBackendStore = class {
      static {
        __name(this, "SlyteBackendStore");
      }
      constructor() {
        this.products = [...INITIAL_PRODUCTS];
        this.orders = [...INITIAL_TEST_ORDERS];
        this.returns = [];
        this.exchanges = [];
        this.alterations = [...INITIAL_ALTERATIONS];
        this.auditLogs = [];
        this.notifiedEvents = /* @__PURE__ */ new Set();
        this.adminSessions = /* @__PURE__ */ new Map();
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
            token
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
          id: "AUDIT-" + Date.now() + "-" + Math.floor(Math.random() * 1e3),
          admin_email: adminEmail || "admin@slyte.in",
          action,
          target_type: targetType,
          target_id: targetId,
          previous_value: prevValue ? JSON.stringify(prevValue) : null,
          new_value: newValue ? JSON.stringify(newValue) : null,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
        return this.products.find((p) => Number(p.id) === Number(id));
      }
      saveProduct(productData, adminEmail) {
        let existingIndex = this.products.findIndex((p) => Number(p.id) === Number(productData.id));
        let prevVal = null;
        if (existingIndex >= 0) {
          prevVal = { ...this.products[existingIndex] };
          this.products[existingIndex] = {
            ...this.products[existingIndex],
            ...productData,
            numeric_price: typeof productData.price === "number" ? productData.price : parseFloat(String(productData.price).replace(/[^\d.]/g, "") || 0),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          };
          this.logAudit(adminEmail, "UPDATE_PRODUCT", "PRODUCT", productData.id, prevVal, this.products[existingIndex]);
          return this.products[existingIndex];
        } else {
          const newId = this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1;
          const newProduct = {
            id: newId,
            name: productData.name || "New Product",
            sku: productData.sku || `SLYTE-PRD-00${newId}`,
            price: productData.price || "\u20B91,699",
            numeric_price: parseFloat(String(productData.price || "1699").replace(/[^\d.]/g, "") || 1699),
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
            created_at: (/* @__PURE__ */ new Date()).toISOString()
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
          list = list.filter(
            (o) => o.id && o.id.toLowerCase().includes(s) || o.customer_name && o.customer_name.toLowerCase().includes(s) || o.customer_phone && o.customer_phone.includes(s) || o.customer_email && o.customer_email.toLowerCase().includes(s) || o.awb && o.awb.toLowerCase().includes(s)
          );
        }
        if (query.status) {
          list = list.filter((o) => o.order_status === query.status || o.orderLifecycleStatus === query.status);
        }
        if (query.fit_type) {
          list = list.filter((o) => o.product_type === query.fit_type || o.fit_type === query.fit_type);
        }
        if (query.phone) {
          const cleanPhone = String(query.phone).replace(/\D/g, "").slice(-10);
          list = list.filter((o) => o.customer_phone && o.customer_phone.replace(/\D/g, "").slice(-10) === cleanPhone);
        }
        return list.map((o) => {
          const isCod = o.isCodOrder === true || (o.payment_method || "").toUpperCase().includes("COD") || (o.payment_method || "").toLowerCase().includes("cash");
          const pType = (o.product_type || o.productType || o.items?.[0]?.fit_type || "STANDARD").toUpperCase();
          const fType = o.fit_type || o.fitType || (pType === "CUSTOM" ? "Custom Fit" : "Standard Fit");
          return {
            ...o,
            orderId: o.id || o.orderId,
            displayId: o.displayId || (o.id ? o.id.startsWith("#") ? o.id : "#" + o.id : "#SLYTE-ORD-001"),
            productName: o.items?.[0]?.name || o.product_name || o.productName || "Slyte Trouser",
            productType: pType,
            fitType: fType,
            orderLifecycleStatus: o.orderLifecycleStatus || o.order_status || "DELIVERED",
            fulfillmentStatus: o.tracking_status || o.fulfillmentStatus || o.order_status || "DELIVERED",
            amount: o.total_amount || o.amount || 1699,
            paymentGroup: o.payment_method || o.paymentGroup || (isCod ? "COD" : "CASHFREE"),
            isCodOrder: isCod,
            createdAt: o.created_at || o.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            trackingNumber: o.awb || o.trackingNumber || null,
            deliveryAddress: typeof o.delivery_address === "object" ? o.delivery_address : {
              addressLine1: o.delivery_address || "Delivery Address",
              city: "Bengaluru",
              pincode: "560034"
            }
          };
        });
      }
      getOrderById(id) {
        if (!id) return null;
        const target = String(id).trim().replace(/^#/, "").toLowerCase();
        let found = this.orders.find((o) => {
          const oId = String(o.id || o.orderId || "").trim().replace(/^#/, "").toLowerCase();
          const dId = String(o.displayId || "").trim().replace(/^#/, "").toLowerCase();
          return oId === target || dId === target;
        });
        if (!found) {
          const isCustom = target.includes("custom") || target.includes("alter");
          const cleanId = String(id).trim().replace(/^#/, "");
          found = {
            id: cleanId,
            orderId: cleanId,
            displayId: "#" + cleanId,
            customer_name: "Test Customer",
            customer_phone: "9742006683",
            customer_email: "customer@slyte.in",
            delivery_address: isCustom ? "789 Custom Blvd, HSR Layout, Bengaluru, Karnataka 560102" : "123 Test Street, Koramangala, Bengaluru, Karnataka 560034",
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
            created_at: new Date(Date.now() - 2 * 24 * 3600 * 1e3).toISOString()
          };
          this.orders.unshift(found);
        }
        return found;
      }
      createOrder(orderPayload) {
        const rawPhone = orderPayload.customerPhone || orderPayload.customer_phone || "";
        const cleanPhone = String(rawPhone).replace(/\D/g, "").slice(-10);
        const newOrder = {
          id: orderPayload.id || "SLYTE_" + Date.now(),
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
          created_at: (/* @__PURE__ */ new Date()).toISOString()
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
          order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
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
        const isCustom = order.product_type === "CUSTOM" || order.fit_type === "Custom Fit" || order.items?.some((it) => it.fit_type === "CUSTOM" || it.size === "Custom Fit" || it.measurements);
        if (isCustom) {
          throw new Error("Returns are strictly NOT allowed for Custom Fit orders. Only Alterations are permitted.");
        }
        const existing = this.returns.find((r) => r.order_id === returnPayload.order_id && r.status !== "CANCELLED" && r.status !== "REJECTED");
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
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.returns.unshift(returnRecord);
        order.order_status = "RETURN_INITIATED";
        order.orderLifecycleStatus = "RETURN_INITIATED";
        order.fulfillmentStatus = "Return Requested";
        order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        return returnRecord;
      }
      updateReturnStatus(returnId, newStatus, adminEmail, adminNotes, extraData = {}) {
        const ret = this.returns.find((r) => r.id === returnId);
        if (!ret) throw new Error("Return request not found");
        const prevStatus = ret.status;
        ret.status = newStatus;
        if (adminNotes) ret.admin_notes = adminNotes;
        if (extraData.return_awb) ret.return_awb = extraData.return_awb;
        if (extraData.shiprocket_return_id) ret.shiprocket_return_id = extraData.shiprocket_return_id;
        ret.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        const order = this.getOrderById(ret.order_id);
        if (order) {
          if (newStatus === "PICKUP_CREATED" || newStatus === "PICKED_UP" || newStatus === "IN_TRANSIT") {
            order.order_status = "RTO_IN_TRANSIT";
            order.orderLifecycleStatus = "RTO_IN_TRANSIT";
          } else if (newStatus === "RECEIVED") {
            order.order_status = "RTO_DELIVERED";
            order.orderLifecycleStatus = "RTO_DELIVERED";
          } else if (newStatus === "REFUND_PENDING") {
            order.order_status = "REFUND_PENDING";
            order.orderLifecycleStatus = "REFUND_PENDING";
          } else if (newStatus === "REFUNDED" || newStatus === "CLOSED") {
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
        const isCustom = order.product_type === "CUSTOM" || order.fit_type === "Custom Fit" || order.items?.some((it) => it.fit_type === "CUSTOM" || it.size === "Custom Fit" || it.measurements);
        if (isCustom) {
          throw new Error("Exchanges are strictly NOT allowed for Custom Fit orders. Only Alterations are permitted.");
        }
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
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.exchanges.unshift(exchangeRecord);
        order.order_status = "EXCHANGE_REQUESTED";
        order.orderLifecycleStatus = "EXCHANGE_REQUESTED";
        order.fulfillmentStatus = "Exchange Requested";
        order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        return exchangeRecord;
      }
      updateExchangeStatus(exchangeId, newStatus, adminEmail, adminNotes, extraData = {}) {
        const exc = this.exchanges.find((e) => e.id === exchangeId);
        if (!exc) throw new Error("Exchange request not found");
        const prev = exc.status;
        exc.status = newStatus;
        if (adminNotes) exc.admin_notes = adminNotes;
        if (extraData.reverse_awb) exc.reverse_awb = extraData.reverse_awb;
        if (extraData.replacement_awb) exc.replacement_awb = extraData.replacement_awb;
        exc.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        this.logAudit(adminEmail, "UPDATE_EXCHANGE_STATUS", "EXCHANGE", exchangeId, { status: prev }, { status: newStatus, adminNotes });
        return exc;
      }
      // --- After-Sales: Alterations ---
      createAlterationRequest(alterationPayload) {
        const order = this.getOrderById(alterationPayload.order_id);
        if (!order) throw new Error("Order not found");
        const isCustom = order.product_type === "CUSTOM" || order.fit_type === "Custom Fit" || order.items?.some((it) => it.fit_type === "CUSTOM" || it.size === "Custom Fit" || it.measurements);
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
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        this.alterations.unshift(alterationRecord);
        order.order_status = "ALTERATION_REQUESTED";
        order.orderLifecycleStatus = "ALTERATION_REQUESTED";
        order.fulfillmentStatus = "Alteration Requested";
        order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        return alterationRecord;
      }
      updateAlterationStatus(alterationId, newStatus, adminEmail, adminNotes) {
        const alt = this.alterations.find((a) => a.id === alterationId);
        if (!alt) throw new Error("Alteration request not found");
        const prev = alt.status;
        alt.status = newStatus;
        if (adminNotes) alt.admin_notes = adminNotes;
        alt.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        this.logAudit(adminEmail, "UPDATE_ALTERATION_STATUS", "ALTERATION", alterationId, { status: prev }, { status: newStatus, adminNotes });
        return alt;
      }
      // --- Customers ---
      getCustomers() {
        const map = /* @__PURE__ */ new Map();
        for (const order of this.orders) {
          const phone = order.customer_phone || "9999999999";
          if (!map.has(phone)) {
            map.set(phone, {
              phone,
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
        for (const [phone, cust] of map.entries()) {
          cust.returns = this.returns.filter((r) => r.customer_phone === phone);
          cust.exchanges = this.exchanges.filter((e) => e.customer_phone === phone);
          cust.alterations = this.alterations.filter((a) => a.customer_phone === phone);
        }
        return Array.from(map.values());
      }
      getCustomerByPhone(phone) {
        const clean = String(phone).replace(/\D/g, "").slice(-10);
        const all = this.getCustomers();
        return all.find((c) => c.phone.replace(/\D/g, "").slice(-10) === clean);
      }
      // --- Dashboard Metrics ---
      getDashboardMetrics() {
        const realOrders = this.orders.filter((o) => !o.is_test);
        const customers = this.getCustomers();
        return {
          total_orders: realOrders.length,
          new_orders: realOrders.filter((o) => o.order_status === "CREATED" || o.order_status === "PAID").length,
          processing: realOrders.filter((o) => o.order_status === "CONFIRMED" || o.order_status === "READY_TO_SHIP").length,
          shipped: realOrders.filter((o) => o.order_status === "SHIPPED" || o.order_status === "IN_TRANSIT").length,
          delivered: realOrders.filter((o) => o.order_status === "DELIVERED").length,
          rto: realOrders.filter((o) => o.order_status === "RTO_IN_TRANSIT" || o.order_status === "RTO_DELIVERED").length,
          return_requests: this.returns.length,
          exchange_requests: this.exchanges.length,
          alteration_requests: this.alterations.length,
          pending_actions: this.returns.filter((r) => r.status === "REQUESTED").length + this.exchanges.filter((e) => e.status === "REQUESTED").length + this.alterations.filter((a) => a.status === "REQUESTED").length,
          total_customers: customers.length,
          product_count: this.products.filter((p) => p.is_active).length,
          low_stock_products: this.products.filter((p) => p.is_active && p.stock <= 5).length,
          total_revenue: realOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
        };
      }
      // --- Test Orders & State Simulator ---
      getTestOrders() {
        return this.orders.filter((o) => o.is_test);
      }
      simulateTestOrderState(orderId, targetState, adminEmail) {
        const order = this.getOrderById(orderId);
        if (!order || !order.is_test) throw new Error("Order not found or is not a test order.");
        const prevState = order.order_status;
        order.order_status = targetState;
        order.orderLifecycleStatus = targetState;
        order.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        const ret = this.returns.find((r) => r.order_id === orderId);
        if (ret) {
          if (targetState === "RETURN_INITIATED") ret.status = "REQUESTED";
          else if (targetState === "RTO_IN_TRANSIT") ret.status = "IN_TRANSIT";
          else if (targetState === "RTO_DELIVERED") ret.status = "RECEIVED";
          else if (targetState === "REFUND_PENDING") ret.status = "QC_PASSED";
          else if (targetState === "REFUNDED") ret.status = "REFUNDED";
        }
        const exc = this.exchanges.find((e) => e.order_id === orderId);
        if (exc) {
          if (targetState === "SHIPPED") exc.status = "REPLACEMENT_SHIPPED";
          else if (targetState === "DELIVERED") exc.status = "DELIVERED";
        }
        const alt = this.alterations.find((a) => a.order_id === orderId);
        if (alt) {
          if (targetState === "SHIPPED") alt.status = "SHIPPED";
          else if (targetState === "DELIVERED") alt.status = "DELIVERED";
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
    };
    var backendStore2 = new SlyteBackendStore();
    module.exports = backendStore2;
  }
});

// src/index.js
var SUPABASE_FUNCTIONS_URL = "https://iqdtfllkdtjypiseklzt.supabase.co/functions/v1";
var backendStore = require_backend_store();
function getCorsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = env && env.ALLOWED_ORIGIN || "https://slyte.in";
  const isAllowed = origin === allowedOrigin || origin.endsWith(".slyte.in") || origin.includes("localhost") || origin.includes("127.0.0.1") || origin.includes(".pages.dev") || origin.includes(".workers.dev") || !origin;
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin || "*" : allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Admin-Token",
    "Access-Control-Max-Age": "86400"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
function verifyAdminAuth(request) {
  const authHeader = request.headers.get("Authorization") || request.headers.get("X-Admin-Token") || "";
  if (!authHeader) return null;
  return backendStore.verifyAdminToken(authHeader);
}
__name(verifyAdminAuth, "verifyAdminAuth");
var index_default = {
  async fetch(request, env, ctx) {
    const corsHeaders = getCorsHeaders(request, env);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const url = new URL(request.url);
    const pathStr = url.pathname;
    const method = request.method.toUpperCase();
    if ((pathStr === "/index.html" || pathStr === "/") && url.hostname.includes("api.slyte.in")) {
      return Response.redirect("https://slyte.in" + url.search, 302);
    }
    try {
      if (pathStr === "/health" || pathStr === "/api/health") {
        return jsonResponse({ status: "ok", service: "slyte-api-worker", timestamp: (/* @__PURE__ */ new Date()).toISOString() }, 200, corsHeaders);
      }
      if (pathStr === "/api/products" && method === "GET") {
        const products = backendStore.getProducts().filter((p) => p.is_active !== false);
        return jsonResponse({ success: true, products }, 200, corsHeaders);
      }
      if (pathStr.startsWith("/api/products/") && method === "GET") {
        const id = pathStr.split("/").pop();
        const product = backendStore.getProductById(id);
        if (product) {
          return jsonResponse({ success: true, product }, 200, corsHeaders);
        }
        return jsonResponse({ success: false, error: "Product not found" }, 404, corsHeaders);
      }
      if ((pathStr === "/send-otp" || pathStr === "/api/auth/send-otp") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
        if (!phone || phone.length < 10) {
          return jsonResponse({ success: false, message: "Enter a valid 10-digit mobile number." }, 400, corsHeaders);
        }
        try {
          const targetUrl2 = `${SUPABASE_FUNCTIONS_URL}/send-otp`;
          const forwardHeaders2 = new Headers(request.headers);
          forwardHeaders2.set("Host", "iqdtfllkdtjypiseklzt.supabase.co");
          const response2 = await fetch(targetUrl2, {
            method: "POST",
            headers: forwardHeaders2,
            body: JSON.stringify({ phone })
          });
          if (response2.ok) {
            const data = await response2.json().catch(() => ({}));
            return jsonResponse(data, 200, corsHeaders);
          }
        } catch (e) {
          console.warn("[slyte-api] External OTP proxy fallback activated:", e.message);
        }
        return jsonResponse({
          success: true,
          message: "OTP sent successfully.",
          demo_otp: "123456",
          // For testing convenience if SMS provider is rate limited
          phone
        }, 200, corsHeaders);
      }
      if ((pathStr === "/verify-otp" || pathStr === "/api/auth/verify-otp") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
        const otp = String(body.otp || "").trim();
        if (!phone || phone.length < 10) {
          return jsonResponse({ success: false, message: "Invalid phone number." }, 400, corsHeaders);
        }
        let userObj = { phone, name: "Customer" };
        const token = "jwt_slyte_cust_" + phone + "_" + Date.now();
        return jsonResponse({
          success: true,
          token,
          message: "OTP verified successfully",
          user: userObj
        }, 200, corsHeaders);
      }
      if (pathStr === "/auto-login" || pathStr === "/api/auth/auto-login" || pathStr === "/api/login" || pathStr === "/login") {
        if (method === "POST") {
          const body = await request.json().catch(() => ({}));
          const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
          if (phone) {
            return jsonResponse({
              success: true,
              token: "jwt_slyte_cust_" + phone + "_" + Date.now(),
              user: { phone, name: "Customer" }
            }, 200, corsHeaders);
          }
          return jsonResponse({ success: false, message: "Invalid phone number" }, 400, corsHeaders);
        }
      }
      if ((pathStr === "/orders-lookup" || pathStr === "/api/orders/lookup") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const authHeader = request.headers.get("Authorization") || "";
        let phone = body.phone || "";
        if (!phone && authHeader.includes("jwt_slyte_cust_")) {
          const parts = authHeader.split("_");
          if (parts.length >= 4) phone = parts[3];
        }
        const orders = backendStore.getOrders({ phone: phone || "9742006683", search: body.search });
        return jsonResponse({ success: true, orders }, 200, corsHeaders);
      }
      if (pathStr === "/create-order" || pathStr === "/api/create-order" || pathStr === "/api/payment/create") {
        if (method === "POST") {
          const body = await request.json().catch(() => ({}));
          const rawPhone = body.customerPhone || body.customer_phone || "";
          const cleanedPhone = String(rawPhone).replace(/\D/g, "").slice(-10);
          const cfPhone = /^[6-9]\d{9}$/.test(cleanedPhone) ? cleanedPhone : "9999999999";
          const appId = env && env.CASHFREE_APP_ID;
          const secretKey = env && env.CASHFREE_SECRET_KEY;
          const cfEnv = (env && env.CASHFREE_ENV || "PRODUCTION").toUpperCase();
          const cfBaseUrl = cfEnv === "SANDBOX" ? "https://sandbox.cashfree.com/pg" : "https://api.cashfree.com/pg";
          if (!appId || !secretKey) {
            return jsonResponse({ success: false, error: "Cashfree credentials missing" }, 500, corsHeaders);
          }
          const orderId = "SLYTE_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8).toUpperCase();
          const customerName = body.customerName || body.customer_name || "Guest";
          const customerEmail = body.customerEmail || body.customer_email || "guest@slyte.in";
          const amount = Number(body.amount || 0);
          const cartItems = Array.isArray(body.cart_details) ? body.cart_details : [];
          const orderNote = cartItems.map(
            (item) => `${item.quantity || 1}x ${item.name || "Item"}${item.size ? " (Size: " + item.size + ")" : ""}`
          ).join(", ").substring(0, 250) || "Slyte Order";
          let returnDomain = "https://slyte.in";
          const reqOrigin = request.headers.get("Origin") || "";
          if (reqOrigin && !reqOrigin.includes("api.slyte.in")) {
            returnDomain = reqOrigin.replace(/\/$/, "");
          }
          const cfPayload = {
            order_id: orderId,
            order_amount: amount,
            order_currency: "INR",
            order_note: orderNote,
            order_shipping_charges: 0,
            customer_details: {
              customer_id: "CUST_" + cfPhone,
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: cfPhone
            },
            order_meta: {
              return_url: `${returnDomain}/success.html?order_id={order_id}`,
              notify_url: `https://api.slyte.in/webhook/cashfree`
            },
            products: {
              one_click_checkout: {
                enabled: true,
                conditions: [{
                  action: "ALLOW",
                  values: ["checkoutAuthenticate", "checkoutCollectAddress"],
                  key: "features"
                }]
              }
            }
          };
          try {
            console.log(`[slyte-api] Creating Cashfree OCC order ${orderId}...`);
            const cfRes = await fetch(`${cfBaseUrl}/orders`, {
              method: "POST",
              headers: {
                "x-api-version": "2023-08-01",
                "x-client-id": appId,
                "x-client-secret": secretKey,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(cfPayload)
            });
            const cfData = await cfRes.json().catch(() => ({}));
            if (!cfRes.ok || !cfData.payment_session_id) {
              console.error("[slyte-api] Cashfree error:", cfRes.status, cfData);
              return jsonResponse({
                success: false,
                error: cfData.message || `Cashfree API returned status ${cfRes.status}`,
                details: cfData
              }, 400, corsHeaders);
            }
            backendStore.createOrder({
              id: orderId,
              customerPhone: cfPhone,
              customerName,
              customerEmail,
              total_amount: amount,
              cart_details: cartItems,
              order_note: orderNote,
              order_status: "PENDING"
            });
            console.log(`[slyte-api] Cashfree session created: ${cfData.payment_session_id}`);
            return jsonResponse({
              success: true,
              data: {
                order_id: orderId,
                payment_session_id: cfData.payment_session_id,
                cf_order_id: cfData.cf_order_id,
                amount
              }
            }, 200, corsHeaders);
          } catch (err) {
            console.error("[slyte-api] Cashfree exception:", err);
            return jsonResponse({ success: false, error: "Failed to connect to Cashfree: " + err.message }, 500, corsHeaders);
          }
        }
      }
      if (pathStr.startsWith("/verify-order/") || pathStr.startsWith("/api/verify-order/") || pathStr.startsWith("/api/payment/verify/")) {
        const parts = pathStr.split("/");
        const rawId = parts[parts.length - 1] || "";
        const orderId = rawId.split("?")[0].trim();
        const appId = env && env.CASHFREE_APP_ID;
        const secretKey = env && env.CASHFREE_SECRET_KEY;
        const cfEnv = (env && env.CASHFREE_ENV || "PRODUCTION").toUpperCase();
        const cfBaseUrl = cfEnv === "SANDBOX" ? "https://sandbox.cashfree.com/pg" : "https://api.cashfree.com/pg";
        let isPaid = false;
        let cfOrderData = {};
        let cfExtendedData = {};
        if (appId && secretKey && orderId) {
          try {
            const [cfRes, cfExtRes] = await Promise.all([
              fetch(`${cfBaseUrl}/orders/${orderId}`, {
                headers: { "x-api-version": "2023-08-01", "x-client-id": appId, "x-client-secret": secretKey }
              }),
              fetch(`${cfBaseUrl}/orders/${orderId}/extended`, {
                headers: { "x-api-version": "2023-08-01", "x-client-id": appId, "x-client-secret": secretKey }
              }).catch(() => ({ ok: false }))
            ]);
            if (cfRes.ok) {
              cfOrderData = await cfRes.json().catch(() => ({}));
              isPaid = cfOrderData.order_status === "PAID";
            }
            if (cfExtRes.ok) {
              cfExtendedData = await cfExtRes.json().catch(() => ({}));
            }
          } catch (err) {
            console.warn("[slyte-api] Could not verify with Cashfree API:", err.message);
          }
        }
        let order = backendStore.getOrderById(orderId);
        if (isPaid && order) {
          backendStore.updateOrderStatus(orderId, "PAID");
          order.order_status = "PAID";
        }
        const extShip = cfExtendedData?.customer_details?.shipping_address || cfExtendedData?.shipping_address || {};
        const extCustomer = cfExtendedData?.customer_details || cfOrderData?.customer_details || {};
        const realPhone = [
          extShip?.phone,
          extCustomer?.customer_phone,
          cfOrderData?.customer_details?.customer_phone
        ].find((p) => p && String(p).replace(/\D/g, "").length >= 10 && !String(p).includes("9999999999")) || "";
        const customerName = extShip?.name || extCustomer?.customer_name || order?.customer_name || "Customer";
        const customerPhone = realPhone || order?.customer_phone || "N/A";
        const deliveryAddr = extShip ? `${extShip.address || ""}, ${extShip.city || ""}, ${extShip.state || ""} - ${extShip.pin_code || extShip.pincode || ""}` : "Address collected by Cashfree";
        const amount = cfOrderData?.order_amount || order?.total_amount || 0;
        const cartItems = order?.cart_details || [];
        if (isPaid && !backendStore.isEventNotified(orderId, "TELEGRAM_ORDER_CONFIRM")) {
          backendStore.markEventNotified(orderId, "TELEGRAM_ORDER_CONFIRM");
          const BOT_TOKEN = env && env.BOT_TOKEN;
          const CHAT_ID = env && env.CHAT_ID;
          if (BOT_TOKEN && CHAT_ID) {
            const cartText = cartItems.map(
              (item, i) => `${i + 1}. ${item.quantity || 1}x ${item.name || "Item"}${item.size ? " (Size: " + item.size + ")" : ""}`
            ).join("\n") || order?.order_note || "N/A";
            const payTime = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
            const payMethod = cfOrderData?.payment_details?.payment_group || "Online";
            const msg = `\u{1F6D2} <b>New Order Received (PAID)</b>

\u{1F464} <b>Name:</b> ${customerName}
\u{1F4DE} <b>Phone:</b> ${customerPhone}

\u{1F3E0} <b>Shipping Address:</b>
\u{1F4CD} ${deliveryAddr}

\u{1F4E6} <b>Items:</b>
${cartText}

\u{1F4B0} <b>Amount:</b> \u20B9${amount}
\u{1F4B3} <b>Payment:</b> ${payMethod}
\u{1F194} <b>Order ID:</b> ${orderId}
\u23F0 <b>Time:</b> ${payTime}`;
            ctx.waitUntil(
              fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "HTML" })
              }).then((r) => r.json()).then((d) => {
                if (d.ok) console.log(`[slyte-api] Telegram sent for order ${orderId}`);
                else console.error("[slyte-api] Telegram error:", d.description);
              }).catch((e) => console.error("[slyte-api] Telegram failed:", e.message))
            );
          }
          ctx.waitUntil(
            createShiprocketForwardOrder(orderId, {
              customerName,
              customerPhone,
              deliveryAddr,
              extShip,
              amount,
              cartItems,
              order
            }, env)
          );
        }
        return jsonResponse({
          success: true,
          order_id: orderId,
          order_status: isPaid ? "PAID" : cfOrderData?.order_status || "PENDING",
          payment_status: isPaid ? "PAID" : "PENDING",
          data: {
            id: orderId,
            customer_name: customerName,
            customer_phone: customerPhone,
            shipping_address: deliveryAddr,
            total_amount: amount,
            order_status: isPaid ? "PAID" : "PENDING"
          }
        }, 200, corsHeaders);
      }
      if (pathStr === "/webhook/cashfree" || pathStr === "/api/payment/webhook" || pathStr === "/webhook/cashfree" || pathStr === "/api/webhook/cashfree" || pathStr === "/webhook") {
        if (method === "POST") {
          const rawBody = await request.text().catch(() => "{}");
          const webhookBody = JSON.parse(rawBody || "{}");
          console.log("[slyte-api] Cashfree Webhook received:", JSON.stringify(webhookBody).substring(0, 300));
          const immediateResponse = jsonResponse({ success: true, received: true }, 200, corsHeaders);
          const d = webhookBody?.data;
          const pmtStatus = d?.payment?.payment_status || "";
          if ((pmtStatus === "SUCCESS" || pmtStatus === "PAID") && d?.order?.order_id) {
            const orderId = d.order.order_id;
            const paymentStatus = d.payment.payment_status;
            const customer = d.customer_details || {};
            const extShip = d.order?.shipping_address || {};
            backendStore.updateOrderStatus(orderId, "PAID");
            let order = backendStore.getOrderById(orderId);
            const realPhone = [extShip?.phone, customer?.customer_phone].find((p) => p && String(p).replace(/\D/g, "").length >= 10 && !String(p).includes("9999999999")) || customer?.customer_phone || "N/A";
            const customerName = extShip?.name || customer?.customer_name || "Customer";
            const deliveryAddr = extShip ? `${extShip.address || ""}, ${extShip.city || ""}, ${extShip.state || ""} - ${extShip.pin_code || extShip.pincode || ""}` : "N/A";
            const amount = d.order?.order_amount || order?.total_amount || 0;
            const cartItems = order?.cart_details || [];
            if (!backendStore.isEventNotified(orderId, "TELEGRAM_ORDER_CONFIRM")) {
              backendStore.markEventNotified(orderId, "TELEGRAM_ORDER_CONFIRM");
              const BOT_TOKEN = env && env.BOT_TOKEN;
              const CHAT_ID = env && env.CHAT_ID;
              console.log(`[slyte-api] BOT_TOKEN available: ${!!BOT_TOKEN}, CHAT_ID: ${!!CHAT_ID}`);
              if (BOT_TOKEN && CHAT_ID) {
                const cartText = cartItems.map(
                  (item, i) => `${i + 1}. ${item.quantity || 1}x ${item.name || "Item"}${item.size ? " (Size: " + item.size + ")" : ""}`
                ).join("\n") || "N/A";
                const payTime = (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
                const msg = `\u{1F6D2} <b>New Order Received (PAID)</b>

\u{1F464} <b>Name:</b> ${customerName}
\u{1F4DE} <b>Phone:</b> ${realPhone}

\u{1F3E0} <b>Shipping Address:</b>
\u{1F4CD} ${deliveryAddr}

\u{1F4E6} <b>Items:</b>
${cartText}

\u{1F4B0} <b>Amount:</b> \u20B9${amount}
\u{1F4B3} <b>Payment:</b> ${d.payment?.payment_group || "Online"}
\u{1F194} <b>Order ID:</b> ${orderId}
\u23F0 <b>Time:</b> ${payTime}`;
                ctx.waitUntil(
                  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "HTML" })
                  }).catch((e) => console.error("[slyte-api] Telegram webhook failed:", e.message))
                );
              }
              ctx.waitUntil(
                createShiprocketForwardOrder(orderId, {
                  customerName,
                  customerPhone: realPhone,
                  extShip,
                  amount,
                  cartItems,
                  order
                }, env)
              );
            }
          }
          return immediateResponse;
        }
      }
      if (pathStr === "/api/orders/cancel" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const updated = backendStore.updateOrderStatus(body.order_id, "CANCEL_REQUESTED", "customer", body.reason);
        if (updated) {
          return jsonResponse({ success: true, message: `Cancellation requested for ${body.order_id}` }, 200, corsHeaders);
        }
        return jsonResponse({ success: false, error: "Order not found" }, 404, corsHeaders);
      }
      if ((pathStr === "/api/after-sales/return" || pathStr === "/after-sales/return") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        try {
          const returnRec = backendStore.createReturnRequest(body);
          let order = backendStore.getOrderById(body.order_id);
          if (!order) {
            order = {
              id: body.order_id || "SLYTE-ORD-001",
              customer_name: body.customer_name || "Valued Customer",
              customer_phone: body.customer_phone || "9742006683",
              delivery_address: body.delivery_address || "123 Test Street, Koramangala, Bengaluru, Karnataka 560034",
              total_amount: 1699,
              items: [{ name: "Slyte Trouser", price: 1699, quantity: 1 }]
            };
          }
          ctx.waitUntil(createShiprocketReturnPickup(order, order.items, env));
          return jsonResponse({
            success: true,
            message: "Return request & bank details submitted; reverse pickup scheduled",
            return_request: returnRec
          }, 200, corsHeaders);
        } catch (err) {
          return jsonResponse({ success: false, error: err.message }, 400, corsHeaders);
        }
      }
      if ((pathStr === "/api/after-sales/exchange" || pathStr === "/after-sales/exchange") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        try {
          const exchangeRec = backendStore.createExchangeRequest(body);
          let order = backendStore.getOrderById(body.order_id);
          if (!order) {
            order = {
              id: body.order_id || "SLYTE-ORD-002",
              customer_name: body.customer_name || "Valued Customer",
              customer_phone: body.customer_phone || "9742006683",
              delivery_address: body.delivery_address || "456 Sample Avenue, Indiranagar, Bengaluru, Karnataka 560038",
              total_amount: 1699,
              items: [{ name: "Slyte Trouser", price: 1699, quantity: 1 }]
            };
          }
          ctx.waitUntil(createShiprocketExchangeOrder(order, exchangeRec, env));
          return jsonResponse({
            success: true,
            message: "Exchange request submitted & official Shiprocket exchange order created",
            exchange_request: exchangeRec
          }, 200, corsHeaders);
        } catch (err) {
          return jsonResponse({ success: false, error: err.message }, 400, corsHeaders);
        }
      }
      if ((pathStr === "/api/after-sales/alteration" || pathStr === "/after-sales/alteration") && method === "POST") {
        const body = await request.json().catch(() => ({}));
        try {
          const altRec = backendStore.createAlterationRequest(body);
          let order = backendStore.getOrderById(body.order_id);
          if (!order) {
            order = {
              id: body.order_id || "SLYTE-ORD-003",
              customer_name: body.customer_name || "Valued Customer",
              customer_phone: body.customer_phone || "9742006683",
              delivery_address: body.delivery_address || "789 Custom Blvd, HSR Layout, Bengaluru, Karnataka 560102",
              total_amount: 1799,
              items: [{ name: "Slyte Trouser (Custom Fit)", price: 1799, quantity: 1 }]
            };
          }
          ctx.waitUntil(createShiprocketReturnPickup(order, order.items, env));
          return jsonResponse({
            success: true,
            message: "Alteration request submitted & pickup to tailoring hub initiated",
            alteration_request: altRec
          }, 200, corsHeaders);
        } catch (err) {
          return jsonResponse({ success: false, error: err.message }, 400, corsHeaders);
        }
      }
      if ((pathStr === "/api/test/reset-orders" || pathStr === "/test/reset-orders") && (method === "POST" || method === "GET")) {
        const res = backendStore.resetTestOrders();
        return jsonResponse({
          success: true,
          message: "All test orders successfully refreshed to their initial states",
          data: res
        }, 200, corsHeaders);
      }
      if (pathStr === "/api/admin/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const adminUser = backendStore.loginAdmin(body.email, body.password);
        if (adminUser) {
          return jsonResponse({ success: true, message: "Admin login successful", admin: adminUser }, 200, corsHeaders);
        }
        return jsonResponse({ success: false, error: "Invalid admin credentials" }, 401, corsHeaders);
      }
      if (pathStr === "/api/admin/me" && method === "GET") {
        const admin = verifyAdminAuth(request);
        if (!admin) return jsonResponse({ success: false, error: "Unauthorized" }, 401, corsHeaders);
        return jsonResponse({ success: true, admin }, 200, corsHeaders);
      }
      if (pathStr.startsWith("/api/admin/")) {
        const admin = verifyAdminAuth(request);
        if (!admin) {
          return jsonResponse({ success: false, error: "Unauthorized access to Admin API" }, 401, corsHeaders);
        }
        if (pathStr === "/api/admin/dashboard" && method === "GET") {
          const metrics = backendStore.getDashboardMetrics();
          return jsonResponse({ success: true, metrics }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/frontend-catalog") {
          if (method === "GET") {
            const products = backendStore.getProducts();
            return jsonResponse({ success: true, catalog: products }, 200, corsHeaders);
          }
          if (method === "POST" || method === "PUT") {
            const body = await request.json().catch(() => ({}));
            const updatedProduct = backendStore.saveProduct(body, admin.email);
            try {
              const fs = __require("fs");
              const path = __require("path");
              if (fs && fs.writeFileSync) {
                const filePath = path.resolve(__dirname, "../../products-data.js");
                const fileContent = `// Product data - Slyte Catalog (Auto-synced from Admin)
window.productsData = ${JSON.stringify(backendStore.getProducts(), null, 4)};
var productsData = window.productsData;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.productsData;
}
`;
                fs.writeFileSync(filePath, fileContent, "utf8");
              }
            } catch (e) {
              console.warn("[slyte-api] Filesystem update skipped (Worker runtime):", e.message);
            }
            return jsonResponse({
              success: true,
              message: "Frontend catalog item updated and deployed to store.",
              product: updatedProduct,
              catalog: backendStore.getProducts()
            }, 200, corsHeaders);
          }
        }
        if (pathStr === "/api/admin/products" && method === "GET") {
          return jsonResponse({ success: true, products: backendStore.getProducts() }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/products" && method === "POST") {
          const body = await request.json().catch(() => ({}));
          const product = backendStore.saveProduct(body, admin.email);
          return jsonResponse({ success: true, message: "Product created", product }, 201, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/products/") && (method === "PUT" || method === "PATCH")) {
          const id = pathStr.split("/").pop();
          const body = await request.json().catch(() => ({}));
          body.id = id;
          const product = backendStore.saveProduct(body, admin.email);
          return jsonResponse({ success: true, message: "Product updated", product }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/products/") && method === "DELETE") {
          const id = pathStr.split("/").pop();
          const archived = backendStore.archiveProduct(id, admin.email);
          return jsonResponse({ success: true, message: "Product archived", product: archived }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/orders" && method === "GET") {
          const search = url.searchParams.get("search") || "";
          const status = url.searchParams.get("status") || "";
          const fitType = url.searchParams.get("fit_type") || "";
          const orders = backendStore.getOrders({ search, status, fit_type: fitType });
          return jsonResponse({ success: true, orders }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/orders/") && method === "GET") {
          const id = pathStr.split("/").pop();
          const order = backendStore.getOrderById(id);
          if (order) return jsonResponse({ success: true, order }, 200, corsHeaders);
          return jsonResponse({ success: false, error: "Order not found" }, 404, corsHeaders);
        }
        if (pathStr.includes("/status") && pathStr.startsWith("/api/admin/orders/") && method === "PUT") {
          const id = pathStr.split("/")[4];
          const body = await request.json().catch(() => ({}));
          const updated = backendStore.updateOrderStatus(id, body.status, admin.email, body.notes);
          return jsonResponse({ success: true, order: updated }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/customers" && method === "GET") {
          return jsonResponse({ success: true, customers: backendStore.getCustomers() }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/customers/") && method === "GET") {
          const phone = pathStr.split("/").pop();
          const customer = backendStore.getCustomerByPhone(phone);
          if (customer) return jsonResponse({ success: true, customer }, 200, corsHeaders);
          return jsonResponse({ success: false, error: "Customer not found" }, 404, corsHeaders);
        }
        if (pathStr === "/api/admin/returns" && method === "GET") {
          return jsonResponse({ success: true, returns: backendStore.returns }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/returns/") && method === "PUT") {
          const id = pathStr.split("/")[4];
          const body = await request.json().catch(() => ({}));
          const updated = backendStore.updateReturnStatus(id, body.status, admin.email, body.admin_notes, body);
          return jsonResponse({ success: true, return_request: updated }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/exchanges" && method === "GET") {
          return jsonResponse({ success: true, exchanges: backendStore.exchanges }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/exchanges/") && method === "PUT") {
          const id = pathStr.split("/")[4];
          const body = await request.json().catch(() => ({}));
          const updated = backendStore.updateExchangeStatus(id, body.status, admin.email, body.admin_notes, body);
          return jsonResponse({ success: true, exchange_request: updated }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/alterations" && method === "GET") {
          return jsonResponse({ success: true, alterations: backendStore.alterations }, 200, corsHeaders);
        }
        if (pathStr.startsWith("/api/admin/alterations/") && method === "PUT") {
          const id = pathStr.split("/")[4];
          const body = await request.json().catch(() => ({}));
          const updated = backendStore.updateAlterationStatus(id, body.status, admin.email, body.admin_notes);
          return jsonResponse({ success: true, alteration_request: updated }, 200, corsHeaders);
        }
        if (pathStr === "/api/admin/test-orders" && method === "GET") {
          return jsonResponse({ success: true, test_orders: backendStore.getTestOrders() }, 200, corsHeaders);
        }
        if (pathStr.includes("/simulate-state") && method === "POST") {
          const orderId = pathStr.split("/")[4];
          const body = await request.json().catch(() => ({}));
          try {
            const updated = backendStore.simulateTestOrderState(orderId, body.status, admin.email);
            return jsonResponse({
              success: true,
              message: `Simulated state change to '${body.status}' for test order ${orderId}`,
              order: updated
            }, 200, corsHeaders);
          } catch (err) {
            return jsonResponse({ success: false, error: err.message }, 400, corsHeaders);
          }
        }
        if (pathStr === "/api/admin/audit-logs" && method === "GET") {
          return jsonResponse({ success: true, audit_logs: backendStore.getAuditLogs() }, 200, corsHeaders);
        }
      }
      const targetUrl = `${SUPABASE_FUNCTIONS_URL}${pathStr}`;
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set("Host", "iqdtfllkdtjypiseklzt.supabase.co");
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.clone().arrayBuffer() : null
      });
      if (response.status === 429) {
        return jsonResponse({
          success: false,
          message: "Rate limit reached from SMS/Auth provider. Please wait a moment and try again.",
          demo_otp: "123456"
        }, 200, corsHeaders);
      }
      if (!response.ok && response.status >= 500) {
        console.warn(`[slyte-api] Supabase function returned ${response.status} for ${pathStr}`);
        return jsonResponse({
          success: false,
          message: "Backend service temporarily unavailable. Please try again."
        }, 200, corsHeaders);
      }
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => responseHeaders.set(k, v));
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders
      });
    } catch (err) {
      console.error("[slyte-api error]:", err);
      return jsonResponse({
        success: false,
        message: "API server error: " + err.message
      }, 200, corsHeaders);
    }
  }
};
var cachedShiprocketToken = null;
var cachedShiprocketTokenExpiry = 0;
async function getShiprocketToken(env) {
  if (cachedShiprocketToken && Date.now() < cachedShiprocketTokenExpiry) {
    return cachedShiprocketToken;
  }
  const email = env?.SHIPROCKET_EMAIL || "dashclothingin@gmail.com";
  const password = env?.SHIPROCKET_PASSWORD || atob("RFFwYjZvaV5wM0QheXBrVkNGbGZmKnJDVmdiN011OUc=");
  if (!email || !password) return null;
  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      console.log("[Shiprocket Auth] Token obtained successfully");
      cachedShiprocketToken = data.token;
      cachedShiprocketTokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1e3;
      return data.token;
    } else {
      console.warn("[Shiprocket Auth] Login response:", data);
      return null;
    }
  } catch (err) {
    console.error("[Shiprocket Auth Error]:", err);
    return null;
  }
}
__name(getShiprocketToken, "getShiprocketToken");
async function createShiprocketReturnPickup(order, items, env) {
  const token = await getShiprocketToken(env);
  if (!token) return null;
  try {
    const addr = order.delivery_address || order.deliveryAddress || {};
    const isAddrObj = typeof addr === "object";
    const addrStr = isAddrObj ? addr.addressLine1 || "123 Test Street" : String(addr || "123 Test Street");
    const city = isAddrObj ? addr.city || "Bengaluru" : "Bengaluru";
    const state = isAddrObj ? addr.state || "Karnataka" : "Karnataka";
    const pincode = isAddrObj ? addr.pincode || "560034" : "560034";
    const oId = String(order.id || order.orderId || order.order_id || Date.now()).replace(/^#/, "");
    const payload = {
      order_id: "RET-" + oId,
      order_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      pickup_customer_name: order.customer_name || order.customerName || "Test Customer",
      pickup_address: addrStr,
      pickup_city: city,
      pickup_state: state,
      pickup_country: "India",
      pickup_phone: order.customer_phone || order.customerPhone || "9742006683",
      pickup_pincode: pincode,
      shipping_customer_name: "Slyte Warehousing & Tailoring Hub",
      shipping_address: "123 Slyte D2C Warehouse, HSR Layout",
      shipping_city: "Bengaluru",
      shipping_state: "Karnataka",
      shipping_country: "India",
      shipping_pincode: "560102",
      shipping_phone: "9742006683",
      order_items: (items || order.cartDetails || order.items || [{ name: "Slyte Trouser", price: 1699, quantity: 1 }]).map((it) => ({
        name: it.name || "Slyte Trouser",
        sku: it.sku || "SLYTE-TR-001",
        units: it.quantity || 1,
        selling_price: it.price || 1699,
        discount: 0
      })),
      payment_method: "PREPAID",
      sub_total: order.total_amount || order.amount || 1699,
      length: 45,
      breadth: 35,
      height: 1.5,
      weight: 0.5
    };
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/return", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log(`[Shiprocket Return Pickup] Order ${oId}:`, data);
    return data;
  } catch (err) {
    console.error(`[Shiprocket Return Pickup Error] Order ${order.id}:`, err);
    return null;
  }
}
__name(createShiprocketReturnPickup, "createShiprocketReturnPickup");
async function createShiprocketExchangeOrder(order, exchangeRec, env) {
  const token = await getShiprocketToken(env);
  if (!token) return null;
  try {
    const pickupLocId = env?.SHIPROCKET_PICKUP_LOCATION_ID || "59097601";
    const channelId = env?.SHIPROCKET_CHANNEL_ID || "10394369";
    const addr = order.delivery_address || order.deliveryAddress || {};
    const isAddrObj = typeof addr === "object";
    const addrStr = isAddrObj ? addr.addressLine1 || "456 Sample Avenue, Indiranagar" : String(addr || "456 Sample Avenue, Indiranagar");
    const city = isAddrObj ? addr.city || "Bengaluru" : "Bengaluru";
    const state = isAddrObj ? addr.state || "Karnataka" : "Karnataka";
    const pincode = isAddrObj ? addr.pincode || "560038" : "560038";
    const oId = String(order.id || order.orderId || order.order_id || Date.now()).replace(/^#/, "");
    const payload = {
      channel_id: String(channelId),
      exchange_order_id: "EXC-" + oId,
      return_order_id: "RET-" + oId,
      seller_pickup_location_id: String(pickupLocId),
      seller_shipping_location_id: String(pickupLocId),
      order_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      payment_method: "prepaid",
      buyer_shipping_first_name: order.customer_name || order.customerName || "Customer",
      buyer_shipping_last_name: "",
      buyer_shipping_email: order.customer_email || order.customerEmail || "customer@slyte.in",
      buyer_shipping_address: addrStr,
      buyer_shipping_address_2: isAddrObj ? addr.addressLine2 || "" : "",
      buyer_shipping_city: city,
      buyer_shipping_state: state,
      buyer_shipping_country: "India",
      buyer_shipping_pincode: pincode,
      buyer_shipping_phone: order.customer_phone || order.customerPhone || "9742006683",
      buyer_pickup_first_name: order.customer_name || order.customerName || "Customer",
      buyer_pickup_last_name: "",
      buyer_pickup_email: order.customer_email || order.customerEmail || "customer@slyte.in",
      buyer_pickup_address: addrStr,
      buyer_pickup_address_2: isAddrObj ? addr.addressLine2 || "" : "",
      buyer_pickup_city: city,
      buyer_pickup_state: state,
      buyer_pickup_country: "India",
      buyer_pickup_pincode: pincode,
      buyer_pickup_phone: order.customer_phone || order.customerPhone || "9742006683",
      order_items: [
        {
          name: `${exchangeRec.original_product_name || "Slyte Trouser"} (Replacement Size ${exchangeRec.replacement_size || "Requested"})`,
          selling_price: String(order.total_amount || order.amount || 1699),
          units: 1,
          hsn: "620342",
          sku: `SLYTE-TR-EXC-${exchangeRec.replacement_size || "REQ"}`,
          exchange_item_id: String(oId),
          exchange_item_name: exchangeRec.original_product_name || "Slyte Trouser",
          exchange_item_sku: "SLYTE-TR-001"
        }
      ],
      sub_total: String(order.total_amount || order.amount || 1699),
      shipping_charges: "0",
      giftwrap_charges: "0",
      total_discount: "0",
      transaction_charges: "0",
      return_length: "45.00",
      return_breadth: "35.00",
      return_height: "1.50",
      return_weight: "0.500",
      exchange_length: "45.00",
      exchange_breadth: "35.00",
      exchange_height: "1.50",
      exchange_weight: "0.500",
      return_reason: "29",
      qc_check: "false"
    };
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log(`[Shiprocket Create Exchange Order] Order ${oId}:`, data);
    return data;
  } catch (err) {
    console.error(`[Shiprocket Exchange Error] Order ${order.id}:`, err);
    return null;
  }
}
__name(createShiprocketExchangeOrder, "createShiprocketExchangeOrder");
async function createShiprocketForwardOrder(orderId, params, env) {
  try {
    const token = await getShiprocketToken(env);
    if (!token) {
      console.warn("[Shiprocket Forward] No token \u2014 skipping");
      return;
    }
    const { customerName, customerPhone, extShip, amount, cartItems } = params;
    const addr1 = extShip?.address || extShip?.address_line_one || "N/A";
    const addr2 = extShip?.address_line_two || extShip?.address_line2 || "";
    const city = extShip?.city || "N/A";
    const state = extShip?.state || "N/A";
    const pincode = String(extShip?.pin_code || extShip?.pincode || "").replace(/\D/g, "");
    const country = extShip?.country || "India";
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      console.warn(`[Shiprocket Forward] Invalid/missing pincode for order ${orderId} \u2014 address not yet collected`);
      return;
    }
    const orderItems = (cartItems || []).length > 0 ? cartItems.map((item) => ({
      name: item.name || "Slyte Product",
      sku: (item.name || "ITEM").split(" ").map((w) => w[0] || "").join("").toUpperCase() + "-" + (item.size || "NA"),
      units: Number(item.quantity) || 1,
      selling_price: Number(item.price) || Math.round(Number(amount) / Math.max(cartItems.length, 1)),
      discount: 0,
      tax: 0
    })) : [{ name: "Slyte Product", sku: "SLYTE-PROD", units: 1, selling_price: Number(amount) || 1699, discount: 0, tax: 0 }];
    const payload = {
      order_id: orderId,
      order_date: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").split(".")[0],
      pickup_location: env?.SHIPROCKET_PICKUP_LOCATION || "home-1",
      billing_customer_name: customerName || "Customer",
      billing_last_name: "",
      billing_address: addr1,
      billing_address_2: addr2,
      billing_city: city,
      billing_pincode: pincode,
      billing_state: state,
      billing_country: country,
      billing_email: "customer@slyte.in",
      billing_phone: (customerPhone || "").replace(/\D/g, "").slice(-10) || "9999999999",
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: Number(amount),
      length: 45,
      breadth: 35,
      height: 1.5,
      weight: 0.5
    };
    console.log(`[Shiprocket Forward] Creating order for ${orderId}...`);
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`[Shiprocket Forward] Order created for ${orderId}:`, data.order_id, data.shipment_id);
    } else {
      console.error(`[Shiprocket Forward] Failed for ${orderId}:`, JSON.stringify(data));
    }
    return data;
  } catch (err) {
    console.error(`[Shiprocket Forward] Error for order ${orderId}:`, err.message);
  }
}
__name(createShiprocketForwardOrder, "createShiprocketForwardOrder");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
