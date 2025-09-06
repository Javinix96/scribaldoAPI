import express from 'express';


const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 5999;

app.use(express.json());

app.get('/hola', (req, res) => {
  console.log(req.baseUrl);
  res.redirect("scribaldo://scribaldogame");
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
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });