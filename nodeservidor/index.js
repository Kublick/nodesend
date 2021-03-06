const express = require("express");
const connectDB = require("./config/db.js");
const cors = require("cors");

// crear server
const app = express();

// Conectar DB
connectDB();

// habilitar cors
const corsoptions = {
	origin: process.env.FRONTEND_URL,
};
app.use(cors(corsoptions));

// puerto app
const port = process.env.PORT || 4000;

app.use(express.json());

//rutas

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));

//arrancar

app.listen(port, "0.0.0.0", () => {
	console.log("funcionando en puerto:", port);
});
