import { ActivityType } from "@/types/activity";

// Sample activities for demonstration
export const sampleActivities = [
	{
		id: "sample-1",
		main_text: "What do you call the process of using code to automate tasks?",
		correct_answer: "Programming",
		type: "multiple_choice" as ActivityType,
		options: ["Data entry", "Programming", "Web browsing", "Emailing"],
		explanation: "Programming is the process of creating instructions for computers to follow.",
		order_number: 1,
		author_id: "61724125-101a-4f07-9136-b6ef9ae86207", // Demo user ID
	},
	{
		id: "sample-2",
		main_text: "Which of these is NOT a programming language?",
		correct_answer: "HPML",
		type: "multiple_choice" as ActivityType,
		options: ["Python", "JavaScript", "HPML", "Ruby"],
		explanation: "HPML is not a real programming language; it's made up for this example.",
		order_number: 2,
		author_id: "61724125-101a-4f07-9136-b6ef9ae86207", // Demo user ID
	},
	{
		id: "sample-3",
		main_text: "True or False: All code must be compiled before it can run.",
		correct_answer: "False",
		type: "true_false" as ActivityType,
		options: ["True", "False"],
		explanation:
			"Interpreted languages like JavaScript and Python can run without being compiled first.",
		order_number: 3,
		author_id: "61724125-101a-4f07-9136-b6ef9ae86207", // Added author ID
	},
	{
		id: "sample-4",
		main_text: "What does HTML stand for?",
		correct_answer: "HyperText Markup Language",
		type: "multiple_choice" as ActivityType,
		options: [
			"HyperText Markup Language",
			"High-Level Text Machine Language",
			"Home Tool Markup Language",
			"Hyperlink and Text Markup Language",
		],
		explanation:
			"HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
		order_number: 4,
		author_id: "61724125-101a-4f07-9136-b6ef9ae86207", // Demo user ID
	},
	{
		id: "sample-5",
		main_text: "Which symbol is used for single-line comments in JavaScript?",
		correct_answer: "//",
		type: "multiple_choice" as ActivityType,
		options: ["//", "/* */", "#", "--"],
		explanation:
			"In JavaScript, single-line comments start with // and extend to the end of the line.",
		order_number: 5,
		author_id: "61724125-101a-4f07-9136-b6ef9ae86207", // Demo user ID
	},
];
