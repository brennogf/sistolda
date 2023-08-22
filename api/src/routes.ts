import { Router } from "express"
const Visitante = require("./controllers/Visitante")
const Registro = require("./controllers/Registro")

const routes = Router()

routes.post("/visitante", Visitante.store)

routes.get("/registro", Registro.index)
routes.post("/registro", Registro.store)
routes.put("/registro", Registro.update)
routes.put("/registroDestino", Registro.updateDestino)

module.exports = routes
