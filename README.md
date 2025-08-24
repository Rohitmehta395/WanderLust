# 🌍 WanderLust

A full-stack travel listing web application where users can explore, create, and review accommodation listings — similar to Airbnb. Built with Node.js, Express, MongoDB, and EJS templating.

---

## 🚀 Features

- 🧭 Browse all travel listings
- 📝 Create, edit, and delete your own listings
- 🌟 Leave reviews and ratings
- 🖼️ Upload images using Cloudinary
- 🔐 User authentication (signup/login/logout)
- ✅ Server-side form validation with Joi
- ⚠️ Custom error handling for clean UX
- 📦 Seed the database with sample data

---

## 🛠️ Tech Stack

| Tech          | Use                                      |
|---------------|-------------------------------------------|
| **Node.js**   | Backend runtime                           |
| **Express.js**| Server framework                          |
| **MongoDB**   | NoSQL database                            |
| **Mongoose**  | MongoDB ORM                               |
| **EJS**       | Templating engine                         |
| **Cloudinary**| Image upload and storage                  |
| **Joi**       | Form validation                           |
| **Passport.js**| Authentication middleware                |
| **Bootstrap** | Responsive UI (if used in views)          |

---

## 📁 Project Structure

```
WanderLust/
├── app.js              # Main server file
├── models/             # Mongoose models
├── routes/             # Route handlers
├── controllers/        # Controller logic
├── views/              # EJS templates
├── public/             # Static assets
├── utils/              # Helper functions and error classes
├── init/               # DB seeding scripts
├── cloudConfig.js      # Cloudinary setup
├── middleware.js       # Custom middleware
├── schema.js           # Joi validation schemas
```

---

## 🧑‍💻 Getting Started

### ⚙️ Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary Account](https://cloudinary.com/)

### 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Rohitmehta395/WanderLust.git
   cd WanderLust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   DB_URL=mongodb://localhost:27017/wanderlust
   SESSION_SECRET=your_secret_key
   ```

4. **Seed the database (optional)**
   ```bash
   node init/index.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. Open your browser at: `http://localhost:8080`

---

## 🔒 Security Notes

- Store all credentials and secrets using `.env`
- Use `helmet` and `express-mongo-sanitize` for production
- Validate and sanitize all user input

---

## 🧪 Future Improvements

- 🗺️ Integrate Mapbox or Leaflet.js for geolocation
- 📱 Improve responsive design
- 🛡️ Add rate limiting and CSRF protection
- 📧 Email verification or password reset
- 🧪 Add unit/integration tests

---

## 🙋‍♂️ Author

Developed by [**Rohit Mehta**](https://github.com/Rohitmehta395)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE)

---

## 🌟 Show Your Support

If you like this project, consider giving it a ⭐️ on GitHub!
