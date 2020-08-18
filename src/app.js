const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// MIDDLEWARES
function validateFields(request, response, next) {
  const keys = Object.keys(request.body);

  for(key of keys) {
    if(request.body[key] == '') {
      return response.status(400).json({ error: 'Fill in all fields'});
    };
  };

  return next();
};

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id))
    return response.status(400).json({ error: 'Invalid repository ID.'})

  return next();
};

function findIndexRepository(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!'});
  }

  request.repositoryIndex = repositoryIndex;

  next();
}

// APPLYING MIDDLEWARES
app.use("/repositories/:id", validateRepositoryId, findIndexRepository);
app.use("/repositories/:id/like", validateRepositoryId, findIndexRepository);

// ROUTES
app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", validateFields, (request, response) => {
  // TODO

  const { title, url, techs } = request.body;
  const id = uuid();

  if(!isUuid(id)) 
    return response.status(400).json({ erro: 'ID is not UUID.'}) ;

  const repository = { id, title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateFields, (request, response) => {
  // TODO
  const { title, url, techs } =  request.body;
  const { repositoryIndex } = request;


  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { repositoryIndex} = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { repositoryIndex } = request;

  const repository = repositories[repositoryIndex];

  repository.likes ++;

  return response.json(repository);
});

module.exports = app;
