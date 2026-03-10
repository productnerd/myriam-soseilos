import { supabase } from "@/integrations/supabase/client";

//Service for uploading an image for quest submission to Supabase storage
export async function uploadSubmissionImage(
	userId: string,
	questId: string,
	imageFile: File
): Promise<string> {
	try {
		// Generate a unique filename to prevent collisions
		const fileExtension = imageFile.name.split(".").pop();
		const uniqueId = Math.random().toString(36).substring(2, 15);
		const fileName = `${questId}/${userId}_${uniqueId}.${fileExtension}`;
		const bucketName = "quest_submissions";

		console.debug("uploadSubmissionImage - Uploading file:", {
			fileName,
			bucketName,
			fileSize: imageFile.size,
			fileType: imageFile.type,
		});

		// Ensure the bucket exists
		try {
			const { data: bucketExists, error: bucketCheckError } =
				await supabase.storage.getBucket(bucketName);

			if (bucketCheckError || !bucketExists) {
				console.debug("uploadSubmissionImage - Creating bucket:", bucketName);
				const { error: createBucketError } = await supabase.storage.createBucket(
					bucketName,
					{
						public: true,
						fileSizeLimit: 10485760, // 10MB
					}
				);

				if (createBucketError) {
					console.error(
						"uploadSubmissionImage - Failed to create bucket:",
						createBucketError
					);
					throw createBucketError;
				}
			}
		} catch (bucketError) {
			console.error("uploadSubmissionImage - Bucket check/creation error:", bucketError);
			// Continue anyway - the bucket might already exist
		}

		// Upload the file to Supabase storage
		const { data, error } = await supabase.storage
			.from(bucketName)
			.upload(fileName, imageFile, {
				cacheControl: "3600",
				upsert: true,
			});

		if (error) {
			console.error("uploadSubmissionImage - Error uploading image:", error);
			throw error;
		}

		console.debug("uploadSubmissionImage - Upload successful:", data);

		// Create and return the public URL
		const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

		console.debug("uploadSubmissionImage - Generated URL:", urlData.publicUrl);
		return urlData.publicUrl;
	} catch (error) {
		console.error("uploadSubmissionImage:", error);
		throw error;
	}
}
