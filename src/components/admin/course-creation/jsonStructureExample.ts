// Example JSON structure for importing activities
export const jsonExampleStructure = {
  activities: [
    // Multiple choice example
    {
      topic_id: "uuid-of-the-topic", // Required: UUID of the topic where activity belongs
      type: "multiple_choice", // Required: Activity type
      main_text: "What is the capital of France?", // Required: The main question text
      correct_answer: "Paris", // Required: The correct answer
      explanation: "Paris is the capital and most populous city of France", // Optional: Explanation shown after answering
      options: ["Berlin", "London", "Paris", "Madrid"], // Required for multiple_choice: Array of options
      order_number: 1 // Optional: Position in the topic (auto-assigned if missing)
    },
    
    // True/False example
    {
      topic_id: "uuid-of-the-topic",
      type: "true_false",
      main_text: "The Earth is flat.",
      correct_answer: "false",
      explanation: "The Earth is approximately spherical in shape.",
      options: ["true", "false"]
    },
    
    // Text input example
    {
      topic_id: "uuid-of-the-topic",
      type: "text_input",
      main_text: "What is the chemical symbol for water?",
      correct_answer: "H2O",
      explanation: "Water's chemical formula is H2O, representing two hydrogen atoms bonded to one oxygen atom."
    },
    
    // Sorting activity example
    {
      topic_id: "uuid-of-the-topic",
      type: "sorting",
      main_text: "Sort these presidents by the year they took office.",
      correct_answer: "Washington,Adams,Jefferson,Madison", // Comma-separated correct ordering
      explanation: "The correct chronological order is: Washington (1789), Adams (1797), Jefferson (1801), Madison (1809).",
      options: ["Jefferson", "Washington", "Madison", "Adams"] // These will be shown to users to sort
    },
    
    // Poll example
    {
      topic_id: "uuid-of-the-topic",
      type: "poll",
      main_text: "Which programming language do you prefer?",
      // Note: correct_answer should be null for polls
      options: ["JavaScript", "Python", "Java", "C++"]
    },
    
    // Myth or reality example
    {
      topic_id: "uuid-of-the-topic",
      type: "myth_or_reality",
      main_text: "Coffee stunts your growth.",
      correct_answer: "Myth",
      explanation: "There is no scientific evidence that coffee or caffeine stunts growth.",
      options: ["Myth", "Reality"]
    },
    
    // Image multiple choice example
    {
      topic_id: "uuid-of-the-topic",
      type: "image_multiple_choice",
      main_text: "Which of these is the flag of Canada?",
      correct_answer: "option1",
      explanation: "The Canadian flag features a red maple leaf on a white square.",
      options: ["option1", "option2", "option3"], // Reference to image options
      embed_url: "https://example.com/flag-images.json" // URL containing images
    },
    
    // Image poll example
    {
      topic_id: "uuid-of-the-topic",
      type: "image_poll",
      main_text: "Which of these designs do you prefer?",
      correct_answer: "N/A", // Not applicable for polls
      explanation: "",
      options: ["design1", "design2", "design3"],
      embed_url: "https://example.com/design-images.json"
    },
    
    // Text poll example
    {
      topic_id: "uuid-of-the-topic",
      type: "text_poll",
      main_text: "What is your opinion on remote work?",
      correct_answer: "N/A",
      explanation: "",
      options: ["I prefer it", "I prefer office work", "I like a hybrid approach"]
    },
    
    // Educational content (eduntainment) example
    {
      topic_id: "uuid-of-the-topic",
      type: "eduntainment",
      main_text: "The inventor of the World Wide Web is Sir Tim Berners-Lee, who created it in 1989 while working at CERN.",
      correct_answer: "N/A", // Not applicable
      explanation: "", // Optional
      embed_url: "https://www.youtube.com/embed/OM6XIICm_qo" // Optional: URL for embedded content
    }
  ]
};

// List of all supported activity types and their descriptions
export const supportedActivityTypes = {
  "multiple_choice": "Regular multiple choice question with text options",
  "true_false": "Simple true/false question",
  "text_input": "Question requiring text input answer",
  "sorting": "Arrange items in correct order",
  "image_multiple_choice": "Multiple choice with images",
  "poll": "Opinion poll with no correct answer",
  "image_poll": "Opinion poll with image options",
  "text_poll": "Opinion poll with text focus",
  "myth_or_reality": "User decides if statement is myth or reality",
  "eduntainment": "Educational content with no question"
};
