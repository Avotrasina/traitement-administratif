import { supabase } from "../lib/supabaseClient";

export async function uploadFileToSupabase(
	file: Express.Multer.File,
	filePath: string
) {
	if (!file || !file.buffer) {
		throw new Error("File buffer is missing.");
	}

	const { data, error } = await supabase.storage
		.from(process.env.SUPABASE_BUCKET!)
		.upload(filePath, file.buffer, {
			contentType: file.mimetype,
			upsert: false,
		});

	if (error) {
		console.error("Supabase upload error:", error);
		throw new Error(error.message);
	}

	// Retrieve the public URL
	const { data: publicUrlData } = supabase.storage
		.from(process.env.SUPABASE_BUCKET!)
		.getPublicUrl(filePath);

	return publicUrlData.publicUrl;
}
