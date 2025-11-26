import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

// run following in command line: 
// npm init -y; npm i express nodemon pg ejs express-session passport passport-local bcrypt; nodemon index.js; 

const port = process.env.PORT || 3000;
const app = express();

// db connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "authentication_module",
  password: "admin",
  port: 5432,
});
db.connect();

app.use(express.static('public'));

app.use(session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function hashPassword(rawPassword){
  const hashed = await bcrypt.hash(rawPassword, saltRounds);
  return hashed;
}

app.set('view engine', 'ejs');
app.set('views', './views');


app.get("/", (req, res) => {
    res.render('index.ejs', {
        // insert data here
    });
})

app.use((req, res) => {
  res.status(404).render('404.ejs', { url: req.originalUrl });
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = await hashPassword(req.body.password);
    try {
      const checkResult = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if (checkResult.rows.length > 0){
        message = "User already exists.";
        res.render('home.ejs', {
          message: message
        })
      } else {
        const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}') RETURNING *`;
        const result = await db.query(query);
        const user = result.rows[0];
        req.login(user, (err) => {
            console.log(err);
            res.redirect('/secrets');
        })
        res.render('secrets.ejs', {
          message: message
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
);

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use(new Strategy(async function verify(username, password, cb) {
    if (username && password) {
    try {
      const query = `SELECT * FROM users WHERE email = '${username}'`;
      const result = await db.query(query);
      
      if (result.rows.length > 0){
        const user = result.rows[0];
        const storedPassword = user.password;
        bcrypt.compare(password, storedPassword, (err, result) => {
            if (err) {
                return cb(err)
            } else {
                if (result) {
                    return cb(null, user)
                } else {
                    return cb(null, false)
                }
            }
        })
      } else {
        return cb("user not found!")
      }
    } catch (error) {
      cb(error)
    }
  }
}));



passport.serializeUser((user, cb) => {
    cb(null, user);
})

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})