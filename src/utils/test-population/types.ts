
export type CourseType = 'career' | 'finance';

export interface TestActivity {
  main_text: string;
  correct_answer: string;
  type: string;
  options: string[];
  explanation: string;
  order_number: number;
}

export interface PopulationResult {
  course: string;
  success: boolean;
}
