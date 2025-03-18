
# React Blog

Welcome to **React Blog**, a blog application built with React that allows users to create, edit, and manage blog posts. Users can authenticate via email or Google, create new blog posts, manage drafts, and more.

## Features

- User Authentication: Sign up/sign in with email or Google.
- Blog Editor: Create and edit blog posts with rich text formatting.
- Dashboard: View and manage blog posts, including drafts and published content.
- Blog Display: View published blogs on the home page with authors' information and tags.
- Notifications: Get notified for actions like new likes or comments on posts.

## Tech Stack

- **Frontend**: React, React Router, Framer Motion, Axios
- **Authentication**: Firebase (Google OAuth)
- **Editor**: Editor.js (Rich Text Editor)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Backend**: Node.js with Express (Assumed based on project setup)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/react-blog.git
   cd react-blog
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Set up your environment variables**:

   Create a `.env` file in the root of the project and add the following:

   ```ini
   VITE_SERVER_DOMAIN=<your_backend_domain>
   VITE_GOOGLE_AUTH_CLIENT_ID=<your_google_auth_client_id>
   ```

4. **Start the development server**:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the app.

## Folder Structure

```bash
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
```

## Usage

### Authentication:

- Sign up with your email or log in using Google for faster access.
- After signing in, you can access the dashboard where you can create new blog posts.

### Creating Blog Posts:

- Use the Blog Editor page to create or edit your blog posts.
- Add a title, banner image, content (via the rich text editor), and tags.
- Publish or save drafts of your posts.

### Blog Display:

- All published blogs can be accessed on the home page.
- Blog posts display the author's information, tags, date of publication, and an excerpt.

### Managing Blog Posts:

- The Dashboard allows users to manage their blog posts and view analytics like total reads and likes.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests. Make sure to follow the code of conduct and review the contribution guidelines.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
