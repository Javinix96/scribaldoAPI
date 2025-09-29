import express from "express";
import Users from "./UserClass.js";

const app = express();
app.use(express.json());

app.get("/GetCode", (req, res) => {
  const code = req.query.code;
  res.redirect(`scribaldo://scribaldogame?code=${code}`);
});

app.get("/Users", async (req, res) => {
  console.log(process.env.DATABASE_URL);
  res.json(await Users.getUsers());
});

// app.get("/GetUser", async (req, res) => {
//   const { name, score } = req.query;

//   res.json(await Users.getUser(name));
// });

// app.post("/AddUser", async (req, res) => {
//   const { username, email, password, state, date, provider, provider_id } =
//     req.body;

//   const response = await Users.AddUser(
//     username,
//     email,
//     password,
//     state,
//     date,
//     provider,
//     provider_id
//   );
//   res.status(200).send(response);
// });

// app.post("/Login", async (req, res) => {
//   const { username, password } = req.body;

//   const response = await Users.GetLogin(username, password);
//   res.status(200).send(response);
// });

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error del servidor" });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en ${process.env.PORT}`);
});

// app.listen(8089, () => {
//   console.log(`Servidor escuchando en http://localhost:${8089}`);
// });
