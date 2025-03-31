import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Ensure API key exists
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('Missing GROQ_API_KEY environment variable');
}

// Primary and fallback models
const PRIMARY_MODEL = 'llama3-70b-8192';
const FALLBACK_MODEL = 'llama3-8b-8192';

// Initialize the Groq client
const client = new Groq({
  apiKey: GROQ_API_KEY,
});

// Get the current configuration (default values)
import { currentConfig } from '../assistant/config/route';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { message, history = [], userConfig } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Determine which model to use based on user preferences
    // If userConfig is provided in the request, use it, otherwise use the server config
    let preferredModel = userConfig?.model || currentConfig.model || PRIMARY_MODEL;
    let allowFallback = userConfig?.allowFallback !== undefined 
      ? userConfig.allowFallback 
      : currentConfig.allowFallback;

    // System prompt to customize the assistant's behavior
    const systemPrompt = `You are AlgoAtlas Assistant, a helpful AI designed to assist users with algorithmic problems, competitive programming, and computer science concepts. 
    You have expertise in algorithms, data structures, and programming languages like C++, Python, and Java.
    You should provide clear, concise explanations and code examples when relevant.
    When providing code, make sure it's well-commented and follows best practices.
    You should be friendly, helpful, and focused on educational assistance.`;

    // Format the conversation history for the Groq API
    const messages: Message[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history
    history.forEach((msg: Message) => {
      messages.push({ 
        role: msg.role,
        content: msg.content 
      });
    });

    // Add the current message
    messages.push({ role: 'user', content: message });

    // Try with primary model first, fall back to secondary if rate limited
    let chatCompletion;
    let modelUsed = preferredModel;
    let fallbackUsed = false;
    
    try {
      // Call Groq Chat Completions API using the preferred model
      chatCompletion = await client.chat.completions.create({
        model: preferredModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.95,
      });
    } catch (primaryError: any) {
      console.warn(`Error using model (${preferredModel}):`, primaryError.message);
      
      // Check if it's a rate limit error and fallback is allowed
      if (allowFallback && (
          primaryError.status === 429 || 
          (primaryError.message && primaryError.message.includes('rate limit')) ||
          (primaryError.error && primaryError.error.includes('rate limit'))
      )) {
        // Only fall back if we're not already using the fallback model
        if (preferredModel !== FALLBACK_MODEL) {
          console.log(`Rate limit exceeded for ${preferredModel}, falling back to ${FALLBACK_MODEL}`);
          
          try {
            // Try with the fallback model
            chatCompletion = await client.chat.completions.create({
              model: FALLBACK_MODEL,
              messages: messages,
              temperature: 0.7,
              max_tokens: 4096,
              top_p: 0.95,
            });
            
            modelUsed = FALLBACK_MODEL;
            fallbackUsed = true;
          } catch (fallbackError: any) {
            // If fallback also fails, throw the original error
            console.error(`Fallback model (${FALLBACK_MODEL}) also failed:`, fallbackError.message);
            throw primaryError;
          }
        } else {
          // If we're already using the fallback model, just throw the error
          throw primaryError;
        }
      } else {
        // If it's not a rate limit error or fallback is not allowed, rethrow
        throw primaryError;
      }
    }

    // Extract the assistant's response
    const aiResponse = chatCompletion.choices[0]?.message?.content || '';

    // Return the assistant's response with the model used
    return NextResponse.json({
      response: aiResponse,
      model: modelUsed,
      fallbackUsed: fallbackUsed
    });
  } catch (error: any) {
    console.error('Error processing assistant request:', error);
    
    // Handle specific Groq API errors
    if (error.status) {
      return NextResponse.json(
        { error: error.message || 'Failed to get response from AI model' },
        { status: error.status }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500 }
    );
  }
} 