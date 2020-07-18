const express = require("express");
const connectDB = require("./config/db.js");

// crear server
const app = express();

// Conectar DB
connectDB();

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
