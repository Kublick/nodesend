const Enlaces = require("../models/enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	const { nombre_original } = req.body;

	const enlace = new Enlaces();
	enlace.url = shortid.generate();
	enlace.nombre = shortid.generate();
	enlace.nombre_original = nombre_original;

	if (req.usuario) {
		const { password, descargas } = req.body;

		if (descargas) {
			enlace.descargas = descargas;
		}
		if (password) {
			const salt = await bcrypt.genSalt(10);
			enlace.password = await bcrypt.hash(password, salt);
		}
	}

	try {
		await enlace.save();

		return res.json({ msg: `${enlace.url}` });
		next();
	} catch (error) {
		console.log(error);
	}
};

// obtener enlace
exports.obtenerEnlace = async (req, res, next) => {
	const { url } = req.params;
	const enlace = await Enlaces.findOne({ url });

	if (!enlace) {
		res.status(404).json({ msg: "el enlace no existe" });
		return next();
	}

	//
	res.json({ archivo: enlace.nombre });

	//
	const { descargas, nombre } = enlace;

	if (descargas === 1) {
		req.archivo = nombre;
		await Enlaces.findOneAndRemove(req.params.url);
		next();
	} else {
		enlace.descargas--;
		await enlace.save();
	}
};
