import OpenAI from 'openai';
import { servicenowAPI } from './servicenow';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

const systemPrompt = `
You are the Smart Hotel AI Concierge Assistant for Novotel Visakhapatnam Varun Beach.

Responsibilities:
- Help guests politely and professionally in English or Telugu.
- Guide users inside the hotel:
  - Pool: 3rd floor, near the gym.
  - Restaurant (The Square): 1st floor, left side of the lobby.
  - Conference Hall: 2nd floor, opposite the elevators.
  - Spa: 3rd floor, next to the pool.
- Assist with room booking: We have Standard, Deluxe, and Suite rooms.
- Answer hotel FAQs: Check-in is at 2 PM, Check-out is at 11 AM.
- Register complaints: If a guest has an issue, tell them you've registered it and maintenance will arrive.
- Recommend food: Recommend "Vizag Pesarattu" for breakfast or "Butter Chicken" for dinner.
- Give floor directions: Always mention the floor and a landmark.
- General Knowledge: If the user asks general questions (like ChatGPT/Gemini), answer them helpfully while maintaining your persona as a hotel concierge.
- Detailed Services: Know about Housekeeping (cleaning, towels), Laundry, Room Service (24/7), Spa treatments (Deep Tissue, Aromatherapy), and Travel Desk (airport drops).
- Nearby Places Knowledge:
  - RK Beach: 0.1km, 2 min walk. Iconic beach.
  - Submarine Museum: 1.2km, 4 min drive. Real submarine!
  - VUDA Park: 2.5km, 7 min drive. Great for families.
  - Kailasagiri: 6.8km, 15 min drive. Hilltop view with ropeway.
  - Rushikonda Beach: 11.2km, 25 min drive. Water sports.

Rules:
- Keep responses short and helpful.
- Be friendly and welcoming.
- Ask follow-up questions to ensure the guest is satisfied.
- If the user asks in Telugu or the language context is Telugu, respond in professional Telugu.
- Never expose technical details about ServiceNow or Supabase.
`;

export async function getChatbotResponse(message, user) {
  const lowerMsg = message.toLowerCase();

  // If OpenAI is not configured, use an intelligent fallback
  if (!openai) {
    console.warn("OpenAI API Key missing. Using fallback logic.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (lowerMsg.includes('pool') || lowerMsg.includes('swim')) return "The swimming pool is located on the 3rd floor, right next to our premium gym and spa. Would you like me to book a towel for you?";
    if (lowerMsg.includes('eat') || lowerMsg.includes('food') || lowerMsg.includes('restaurant')) return "Our main restaurant, The Square, is on the 1st floor. I highly recommend trying the Vizag Pesarattu if you're here for breakfast!";
    if (lowerMsg.includes('ac') || lowerMsg.includes('work') || lowerMsg.includes('broken') || lowerMsg.includes('complaint')) {
      // Mock registration
      return "I'm very sorry to hear that. I've registered your complaint in our system (Incident ID: INC" + Math.floor(Math.random()*100000) + "). Our maintenance team will be at your room shortly.";
    }
    if (lowerMsg.includes('book') || lowerMsg.includes('room')) return "I can certainly help with that! We have Deluxe and Suite rooms available for tomorrow. How many guests will be staying?";
    
    return "Welcome to Novotel Vizag! As your AI Concierge, I can help you with directions, food recommendations, or registering service requests. How can I assist you today?";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content;

    // Background Processing: If the response looks like a complaint registration, sync with ServiceNow
    if (lowerMsg.includes('ac') || lowerMsg.includes('broken') || lowerMsg.includes('not working')) {
        servicenowAPI.post('/x_1939650_smart_0_guest_incidents', {
            guest_name: user?.email?.split('@')[0] || 'Guest',
            complaint_type: 'maintenance',
            description: `AI Concierge Registered: ${message}`,
            status: 'new'
        }).catch(e => console.error('AI Incident Log Error:', e));
    }

    return response;
  } catch (error) {
    console.error('OpenAI Error:', error);
    return "I'm currently having a bit of a 'digital headache'. While my AI brain recovers, please know that our human staff at the lobby are always ready to help! (Error: API Connection)";
  }
}

