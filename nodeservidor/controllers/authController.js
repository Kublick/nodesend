const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

exports.authenticarUsuario = async (req, res, next) => {
	const errores = validationResult(req);

	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	const { email, password } = req.body;
	const usuario = await Usuario.findOne({ email });

	if (!usuario) {
		res.status(401).json({ msg: "El usuario no existe" });
		return next();
	}

	if (bcrypt.compareSync(password, usuario.password)) {
		//crear JWT
		const token = jwt.sign(
			{
				nombre: usuario.nombre,
				id: usuario._id,
				email: usuario.email,
			},
			process.env.SECRETA,
			{
				expiresIn: "4h",
			}
		);

		res.json({ token });
	} else {
		res.status(401).json({ msg: "Password incorrecto" });
		return next();
	}
};

exports.usuarioAutenticado = async (req, res, next) => {
	res.json({ usuario: req.usuario });
};
