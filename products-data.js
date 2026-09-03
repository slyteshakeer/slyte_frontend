// Product data - 1 Product with optimized local static image assets
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
        }
    ];

    if (typeof window !== 'undefined') {
        window.productsData = productsData;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = productsData;
    }
})();
