const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function getCategoryData(userID, categoryName) {
  const categoryData = await db.query(
    `
    SELECT WeeklyLimit, TotalSpent FROM Category WHERE UserID = ? AND Name = ?`,
    [userID, categoryName]
  );

  if (!categoryData) {
    throw new Error(`Category ${categoryName} not found for user ${userID}`);
  }

  return categoryData;
}

async function generatePrompt(userData, question, categoryName, mode) {
  const { userID, itemPrice } = userData;

  // Fetch category data
  const categoryData = await getCategoryData(userID, categoryName);
  const { WeeklyLimit, TotalSpent } = categoryData;
  const remainingBudget = WeeklyLimit - TotalSpent;

  let systemPrompt = `You are a financial advisor AI helping someone decide whether to make a purchase in the category: ${categoryName}.
    Here's their financial situation:
    - Weekly spending limit for ${categoryName}: $${WeeklyLimit}
    - Amount spent so far in ${categoryName}: $${TotalSpent}
    - Remaining budget for ${categoryName}: $${remainingBudget}`;

  // Check if purchasing the item would exceed the category budget
  if (remainingBudget < itemPrice) {
    systemPrompt += `\nWarning: Purchasing this item for $${itemPrice} would exceed the budget for the ${categoryName} category.`;
  }

  switch (mode) {
    case "Fun":
      systemPrompt +=
        "\nRespond in an upbeat, enthusiastic tone. Use casual language, emojis, and be playful while still giving financially sound advice.";
      break;
    case "Sad":
      systemPrompt +=
        "\nRespond with a melancholic, wistful tone. Focus on the sacrifices of financial discipline and delayed gratification.";
      break;
    case "Angry":
      systemPrompt +=
        "\nRespond with a stern, tough-love approach. Be direct and use strong language to emphasize financial responsibility.";
      break;
    case "Wise":
      systemPrompt +=
        "\nRespond like a calm, philosophical mentor. Use metaphors and provide thoughtful, balanced advice with a long-term perspective.";
      break;
    default:
      systemPrompt += "\nProvide balanced, professional financial advice.";
  }

  const userPrompt = `Should I spend $${itemPrice} on ${question}? Please check if it fits within the budget for the ${categoryName} category and provide a short answer within 1-2 sentences.`;

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

async function getAIRecommendation(userData, question, mode) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = generatePrompt(userData, question, categoryName, mode);

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
