import express from 'express'
import path from 'path'
import cors from "cors"
const bodyParser = require('body-parser')
const app = express()
const routes = require("./routes")
const PORT = process.env.PORT || 4000

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

app.use(express.json());
app.use(routes);

app.use(express.static(path.join(__dirname, "../../frontend/build")))

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta: ${PORT}`)
})
