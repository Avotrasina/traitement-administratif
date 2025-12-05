import fs from "fs";
import { supabase } from "../lib/supabaseClient";

export async function uploadFileToSupabase(
	file: Express.Multer.File,
	folder: string
) {
	const fileBuffer = fs.readFileSync(file.path);

	const fileName = `${folder}/${file.filename}`;

	const { data, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET!)
		.upload(fileName, fileBuffer, {
			contentType: file.mimetype,
			upsert: false,
		});

	// Delete local file
	fs.unlinkSync(file.path);

	if (error) throw new Error(error.message);

	return `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;
}
