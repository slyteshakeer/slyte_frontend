// Product data - 3 Products with optimized local static image assets
(function() {
    const productsData = [
        {
            id: 1,
            name: "Slyte 24H Black Trouser",
            price: "₹1,699",
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

    if (typeof window !== 'undefined') {
        window.productsData = productsData;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = productsData;
    }
})();
