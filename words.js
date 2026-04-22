
const fallbackWords = {
  easy: [
    { word: "Pizza", hint: "party food" },
    { word: "Dog", hint: "common pet" },
    { word: "Chair", hint: "sit here" },
    { word: "Apple", hint: "lunch fruit" },
    { word: "Rain", hint: "cloudy day" },
    { word: "Book", hint: "many pages" },
    { word: "Shoes", hint: "worn outside" },
    { word: "Window", hint: "lets light" },
    { word: "Phone", hint: "everyday device" },
    { word: "Bread", hint: "breakfast food" },
    { word: "Beach", hint: "sand and sea" },
    { word: "School", hint: "learning place" },
    { word: "Toothbrush", hint: "bathroom item" },
    { word: "Pillow", hint: "soft comfort" },
    { word: "Bottle", hint: "holds water" },
    { word: "Camera", hint: "takes photos" },
    { word: "Flower", hint: "garden plant" },
    { word: "Clock", hint: "tells time" },
    { word: "Banana", hint: "yellow fruit" },
    { word: "Train", hint: "public transport" }
  ],
  medium: [
    { word: "Compass",    hint: "Navigation tool" },
    { word: "Lighthouse", hint: "Near the sea" },
    { word: "Telescope",  hint: "Used for viewing" },
    { word: "Cactus",     hint: "Desert plant" },
    { word: "Escalator",  hint: "Found in buildings" },
  ],
  hard: [
    { word: "Democracy",  hint: "Political concept" },
    { word: "Nostalgia",  hint: "A feeling" },
    { word: "Gravity",    hint: "Physical force" },
    { word: "Entropy",    hint: "Science concept" },
    { word: "Irony",      hint: "Literary device" },
  ]
};

function buildPrompt(difficulty) {
  const guide = {
    easy:   "The word should be very common and everyday (like 'pizza', 'dog', 'umbrella'). The hint should be somewhat helpful.",
    medium: "The word should be moderately common (like 'compass', 'lighthouse'). The hint should be vague.",
    hard:   "The word should be abstract or complex (like 'democracy', 'nostalgia'). The hint should be barely useful."
  };

  return `You are generating content for a word guessing party game called Imposter.

Difficulty: ${difficulty}
${guide[difficulty]}

Generate ONE word and ONE short hint for the imposter game.

Rules:
- The word should be a single noun or concept
- The hint should be 2-4 words only, vague enough that the imposter can fake knowing the word
- Do not make the hint too obvious
- Return ONLY valid JSON, nothing else, no explanation

Format:
{"word": "YourWord", "hint": "your short hint"}`;
}

const hasApiKey =
  typeof ANTHROPIC_API_KEY !== "undefined" &&
  ANTHROPIC_API_KEY &&
  ANTHROPIC_API_KEY !== "key goes here.........."; {
    console.warn("No API key — using fallback words.");
    return getRandomFallback(difficulty);
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [
          { role: "user", content: buildPrompt(difficulty) }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("API error:", err);
      return getRandomFallback(difficulty);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();
    //const parsed = JSON.parse(text);

    if (!parsed.word || !parsed.hint) {
      throw new Error("Missing word or hint in response");
    }

    return { word: parsed.word, hint: parsed.hint };

  } catch (error) {
    console.error("getWordAndHint failed:", error);
    return getRandomFallback(difficulty);
  }
}

function getRandomFallback(difficulty) {
  const list = fallbackWords[difficulty];
  return list[Math.floor(Math.random() * list.length)];
}