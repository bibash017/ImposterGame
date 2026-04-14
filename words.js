// Fallback words in case the API call fails 
const fallbackWords = {
  easy: [
    { word: "Pizza",      hint: "Italian food" },
    { word: "Dog",        hint: "Common pet" },
    { word: "Chair",      hint: "Furniture" },
    { word: "Apple",      hint: "Fruit" },
    { word: "Rain",       hint: "Weather" },
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
 
// Build the prompt we send to Claude
function buildPrompt(difficulty) {
  const difficultyGuide = {
    easy:   "The word should be very common and everyday (like 'pizza', 'dog', 'umbrella'). The hint should be somewhat helpful.",
    medium: "The word should be moderately common (like 'compass', 'lighthouse'). The hint should be vague.",
    hard:   "The word should be abstract or complex (like 'democracy', 'nostalgia'). The hint should be barely useful."
  };
 
  return `You are generating content for a word guessing party game called Imposter.
 
Difficulty: ${difficulty}
${difficultyGuide[difficulty]}
 
Generate ONE word and ONE short hint for the imposter game.
 
Rules:
- The word should be a single noun or concept
- The hint should be 2-4 words only, vague enough that the imposter can fake knowing the word
- Do not make the hint too obvious — it should help but not give it away
- Return ONLY valid JSON, nothing else, no explanation
 
Format:
{"word": "YourWord", "hint": "your short hint"}`;
}
  
// Main function — call this from script.js
// Returns { word, hint } or throws an error
async function getWordAndHint(difficulty) {
 
  // Safety check — if no key is set, use fallback immediately
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "paste-your-key-here") {
    console.warn("No API key found — using fallback word bank.");
    return getRandomFallback(difficulty);
  }
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        // This header is needed when calling the API from a browser
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",  // fastest + cheapest model, perfect for this
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: buildPrompt(difficulty)
          }
        ]
      })
    });
 
    // If the server returned an error (bad key, no credits, etc.)
    if (!response.ok) {
      const err = await response.json();
      console.error("API error:", err);
      console.warn("Falling back to local word bank.");
      return getRandomFallback(difficulty);
    }
 
    const data = await response.json();
 
    // Pull the text out of the response
    const text = data.content[0].text.trim();
 
    // Parse the JSON Claude returned
    const parsed = JSON.parse(text);
 
    // Make sure both fields exist
    if (!parsed.word || !parsed.hint) {
      throw new Error("Missing word or hint in response");
    }
 
    return { word: parsed.word, hint: parsed.hint };
 
  } catch (error) {
    // Something went wrong — log it and use fallback
    console.error("getWordAndHint failed:", error);
    console.warn("Using fallback word.");
    return getRandomFallback(difficulty);
  }
}

// Pick a random word from the fallback list for this difficulty
function getRandomFallback(difficulty) {
  const list = fallbackWords[difficulty];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}