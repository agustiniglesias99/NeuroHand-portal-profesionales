const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
const dist = path.join(__dirname, 'dist'); // 'build' si usás CRA

app.use(express.static(dist));
app.use((req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(port, () => console.log(`Escuchando en ${port}`));