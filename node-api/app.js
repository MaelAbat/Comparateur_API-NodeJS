const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {router} = require("./routes/auth");
const players = require("./routes/players");
const errorHandler = require("./error-handler");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", router);
app.use("/players", players);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
