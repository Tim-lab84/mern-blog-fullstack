# Blog Platform

A full-stack blog platform with user authentication, built with React, Express.js, and MongoDB.

## Features

- User authentication with email/password and Google OAuth
- JWT-based authentication system
- Secure password storage with bcrypt
- User-friendly authentication forms with validation
- Username auto-generation for new users
- Session management
- Responsive navigation with user profile management
- Search functionality
- Blog post editor
- Notification system
- User profiles with customizable information
- Random profile image generation
- Social media integration
- Blog post tracking
- Responsive UI with animations

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT for authentication
- bcrypt for password hashing
- DiceBear API for profile image generation

### Frontend

- React.js
- React Router for navigation
- Axios for API requests
- Firebase Authentication
- Framer Motion for animations
- react-hot-toast for notifications
- Tailwind CSS for styling
- Flaticon for icons

## Prerequisites

- Node.js (v12 or higher)
- MongoDB instance
- Firebase project with Admin SDK and Authentication enabled
- Environment variables properly configured

## Setup

### Backend Setup

1. Clone the repository
2. Install backend dependencies
   ```
   cd server
   npm install
   ```
3. Set up environment variables in a `.env` file
   ```
   PORT=3000
   DB_LOCATION=your_mongodb_connection_string
   SECRET_ACCESS_KEY=your_jwt_secret_key
   ```
4. Place your Firebase Admin SDK service account key file in the project root as `react-blog-b0b34-firebase-adminsdk-fbsvc-2fe2b78465.json`
5. Start the server
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory
   ```
   cd client
   ```
2. Install frontend dependencies
   ```
   npm install
   ```
3. Create a `.env` file with the following variables
   ```
   VITE_SERVER_DOMAIN=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Start the development server
   ```
   npm run dev
   ```

## Data Models

### User Model

The application uses a comprehensive user model with the following structure:

```javascript
const userSchema = mongoose.Schema(
  {
    personal_info: {
      fullname: String, // User's full name
      email: String, // Unique email address
      password: String, // Hashed password (not required for Google auth)
      username: String, // Unique username
      bio: String, // User biography (max 200 chars)
      profile_img: String, // Auto-generated profile image URL
    },
    social_links: {
      youtube: String, // Social media links
      instagram: String,
      facebook: String,
      twitter: String,
      github: String,
      website: String,
    },
    account_info: {
      total_posts: Number, // Count of user's blog posts
      total_reads: Number, // Total read count across all posts
    },
    google_auth: Boolean, // Whether user was authenticated via Google
    blogs: [ObjectId], // References to user's blog posts
  },
  {
    timestamps: {
      createdAt: "joinedAt", // Custom timestamp field
    },
  }
);
```

Key features of the User model:

- Profile images are automatically generated using DiceBear API
- Password is only required for email/password authentication
- Social media profile links for extended user profiles
- Blog post tracking and analytics
- Timestamps for user account creation

## User Interface Components

### Navigation Bar

The application features a responsive navigation bar that includes:

- Logo linking to the home page
- Search functionality that adapts to different screen sizes
- "Write" button for creating new blog posts (for authenticated users)
- Notification bell with link to notification dashboard (for authenticated users)
- User profile picture with dropdown navigation panel (for authenticated users)
- Sign In/Sign Up buttons (for unauthenticated users)

The navbar dynamically changes based on the user's authentication status and screen size, providing an optimal experience on both mobile and desktop devices.

### Authentication Forms

User-friendly authentication forms include:

- Email/password sign-in
- New user registration
- Google OAuth authentication
- Client-side validation with clear error messages
- Smooth animations during transitions

## Authentication Flow

### Email/Password Authentication

1. Users enter their credentials in the sign-up/sign-in form
2. Client-side validation checks for password strength and email format
3. Credentials are sent to the server via API call
4. Server validates data, hashes passwords, and stores user information
5. JWT token is generated and returned to the client
6. User session is created and stored

### Google Authentication

1. Users click "Continue with Google" button
2. Firebase Authentication opens Google sign-in popup
3. Upon successful Google authentication, an access token is obtained
4. Token is sent to the server for verification using Firebase Admin SDK
5. If the user is new, a new account is created; otherwise, existing account is used
6. JWT token is generated and returned to the client
7. User session is created and stored

## Profile Image Generation

The application uses DiceBear API to generate unique profile images for users. The system:

- Randomly selects from predefined avatar collections
- Combines with random seed names for variety
- Creates consistent, unique avatars for each user
- Provides visual identity without requiring user uploads

## API Endpoints

### Authentication

#### Sign Up

- **URL**: `/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fullname": "User's Full Name",
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response**: Returns access token and user data
- **Error Response**: Returns error message with appropriate status code

#### Sign In

- **URL**: `/signin`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Success Response**: Returns access token and user data
- **Error Response**: Returns error message with appropriate status code

#### Google Authentication

- **URL**: `/google-auth`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "access_token": "google_id_token"
  }
  ```
- **Success Response**: Returns access token and user data
- **Error Response**: Returns error message with appropriate status code

## Authentication Rules

- Fullname must be at least 3 characters long
- Email must be valid and unique
- Password must be 6-20 characters, including at least one digit, one lowercase and one uppercase letter
- Username must be at least 3 characters long and unique

## Known Issues and Fixes

### Cross-Origin-Opener-Policy Issues with Firebase Authentication

If you encounter Cross-Origin-Opener-Policy errors with Firebase authentication popups, add the following middleware to your server code:

```javascript
server.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
```

This allows Firebase's authentication popups to be properly closed after authentication is complete.

## Project Structure

```
project-root/
├── server/                 # Backend code
│   ├── Schema/             # MongoDB schemas
│   │   └── User.js         # User model
│   ├── server.js           # Express server entry point
│   └── .env                # Environment variables
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── input.component.jsx       # Form input component
│   │   │   ├── navbar.component.jsx      # Navigation bar component
│   │   │   └── user-navigation.component.jsx # User dropdown navigation
│   │   ├── common/         # Shared utilities
│   │   │   ├── firebase.js              # Firebase configuration
│   │   │   ├── session.js               # Session management
│   │   │   └── page-animation.js        # Animation wrapper
│   │   ├── imgs/           # Image assets
│   │   │   ├── logo.png                 # Site logo
│   │   │   └── google.png               # Google icon for auth
│   │   ├── App.js          # Main application component
│   │   └── ...
│   └── .env                # Frontend environment variables
└── README.md               # This file
```

## CSS Classes

The project uses Tailwind CSS with custom classes for UI components:

- `.navbar` - Main navigation container
- `.btn-dark` - Dark-themed button
- `.btn-light` - Light-themed button
- `.link` - Text link styling
- `.h-cover` - Full height container

## License

[MIT](LICENSE)
