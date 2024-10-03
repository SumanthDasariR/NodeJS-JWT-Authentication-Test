import express from "express";
import bodyParser from "body-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const secretkey = "My super secret key";
const jwtMW = expressjwt({
  secret: secretkey,
  algorithms: ["HS256"],
});
let users = [
  {
    id: 1,
    username: "Sumanth",
    password: "123",
  },
  {
    id: 1,
    username: "Reddy",
    password: "456",
  },
];
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretkey,
        { expiresIn: '3m' }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: "Username or Password is incorrect !!!",
      });
    }
  }
  console.log("This is me", username, password);
  res.json({ data: "it works" });
});
app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see.",
  });
});
app.get('/api/settings', jwtMW , (req,res) => {
    res.json({
        success: true,
        myContent:'This is the settings page'
    });
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect 2",
    });
  } else {
    next(err);
  }
});
app.listen(PORT, () => {
  console.log(`Servicing on port ${PORT}`);
});
