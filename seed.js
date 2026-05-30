const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables
dotenv.config();

// Catalog Data Array (matching exactly the 22 premium gadgets in index.html)
const products = [
    {
        title: "Premium Wired headphones",
        price: 99.99,
        originalPrice: 124.99,
        category: "Audio",
        stockCount: 12,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800",
        badge: "20% Off"
    },
    {
        title: "Ultra Speed Pendrives (128GB)",
        price: 199.99,
        category: "Storage",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=800",
        badge: "New"
    },
    {
        title: "Bluetooth Wireless Earphone",
        price: 500.99,
        originalPrice: 625.99,
        category: "Audio",
        stockCount: 3,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800",
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
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
        badge: "Offer"
    },
    {
        title: "AMOLED Display Smart Watch",
        price: 1200.99,
        category: "Wearables",
        stockCount: 4,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
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
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800"
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
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800",
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
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800",
        badge: "25% Off"
    },
    {
        title: "Realme 12 Pro+ 5G",
        price: 32000.99,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800"
    },
    {
        title: "Apple iPhone 16",
        price: 78000.99,
        category: "Cameras & Phones",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800",
        badge: "New"
    },
    {
        title: "Apple iPhone 16 Pro Max",
        price: 150000.00,
        category: "Cameras & Phones",
        stockCount: 1,
        stockStatus: "low",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
        badge: "Hot"
    },
    {
        title: "iPhone 16 Glass Protective Cover",
        price: 350.00,
        category: "Accessories",
        stockStatus: "instock",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing product data
        await Product.deleteMany({});
        console.log("Deleted existing products...");

        // Seed new product catalog items
        await Product.insertMany(products);
        console.log("Database seeded successfully with 22 premium products!");

        mongoose.connection.close();
        console.log("Seeding complete. Connection closed.");
        process.exit(0);
    } catch (error) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
