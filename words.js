// Fallback words in case the API call fails (no internet, etc.)
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
 