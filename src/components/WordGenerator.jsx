// src/components/WordGenerator.js
const englishWords = ['example', 'test', 'react', 'javascript', 'developer', 'coding'];
const hindiWords = ['उदाहरण', 'परीक्षण', 'प्रतिक्रिया', 'जावास्क्रिप्ट', 'विकासक', 'कोडिंग'];

const WordGenerator = (language) => {
  const words = language === 'English' ? englishWords : hindiWords;
  // Shuffle the words array and return the first 10 words
  return words.sort(() => Math.random() - 0.5).slice(0, 10);
};

export default WordGenerator;
