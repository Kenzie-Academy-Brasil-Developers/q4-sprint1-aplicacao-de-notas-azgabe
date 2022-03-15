import express from "express";

const app = express();
app.use(express.json());

let database = [];

const verifyCpfAvailability = (req, res, next) => {
  const { cpf } = req.body;
  const cpfList = database.map((user) => user.cpf);

  if (cpfList.includes(cpf)) return { error: "user already exists" };

  return next();
};

const verifyUserExistence = (req, res, next) => {
  const { cpf } = req.params;
  const cpfList = database.map((user) => user.cpf);

  if (!cpfList.includes(cpf)) return { error: "user is not registered" };

  return next();
};

const verifyNoteExistence = (req, res, next) => {
  const { cpf, id } = req.params;
  const { notes } = database.find((user) => user.cpf === cpf);
  const idList = notes.map((note) => note.id);

  if (!idList.includes(id)) return { error: "note is not registered" };

  return next();
};

app.listen(3000, () => "Aplicação rodando em http://localhost:3000");
