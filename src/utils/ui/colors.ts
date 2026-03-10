// Map course names to background colors
export function getBgColorByCourseName(courseName: string | undefined): string {
	switch (courseName?.toLowerCase()) {
		case "javascript":
			return "bg-yellow-500";
		case "python":
			return "bg-blue-500";
		case "java":
			return "bg-orange-500";
		case "c++":
			return "bg-purple-500";
		case "ruby":
			return "bg-red-500";
		case "go":
			return "bg-cyan-500";
		case "rust":
			return "bg-amber-500";
		case "typescript":
			return "bg-blue-600";
		case "swift":
			return "bg-orange-600";
		case "kotlin":
			return "bg-violet-500";
		case "scala":
			return "bg-red-600";
		case "haskell":
			return "bg-purple-600";
		case "elixir":
			return "bg-fuchsia-500";
		case "dart":
			return "bg-sky-500";
		default:
			return "bg-gray-500";
	}
}
