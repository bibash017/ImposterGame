
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
    { word: "Compass", hint: "finds direction" },
    { word: "Lighthouse", hint: "ocean tower" },
    { word: "Telescope", hint: "night sky" },
    { word: "Cactus", hint: "desert plant" },
    { word: "Escalator", hint: "moving stairs" },
    { word: "Backpack", hint: "travel carry" },
    { word: "Lantern", hint: "dark places" },
    { word: "Volcano", hint: "fiery mountain" },
    { word: "Helmet", hint: "safety gear" },
    { word: "Passport", hint: "travel paper" },
    { word: "Microscope", hint: "tiny world" },
    { word: "Sculpture", hint: "shaped art" },
    { word: "Glacier", hint: "frozen giant" },
    { word: "Submarine", hint: "under water" },
    { word: "Chimney", hint: "roof opening" },
    { word: "Windmill", hint: "spinning blades" },
    { word: "Treasure", hint: "hidden value" },
    { word: "Castle", hint: "old fortress" },
    { word: "Bridge", hint: "over water" },
    { word: "Orbit", hint: "around center" }
  ],
  hard: [
    { word: "Democracy",  hint: "Political concept" },
    { word: "Nostalgia",  hint: "A feeling" },
    { word: "Gravity",    hint: "Physical force" },
    { word: "Entropy",    hint: "Science concept" },
    { word: "Irony",      hint: "Literary device" },
  ]
};

function getStorageKey(difficulty) {
  return `usedWords_${difficulty}`;
}


  
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