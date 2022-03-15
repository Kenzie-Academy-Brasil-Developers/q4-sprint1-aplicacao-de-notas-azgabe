import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const database = [];

const verifyCpfAvailability = (req, res, next) => {
  const { cpf } = req.body;
  const cpfList = database.map((user) => user.cpf);

  if (cpfList.includes(cpf)) {
    res.statusCode = 422;
    return res.json({ error: "user already exists" });
  }

  return next();
};

const verifyUserExistence = (req, res, next) => {
  const { cpf } = req.params;
  const cpfList = database.map((user) => user.cpf);

  if (!cpfList.includes(cpf)) {
    res.statusCode = 404;
    return res.json({ error: "user is not registered" });
  }

  return next();
};

const verifyNoteExistence = (req, res, next) => {
  const { cpf, id } = req.params;
  const { notes } = database.find((user) => user.cpf === cpf);
  const idList = notes.map((note) => note.id);

  if (!idList.includes(id)) {
    res.statusCode = 404;
    return res.json({ error: "note is not registered" });
  }

  return next();
};

app.post("/users", verifyCpfAvailability, (req, res) => {
  const { name, cpf } = req.body;
  const user = { id: uuidv4(), name, cpf, notes: [] };

  database.push(user);

  res.statusCode = 201;
  res.json(user);
});

app.listen(3000, () => "Aplicação rodando em http://localhost:3000");
