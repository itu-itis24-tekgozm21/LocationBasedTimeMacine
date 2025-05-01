import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateHistoricalResponse(query: string): Promise<{ text: string; audioUrl?: string }> {
  try {
    // Generate text response
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable historical guide specializing in world history, architecture, and cultural heritage. Provide detailed, accurate, and engaging responses about historical sites, events, and artifacts. Always respond in English regardless of the language used in the question."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 500,
    });

    const textResponse = response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";
    
    // Generate speech from the text response
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: textResponse,
    });
    
    // Convert to base64 for easy transfer to client
    const buffer = Buffer.from(await speechResponse.arrayBuffer());
    const audioUrl = `data:audio/mp3;base64,${buffer.toString('base64')}`;
    
    return {
      text: textResponse,
      audioUrl
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate response from AI service");
  }
}

export async function generateStorytellingContent(
  site: string,
  period: string
): Promise<{
  title: string;
  content: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate an engaging historical story about the specified location and time period. Include historical facts while maintaining a narrative style."
        },
        {
          role: "user",
          content: `Create a story about ${site} during the ${period} period. Format the response as JSON with 'title' and 'content' fields.`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Forcing a type check to handle null possibility
    const messageContent = response.choices[0].message.content;
    const content = messageContent !== null ? messageContent : '{"title":"Historical Story","content":"Once upon a time..."}';
    const result = JSON.parse(content);
    return {
      title: result.title,
      content: result.content
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate storytelling content");
  }
}
