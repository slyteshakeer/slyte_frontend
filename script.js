
import { monitorAuthState, logoutUser } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED DATA ---
    const getProducts = () => (typeof window !== 'undefined' && Array.isArray(window.productsData) && window.productsData.length > 0) ? window.productsData : ((typeof productsData !== 'undefined') ? productsData : []);
    const allProducts = getProducts();

    // --- SHARED HELPERS ---
    const getWishlist = () => {
        const list = localStorage.getItem('slyteWishlist') || localStorage.getItem('dashWishlist');
        return list ? JSON.parse(list) : [];
    };

    const saveWishlist = (list) => {
        localStorage.setItem('slyteWishlist', JSON.stringify(list));
    };

    const toggleWishlist = async (product) => {
        let list = getWishlist();
        const index = list.findIndex(p => p.id === product.id);
        let added = false;
        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(product);
            added = true;
        }
        saveWishlist(list);
        return added;
    };

    const showToast = (message) => {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification success';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };
    window.showToast = showToast;

    // --- HEADER SCROLL EFFECT ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow = window.scrollY > 20 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
        });
    }

    // --- MOBILE MENU ---
    const menuBtn = document.querySelector('.menu-btn');
    const menuDrawer = document.getElementById('menuDrawer');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuCloseBtn = document.getElementById('menuCloseBtn');

    const toggleMenu = (show) => {
        if (!menuDrawer || !menuOverlay) return;
        if (show) {
            menuDrawer.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        } else {
            menuDrawer.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    };

    if (menuBtn) menuBtn.addEventListener('click', () => {
        console.log("Hamburger clicked");
        toggleMenu(true);
    });
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', () => toggleMenu(false));
    if (menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });

    // --- SHOP PAGE ---
    const shopGrid = document.querySelector('.shop-grid');
    if (shopGrid) {
        shopGrid.innerHTML = allProducts.map(product => `
            <div class="shop-card">
                <a href="${product.link}" class="card-image" style="display:block; text-decoration:none;">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="card-details">
                    <a href="${product.link}" style="text-decoration:none;">
                        <h3>${product.name}</h3>
                    </a>
                    <p class="price">${product.price}</p>
                    <div class="fit-tag">Perfect for You</div>
                    <div class="card-actions">
                        <button class="action-btn wishlist-btn-static ${getWishlist().some(p => p.id === product.id) ? 'active' : ''}" data-id="${product.id}">
                            <span class="material-symbols-outlined">favorite</span> Save
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add wishlist listeners for shop cards
        document.querySelectorAll('.wishlist-btn-static').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget;
                const pid = parseInt(target.dataset.id);
                const product = allProducts.find(p => p.id === pid);
                if (product) {
                    const added = await toggleWishlist(product);
                    target.classList.toggle('active', added);
                    showToast(added ? 'Added to Wishlist' : 'Removed from Wishlist');
                }
            });
        });
    }


    // --- CART LOGIC (LocalStorage Only) ---

    // Get Cart
    const getCart = () => {
        const cartJSON = localStorage.getItem('slyte_cart') || localStorage.getItem('dash_cart');
        return cartJSON ? JSON.parse(cartJSON) : [];
    };

    // Save Cart
    const saveCart = (cart) => {
        localStorage.setItem('slyte_cart', JSON.stringify(cart));
        updateCartUI();
    };

    // Add to Cart
    window.addToCart = (product, size, customFit = null) => {
        const cart = getCart();
        let existingItem = null;

        if (!customFit) {
            existingItem = cart.find(item => item.id === product.id && item.size === size && !item.customFit);
        } else {
            existingItem = cart.find(item =>
                item.id === product.id &&
                item.size === size &&
                JSON.stringify(item.customFit) === JSON.stringify(customFit)
            );
        }

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                size: size,
                customFit: customFit,
                quantity: 1
            });
        }
        saveCart(cart);
        updateCartUI();
    };

    // Internal usage wrapper
    const addToCart = window.addToCart;

    // Update Quantity
    const updateQuantity = (index, action) => {
        const cart = getCart();
        if (!cart[index]) return;

        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                // Optional: Confirm remove?
            }
        }
        saveCart(cart);
        renderCart();
    };

    // Remove from Cart
    const removeFromCart = (index) => {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    };

    // Update UI Badges
    const updateCartUI = () => {
        const cartCountElements = document.querySelectorAll('.cart-count, .nav-cart-count');
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCountElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    };
    updateCartUI();

    // Render Cart Page
    const renderCart = () => {
        const cartItemsContainer = document.querySelector('.cart-items');
        // Elements for totals
        const bagTotalElements = document.querySelectorAll('.bag-total, .checkout-total');
        const grandTotalElements = document.querySelectorAll('.grand-total, .checkout-total-btn');
        const payAmountElements = document.querySelectorAll('.pay-amount');

        if (!cartItemsContainer) return;

        const cart = getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 10px;">shopping_cart_off</span>
                    <p>Your cart is empty.</p>
                    <a href="shop.html" style="color: var(--primary-blue); text-decoration: underline; margin-top: 10px; display: inline-block;">Start Shopping</a>
                </div>
            `;
            // Zero totals
            const zero = "\u20B90";
            [...bagTotalElements, ...grandTotalElements, ...payAmountElements].forEach(el => el.textContent = zero);
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => {
            let customFitHTML = '';
            if (item.customFit) {
                customFitHTML = `
                    <div style="margin-top: 6px; padding: 6px; background: #f5f8ff; border-radius: 6px; border: 1px dashed #154cbd; font-size: 11px;">
                        <div style="display:flex; align-items:center; gap:4px; font-weight:600; color:#154cbd; margin-bottom:2px;">
                             <span class="material-symbols-outlined" style="font-size:12px">straighten</span> Custom Fit Applied
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2px; color: #444;">
                             <span>Waist: <b>${item.customFit.waist}"</b></span>
                             <span>Inseam: <b>${item.customFit.inseam}"</b></span>
                             <span>Outseam: <b>${item.customFit.outseam}"</b></span>
                             <span>Ankle: <b>${item.customFit.ankle}"</b></span>
                        </div>
                    </div>
                `;
            }

            return `
            <div class="cart-card">
                <a href="${item.link}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="cart-card-details">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;"><h3 style="margin:0; font-size:15px; font-weight:600; flex:1; color:#000;">${item.name}</h3><p class="price-text" style="margin:0; font-size:15px; font-weight:700; color:#000; white-space:nowrap;">${item.price}</p></div>
                        <div class="variant">${item.size === 'Custom Fit' || item.fit === 'Custom Fit' ? 'Fit: Custom Fit' : (item.size ? `Fit: Standard Fit (${item.size})` : 'Fit: Standard Fit')}</div>
                        ${customFitHTML}
                    </div>
                    
                    <div class="cart-actions-row">
                         <div class="qty-btn-group">
                            <span style="font-size: 11px; color: #666; margin-right: 0px;">Qty</span>
                            <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                         </div>
                         
                    </div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                         <button class="remove-link remove-btn" data-index="${index}">
                            <span class="material-symbols-outlined" style="font-size:16px">delete</span> Remove
                         </button>
                    </div>
                </div>
            </div>
        `}).join('');

        // Listeners for dynamic cart elements
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                updateQuantity(parseInt(e.target.dataset.index), e.target.dataset.action);
            });
        });
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(parseInt(e.target.closest('.remove-btn').dataset.index));
            });
        });

        // Totals
        let total = 0;
        cart.forEach(item => {
            const price = parseInt(item.price.replace(/[^0-9]/g, ''));
            total += price * item.quantity;
        });
        const formatted = `\u20B9${total.toLocaleString('en-IN')}`;
        [...bagTotalElements, ...grandTotalElements, ...payAmountElements].forEach(el => el.textContent = formatted);
    };

    renderCart();


    // --- WISHLIST LOGIC (LocalStorage Only) ---

    const renderWishlist = () => {
        const container = document.getElementById('wishlistItems');
        if (!container) return;

        const list = getWishlist();
        if (list.length === 0) {
            container.innerHTML = `
                <div class="empty-wishlist">
                    <h2>Your wishlist is empty</h2>
                    <a href="shop.html" class="shop-now-btn">Shop Now</a>
                </div>`;
            return;
        }

        container.innerHTML = list.map((item, index) => `
            <div class="wishlist-card">
                <a href="${item.link}"><img src="${item.image}" alt="${item.name}"></a>
                <div class="wishlist-card-details">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;"><h3 style="margin:0; font-size:15px; font-weight:600; flex:1; color:#000;">${item.name}</h3><p class="price-text" style="margin:0; font-size:15px; font-weight:700; color:#000; white-space:nowrap;">${item.price}</p></div>
                    <p class="price">${item.price}</p>
                    <button class="add-to-cart-wishlist" data-id="${item.id}">Add to Cart</button>
                </div>
                <button class="wishlist-remove-btn" data-index="${index}">X</button>
            </div>
        `).join('');

        // Listeners
        document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                const list = getWishlist();
                list.splice(idx, 1);
                saveWishlist(list);
                renderWishlist();
                showToast('Removed from wishlist');
            });
        });
        document.querySelectorAll('.add-to-cart-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pid = parseInt(e.target.dataset.id);
                const p = allProducts.find(x => x.id === pid);
                if (p) {
                    addToCart(p, '32');
                    showToast('Added to Cart');
                }
            });
        });
    };

    if (document.getElementById('wishlistItems')) renderWishlist();


    // --- PRODUCT PAGE INTERACTION ---
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const selectedSizeBox = document.querySelector('.size-box.selected');
            const isCustomCheck = document.getElementById('custom-fit-btn')?.classList.contains('active');
            if (!selectedSizeBox && !isCustomCheck) {
                showToast('Please select a size first');
                return;
            }
            const urlParams = new URLSearchParams(window.location.search);
            const pid = parseInt(urlParams.get('id')) || 1;
            const baseProd = allProducts.find(p => p.id === pid) || {};
            const product = Object.assign({}, baseProd);

            const isCustom = document.getElementById('custom-fit-btn')?.classList.contains('active');
            const size = isCustom ? 'Custom Fit' : (document.querySelector('.size-box.selected')?.textContent || '32');
            const priceFormatted = isCustom ? '₹1,799' : '₹1,699';
            
            product.price = priceFormatted;
            product.fit = isCustom ? 'Custom Fit' : 'Standard Fit';

            const priceEl = document.querySelector('.p-price');
            if (priceEl) priceEl.textContent = priceFormatted;

            if (product) {
                addToCart(product, size);
                showToast('Added to Cart');
            }
        });
    }

    // Buy Now - directly checkout with 1 item
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', async () => {
            const selectedSizeBox = document.querySelector('.size-box.selected');
            const isCustomCheck = document.getElementById('custom-fit-btn')?.classList.contains('active');
            if (!selectedSizeBox && !isCustomCheck) {
                showToast('Please select a size first');
                return;
            }
            const urlParams = new URLSearchParams(window.location.search);
            const pid = parseInt(urlParams.get('id')) || 1;
            const product = Object.assign({}, allProducts.find(p => p.id === pid));
            
            const isCustom = document.getElementById('custom-fit-btn')?.classList.contains('active');
            const size = isCustom ? 'Custom Fit' : (document.querySelector('.size-box.selected')?.textContent || '32');
            
            const priceEl = document.querySelector('.p-price');
            if (priceEl) product.price = priceEl.textContent;
            
            if (product) {
                const isCustom = document.getElementById('custom-fit-btn')?.classList.contains('active');
                const priceNum = isCustom ? 1799 : 1699;
                const priceFormatted = isCustom ? '₹1,799' : '₹1,699';
                product.price = priceFormatted;
                product.fit = isCustom ? 'Custom Fit' : 'Standard Fit';

                // Add loading state
                const originalText = buyNowBtn.innerHTML;
                buyNowBtn.innerHTML = 'PROCESSING...';
                buyNowBtn.disabled = true;

                try {
                    // Start checkout purely for this 1 item
                    const res = await window.initiateCheckout({
                        amount: priceNum,
                        customerPhone: localStorage.getItem("slyte_phone") || localStorage.getItem("dash_phone") || undefined,
                        customerName: localStorage.getItem("username") || undefined,
                        cartItems: [{
                            ...product,
                            size: size,
                            quantity: 1,
                            price: priceNum
                        }]
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
                        // Redirect to cart.html if cashfree isn't available
                        window.location.href = 'cart.html';
                    }
                } catch (e) {
                    console.error("Buy Now Checkout failed:", e);
                    window.showToast("Checkout failed. Please try again or use cart.");
                    buyNowBtn.innerHTML = originalText;
                    buyNowBtn.disabled = false;
                }
            }
        });
    }

    // Fit and Size selection
    const sizeBoxes = document.querySelectorAll('.size-box');
    const customFitBtn = document.getElementById('custom-fit-btn');
    const priceEl = document.querySelector('.p-price');

    // Handle size box click (Standard Fit)
    sizeBoxes.forEach(box => {
        box.addEventListener('click', () => {
            if (box.classList.contains('disabled')) return;
            sizeBoxes.forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
            
            if (customFitBtn) {
                customFitBtn.classList.remove('active');
            }
            if (priceEl) priceEl.textContent = '₹1,699';
        });
    });

    // Handle Custom Fit button click
    if (customFitBtn) {
        customFitBtn.addEventListener('click', () => {
            sizeBoxes.forEach(b => b.classList.remove('selected'));
            customFitBtn.classList.add('active');
            
            if (priceEl) priceEl.textContent = '₹1,799';
        });
    }

    // --- DYNAMIC PRODUCT PAGE ---
    const initCarousel = () => {
        const carouselContainer = document.querySelector('.carousel-container');
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        const thumbs = document.querySelectorAll('.thumb');
        let currentIndex = 0;

        const showSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;

            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === index);
            });
        };

        // Initial show
        if (slides.length > 0) showSlide(0);

        // Click handlers
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.dataset.index);
                showSlide(idx);
            });
        });

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.dataset.index);
                showSlide(idx);
            });
        });

        // Swipe Support
        let touchstartX = 0;
        let touchendX = 0;

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                touchstartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselContainer.addEventListener('touchend', (e) => {
                touchendX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        const handleSwipe = () => {
            if (touchendX < touchstartX - 50) {
                // Swiped Left -> Next
                showSlide(currentIndex + 1);
            }
            if (touchendX > touchstartX + 50) {
                // Swiped Right -> Previous
                showSlide(currentIndex - 1);
            }
        };
    };

    const shareProduct = (product) => {
        if (!product) return;
        const shareData = {
            title: product.name,
            text: `Check out this ${product.name} on slyte!`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('User cancelled share or error:', err);
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => showToast('Link copied to clipboard!'))
                .catch(err => console.error('Error copying link:', err));
        }
    };

    const loadProductPage = () => {
        // Only run on product page
        if (!document.querySelector('.product-container') && !window.location.pathname.includes('product')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const pid = parseInt(urlParams.get('id')); // might be NaN

        const productsList = getProducts();
        let product = null;
        if (!pid) {
            product = productsList[0]; // Default to first product if no ID
        } else {
            product = productsList.find(p => p.id === pid);
        }

        if (!product) return;
        // update title and price
        const titleEl = document.querySelector('.p-title');
        const priceEl = document.querySelector('.p-price');
        if (titleEl) titleEl.textContent = product.name;
        if (priceEl) priceEl.textContent = product.price;

        // update page title
        document.title = `${product.name} - SLYTE Custom Fit Menswear`;

        // Update Schema.org Product JSON-LD dynamically with real product data
        const jsonLdEl = document.getElementById('product-jsonld');
        if (jsonLdEl) {
            const rawPrice = (product.price || "").replace(/[^\d]/g, '');
            const primaryImg = (typeof window.SLYTE_CONFIG !== 'undefined' && window.SLYTE_CONFIG.getImageUrl)
                ? window.SLYTE_CONFIG.getImageUrl(product.image || (product.images && product.images[0]))
                : (product.image || (product.images && product.images[0]));
            const fullImgUrl = primaryImg.startsWith('http') ? primaryImg : `https://slyte.in/${primaryImg}`;
            const schemaData = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.name,
                "image": fullImgUrl,
                "description": `Buy premium custom fit ${product.name} from SLYTE. AI-powered precision sizing and custom tailoring for men.`,
                "brand": {
                    "@type": "Brand",
                    "name": "SLYTE"
                },
                "offers": {
                    "@type": "Offer",
                    "url": `https://slyte.in/product.html?id=${product.id}`,
                    "priceCurrency": "INR",
                    "price": rawPrice || "999",
                    "availability": "https://schema.org/InStock"
                }
            };
            jsonLdEl.textContent = JSON.stringify(schemaData, null, 2);
        }

        // update images
        const carouselContainer = document.querySelector('.carousel-container');
        const thumbnailsContainer = document.querySelector('.gallery-thumbnails');

        if (carouselContainer && product.images && product.images.length > 0) {
            // Rebuild Slides
            const slidesHTML = product.images.map((img, i) => `
                <div class="carousel-slide" style="${i === 0 ? 'display:block' : 'display:none'}">
                    <img src="${img}" alt="${product.name}">
                </div>
            `).join('');

            // Rebuild Dots
            const dotsHTML = product.images.map((_, i) => `
                <span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>
            `).join('');

            // Helper to keep buttons
            // We need to re-attach or re-create them. 
            // Since we are replacing innerHTML, we lose event listeners if attached to buttons inside.
            // But luckily, wishlist/share buttons are static in HTML structure, so we should preserve them if possible
            // OR re-add them. 
            // The structure in HTML is: slides, dots, share-btn, wishlist-btn.

            const shareBtnHTML = `<button class="share-btn"><span class="material-symbols-outlined">share</span></button>`;
            const wishlistBtnHTML = `<button class="wishlist-btn-gallery"><span class="material-symbols-outlined">favorite</span></button>`;

            carouselContainer.innerHTML = slidesHTML +
                `<div class="carousel-dots">${dotsHTML}</div>` +
                shareBtnHTML + wishlistBtnHTML;

            // Rebuild Thumbnails
            if (thumbnailsContainer) {
                thumbnailsContainer.innerHTML = product.images.map((img, i) => `
                    <img src="${img}" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" alt="Thumbnail ${i + 1}">
                `).join('');
            }

            // Initialize Carousel Logic
            initCarousel();

            // --- ATTACH SHARE & WISHLIST LISTENERS ---
            const shareBtn = carouselContainer.querySelector('.share-btn');
            const wishlistBtn = carouselContainer.querySelector('.wishlist-btn-gallery');

            if (shareBtn) {
                shareBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    shareProduct(product);
                });
            }

            if (wishlistBtn) {
                // Initial active state check
                const currentWishlist = getWishlist();
                const isInWishlist = currentWishlist.some(p => p.id === product.id);
                if (isInWishlist) wishlistBtn.classList.add('active');

                wishlistBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const added = await toggleWishlist(product);
                    wishlistBtn.classList.toggle('active', added);
                    showToast(added ? 'Added to Wishlist' : 'Removed from Wishlist');
                });
            }
        } else if (carouselContainer && product.image) {
            // Single image fallback
            const slidesHTML = `
                <div class="carousel-slide" style="display:block">
                    <img src="${product.image}" alt="${product.name}">
                </div>
            `;
            carouselContainer.innerHTML = slidesHTML;
            if (thumbnailsContainer) thumbnailsContainer.innerHTML = '';
        }

        // Explore More rendering
        const exploreMoreGrid = document.getElementById('explore-more-grid');
        if (exploreMoreGrid) {
            const productsList = getProducts();
            const otherProducts = productsList.filter(p => p.id !== product.id).slice(0, 2);
            if (otherProducts.length > 0) {
                exploreMoreGrid.innerHTML = otherProducts.map(p => `
                    <a href="product.html?id=${p.id}">
                        <img class="em-img" src="${p.image}" alt="${p.name}">
                        <div class="em-info">
                            <p class="em-name">${p.name}</p>
                            <p class="em-price">${p.price}</p>
                        </div>
                    </a>
                `).join('');
            } else {
                const exploreSection = document.querySelector('.explore-more-section');
                if (exploreSection) exploreSection.style.display = 'none';
            }
        }
    };


    // --- SEARCH PAGE LOGIC ---
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchClear = document.getElementById('searchClear');
    const searchResultsHeading = document.getElementById('results-heading');
    const resultsCount = document.getElementById('resultsCount');
    const productsGrid = document.getElementById('products-grid');
    const popularSection = document.getElementById('popularSection');

    if (searchInput && productsGrid) {

        // Reusable card renderer
        const renderProductCards = (products) => {
            return products.map(product => `
                <a href="product.html?id=${product.id}" class="product-card" style="text-decoration: none;">
                    <div class="product-image">
                        <div class="badge">AI Fit Ready</div>
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price}</p>
                    </div>
                </a>
            `).join('');
        };

        // Render all products initially
        productsGrid.innerHTML = renderProductCards(allProducts);
        if (resultsCount) resultsCount.textContent = `${allProducts.length} products`;

        // Search function
        const performSearch = (query) => {
            query = query.toLowerCase().trim();

            // Show/Hide clear button
            if (searchClear) searchClear.style.display = query.length > 0 ? 'block' : 'none';

            // Show/Hide popular section
            if (popularSection) popularSection.style.display = query.length > 0 ? 'none' : '';

            if (!query) {
                // Reset â€” show all
                if (searchResultsHeading) searchResultsHeading.textContent = 'All Products';
                if (resultsCount) resultsCount.textContent = `${allProducts.length} products`;
                productsGrid.innerHTML = renderProductCards(allProducts);
                return;
            }

            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.tags && p.tags.some(t => t.includes(query)))
            );

            if (searchResultsHeading) {
                searchResultsHeading.textContent = filtered.length > 0
                    ? `Results for "${query}"`
                    : 'No Results';
            }
            if (resultsCount) {
                resultsCount.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
            }

            if (filtered.length === 0) {
                productsGrid.innerHTML = `
                    <div class="search-empty-state" style="grid-column: 1 / -1;">
                        <span class="material-symbols-outlined">search_off</span>
                        <p>No products found for "${query}"</p>
                        <p class="hint">Try a different term like "gurkha" or "trouser"</p>
                    </div>
                `;
            } else {
                productsGrid.innerHTML = renderProductCards(filtered);
            }
        };

        // Debounce helper
        let debounceTimer;
        const debounce = (fn, delay) => {
            return (...args) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => fn(...args), delay);
            };
        };

        // Debounced live search on typing
        searchInput.addEventListener('input', debounce((e) => {
            performSearch(e.target.value);
        }, 200));

        // Enter key support
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
        });

        // Button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                performSearch(searchInput.value);
            });
        }

        // Clear button
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.focus();
                performSearch('');
            });
        }

        // Tag cloud clicks
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            tag.addEventListener('click', () => {
                const term = tag.textContent.trim();
                searchInput.value = term;
                searchInput.focus();
                performSearch(term);
            });
        });
    }



    loadProductPage();
});








document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.material-symbols-outlined');
            if (content && content.classList.contains('accordion-content')) {
                const isHidden = content.style.display === 'none' || getComputedStyle(content).display === 'none';
                if (isHidden) {
                    content.style.display = 'block';
                    if (icon) icon.textContent = 'remove';
                } else {
                    content.style.display = 'none';
                    if (icon) icon.textContent = 'add';
                }
            }
        });
    });
});















