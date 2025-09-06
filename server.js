import express from 'express';


const app = express();

app.use(express.json());

app.get('/GetCode', (req, res) => {
  const code = req.query.code;
  res.redirect(`scribaldo://scribaldogame?code=${code}`);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en ${PORT}`);
  });

// app.listen(8089, () => {
//   console.log(`Servidor escuchando en http://localhost:${PORT}`);
//   });