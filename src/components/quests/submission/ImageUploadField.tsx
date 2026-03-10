import React, { useState } from "react";

interface ImageUploadFieldProps {
	onFileChange: (file: File | null) => void;
	required?: boolean;
	disabled?: boolean;
	existingImageUrl?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
	onFileChange,
	required = false,
	disabled = false,
	existingImageUrl,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;

		if (file) {
			onFileChange(file);
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
		} else {
			onFileChange(null);
			setPreviewUrl(existingImageUrl || null);
		}
	};

	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium">
				Upload Image {required && <span className="text-red-500">*</span>}
			</label>

			{previewUrl && (
				<div className="mb-3">
					<img
						src={previewUrl}
						alt="Preview"
						className="h-56 object-contain rounded-md border border-border/50 mb-2"
					/>
				</div>
			)}

			{!disabled && (
				<div>
					<input
						id="image-upload"
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						required={required && !existingImageUrl}
						disabled={disabled}
					/>
					<label
						htmlFor="image-upload"
						className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium
              ${
					disabled
						? "bg-gray-100 text-gray-500 cursor-not-allowed"
						: "bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
				}`}
					>
						{existingImageUrl ? "Change Image" : "Upload Image"}
					</label>
					<p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF up to 5MB</p>
				</div>
			)}
		</div>
	);
};

export default ImageUploadField;
