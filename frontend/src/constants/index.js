import background1 from "../assets/images/background1.png";
import background2 from "../assets/images/background2.png";
import background3 from "../assets/images/background3.png";
import background4 from "../assets/images/background4.png";
import background5 from "../assets/images/background5.png";
import background6 from "../assets/images/background6.png";
import background7 from "../assets/images/background7.png";

import happyRobot from "../assets/images/happy_robot.png";
import sadRobot from "../assets/images/sad_robot.png";
import neutralRobot from "../assets/images/thinking_robot.png";
import introRobot from "../assets/images/intro_robot.png";
import nameRobot from "../assets/images/name_robot.png";
import thinkingRobot from "../assets/images/thinking_robot.png";

export const robotImages = {
  happy: happyRobot,
  sad: sadRobot,
  neutral: neutralRobot,
  intro: introRobot,
  name: nameRobot,
  thinking: thinkingRobot,
};

export const levelBackgrounds = [
  background1,
  background2,
  background3,
  background4,
  background5,
  background6,
  background7,
  background1,
];

const wordBank = [
  // Pronouns & Subjects
  { text: 'I', score: 0 }, { text: 'you', score: 0 }, { text: 'he', score: 0 }, { text: 'she', score: 0 }, { text: 'it', score: 0 }, { text: 'we', score: 0 }, { text: 'they', score: 0 },
  // Positive Adjectives
  { text: 'happy', score: 1 }, { text: 'wonderful', score: 2 }, { text: 'amazing', score: 2 }, { text: 'great', score: 1 }, { text: 'joyful', score: 2 }, { text: 'excellent', score: 2 }, { text: 'fun', score: 1 }, { text: 'best', score: 2 }, { text: 'tasty', score: 1 }, { text: 'lovely', score: 1 }, { text: 'brilliant', score: 2 }, { text: 'delicious', score: 2 }, { text: 'charming', score: 1 },
  // Negative Adjectives
  { text: 'sad', score: -1 }, { text: 'terrible', score: -2 }, { text: 'awful', score: -2 }, { text: 'bad', score: -1 }, { text: 'boring', score: -1 }, { text: 'worst', score: -2 }, { text: 'cold', score: -1 }, { text: 'tasteless', score: -1 }, { text: 'angry', score: -1 }, { text: 'dreadful', score: -2 }, { text: 'disgusting', score: -2 }, { text: 'mediocre', score: -1 },
  // Neutral Nouns
  { text: 'movie', score: 0 }, { text: 'game', score: 0 }, { text: 'book', score: 0 }, { text: 'food', score: 0 }, { text: 'day', score: 0 }, { text: 'pizza', score: 0 }, { text: 'park', score: 0 }, { text: 'story', score: 0 }, { text: 'music', score: 0 }, { text: 'friend', score: 0 },
  // Verbs
  { text: 'is', score: 0 }, { text: 'was', score: 0 }, { text: 'love', score: 2 }, { text: 'hate', score: -2 }, { text: 'like', score: 1 }, { text: 'dislike', score: -1 }, { text: 'play', score: 0 }, { text: 'read', score: 0 }, { text: 'eat', score: 0 }, { text: 'felt', score: 0 }, { text: 'seemed', score: 0 },
  // Determiners & Adverbs
  { text: 'the', score: 0 }, { text: 'a', score: 0 }, { text: 'my', score: 0 }, { text: 'your', score: 0 }, { text: 'so', score: 0 }, { text: 'very', score: 0 }, { text: 'not', score: 0 }, { text: 'truly', score: 0 }, { text: 'really', score: 0 },
  // Connectors
  { text: 'and', score: 0 }, { text: 'but', score: 0 }, { text: 'because', score: 0 },
];

export const introduction = [
  {
    type: "intro",
    robot: "intro",
    text: "Hello there! My name is Gloomy, and I'm a robot who's new to your world.",
  },
  {
    type: "intro",
    robot: "thinking",
    text: "I can read human words, but I don't understand feelings like 'happy' or 'sad'. To me, they're just... data.",
  },
  {
    type: "intro",
    robot: "happy",
    text: "Will you help me on an adventure to learn what sentiments really are? Let's get started!",
  },
];

export const story = [
  {
    level: 1,
    title: "Data Collection",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Welcome to Level 1! Let's help me collect messages that are full of feelings. This is called 'Data Collection'.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question: "1/5: Which of these messages has a strong 'happy' feeling?",
        options: [
          "The sky is blue.",
          "I am so happy today!",
          "My name is Tom.",
        ],
        answer: "I am so happy today!",
      },
      {
        type: "quiz",
        robot: "thinking",
        question: "2/5: Which message has a clear 'sad' or 'boring' feeling?",
        options: [
          "That movie was terribly boring.",
          "A table has four legs.",
          "Computers use electricity.",
        ],
        answer: "That movie was terribly boring.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "3/5: Some messages are just questions. Which one is a statement with a feeling?",
        options: [
          "What time is it?",
          "This is the best pizza ever!",
          "Is it raining outside?",
        ],
        answer: "This is the best pizza ever!",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "4/5: Feelings can be hidden. Which sentence shows excitement without using the word 'excited'?",
        options: [
          "I can't wait for the party!",
          "The party is on Saturday.",
          "We should bring snacks.",
        ],
        answer: "I can't wait for the party!",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "5/5: Some data is better than others. Which message has the STRONGEST feeling?",
        options: [
          "I like ice cream.",
          "I absolutely adore my new puppy!",
          "That book was okay.",
        ],
        answer: "I absolutely adore my new puppy!",
      },
      {
        type: "intro",
        robot: "happy",
        text: "Amazing! We've collected lots of great data. You've completed Level 1!",
      },
    ],
  },
  {
    level: 2,
    title: "Text Preprocessing",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Welcome to Level 2! Now we need to clean up the text. This is called 'Preprocessing'.",
      },
      {
        type: "cleanup",
        robot: "thinking",
        question:
          "1/5: First, let's remove the extra punctuation. Click on the useless symbols.",
        sentence: "This is so much fun ! ! !",
        wordsToRemove: ["!", "!", "!"],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "2/5: Capital letters confuse me! Which sentence is easiest for a robot to read (all lowercase)?",
        options: ["THIS IS GREAT", "This Is Great", "this is great"],
        answer: "this is great",
      },
      {
        type: "cleanup",
        robot: "thinking",
        question:
          "3/5: Now let's remove boring 'stop words' like 'a', 'the', and 'is'.",
        sentence: "This is a story about a brave hero",
        wordsToRemove: ["This", "is", "a", "about", "a"],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "4/5: Emojis and slang are tricky! Which option means something is 'amazing' or 'exciting'?",
        options: ["That's cap 🧢", "This is lit 🔥", "I'm so salty 🧂"],
        answer: "This is lit 🔥",
      },
      {
        type: "cleanup",
        robot: "thinking",
        question:
          "5/5: Let's combine everything! Clean up all the punctuation and stop words.",
        sentence: "Wow , this was a really , really cool adventure !!",
        wordsToRemove: [
          "Wow",
          ",",
          "this",
          "was",
          "a",
          "really",
          ",",
          "really",
          "!!",
        ],
      },
      {
        type: "intro",
        robot: "happy",
        text: "Incredible! The data is so much cleaner now. You've completed Level 2!",
      },
    ],
  },
  {
    level: 3,
    title: "Feature Extraction",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Level 3! Let's turn words into numbers so I can understand them. This is 'Feature Extraction'.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "1/5: Let's count words! In 'I love my cat and my dog', how many times does 'my' appear?",
        options: ["Once", "Twice", "Three times"],
        answer: "Twice",
      },
      {
        type: "fill-in-the-blank",
        robot: "thinking",
        question: "2/5: Fill in the blank to make this sentence POSITIVE.",
        sentenceParts: ["This game is truly", "!"],
        options: ["amazing", "awful"],
        answer: "amazing",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "3/5: If 'good' = 1, 'bad' = -1, and 'okay' = 0, what is the score for 'The movie was good, not bad'?",
        options: ["0 (1 + -1)", "2 (1 + 1)", "-2 (-1 + -1)"],
        answer: "0 (1 + -1)",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "4/5: Which pair of words ('bigram') is most important in 'The service was not good'?",
        options: ["The service", "was not", "not good"],
        answer: "not good",
      },
      {
        type: "fill-in-the-blank",
        robot: "thinking",
        question: "5/5: Now, fill in the blank to make this sentence NEGATIVE.",
        sentenceParts: ["That long wait was very", "."],
        options: ["relaxing", "annoying"],
        answer: "annoying",
      },
      {
        type: "intro",
        robot: "happy",
        text: "You're a natural! You've learned how specific words create features for me to analyze. Level 3 is done!",
      },
    ],
  },
  {
    level: 4,
    title: "Sentiment Classification",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Level 4 is here! Now we sort feelings into groups. This is 'Classification'.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "1/5: A movie review has a score of +5. Which category is it?",
        options: ["Positive", "Negative", "Neutral"],
        answer: "Positive",
      },
      {
        type: "sort",
        robot: "thinking",
        question: "2/5: Drag these words into the correct feeling bins!",
        items: [
          { id: "item-1", text: "joyful", category: "Positive" },
          { id: "item-2", text: "awful", category: "Negative" },
          { id: "item-3", text: "wonderful", category: "Positive" },
          { id: "item-4", text: "terrible", category: "Negative" },
        ],
        bins: ["Positive", "Negative"],
      },
      {
        type: "mapping",
        robot: "thinking",
        question:
          "3/5: Match the sentence to its feeling. Click a sentence, then click the correct category.",
        items: [
          {
            id: "m1-1",
            text: "The concert was spectacular!",
            answer: "Positive",
          },
          {
            id: "m1-2",
            text: "I waited in line for an hour.",
            answer: "Neutral",
          },
          {
            id: "m1-3",
            text: "The food was cold and tasteless.",
            answer: "Negative",
          },
        ],
        categories: ["Positive", "Negative", "Neutral"],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "4/5: A book review has a score of -3. Which category does it belong to?",
        options: ["Positive", "Negative", "Neutral"],
        answer: "Negative",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "5/5: My model sees a new sentence: 'I absolutely hated the ending.' How will I classify this?",
        options: ["Positive", "Negative", "Neutral"],
        answer: "Negative",
      },
      {
        type: "intro",
        robot: "happy",
        text: "Perfect! You've taught me how to sort feelings. Level 4 complete!",
      },
    ],
  },
  {
    level: 5,
    title: "Analysis & Interpretation",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Welcome to Level 5! What do the results mean? Let's analyze them.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question: "1/5: 80 of 100 game reviews are Positive. This means...",
        options: [
          "Most people disliked the game.",
          "Most people thought the game was okay.",
          "Most people really liked the game.",
        ],
        answer: "Most people really liked the game.",
      },
      {
        type: "slider",
        robot: "thinking",
        question:
          "2/5: Let's rate sentiment intensity. How NEGATIVE is this sentence? 'The vacation was a complete disaster.'",
        labels: ["A little bad", "Very bad", "The worst!"],
        answerRange: [75, 100],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "3/5: I might get confused by sarcasm. How would I probably interpret 'Oh, great. I spilled juice.'?",
        options: [
          "Positive, because it says 'great'.",
          "Negative, because spilling is usually bad.",
        ],
        answer: "Positive, because it says 'great'.",
      },
      {
        type: "slider",
        robot: "thinking",
        question:
          "4/5: Now, how POSITIVE is this sentence? 'This was the best day of my entire life!'",
        labels: ["Neutral", "Happy", "Ecstatic!"],
        answerRange: [85, 100],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "5/5: The word 'sick' can be positive or negative. Which sentence uses it in a POSITIVE way?",
        options: [
          "I feel sick and have a fever.",
          "That skateboard trick was sick!",
        ],
        answer: "That skateboard trick was sick!",
      },
      {
        type: "intro",
        robot: "happy",
        text: "Exactly! Part of analysis is finding my mistakes so you can help me get smarter. You've completed Level 5!",
      },
    ],
  },
  {
    level: 6,
    title: "Visualization & Reporting",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Level 6! It's hard to read numbers. Let's visualize the results to make them easy to understand.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "1/5: To show 70% Positive vs 30% Negative reviews, what's the best chart?",
        options: ["A Pie Chart", "A Map", "A List of Names"],
        answer: "A Pie Chart",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "2/5: To show how sentiment changed over time, what's the best chart?",
        options: ["A Pie Chart", "A Line Graph", "A Photo of the movie poster"],
        answer: "A Line Graph",
      },
      {
        type: "mapping",
        robot: "thinking",
        question: "3/5: Match the goal with the best chart type.",
        items: [
          {
            id: "m2-1",
            text: "Show parts of a whole (70% vs 30%)",
            answer: "Pie Chart",
          },
          { id: "m2-2", text: "Show change over time", answer: "Line Graph" },
          { id: "m2-3", text: "Compare different items", answer: "Bar Chart" },
        ],
        categories: ["Line Graph", "Bar Chart", "Pie Chart"],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "4/5: What are the best colors for 'Positive', 'Negative', and 'Neutral' feelings?",
        options: [
          "Green for Positive, Red for Negative, Gray for Neutral",
          "Blue for all of them",
          "Orange for Positive, Purple for Negative, Yellow for Neutral",
        ],
        answer: "Green for Positive, Red for Negative, Gray for Neutral",
      },
      {
        type: "fill-in-the-blank",
        robot: "thinking",
        question: "5/5: A good report should be clear and easy to ______.",
        sentenceParts: ["A report should be clear and easy to", "."],
        options: ["ignore", "understand"],
        answer: "understand",
      },
      {
        type: "intro",
        robot: "happy",
        text: "Exactly! Making clear and colorful charts helps everyone understand the story in our data. Level 6 is complete!",
      },
    ],
  },
  {
    level: 7,
    title: "Implementation & Iteration",
    steps: [
      {
        type: "intro",
        robot: "intro",
        text: "Final Level! It's time to use our model in the real world. This is 'Implementation'.",
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "1/5: A company wants to sort customer emails. Where could they implement our model?",
        options: [
          "On their website's login page.",
          "In their email system to flag angry customer emails.",
          "In the office coffee machine.",
        ],
        answer: "In their email system to flag angry customer emails.",
      },
      {
        type: "order",
        robot: "thinking",
        question:
          "2/5: Let's review! Drag and drop the first four steps of our journey into the correct order.",
        items: [
          "Text Preprocessing",
          "Feature Extraction",
          "Data Collection",
          "Sentiment Classification",
        ],
        correctOrder: [
          "Data Collection",
          "Text Preprocessing",
          "Feature Extraction",
          "Sentiment Classification",
        ],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "3/5: My model sees 'This slaps 🔥' and gets confused. What should we do?",
        options: [
          "Ignore it.",
          "Delete the model.",
          "Add it to my training data and teach me it means 'Positive'.",
        ],
        answer: "Add it to my training data and teach me it means 'Positive'.",
      },
      {
        type: "mapping",
        robot: "thinking",
        question: "4/5: Match the problem to the sentiment analysis solution.",
        items: [
          {
            id: "m3-1",
            text: "Are customers happy with our update?",
            answer: "Analyze App Store reviews",
          },
          {
            id: "m3-2",
            text: "Is this movie trailer getting good reactions?",
            answer: "Analyze YouTube comments",
          },
          {
            id: "m3-3",
            text: "What do people think of our restaurant?",
            answer: "Analyze Yelp reviews",
          },
        ],
        categories: [
          "Analyze Yelp reviews",
          "Analyze YouTube comments",
          "Analyze App Store reviews",
        ],
      },
      {
        type: "quiz",
        robot: "thinking",
        question:
          "5/5: What's the most important part of making a model better over time?",
        options: [
          "Using a faster computer.",
          "Giving it a cool name.",
          "Learning from new and changing data.",
        ],
        answer: "Learning from new and changing data.",
      },
      {
        type: "intro",
        robot: "name",
        text: "Thanks to you, I'm not so Gloomy anymore! I understand feelings! You've completed all the levels. YOU are a Sentiment Analysis expert!",
      },
    ],
  },
  {
    level: 8,
    title: "Play with Gloomy",
    steps: [
      {
        type: "sandbox",
        robot: "neutral",
        question:
          "Let's test my learning! Build a sentence from the words below and I'll predict its sentiment.",
        wordBank: wordBank,
      },
    ],
  },
];
