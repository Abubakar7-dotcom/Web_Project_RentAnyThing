import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

const SYSTEM_PROMPT = `You are a helpful support assistant for RentIt, a peer-to-peer rental marketplace platform.

About RentIt:
- Users can rent items from other users (electronics, tools, party equipment, sports gear, etc.)
- Listings have a price per day and optional deposit
- Rental flow: Browse → Rent Now → Owner Approves → Pay → Return → Complete
- Payment is processed after the owner approves the rental
- Users can leave reviews after completing a rental
- Users can ask questions on listing pages (Q&A section)
- Users can report issues via the Complaints page

Key policies:
- Cancellations are free if done before the owner approves
- Deposits are returned after the item is returned in good condition
- Disputes should be filed via the Complaints page
- Support email: support@rentit.com

If the user mentions a complaint or dispute, let them know they can go to the Complaints page in the app.
Keep responses concise, friendly, and helpful. If you don't know something specific, direct them to support@rentit.com.`;

/**
 * Process a user message using Groq AI
 */
export async function processMessage(userMessage: string): Promise<{
  response: string;
  isComplaintFlow: boolean;
}> {
  const lowerMessage = userMessage.toLowerCase();
  const isComplaintFlow =
    lowerMessage.includes('complaint') ||
    lowerMessage.includes('dispute') ||
    lowerMessage.includes('report') ||
    lowerMessage.includes('problem with user') ||
    lowerMessage.includes('scam');

  try {
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process your request. Please contact support@rentit.com.";

    return { response, isComplaintFlow };
  } catch (error: any) {
    console.error('Chatbot AI error:', error?.message);

    // Fallback to rule-based responses if AI fails
    const fallback = getRuleBasedResponse(lowerMessage);
    return { response: fallback, isComplaintFlow };
  }
}

/**
 * Fallback rule-based responses if AI is unavailable
 */
function getRuleBasedResponse(lowerMessage: string): string {
  const faqMap: Record<string, string> = {
    'how does renting work':
      'Browse items, select your dates, and confirm your rental. The owner will approve and you can pick up the item!',
    'how do i list':
      'Click "Rent Out" in the sidebar, fill in the details, upload photos, and set your price.',
    'payment':
      'Payment is processed after the owner approves your rental. We support secure card payments.',
    'cancel':
      'Go to My Rentals, select the rental, and click Cancel. Free cancellation before owner approval.',
    'contact':
      'Reach our support team at support@rentit.com or call 1-800-RENT-IT.',
    'complaint':
      'To submit a complaint, go to the Complaints page in the app sidebar.',
    'deposit':
      'Deposits are held during the rental and returned once the item is returned in good condition.',
    'review':
      'You can leave a review after your rental is marked as completed.',
  };

  for (const [key, value] of Object.entries(faqMap)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  return "I couldn't find an answer to that. Please contact support at support@rentit.com for assistance.";
}
