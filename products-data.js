// Product data - 5 Products with optimized local static image assets
(function() {
    const productsData = [
        {
            id: 1,
            name: "White Relaxed Fit Trouser",
            price: "₹999",
            image: "images/products/white-relaxed-fit-trouser-front.webp",
            images: [
                "images/products/white-relaxed-fit-trouser-front.webp",
                "images/products/white-relaxed-fit-trouser-right.webp",
                "images/products/white-relaxed-fit-trouser-left.webp",
                "images/products/white-relaxed-fit-trouser-back.webp"
            ],
            tags: ["white", "trouser", "trousers", "relaxed", "fit", "pant", "pants"],
            link: "product.html?id=1"
        },
        {
            id: 2,
            name: "Beige Gurkha Pant",
            price: "₹1299",
            image: "images/products/beige-gurkha-pant-front.webp",
            images: [
                "images/products/beige-gurkha-pant-front.webp",
                "images/products/beige-gurkha-pant-right.webp",
                "images/products/beige-gurkha-pant-left.webp",
                "images/products/beige-gurkha-pant-back.webp"
            ],
            tags: ["beige", "gurkha", "pant", "pants", "trouser", "trousers", "formal"],
            link: "product.html?id=2"
        },
        {
            id: 3,
            name: "Deep Black Pleated Gurkha Pant",
            price: "₹1199",
            image: "images/products/deep-black-pleated-gurkha-pant-front.webp",
            images: [
                "images/products/deep-black-pleated-gurkha-pant-front.webp",
                "images/products/deep-black-pleated-gurkha-pant-right.webp",
                "images/products/deep-black-pleated-gurkha-pant-left.webp",
                "images/products/deep-black-pleated-gurkha-pant-back.webp"
            ],
            tags: ["black", "gurkha", "pleated", "pant", "pants", "dark", "trouser", "trousers"],
            link: "product.html?id=3"
        },
        {
            id: 4,
            name: "Brown Textured Korean Pant",
            price: "₹999",
            image: "images/products/brown-textured-korean-pant-front.webp",
            images: [
                "images/products/brown-textured-korean-pant-front.webp",
                "images/products/brown-textured-korean-pant-right.webp",
                "images/products/brown-textured-korean-pant-slant.webp",
                "images/products/brown-textured-korean-pant-back.webp"
            ],
            tags: ["brown", "korean", "textured", "pant", "pants", "trouser", "trousers"],
            link: "product.html?id=4"
        },
        {
            id: 5,
            name: "Pecan Khaki Relaxed Fit Korean Pintuck Pants",
            price: "₹1299",
            image: "images/products/pecan-khaki-relaxed-fit-korean-pintuck-pants-front.webp",
            images: ["images/products/pecan-khaki-relaxed-fit-korean-pintuck-pants-front.webp"],
            tags: ["pecan", "brown", "khaki", "relaxed", "fit", "korean", "pintuck", "pants"],
            link: "product.html?id=5"
        }
    ];

    if (typeof window !== 'undefined') {
        window.productsData = productsData;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = productsData;
    }
})();
