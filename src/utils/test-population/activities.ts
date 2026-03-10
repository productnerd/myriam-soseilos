
import { supabase } from '@/integrations/supabase/client';
import { CourseType, TestActivity } from './types';

/**
 * Creates activities for a specific test type
 */
export const createActivitiesForTest = async (courseType: CourseType): Promise<any[]> => {
  try {
    const activities = [];
    
    if (courseType === 'career') {
      // Career Development activities
      const careerActivities = getCareerActivities();
      
      for (const [index, activity] of careerActivities.entries()) {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            main_text: activity.main_text,
            correct_answer: activity.correct_answer,
            type: activity.type,
            options: activity.options,
            explanation: activity.explanation,
            order_number: index + 1 // Add order_number based on index
          })
          .select();
          
        if (error) {
          console.error('Error creating activity:', error);
          continue;
        }
        
        if (data && data.length > 0) {
          activities.push(data[0]);
        }
      }
    } else {
      // Personal Finance activities
      const financeActivities = getFinanceActivities();
      
      for (const [index, activity] of financeActivities.entries()) {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            main_text: activity.main_text,
            correct_answer: activity.correct_answer,
            type: activity.type,
            options: activity.options,
            explanation: activity.explanation,
            order_number: index + 1 // Add order_number based on index
          })
          .select();
          
        if (error) {
          console.error('Error creating activity:', error);
          continue;
        }
        
        if (data && data.length > 0) {
          activities.push(data[0]);
        }
      }
    }
    
    return activities;
  } catch (error) {
    console.error('Error creating activities:', error);
    return [];
  }
};

/**
 * Returns predefined career development activities
 */
function getCareerActivities(): TestActivity[] {
  return [
    {
      main_text: "What is the most important factor when choosing a career path?",
      correct_answer: "Personal interests and skills",
      type: "multiple_choice",
      options: ["Salary potential", "Personal interests and skills", "Job market demand", "Family recommendations"],
      explanation: "While all factors matter, choosing a career aligned with your personal interests and skills leads to greater satisfaction and long-term success.",
      order_number: 1
    },
    {
      main_text: "Which of these is NOT typically included in a professional resume?",
      correct_answer: "Personal hobbies unrelated to the job",
      type: "multiple_choice",
      options: ["Work experience", "Educational background", "Personal hobbies unrelated to the job", "Relevant skills"],
      explanation: "A professional resume should focus on information relevant to the job. Personal hobbies should only be included if they demonstrate relevant skills or qualities.",
      order_number: 2
    },
    {
      main_text: "What is networking in a professional context?",
      correct_answer: "Building and maintaining professional relationships",
      type: "multiple_choice",
      options: ["Using social media", "Building and maintaining professional relationships", "Applying for multiple jobs", "Sending emails to potential employers"],
      explanation: "Networking involves creating and nurturing professional relationships that can provide support, information, and opportunities throughout your career.",
      order_number: 3
    },
    {
      main_text: "What is the purpose of a cover letter?",
      correct_answer: "To explain why you're the best candidate for the position",
      type: "multiple_choice",
      options: ["To repeat what's in your resume", "To explain why you're the best candidate for the position", "To request a high salary", "To describe your personal life"],
      explanation: "A cover letter complements your resume by explaining why your skills and experience make you ideal for the specific position.",
      order_number: 4
    }
  ];
}

/**
 * Returns predefined personal finance activities
 */
function getFinanceActivities(): TestActivity[] {
  return [
    {
      main_text: "What is the first step in creating a personal budget?",
      correct_answer: "Track your income and expenses",
      type: "multiple_choice",
      options: ["Open a savings account", "Track your income and expenses", "Set financial goals", "Cut all unnecessary spending"],
      explanation: "Before you can create an effective budget, you need to understand your current financial situation by tracking what's coming in and going out.",
      order_number: 1
    },
    {
      main_text: "Which of these is generally considered a good debt?",
      correct_answer: "Student loans",
      type: "multiple_choice",
      options: ["Credit card debt", "Payday loans", "Student loans", "Car loans for luxury vehicles"],
      explanation: "Student loans are often considered 'good debt' because they're an investment in your future earning potential, typically have lower interest rates, and may offer tax benefits.",
      order_number: 2
    },
    {
      main_text: "What is the rule of 72 in finance?",
      correct_answer: "A formula to estimate how long it takes to double your money",
      type: "multiple_choice",
      options: ["A formula to estimate how long it takes to double your money", "A rule that 72% of your income should go to necessities", "A guideline that you should save 72% of your bonuses", "A formula to calculate compound interest"],
      explanation: "The Rule of 72 is a simplified way to estimate how long an investment will take to double given a fixed annual rate of return. You divide 72 by the annual rate of return.",
      order_number: 3
    },
    {
      main_text: "What is the purpose of an emergency fund?",
      correct_answer: "To cover unexpected expenses or income loss",
      type: "multiple_choice",
      options: ["To save for retirement", "To cover unexpected expenses or income loss", "To invest in the stock market", "To pay for luxury items"],
      explanation: "An emergency fund is a financial safety net designed to cover unexpected expenses like medical emergencies or to help you survive if you lose your job.",
      order_number: 4
    }
  ];
}
