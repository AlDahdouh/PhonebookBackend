const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./modles/person");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) res.json(result);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      number: req.body.number,
    },
    { new: true, runValidators: true, context: "query" }
  )
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  person
    .save()
    .then((p) => res.json(p))
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((result) => {
      res.send(`<p> Phonebook has info for ${result.length} people </p> 
  <p>${new Date()} </p>`);
    })
    .catch((error) => next(error));
});

app.use((req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.codeName === "DuplicateKey")
    return response.status(400).json({ error: error.message });

  next(error);
};

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Application is now listening on port ${port}`);
});
