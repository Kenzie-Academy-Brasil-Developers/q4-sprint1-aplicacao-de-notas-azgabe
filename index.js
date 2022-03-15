import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

let database = [];

const verifyCpfAvailability = (req, res, next) => {
  const { cpf } = req.body;
  const cpfList = database.map((user) => user.cpf);

  if (cpfList.includes(cpf)) {
    return res.status(422).json({ error: "user already exists" });
  }

  return next();
};

const verifyUserExistence = (req, res, next) => {
  const { cpf } = req.params;
  const cpfList = database.map((user) => user.cpf);

  if (!cpfList.includes(cpf)) {
    return res.status(404).json({ error: "user is not registered" });
  }

  return next();
};

const verifyNoteExistence = (req, res, next) => {
  const { cpf, id } = req.params;
  const { notes } = database.find((user) => user.cpf === cpf);
  const idList = notes.map((note) => note.id);

  if (!idList.includes(id)) {
    return res.status(404).json({ error: "note is not registered" });
  }

  return next();
};

app.post("/users", verifyCpfAvailability, (req, res) => {
  const { name, cpf } = req.body;
  const user = { id: uuidv4(), name, cpf, notes: [] };

  database.push(user);

  res.status(201).json(user);
});

app.get("/users", (_, res) => {
  res.status(200).json(database);
});

app.patch("/users/:cpf", verifyUserExistence, (req, res) => {
  const { cpf: routeCpf } = req.params;
  const { cpf: newCpf, name: newName } = req.body;

  database.forEach((user) => {
    if (user.cpf === routeCpf) {
      user.name = newName !== undefined ? newName : user.name;
      user.cpf = newCpf !== undefined ? newCpf : user.cpf;

      res.status(200).json(user);
    }
  });
});

app.delete("/users/:cpf", verifyUserExistence, (req, res) => {
  const { cpf: routeCpf } = req.params;

  database = database.filter((user) => user.cpf !== routeCpf);

  res.status(204).end();
});

app.listen(3000, () => "Aplicação rodando em http://localhost:3000");
