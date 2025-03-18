import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
//import serviceAccountKey from "./react-blog-b0b34-firebase-adminsdk-fbsvc-2fe2b78465.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";
import aws from "aws-sdk";

// Schema Imports
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";
const server = express();
const PORT = process.env.PORT || 3000;

const {
  FIREBASE_TYPE: type,
  FIREBASE_PROJECT_ID: project_id,
  FIREBASE_PRIVATE_KEY_ID: private_key_id,
  FIREBASE_PRIVATE_KEY: private_key,
  FIREBASE_CLIENT_EMAIL: client_email,
  FIREBASE_CLIENT_ID: client_id,
  FIREBASE_AUTH_URI: auth_uri,
  FIREBASE_TOKEN_URI: token_uri,
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: auth_provider_x509_cert_url,
  FIREBASE_CLIENT_X509_CERT_URL: client_x509_cert_url,
  FIREBASE_UNIVERSE_DOMAIN: universe_domain,
} = process.env;

const serviceAccountKey = {
  type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url,
  universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

server.use(express.json());
server.use(cors());
server.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

//setting up s3 bucket
const s3 = new aws.S3({
  region: "eu-north-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "react-blog-ironhack",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg",
  });
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ error: "No access token" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid" });
    }
    req.user = user.id;
    next();
  });
};

const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

//check if Username already exists -> add random number if it does

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let usernameExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  usernameExists ? (username += nanoid().substring(0, 5)) : "";
  return username;
};
// ROUTING

//upload image route
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post("/signup", async (req, res) => {
  let { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Enter Email" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long and contain a numeric, 1 uppercase and 1 lowercase letter",
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    let username = await generateUsername(email);

    let user = new User({
      personal_info: { fullname, email, password: hashedPassword, username },
    });

    let savedUser = await user.save();
    return res.status(200).json(formatDataToSend(savedUser));
  } catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: err.message });
  }
});

server.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user by email (case-insensitive)
    const user = await User.findOne({
      "personal_info.email": email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Explicit check for password
    if (!user.personal_info.password) {
      return res.status(500).json({ error: "User account is incomplete" });
    }

    try {
      // Compare passwords
      const isMatch = await bcrypt.compare(
        password,
        user.personal_info.password
      );

      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect Password" });
      }

      // Successful login
      return res.status(200).json(formatDataToSend(user));
    } catch (compareError) {
      console.error("Bcrypt comparison error:", {
        name: compareError.name,
        message: compareError.message,
        stack: compareError.stack,
      });

      return res.status(500).json({
        error: "Password validation failed",
        details: compareError.message,
      });
    }
  } catch (err) {
    console.error("Signin process error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

server.post("/google-auth", async (req, res) => {
  const { access_token } = req.body;

  try {
    // Verify the ID token
    const decodedUser = await getAuth().verifyIdToken(access_token);
    const { email, name, picture } = decodedUser;

    // Replace profile picture with higher resolution
    const profilePicture = picture.replace("s96-c", "s384-c");

    // Try to find existing user
    let user = await User.findOne({ "personal_info.email": email }).select(
      "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
    );

    // Handle existing user
    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          error:
            "This email was signed up without google. Please login with password to access the account",
        });
      }
    } else {
      // Create new user if not exists
      const username = await generateUsername(email);
      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: profilePicture,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    // Send response with formatted user data
    return res.status(200).json(formatDataToSend(user));
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({
      error: "Failed to authenticate with Google. Please try another account.",
    });
  }
});

server.get("/latest-blogs", (req, res) => {
  let maxLimit = 5;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.get("/trending-blogs", (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

server.post("/create-blog", verifyJWT, (req, res) => {
  const authorId = req.user;
  const { title, des, banner, tags, content, draft } = req.body;
  const errors = [];
  if (!title || !title.trim().length) {
    errors.push("Please provide a valid title.");
  }
  if (!draft) {
    if (!des || !des.trim().length) {
      errors.push("Description cannot be empty.");
    } else if (des.length > 200) {
      errors.push("Description should not exceed 200 characters.");
    }

    if (!banner || !banner.trim().length) {
      errors.push("A banner image is required.");
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      errors.push("At least one tag is required.");
    }

    if (
      !content ||
      !Array.isArray(content.blocks) ||
      content.blocks.length === 0
    ) {
      errors.push("Blog content cannot be empty.");
    }

    if (typeof draft !== "boolean") {
      errors.push("Draft field must be true or false.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
  }

  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  let blogId =
    title
      .trim()
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .toLowerCase() +
    "-" +
    nanoid();

  let blog = new Blog({
    title,
    des,
    banner,
    content,
    tags: normalizedTags,
    author: authorId,
    blog_id: blogId,
    draft: Boolean(draft),
  });
  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;

      console.log("Attempting to update user with authorId:", authorId);
      console.log("Increment value:", incrementVal);

      // Log the update query
      const updateQuery = {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: blog._id },
      };
      console.log("Update query:", updateQuery);

      User.findOneAndUpdate(
        { _id: authorId },
        updateQuery,
        { new: true } // To return the updated document
      )
        .then((user) => {
          if (!user) {
            console.log("User not found for authorId:", authorId);
          } else {
            console.log("User updated successfully:", user);
          }

          return res.status(200).json({
            message: "Blog created successfully!",
            id: blog.blog_id, // Correct field name for blogId
          });
        })
        .catch((err) => {
          console.error("Error updating user:", err);
          return res
            .status(500)
            .json({ error: "Failed to update total number of posts" });
        });
    })
    .catch((err) => {
      console.error("Error saving blog:", err);
      return res.status(500).json({ error: err.message });
    });
  console.log(blogId);
});

server.listen(PORT, () => {
  console.log("Listening on Port -> " + PORT);
});
