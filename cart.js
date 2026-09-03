// cart.js
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("cart-root");
    const summarySection = document.getElementById("cart-summary");
    const stickyFooter = document.getElementById("sticky-footer");
    const subtotalEl = document.getElementById("subtotal-amount");
    const shippingEl = document.getElementById("shipping-amount");
    const totalEl = document.getElementById("grand-total");
    const payBtn = document.getElementById("pay-btn");
    const errEl = document.getElementById("checkout-err");

    let isProcessing = false;

    // Optional: Load fallback products
    const productsDB = window.productsData || [];

    function showErr(t) {
        if (t) {
            errEl.textContent = t;
            errEl.hidden = false;
        } else {
            errEl.textContent = "";
            errEl.hidden = true;
        }
    }

    // Safely parse price, extracting numbers from string formats like "₹10"
    function parsePrice(val) {
        if (typeof val === "number") return val;
        if (typeof val === "string") {
            const num = parseFloat(val.replace(/[^\d.]/g, ""));
            if (!isNaN(num)) return num;
        }
        return null; // Signals invalid or missing
    }

    function updateCartUI() {
        const items = window.SLYTE_API.loadCartFromStorage();

        if (!items || items.length === 0) {
            root.innerHTML = `
                <div class="empty-cart">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <a href="index.html" class="btn-shop">Continue Shopping</a>
                </div>
            `;
            summarySection.style.display = 'none';
            stickyFooter.style.display = 'none';
            return;
        }

        let valid = true;
        let subtotal = 0;

        const processedItems = items.map((it, idx) => {
            const size = it.size ?? it.selectedSize ?? it.variant ?? "";
            const meas = it.measurements || it.customFit || it.customMeasurements || null;
            const isCustomItem = size === "Custom Fit" || it.fit === "Custom Fit" || (meas && typeof meas === "object");

            let price = parsePrice(it.price);
            if (price === null || price <= 0) {
                price = isCustomItem ? 1799 : 1699;
            } else if (isCustomItem && price === 1699) {
                price = 1799;
            } else if (!isCustomItem && price === 1799) {
                price = 1699;
            }

            const quantity = Number(it.quantity) > 0 ? Number(it.quantity) : 1;
            subtotal += price * quantity;

            let measText = "";
            if (meas && typeof meas === "object") {
                const parts = [];
                if (meas.waist) parts.push(`Waist: ${meas.waist}"`);
                const lengthVal = meas.length || meas.outseam;
                if (lengthVal) parts.push(`Length: ${lengthVal}"`);
                if (meas.ankle) parts.push(`Ankle: ${meas.ankle}"`);

                if (parts.length > 0) {
                    measText = `Custom Fit (${parts.join(', ')})`;
                } else {
                    measText = "Custom Fit";
                }
            }

            let displaySize = "";
            if (measText) {
                displayFitText = `Fit: ${measText}`;
                displaySize = `Fit: ${measText}`;
            } else if (isCustomItem) {
                displaySize = "Fit: Custom Fit";
            } else if (size) {
                displaySize = `Fit: Standard Fit (${size})`;
            } else {
                displaySize = "Fit: Standard Fit";
            }
            const fallbackImg = (typeof window !== "undefined" && window.SLYTE_CONFIG) ? window.SLYTE_CONFIG.getImageUrl("images/logos/slyte-logo-black.png") : "images/logos/slyte-logo-black.png";
            // Check db match image if item has no image
            let imgSrc = it.image;
            if (!imgSrc) {
                const dbMatch = productsDB.find(p => p.id === it.id || p.name === it.name);
                if (dbMatch) imgSrc = dbMatch.image;
            }
            imgSrc = imgSrc || fallbackImg;

            return `
                <div class="cart-item" data-index="${idx}">
                    <div class="item-img-placeholder">
                        <img src="${imgSrc}" alt="${it.name || "Item"}" onerror="this.src='${fallbackImg}'">
                    </div>
                    <div class="item-details">
                        <div class="item-header">
                            <div class="item-title">${it.name || it.title || "Item"}</div>
                            <div class="item-price">${price > 0 ? '₹' + price : ''}</div>
                        </div>
                        ${displaySize ? `<div class="item-meta">${displaySize}</div>` : ""}
                        <div class="item-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn" onclick="handleChangeQty(${idx}, -1)">-</button>
                                <span class="qty-val">${quantity}</span>
                                <button class="qty-btn" onclick="handleChangeQty(${idx}, 1)">+</button>
                            </div>
                            <button class="btn-remove" aria-label="Remove item" onclick="handleRemoveItem(${idx})">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        root.innerHTML = processedItems.join("");

        const shipping = 0; // Free shipping initially, could be dynamic
        const total = subtotal + shipping;

        subtotalEl.textContent = `₹${subtotal}`;
        shippingEl.textContent = shipping === 0 ? "Free" : `₹${shipping}`;
        totalEl.textContent = `₹${total}`;

        summarySection.style.display = 'block';
        stickyFooter.style.display = 'flex';

        if (!valid) {
            showErr("Some items have invalid prices. Please remove them.");
            payBtn.disabled = true;
            payBtn.textContent = "Invalid Total";
        } else if (total <= 0) {
            payBtn.disabled = true;
            payBtn.textContent = "Empty Cart";
        } else {
            payBtn.disabled = false;
            payBtn.innerHTML = `ORDER NOW — ₹${total} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
        }
    }

    window.handleRemoveItem = function (index) {
        if (window.removeSlyteCartLine) {
            window.removeSlyteCartLine(index);
        } else if (window.removeDashCartLine) {
            window.removeDashCartLine(index);
        } else {
            const items = window.SLYTE_API.loadCartFromStorage();
            items.splice(index, 1);
            localStorage.setItem("slyte_cart", JSON.stringify(items));
            updateCartUI();
        }
    };

    window.handleChangeQty = function (index, delta) {
        const items = window.SLYTE_API.loadCartFromStorage();
        if (items && items[index]) {
            const cur = Number(items[index].quantity) || 1;
            const nxt = cur + delta;
            if (nxt > 0) {
                items[index].quantity = nxt;
                if (window.setSlyteCart) window.setSlyteCart(items);
                else if (window.setDashCart) window.setDashCart(items);
                else {
                    localStorage.setItem("slyte_cart", JSON.stringify(items));
                    updateCartUI();
                }
            } else if (nxt === 0) {
                handleRemoveItem(index);
            }
        }
    };

    payBtn.addEventListener("click", async function () {
        if (isProcessing) return;

        showErr("");
        const items = window.SLYTE_API.loadCartFromStorage();

        let valid = true;
        let total = 0;

        // Auto-fix price data flow before checkout
        items.forEach(it => {
            const size = it.size ?? it.selectedSize ?? it.variant ?? "";
            const meas = it.measurements || it.customFit || it.customMeasurements || null;
            const isCustomItem = size === "Custom Fit" || it.fit === "Custom Fit" || (meas && typeof meas === "object");

            let price = parsePrice(it.price);
            if (price === null || price <= 0) {
                price = isCustomItem ? 1799 : 1699;
            } else if (isCustomItem && price === 1699) {
                price = 1799;
            } else if (!isCustomItem && price === 1799) {
                price = 1699;
            }

            it.price = price;
            it.fit = isCustomItem ? "Custom Fit" : "Standard Fit";
            total += price * (Number(it.quantity) || 1);
        });

        // Add shipping
        const shipping = 0;
        total += shipping;

        // Validate total > 0
        if (!valid || total <= 0) {
            showErr("Cannot process checkout with invalid or zero total amount.");
            return;
        }

        // Pass total directly in Rupees as expected by backend and Cashfree
        const amountForCheckout = total;

        isProcessing = true;
        const originalBtnHtml = payBtn.innerHTML;
        payBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
            </svg> 
            PROCESSING...
        `;
        // Insert inline style mapping for spin if it doesn't exist
        if (!document.getElementById('spin-style')) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        payBtn.disabled = true;

        try {
            const res = await window.initiateCheckout({
                amount: amountForCheckout,
                customerPhone: localStorage.getItem("slyte_phone") || localStorage.getItem("dash_phone") || undefined,
                customerName: localStorage.getItem("username") || undefined,
                cartItems: items
            });

            const sid = res.data && res.data.payment_session_id;
            const oid = res.data && res.data.order_id;

            if (!sid) {
                throw new Error("No payment_session_id from server");
            }

            if (typeof Cashfree !== "undefined") {
                const cf = Cashfree({ mode: "production" });
                cf.checkout({
                    paymentSessionId: sid,
                    returnUrl: window.location.origin + "/index.html?order_id=" + encodeURIComponent(oid || "")
                });
            } else {
                throw new Error("Cashfree SDK not loaded on this page.");
            }
        } catch (e) {
            console.error(e);
            showErr(e.message || "Checkout failed");
            payBtn.innerHTML = originalBtnHtml;
            payBtn.disabled = false;
        } finally {
            isProcessing = false;
        }
    });

    window.addEventListener("slytecartchange", updateCartUI);
    window.addEventListener("dashcartchange", updateCartUI);
    updateCartUI();
});


