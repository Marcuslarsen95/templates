import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

env.config();

const port = process.env.PORT || 3000;
const app = express();
const saltRounds = 10;

async function hashPassword(rawPassword) {
  const hashed = await bcrypt.hash(rawPassword, saltRounds);
  return hashed;
}


// db connection
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// API routes
app.post("/api/users/register", async (req, res) => {
  const email = req.body.username;
  const password = await hashPassword(req.body.password);
  try {
    const checkResult = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;
      const result = await db.query(query, [email, password]);
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) return res.status(500).json({ error: "Login failed!" });
        res.json({ user });
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login route
app.post("/api/users/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      return res.json({ user });
    });
  })(req, res, next);
});


app.get("/api/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});


// Passport strategy
passport.use(
  new Strategy(async function verify(username, password, cb) {
    if (username && password) {
      try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [username]);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedPassword = user.password;
          bcrypt.compare(password, storedPassword, (err, isMatch) => {
            if (err) {
              return cb(err);
            } else {
              if (isMatch) {
                return cb(null, user);
              } else {
                return cb(null, false);
              }
            }
          });
        } else {
          return cb("user not found!");
        }
      } catch (error) {
        cb(error);
      }
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Serve React build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

// 404 fallback for APIs
app.use((req, res) => {
  res.status(404).json({ error: "Not found", url: req.originalUrl });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
