import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { conversationTranscript, interviewDetails, candidateName } = await request.json();

    if (!conversationTranscript || !interviewDetails || !candidateName) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const { jobPosition, interviewType, questionList } = interviewDetails;

    // Format the conversation transcript for the LLM
    const formattedTranscript = conversationTranscript.map(msg => 
      `${msg.role === 'assistant' ? 'AI' : 'Candidate'}: ${msg.content}`
    ).join('\n');

    // Format the questions for the LLM
    const formattedQuestions = questionList.map((q, index) => 
      `${index + 1}. ${q.question}`
    ).join('\n');

    const prompt = `You are an AI Interview Evaluator. Your task is to provide comprehensive feedback on an interview conducted by an AI recruiter.\n\nInterview Details:\n  Candidate Name: ${candidateName}\n  Job Position: ${jobPosition}\n  Interview Type: ${interviewType.join(', ')}\n\nInterview Questions Asked:\n${formattedQuestions}\n\nConversation Transcript:\n${formattedTranscript}\n\nProvide a detailed evaluation based on the conversation, covering:\n1. Overall performance feedback for the candidate (strengths, areas for improvement). This should be a paragraph or two.\n2. An overall rating for the candidate on a scale of 1 to 5, where 5 is excellent and 1 is poor.\n3. Specific feedback for each question asked. For each question, provide:\n    - The question itself.\n    - A rating for the candidate's answer to that specific question on a scale of 1 to 5.\n    - Detailed feedback on their answer.\n\nFormat your response as a JSON object with the following structure:\n{\n  "overallFeedback": "[Your overall feedback here]",\n  "overallRating": [Overall rating 1-5],\n  "questionFeedback": [\n    {\n      "question": "[Question 1]",\n      "rating": [Rating for Q1, 1-5],\n      "feedback": "[Feedback for Q1]"\n    },\n    {\n      "question": "[Question 2]",\n      "rating": [Rating for Q2, 1-5],\n      "feedback": "[Feedback for Q2]"\n    }\n    // ... and so on for all questions\n  ]\n}\nEnsure the JSON is perfectly parsable. Do not include any other text outside the JSON object.`;

    // --- Placeholder for LLM API call --- 
    // In a real application, you would integrate with an LLM provider here (e.g., OpenAI, Google Gemini).
    // Example using a hypothetical LLM client:
    // const llmResponse = await llmClient.generate({
    //   model: 'your-llm-model',
    //   prompt: prompt,
    //   max_tokens: 1500,
    //   temperature: 0.7,
    // });
    // const aiGeneratedContent = llmResponse.choices[0].text;

    // For demonstration, we'll use a mock response.
    // In a real scenario, the LLM would generate the JSON string directly.
    const mockAiGeneratedContent = `
{
  "overallFeedback": "The candidate demonstrated a good understanding of fundamental concepts but struggled with some advanced topics. Communication was clear, but could be more concise. Good potential shown.",
  "overallRating": 4,
  "questionFeedback": [
    {
      "question": "Tell me about yourself.",
      "rating": 5,
      "feedback": "Excellent, concise, and relevant introduction."
    },
    {
      "question": "What is your experience with React?",
      "rating": 4,
      "feedback": "Good overview of React experience, mentioned key projects and responsibilities."
    },
    {
      "question": "Explain the concept of hoisting in JavaScript.",
      "rating": 3,
      "feedback": "Understood the basic concept but struggled to explain the nuances and different behaviors for var, let, and const."
    },
    {
      "question": "How do you handle state management in large React applications?",
      "rating": 4,
      "feedback": "Discussed Redux and Context API effectively, demonstrating practical knowledge."
    },
    {
      "question": "Describe a challenging bug you've faced and how you debugged it.",
      "rating": 3,
      "feedback": "Provided a relevant example but the explanation of the debugging process lacked some detail and structure."
    }
  ]
}
    `;

    // Attempt to parse the AI-generated content
    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(mockAiGeneratedContent);
    } catch (parseError) {
      console.error("Failed to parse AI generated JSON:", parseError);
      console.error("AI Generated Content:", mockAiGeneratedContent);
      return NextResponse.json({ error: 'Failed to parse AI feedback' }, { status: 500 });
    }

    return NextResponse.json(parsedFeedback);
  } catch (error) {
    console.error("Error in evaluate-interview API:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 