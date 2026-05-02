# UserAdmin System

A full-stack web application for user management and administration, featuring authentication, profile management, and admin dashboard capabilities.

## 🚀 Features

- **User Authentication**
  - Email/password registration and login
  - OTP verification for account activation
  - LinkedIn OAuth integration
  - JWT-based session management

- **User Management**
  - Profile creation and editing
  - Profile image upload
  - Multiple image gallery support
  - User roles (Admin/User)

- **Admin Dashboard**
  - View all users with statistics
  - Edit user information
  - Delete users (individual or bulk)
  - Filter and search users
  - Role management

- **Security Features**
  - Password hashing
  - Session management
  - CORS protection
  - Input validation

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Notification system
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Nodemailer** - Email service
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd useradmin-system
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Environment Setup

### Server Environment Variables

1. Copy the example environment file:
   ```bash
   cd server
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=your-mongodb-connection-string

   # Server Configuration
   PORT=3000
   SESSION_SECRET=your-super-secret-session-key

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=your-linkedin-client-id
   LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
   LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback
   ```

### Client Environment Variables

1. Copy the example environment file:
   ```bash
   cd ../client
   cp .env.example .env
   ```

2. Update the `.env` file:
   ```env
   # API Base URL for backend server
   VITE_API_BASE_URL=http://localhost:3000/api/users

   # Server Base URL for static assets like images
   VITE_SERVER_BASE_URL=http://localhost:3000

   # LinkedIn OAuth URL
   VITE_LINKEDIN_AUTH_URL=http://localhost:3000/api/auth/linkedin
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the server** (from root directory):
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3000`

2. **Start the client** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

### Production Build

1. **Build the client**:
   ```bash
   cd client
   npm run build
   ```

2. **Start the server** (serves both API and built client):
   ```bash
   cd server
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `GET /api/auth/linkedin` - LinkedIn OAuth
- `GET /api/auth/linkedin/callback` - LinkedIn OAuth callback

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-profile-image` - Upload profile image
- `POST /api/users/upload-images` - Upload multiple images

### Admin (Protected)
- `GET /api/users/admin/users` - Get all users
- `GET /api/users/admin/users/:id` - Get user by ID
- `PUT /api/users/admin/users/:id` - Update user
- `DELETE /api/users/admin/users/:id` - Delete user

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for JWT and session keys
- Regularly rotate API keys and secrets
- Enable HTTPS in production
- Validate and sanitize all user inputs

## 🚀 Deployment

### Environment Variables for Production

For platforms like Vercel, Netlify, or Heroku, set these environment variables:

**Server:**
- `MONGODB_URI`
- `SESSION_SECRET`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_REDIRECT_URI`

**Client:**
- `VITE_API_BASE_URL`
- `VITE_SERVER_BASE_URL`
- `VITE_LINKEDIN_AUTH_URL`

### Recommended Deployment Platforms

- **Frontend:** Vercel, Netlify
- **Backend:** Heroku, Railway, Render
- **Database:** MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Note:** This is a production-ready application. Make sure to update all secrets and configuration before deploying to production.