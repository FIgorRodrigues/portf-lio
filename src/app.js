const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const existsRepository = (request, response, next) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id == id);
  if(index < 0) 
    return response.status(400).json({ error: "repository does not exists"});
  request.indexRepository = index;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body;
  const repository = { 
    id: uuid(), likes: 0, title, url, techs };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", existsRepository, (request, response) => {
  const index = request.indexRepository;
  let repository = repositories[index]; 
  const { title, url, techs } = request.body;
  const { id, likes } = repository;
  repository = { id, title, url, techs, likes };
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", existsRepository, (request, response) => {
  const index = request.indexRepository;
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", existsRepository, (request, response) => {
  const index = request.indexRepository;
  const repository = repositories[index];
  repository.likes ++;
  return response.status(200).json(repository);
});

module.exports = app;
