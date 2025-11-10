import multer from "multer";
import { Request } from "express";
import {v4} from "uuid";

const storage = multer.diskStorage({
	destination: (
		_: Request,
		__: Express.Multer.File,
		callback: CallableFunction
	) => {
		callback(null, "uploads");
	},
	filename: (_, file, callback) => {
		const extArray = file.mimetype.split("/");
		const extension = extArray[extArray.length - 1];
		callback(null, `${v4()}.${extension}`);
	},
});

const fileFilter = (
	_: Request,
	file: Express.Multer.File,
	callback: CallableFunction
) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
		return callback(
			new Error("Only image files are allowed"),
			false
		);
	callback(null, true);
};

export const configurationStorage = () => multer({ storage, fileFilter });
