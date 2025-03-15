const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function generatePrompt(userData, question, category, amount, mode) {
  const { weeklyLimit, totalSpent, totalSaved, savingGoals } = userData;
  const remainingBudget = weeklyLimit - totalSpent;

  let systemPrompt = `You are a financial advisor AI helping someone decided wether to make a purchase.
    Here's their financial situation:
    - Weekly spending limit: $${weeklyLimit}
    - Amount spent so far: $${totalSpent}
    - Remaining budget: $${remainingBudget}
    - Saving goals: $${savingGoals}
    - Total saved: $${totalSaved}`;

  switch (mode) {
    case "fun":
      systemPrompt +=
        "\nRespond in an upbeat, enthusiastic tone. Use casual language, emojis, and be playful while still giving financially sound advice.";
      break;
    case "sad":
      systemPrompt +=
        "\nRespond with a melancholic, wistful tone. Focus on the sacrifices of financial discipline and delayed gratification.";
      break;
    case "angry":
      systemPrompt +=
        "\nRespond with a stern, tough-love approach. Be direct and use strong language to emphasize financial responsibility.";
      break;
    case "wise":
      systemPrompt +=
        "\nRespond like a calm, philosophical mentor. Use metaphors and provide thoughtful, balanced advice with a long-term perspective.";
      break;
    default:
      systemPrompt += "\nProvide balanced, professional financial advice.";
  }

  const userPrompt = `Should I spend $${amount} on ${question} in the ${category} category? Give me a short answer within 1-2 sentences`;

  return {
    contents: [
      {
        parts: [{ text: systemPrompt }],
        role: "user",
      },
      {
        parts: [{ text: userPrompt }],
        role: "user",
      },
    ],
  };
}

async function getAIRecommendation(userData, question, category, amount, mode) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = generatePrompt(userData, question, category, amount, mode);

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("AI API error: ", error);
    throw new Error("Failed to get AI Recommendation");
  }
}

module.exports = { getAIRecommendation };
