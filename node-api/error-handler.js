function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.status === 401) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    if (err.status === 404) {
        return res.status(404).send({ message: "Not found" });
    }

    res.status(500).send({ message: "Internal server error" });
}

module.exports = errorHandler;
