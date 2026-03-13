export const mockAyurvedaAI = (symptoms) => {
  const text = symptoms.toLowerCase();

  if (text.includes("sleep") || text.includes("anxiety")) {
    return {
      dosha: "Vata",
      reasoning:
        "Sleep disturbance and anxiety are classic signs of Vata imbalance.",
      remedies: [
        "Warm sesame oil Abhyanga",
        "Ashwagandha before bedtime",
        "Warm milk with nutmeg",
      ],
      dietRecommendations: [
        "Warm, cooked meals",
        "Avoid caffeine at night",
      ],
      lifestyleRecommendations: [
        "Fixed sleep routine",
        "Gentle evening yoga",
      ],
    };
  }

  if (text.includes("acidity") || text.includes("burning")) {
    return {
      dosha: "Pitta",
      reasoning:
        "Acidity and burning sensations indicate excess Pitta in the body.",
      remedies: [
        "Amla powder",
        "Coriander seed water",
        "Cooling pranayama",
      ],
      dietRecommendations: [
        "Cooling foods",
        "Avoid spicy meals",
      ],
      lifestyleRecommendations: [
        "Avoid midday sun",
        "Practice Sheetali pranayama",
      ],
    };
  }

  if (text.includes("cold") || text.includes("mucus")) {
    return {
      dosha: "Kapha",
      reasoning:
        "Mucus buildup and lethargy are signs of Kapha imbalance.",
      remedies: [
        "Trikatu churna",
        "Honey with ginger",
        "Steam inhalation",
      ],
      dietRecommendations: [
        "Light, warm foods",
        "Reduce dairy",
      ],
      lifestyleRecommendations: [
        "Daily exercise",
        "Dry brushing",
      ],
    };
  }

  // Default fallback
  return {
    dosha: "Mixed",
    reasoning:
      "Symptoms suggest a mixed dosha imbalance requiring holistic balance.",
    remedies: ["Balanced diet", "Daily routine regulation"],
    dietRecommendations: ["Fresh, seasonal foods"],
    lifestyleRecommendations: ["Regular sleep and exercise"],
  };
};
