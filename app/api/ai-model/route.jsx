import { Questions_prompt } from "@/services/Constants";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    
    const {jobPosition , jobDescription , duration , type} = await req.json(); 
    
    const Final_Prompt = Questions_prompt
    .replace('{{jobTitle}}' , jobPosition)
    .replace('{{jobDescription}}' , jobDescription)
    .replace('{{duration}}' , duration)
    .replace('{{type}}',type)

    console.log("Final Prompt sent to Gemini:", Final_Prompt);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

    try {
        const result = await model.generateContent(Final_Prompt);
        const aiResponseContent = await result.response.text();
        console.log("Raw AI response content (string):\n", aiResponseContent);

        let parsedResponse;
        try {
            // Attempt to parse the content string as JSON
            // Handle cases where the AI might wrap JSON in markdown (e.g., ```json...```)
            let jsonString = aiResponseContent;
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.lastIndexOf('```'));
            } else if (jsonString.startsWith('```')) {
                // Handle cases where it's just ``` followed by content, assuming it's JSON
                jsonString = jsonString.substring(3, jsonString.lastIndexOf('```'));
            }
            parsedResponse = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("Failed to parse AI response content as JSON:", parseError);
            // If parsing fails, return a generic error or the raw content for debugging
            return NextResponse.json(
                { error: 'AI response not in expected JSON format', rawContent: aiResponseContent },
                { status: 500 }
            );
        }

        console.log("Parsed AI response object:\n", parsedResponse);
        return NextResponse.json(parsedResponse); // Return the parsed object directly

    } catch(error){
        console.error("API Error:", error);
        return NextResponse.json(
          { error: 'Failed to generate questions', details: error.message || 'Unknown error' },
          { status: 500 }
        );
      }
} 