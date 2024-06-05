const express = require("express");
const axios = require("axios");
const config = require("../config/config");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const secret = "thisismysecret";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const router = express.Router();

// Define passport strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const response = await axios.get(
        `${config.databaseUrl}/utilisateurs/${jwtPayload.user}`,
        {
          headers: { "x-apikey": config.apiKey },
        }
      );
      const utilisateurs = response.data;

      if (utilisateurs.length === 0) {
        return done(null, false);
      }

      const user = utilisateurs[0];

      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);

// Inscription
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }

  // Vérifiez si l'utilisateur existe déjà
  try {
    const response = await axios.get(
      `${config.databaseUrl}/utilisateurs?q={"username":"${username}"}`,
      {
        headers: { "x-apikey": config.apiKey },
      }
    );
    const utilisateurs = response.data;

    if (utilisateurs.length > 0) {
      return res.status(400).send({ message: "Username already exists" });
    }

    // Créer l'utilisateur
    const user = { username, password };
    const createUser = await axios.post(
      `${config.databaseUrl}/utilisateurs`,
      user,
      {
        headers: { "x-apikey": config.apiKey },
      }
    );
    const newUser = createUser.data;

    res.status(201).send({ message: "User created", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }

  // Vérifiez si l'utilisateur existe
  try {
    const response = await axios.get(
      `${config.databaseUrl}/utilisateurs?q={"username":"${username}","password":"${password}"}`,
      {
        headers: { "x-apikey": config.apiKey },
      }
    );
    const utilisateurs = response.data;

    if (utilisateurs.length === 0) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    const user = utilisateurs[0];

    // Créer un jeton d'accès
    const token = jwt.sign({ user: user._id }, secret);
    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error(error);

    res.status(500).send({ message: "Server error" });
  }
});

module.exports = {
  router,
};
