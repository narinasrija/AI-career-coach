const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build', // Fallback for dev without key
});

const isMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume (PDF)' });
    }

    // Parse PDF text
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    // Call OpenAI to analyze
    // If no key is provided or it's the default placeholder, return a mock response for UI testing
    if (isMockMode) {
      return res.json({
        atsScore: 75,
        missingSkills: ['React Query', 'TypeScript'],
        improvements: ['Add more quantifiable metrics to bullet points', 'Highlight leadership experience'],
        rewrittenBullets: ['Spearheaded the development of a scalable React frontend, resulting in a 20% increase in user retention.']
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert AI Career Coach and ATS Resume Analyzer. Analyze the provided resume text and return a JSON object containing: atsScore (0-100), missingSkills (array of strings), improvements (array of strings), rewrittenBullets (array of improved bullet points)." },
        { role: "user", content: `Resume text:\n${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);
    res.json(aiResponse);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ message: 'Error analyzing resume. Make sure you have a valid OpenAI key.' });
  }
};

const generateRoadmap = async (req, res) => {
  try {
    const { goal, experience } = req.body;

    if (isMockMode) {
      return res.json({
        roadmap: [
          { week: "Week 1", topic: "Advanced JS", details: "Closures, Event Loop, Promises" },
          { week: "Week 2", topic: "React Hooks", details: "useEffect, useMemo, custom hooks" },
          { week: "Week 3", topic: "Performance", details: "Code splitting, lazy loading, profiling" },
          { week: "Week 4", topic: "Architecture", details: "State management, system design basics" }
        ]
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI Career Coach. Generate a JSON object containing a 'roadmap' array. Each item should have 'week', 'topic', and 'details'. Provide a 4-week roadmap." },
        { role: "user", content: `My goal is to become a ${goal}. My current experience is ${experience}. Generate my learning roadmap.` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(response.choices[0].message.content);
    res.json(aiResponse);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mockInterview = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (isMockMode) {
      return res.json({
        reply: "That's a great answer! Can you elaborate more on how you handled the conflict with your team member?",
        score: null
      });
    }

    const messages = [
      { role: "system", content: "You are a Technical and HR Interviewer. Conduct a realistic interview. Ask one question at a time. If the user asks for a score, provide an evaluation." },
      ...history,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    res.json({
      reply: response.choices[0].message.content,
      score: null // You can add logic to detect when the interview is over and score it
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeResume, generateRoadmap, mockInterview };
