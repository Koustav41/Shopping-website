# 🛒 Shopping Website Project — Online Gadgets Store

Welcome to the **Shopping Website Project**!  
This is a modern, responsive online gadgets shop where you can explore and buy the latest tech gadgets. Built with **HTML**, **CSS**, and **JavaScript** for a smooth and interactive user experience, with a robust backend powered by **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- **Sleek & Responsive Design:** Looks great on any device – desktop, tablet, or mobile.
- **Product Gallery:** Browse a wide variety of gadgets with images, descriptions, specifications, and prices.
- **Shopping Cart:** Select your favorite gadgets and manage your shopping cart with ease.
- **User-Friendly Interface:** Clean layout, intuitive navigation, and modern visuals.
- **Backend Integration:** Node.js & Express server with MongoDB database for data persistence.
- **API-Driven:** RESTful API endpoints for seamless frontend-backend communication.
- **Environment Configuration:** Secure configuration using environment variables.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** — Semantic markup & structure
- **CSS3** — Responsive styling & modern layouts
- **JavaScript (ES6+)** — Interactivity, cart management, dynamic UI updates

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework & routing
- **MongoDB** — NoSQL database for product & order data
- **JWT** — Secure authentication & authorization

---

## 📁 Project Structure

```
Shopping-website/
├── index.html              # Homepage and main shop interface
├── products.html           # Detailed product listing page
├── cart.html               # Shopping cart and checkout page
├── style.css               # All styles and responsive design rules
├── script.js               # Frontend interactivity and cart logic
├── server.js               # Backend server entry point (Node.js/Express)
├── .env.example            # Environment variables template
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation (you are here!)
```

---

## 👀 Preview

> _Add a screenshot of your website here!_  
> Simply upload as `screenshot.png` in the root directory.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher) — [Download here](https://nodejs.org/)
- **MongoDB** — [Community Edition](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download here](https://git-scm.com/)

### Installation Steps

1. **Clone this repository:**
   ```bash
   git clone https://github.com/Koustav41/Shopping-website.git
   cd Shopping-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root with the following configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/shopping-website
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```
   > **Note:** Replace `JWT_SECRET` with a strong, unique key for production use.

4. **Start MongoDB:**
   - **Local Setup:** Ensure MongoDB service is running on your system.
   - **Cloud Setup:** Use MongoDB Atlas and replace `MONGO_URI` with your connection string.

5. **Run the backend server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

6. **Open the app in your browser:**
   - Visit `http://localhost:5000` in your browser.

> ⚠️ **Important:** Do not open `index.html` directly from your file system. The application requires the backend server to handle API routes (`/api/*`).

---

## 📝 Available Scripts

- `npm run dev` — Start the development server with hot reload
- `npm start` — Start the production server
- `npm test` — Run tests (if configured)

---

## ✏️ Customization Ideas

- 🔐 Add user authentication & account management
- 📦 Implement order history and tracking
- 💳 Integrate payment gateways (Stripe, PayPal, etc.)
- 🔍 Add product search, filtering, and sorting features
- ⭐ Include product reviews and ratings
- 📧 Add email notifications for orders
- 📱 Expand with mobile app version
- 🌍 Add multi-language support

---

## 🤝 Contributions

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📜 License

This project is for educational and demonstration purposes.  
Feel free to use, modify, and share! See [LICENSE](LICENSE) for more details.

---

## 🐛 Troubleshooting

**Issue:** Server won't start  
**Solution:** Ensure MongoDB is running and `MONGO_URI` in `.env` is correct.

**Issue:** Port 5000 already in use  
**Solution:** Change `PORT` in `.env` to an available port (e.g., 3000, 8000).

**Issue:** Cannot connect to MongoDB  
**Solution:** Verify MongoDB connection string and ensure your IP is whitelisted (for MongoDB Atlas).

---

**Made with ❤️ by [Koustav41](https://github.com/Koustav41)**
