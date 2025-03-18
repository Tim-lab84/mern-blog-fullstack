React Blog
Description
React Blog is a dynamic, full-featured blogging platform built using React.js. It allows users to create, edit, and publish blog posts, with features like authentication via email and Google, a rich text editor, notifications, and a dashboard for managing posts. The platform provides a smooth user experience with animations and a clean UI for both users and content creators.

Features
User Authentication: Users can sign up, sign in, and log in via Google.
Dashboard: Content creators can manage their blog posts, view drafts, and publish new content.
Rich Text Editor: Integrated with Editor.js for creating rich, interactive blog content.
Tags & Categories: Blogs can be categorized using tags, which are displayed in posts.
Notifications: Users can receive notifications about their interactions on the platform.
Responsive Design: The platform is fully responsive, ensuring a great experience on all devices.
Technologies Used
Frontend:

React.js
React Router
Axios (for HTTP requests)
Editor.js (for the blog editor)
Firebase (for Google Authentication)
framer-motion (for animations)
React Hot Toast (for notifications)
Backend:

Node.js
Express
MongoDB (for data storage)
Mongoose (for MongoDB object modeling)
JWT Authentication (for secure access)
AWS S3: For image and file storage.

Installation
Clone the repository:

bash
Kopieren
Bearbeiten
git clone https://github.com/your-username/react-blog.git
cd react-blog
Install the dependencies:

bash
Kopieren
Bearbeiten
npm install
Set up your environment variables:

Create a .env file in the root of the project and add the following:

ini
Kopieren
Bearbeiten
VITE_SERVER_DOMAIN=<your_backend_domain>
VITE_GOOGLE_AUTH_CLIENT_ID=<your_google_auth_client_id>
Start the development server:

bash
Kopieren
Bearbeiten
npm start
Open your browser and navigate to http://localhost:3000 to view the app.

Folder Structure
bash
Kopieren
Bearbeiten
├── src/
│   ├── components/           # Reusable components like buttons, form elements, cards, etc.
│   ├── pages/                # React pages for each route
│   ├── common/               # Common utilities and helpers (e.g., session management, AWS, animations)
│   ├── imgs/                 # Images used in the project
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point for React app
│   ├── styles/               # CSS/SCSS files for styling
│   └── firebase.js           # Firebase configuration for Google Auth
└── .env                      # Environment variables
Usage
Authentication:

Sign up with your email or log in using Google for faster access.
After signing in, you can access the dashboard where you can create new blog posts.
Creating Blog Posts:

Use the Blog Editor page to create or edit your blog posts.
Add a title, banner image, content (via the rich text editor), and tags.
Publish or save drafts of your posts.
Blog Display:

All published blogs can be accessed on the home page.
Blog posts display the author's information, tags, date of publication, and an excerpt.
Managing Blog Posts:

The Dashboard allows users to manage their blog posts and view analytics like total reads and likes.
Contributing
Contributions are welcome! Feel free to submit issues and pull requests. Make sure to follow the code of conduct and review the contribution guidelines.

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes.
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature/your-feature).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Let me know if you need any adjustments or further additions!
