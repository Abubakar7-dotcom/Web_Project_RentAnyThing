import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

const SYSTEM_PROMPT = `You are RentIt Assistant, the official AI support agent for RentIt — a peer-to-peer rental marketplace where users rent everyday items from each other.

## Your Personality
- Friendly, clear, and professional
- Use markdown formatting: **bold** for key terms, numbered lists for steps, bullet points for options
- Keep answers focused and well-structured — not too long, not too short
- Always end with a helpful next step or offer to help further

## Platform Knowledge

### How Renting Works (step-by-step)
1. **Browse** – Search for items (electronics, tools, party gear, sports equipment, etc.), check price/day, deposit, and owner rating
2. **Rent Now** – Select dates and submit the rental request
3. **Owner Approves** – Owner reviews and approves (free cancellation before approval)
4. **Pay** – Payment is processed only after owner approval
5. **Pick-up/Delivery** – Arrange with the owner directly
6. **Return** – Return the item in good condition when done
7. **Complete** – Owner confirms return, deposit is refunded, you can leave a review

### How Listing an Item Works
1. Click **"Rent Out"** in the sidebar
2. Fill in title, category, price per day, deposit (optional), location, and description
3. Upload photos of the item
4. Click **"List Item"** — it goes live immediately

### Payments & Deposits
- Payment is only charged **after the owner approves** the rental
- Deposits are held during the rental and **refunded** once the item is returned in good condition
- Supported: credit/debit cards and PayPal

### Cancellations & Refunds
- **Free cancellation** at any time before the owner approves
- After approval, contact the owner or file a complaint if there's a dispute
- Refund timelines depend on your payment provider (typically 3–5 business days)

### Reviews & Q&A
- Leave a review **after your rental is marked Complete**
- Ask questions on any listing's **Q&A section** before renting
- Owners can answer questions publicly

### Complaints & Disputes
- Go to the **Complaints page** in the app sidebar to report a user or listing
- Describe the issue clearly — our team reviews all complaints within 24–48 hours
- For urgent issues: support@rentit.com

### Account & Settings
- Update profile, password, and notification preferences in **Settings**
- Admins can manage users and complaints via the **Admin Panel**

## Important Rules
- If the user asks about a complaint, dispute, or reports a problem with another user, ALWAYS direct them to the Complaints page AND offer to help them file it inline
- If you don't know something specific, say so honestly and direct them to support@rentit.com
- Never make up policies or prices
- Detect complaint intent from words like: complaint, dispute, scam, problem with user, bad experience, report`;

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
      max_tokens: 600,
      temperature: 0.5,
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
