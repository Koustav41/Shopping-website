const express = require('express');
const router = express.Router();

const mockProducts = [
    {
        title: "Premium Wired headphones",
        price: 99.99,
        originalPrice: 124.99,
        category: "Audio",
        stockCount: 12,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800",
        badge: "20% Off"
    },
    {
        title: "Ultra Speed Pendrives (128GB)",
        price: 199.99,
        category: "Storage",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1622536840156-538c064ceb34?q=80&w=800",
        badge: "New"
    },
    {
        title: "Bluetooth Wireless Earphone",
        price: 500.99,
        originalPrice: 625.99,
        category: "Audio",
        stockCount: 3,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "Ultra Low-Latency Gaming Tws",
        price: 900.99,
        category: "Audio",
        stockStatus: "instock",
        image: "image/Gemini_Generated_Image_p3ejslp3ejslp3ej.png",
        badge: "New"
    },
    {
        title: "Wireless ANC Over-Ear Headphone",
        price: 1000.99,
        originalPrice: 1250.00,
        category: "Audio",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "AMOLED Display Smart Watch",
        price: 1200.99,
        category: "Wearables",
        stockCount: 4,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "GPS Quadcopter Camera Drone",
        price: 7000.99,
        originalPrice: 8750.00,
        category: "Smart Devices",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800",
        badge: "New"
    },
    {
        title: "Mechanical RGB Gaming Keyboard",
        price: 5000.99,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "Surround Sound Home Theatre",
        price: 20000.99,
        category: "Audio",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800",
        badge: "New"
    },
    {
        title: "RGB Wireless Gaming Mouse",
        price: 2000.99,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "Ergonomic Wired Mouse",
        price: 200.99,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1625842268584-8f3290447001?q=80&w=800"
    },
    {
        title: "FHD Frameless IPS Monitor",
        price: 13000.00,
        originalPrice: 16250.00,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "Graphic Card (8GB VRAM)",
        price: 45000.98,
        category: "Computers & Gaming",
        stockCount: 2,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "ARGB Tempered Glass Cabinet",
        price: 8000.99,
        category: "Computers & Gaming",
        stockStatus: "instock",
        image: "https://zebronics.com/cdn/shop/files/ZEB-Phantom-pic2.jpg?v=1696845618&width=1200"
    },
    {
        title: "Wireless Bluetooth Mic System",
        price: 13500.99,
        category: "Audio",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=800",
        badge: "New"
    },
    {
        title: "Professional DSLR Digital Camera",
        price: 70000.99,
        originalPrice: 87500.00,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "OnePlus Nord CE 4 5G",
        price: 30000.78,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://image01-in.oneplus.net/ebp/202404/07/1-M00-52-A5-CpgM7mYR-yOAN0suAAH06ke98vE178.png"
    },
    {
        title: "Samsung S22 5G (128GB)",
        price: 29000.99,
        originalPrice: 38600.00,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s22-5g.jpg",
        badge: "25% Off"
    },
    {
        title: "Realme 12 Pro+ 5G",
        price: 32000.99,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://fdn2.gsmarena.com/vv/bigpic/realme-12-pro-plus.jpg"
    },
    {
        title: "Apple iPhone 16",
        price: 78000.99,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
        badge: "New"
    },
    {
        title: "Apple iPhone 16 Pro Max",
        price: 150000.00,
        category: "Cameras & Phones",
        stockCount: 1,
        stockStatus: "low",
        image: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
        badge: "Hot"
    },
    {
        title: "iPhone 16 Glass Protective Cover",
        price: 350.00,
        category: "Accessories",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?q=80&w=800"
    }
];

// @route   GET /api/products
// @desc    Retrieve all products (Mocked)
router.get('/', async (req, res) => {
    try {
        return res.status(200).json({ success: true, count: mockProducts.length, data: mockProducts });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product catalog item (Mocked)
router.post('/', async (req, res) => {
    try {
        mockProducts.push(req.body);
        return res.status(201).json({ success: true, data: req.body });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
