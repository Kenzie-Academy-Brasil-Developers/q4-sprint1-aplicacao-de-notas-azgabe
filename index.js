import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

let database = [];

const validateCpf = (req, res, next) => {
  const { cpf } = req.body;

  const cpfList = database.map((user) => user.cpf);

  if (cpfList.includes(cpf)) {
    return res.status(422).json({ error: "user already exists" });
  }

  return next();
};

const verifyUser = (req, res, next) => {
  const { cpf } = req.params;

  const cpfList = database.map((user) => user.cpf);

  if (!cpfList.includes(cpf)) {
    return res.status(404).json({ error: "user is not registered" });
  }

  return next();
};

const verifyNote = (req, res, next) => {
  const { cpf, id } = req.params;
  const { notes } = database.find((user) => user.cpf === cpf);

  const idList = notes.map((note) => note.id);

  if (!idList.includes(id)) {
    return res.status(404).json({ error: "note is not registered" });
  }

  return next();
};

app.post("/users", validateCpf, (req, res) => {
  const { name, cpf } = req.body;

  const user = { id: uuidv4(), name, cpf, notes: [] };

  database.push(user);

  res.status(201).json(user);
});

app.get("/users", (_, res) => {
  res.status(200).json(database);
});

app.patch("/users/:cpf", verifyUser, (req, res) => {
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

app.delete("/users/:cpf", verifyUser, (req, res) => {
  const { cpf: routeCpf } = req.params;

  database = database.filter((user) => user.cpf !== routeCpf);

  res.status(204).end();
});

app.post("/users/:cpf/notes", verifyUser, (req, res) => {
  const { cpf: routeCpf } = req.params;
  const { title, content } = req.body;

  const now = new Date();

  const newNote = { id: uuidv4(), created_at: now, title, content };

  database.forEach((user) => {
    if (user.cpf === routeCpf) {
      user.notes.push(newNote);

      res.status(201).json({
        message: `${newNote.title} was added into ${user.name}'s notes`,
      });
    }
  });
});

app.get("/users/:cpf/notes", verifyUser, (req, res) => {
  const { cpf: routeCpf } = req.params;

  const { notes } = database.find((user) => user.cpf === routeCpf);

  res.status(200).json(notes);
});

app.patch(
  "/users/:cpf/notes/:id",
  verifyUser,
  verifyNote,
  validateCpf,
  (req, res) => {
    const { cpf: routeCpf, id: routeId } = req.params;
    const { title: newTitle, content: newContent } = req.body;
    const { notes } = database.find((user) => user.cpf === routeCpf);

    const now = new Date();

    notes.forEach((note) => {
      if (note.id === routeId) {
        note.title = newTitle !== undefined ? newTitle : note.title;
        note.content = newContent !== undefined ? newContent : note.content;
        note.updated_at = now;

        res.status(200).json(note);
      }
    });
  }
);

app.listen(3000, () => null);
