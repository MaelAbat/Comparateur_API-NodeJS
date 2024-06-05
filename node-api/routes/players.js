const express = require("express");
const axios = require("axios");
const config = require("../config/config");
const auth = require("../routes/auth");
const passport = require("passport");

const router = express.Router();

// Récupération de tous les joueurs
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${config.databaseUrl}/players`, {
      headers: { "x-apikey": config.apiKey },
    });
    console.log(response);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving players" });
  }
});

// Récupération d'un joueur par son ID
router.get(
  "/:id",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const response = await axios.get(
        `${config.databaseUrl}/players/${req.params.id}`,
        {
          headers: { "x-apikey": config.apiKey },
        }
      );
      if (!response.data) {
        return res.status(404).send({ message: "Player not found" });
      }
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send({ message: "Error retrieving player" });
    }
  }
);

// Ajout d'un joueur
router.post("/", async (req, res) => {
  const {
    name,
    team,
    position,
    height,
    weight,
    age,
    salary,
    ranking,
    picture,
  } = req.body;

  if (
    !name ||
    !team ||
    !position ||
    !height ||
    !weight ||
    !age ||
    !salary ||
    !ranking ||
    !picture
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const player = {
    name,
    team,
    position,
    height,
    weight,
    age,
    salary,
    ranking,
    picture,
  };
  try {
    const response = await axios.post(`${config.databaseUrl}/players`, player, {
      headers: {
        "Content-Type": "application/json",
        "x-apikey": config.apiKey,
      },
    });
    res.status(201).send(response.data);
  } catch (error) {
    res.status(500).send({ message: "Error adding player" });
  }
});

// Modification d'un joueur
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const {
      name,
      team,
      position,
      height,
      weight,
      age,
      salary,
      ranking,
      picture,
    } = req.body;

    if (
      !name ||
      !team ||
      !position ||
      !height ||
      !weight ||
      !age ||
      !salary ||
      !ranking ||
      !picture
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const player = {
      name,
      team,
      position,
      height,
      weight,
      age,
      salary,
      ranking,
      picture,
    };
    try {
      const response = await axios.put(
        `${config.databaseUrl}/players/${req.params.id}`,
        player,
        {
          headers: {
            "Content-Type": "application/json",
            "x-apikey": config.apiKey,
          },
        }
      );
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send({ message: "Error updating player" });
    }
  }
);

// Suppression d'un joueur
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await axios.delete(`${config.databaseUrl}/players/${req.params.id}`, {
        headers: { "x-apikey": config.apiKey },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ message: "Error deleting player" });
    }
  }
);

module.exports = router;
