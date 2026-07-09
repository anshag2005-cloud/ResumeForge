const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || '';
let genAI = null;
let apiEnabled = false;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    apiEnabled = true;
  } catch (error) {
    console.error(`Error initializing Gemini AI: ${error.message}`);
  }
}

const callGemini = async (prompt, expectJson = false) => {
  if (!apiEnabled || !genAI) {
    throw new Error('Gemini API key is not configured or failed to initialize.');
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: expectJson ? { responseMimeType: "application/json" } : {}
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
};

// --- Mocks & Fallbacks ---
const mockParsedResume = (text) => {
  const nlp = require('../utils/nlp');
  const contacts = nlp.extractContactInfo(text);
  const skills = nlp.extractSkills(text);
  const sections = nlp.segmentResumeSections(text);

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let name = lines[0] || 'Candidate Name';
  if (name.length > 40 || name.includes('@')) name = 'Professional Candidate';

  return {
    name,
    email: contacts.email || 'candidate@example.com',
    phone: contacts.phone || '+1 (555) 019-2834',
    linkedin: contacts.linkedin || 'https://linkedin.com/in/candidate',
    github: contacts.github || 'https://github.com/candidate',
    portfolio: contacts.portfolio || 'https://candidate.dev',
    summary: sections.summary || 'Results-driven professional with experience building scalable backend APIs.',
    skills: {
      technical: skills.technical.length > 0 ? skills.technical : ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
      soft: skills.soft.length > 0 ? skills.soft : ['Problem Solving', 'Teamwork', 'Agile']
    },
    experience: [
      {
        role: 'Software Developer',
        company: 'Innovate Solutions Inc.',
        duration: '2023 - Present',
        description: sections.experience || 'Designed high-performance REST endpoints and structured database migrations.'
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        school: 'State Tech University',
        year: '2022'
      }
    ],
    projects: [
      {
        title: 'ResumeForge App',
        description: 'Constructed an ATS parser and matching panel using the MERN stack.'
      }
    ],
    certifications: ['MongoDB Certified Developer'],
    languages: ['English']
  };
};

const mockImprovementSuggestions = () => {
  return {
    improved_summary: "Analytical Software Engineer experienced in building secure, high-performance REST APIs. Proficient in Next.js, Express.js, and MongoDB Atlas.",
    experience_bullets: [
      "Architected and deployed backend REST APIs with Express.js and Node.js, reducing response latencies by 30%.",
      "Spearheaded database migrations to MongoDB Atlas, ensuring clean indexing structures and reliable backups.",
      "Designed dynamic glassmorphic frontend views using Next.js and Tailwind CSS, increasing user engagement metrics."
    ],
    project_bullets: [
      "Built a secure JWT token authorization middleware safeguards candidate routes.",
      "Integrated Gemini API completion pipelines with local mock rule fallbacks."
    ],
    headlines: [
      "Full Stack Developer | Node.js, Next.js & MongoDB Specialist",
      "Software Engineer & Cloud Integration Practitioner"
    ],
    power_verbs: ["Architected", "Spearheaded", "Optimized", "Engineered", "Implemented", "Maximized"]
  };
};

const mockCoverLetter = (company, role) => {
  return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position. With my background in MERN stack development, API design, and interactive UI styling, I am confident that I can bring valuable skills to your engineering team.

In my previous projects, I have focused on designing efficient database models, writing clean, maintainable backend code, and constructing interactive user experiences that users love. Additionally, my familiarity with cloud deployments and container tools fits closely with the tasks outlined for this position.

I am particularly excited about the work ${company} is doing and would welcome the opportunity to discuss how my skillset matches your current product needs.

Sincerely,
Professional Candidate`;
};

const mockInterviewPrep = () => {
  return [
    {
      question: "How do you handle schema validation in MongoDB with Express?",
      answer: "Use Mongoose middleware validator hook models or validate incoming body inputs using libraries like Joi/Zod prior to DB writes.",
      type: "Technical",
      difficulty: "Medium"
    },
    {
      question: "Describe a complex bug you solved in production.",
      answer: "Outline the bug symptoms, debug using logs/profilers, explain the fix (e.g. adding database indexing or cleaning race conditions), and outline prevention tests.",
      type: "Behavioral",
      difficulty: "Hard"
    },
    {
      question: "What is the benefit of using JWT tokens?",
      answer: "JWT tokens are stateless, meaning user session payloads are verified by a secret key on the server without hitting a session database.",
      type: "Technical",
      difficulty: "Easy"
    }
  ];
};

const mockCareerRoadmap = () => {
  return {
    suggested_roles: ["Full Stack Engineer", "Backend Architect", "DevOps Engineer"],
    salary_range: "$90,000 - $130,000",
    certifications: [
      "MongoDB Certified Developer Associate",
      "AWS Certified Solutions Architect",
      "HashiCorp Terraform Associate"
    ],
    courses: [
      "Advanced System Design Bootcamp",
      "Docker & Kubernetes Complete Masterclass",
      "Node.js Advanced Design Patterns"
    ],
    roadmap_steps: [
      { step: 1, title: "Strengthen System Design Foundations", description: "Study caching strategies, rate limiters, database sharding, and message queues." },
      { step: 2, title: "Master Cloud Infrastructure", description: "Deploy MERN applications on AWS/GCP container hosts using automated CI/CD paths." },
      { step: 3, title: "Integrate AI/ML APIs", description: "Build search vectors and semantic similarity engines using Mongo Atlas Search features." }
    ]
  };
};

// --- Core API Wrapper Functions ---

const aiParseResume = async (rawText) => {
  if (!apiEnabled) return mockParsedResume(rawText);

  const prompt = `
    You are an expert ATS (Applicant Tracking System) parser. Analyze the following raw resume text and extract all details into a clean JSON format.
    Do not add extra conversational text or markdown blocks, output strictly valid JSON conforming to this structure:
    {
      "name": "Full Name",
      "email": "email",
      "phone": "phone number",
      "linkedin": "LinkedIn URL",
      "github": "GitHub URL",
      "portfolio": "Portfolio website URL",
      "summary": "Professional Summary",
      "skills": {
        "technical": ["list", "of", "tech", "skills"],
        "soft": ["list", "of", "soft", "skills"]
      },
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "duration": "Dates (e.g. 2021 - Present)",
          "description": "Responsibilities and key accomplishments"
        }
      ],
      "education": [
        {
          "degree": "Degree",
          "school": "University Name",
          "year": "Graduation Year"
        }
      ],
      "projects": [
        {
          "title": "Project Name",
          "description": "Details about project tech stack and impact"
        }
      ],
      "certifications": ["list of certs"],
      "languages": ["list of languages"]
    }
    
    Resume Text:
    ${rawText}
  `;

  try {
    const res = await callGemini(prompt, true);
    return JSON.parse(res);
  } catch (error) {
    console.error(`AI Parse failed (using mock): ${error.message}`);
    return mockParsedResume(rawText);
  }
};

const aiImproveResume = async (rawText) => {
  if (!apiEnabled) return mockImprovementSuggestions();

  const prompt = `
    Analyze the following resume text and suggest improvement updates:
    1. Write a professional, strong summary (improved_summary).
    2. Suggest 3 strong, quantified, impact-driven bullet points for work experience (experience_bullets) utilizing metrics.
    3. Suggest 2 strong project bullet points (project_bullets).
    4. Provide 2 modern resume headlines suited for the candidate (headlines).
    5. Provide 6 powerful action verbs suitable for this background (power_verbs).
    
    Return the response ONLY as a JSON object matching this schema:
    {
      "improved_summary": "string",
      "experience_bullets": ["bullet 1", "bullet 2", "bullet 3"],
      "project_bullets": ["bullet 1", "bullet 2"],
      "headlines": ["headline 1", "headline 2"],
      "power_verbs": ["verb1", "verb2", "verb3", "verb4", "verb5", "verb6"]
    }
    
    Resume text:
    ${rawText}
  `;

  try {
    const res = await callGemini(prompt, true);
    return JSON.parse(res);
  } catch (error) {
    console.error(`AI Improve failed: ${error.message}`);
    return mockImprovementSuggestions();
  }
};

const aiGenerateCoverLetter = async (resumeText, company, role, jobDescription = "", tone = "professional") => {
  if (!apiEnabled) return mockCoverLetter(company, role);

  const prompt = `
    Write a personalized, compelling cover letter for a candidate applying to:
    Company: ${company}
    Role: ${role}
    Job Description context: ${jobDescription}
    Tone: ${tone}
    
    Use the following resume text to gather context about the candidate's achievements and technologies:
    ${resumeText}
    
    Format the cover letter professionally with clear paragraphs. Do not output JSON, output the letter as a plain text string.
  `;

  try {
    return await callGemini(prompt, false);
  } catch (error) {
    console.error(`AI Cover Letter failed: ${error.message}`);
    return mockCoverLetter(company, role);
  }
};

const aiGenerateInterviewPrep = async (resumeText, role, jobDescription = "") => {
  if (!apiEnabled) return mockInterviewPrep();

  const prompt = `
    Based on the following resume and target role '${role}' (Job Description: ${jobDescription}), generate:
    - 2 Technical Questions with ideal answers.
    - 1 Behavioral Question with an ideal answer.
    - 1 HR Question with an ideal answer.
    
    Format the response strictly as a JSON array of objects:
    [
      {
        "question": "Question text?",
        "answer": "Suggested detailed response.",
        "type": "Technical|Behavioral|HR",
        "difficulty": "Easy|Medium|Hard"
      }
    ]
    
    Resume text:
    ${resumeText}
  `;

  try {
    const res = await callGemini(prompt, true);
    return JSON.parse(res);
  } catch (error) {
    console.error(`AI Interview Prep failed: ${error.message}`);
    return mockInterviewPrep();
  }
};

const aiGenerateCareerRoadmap = async (resumeText) => {
  if (!apiEnabled) return mockCareerRoadmap();

  const prompt = `
    Analyze the following resume and generate a customized career roadmap:
    - Recommend 3 suitable job roles (suggested_roles).
    - Provide a estimated market salary range (salary_range).
    - Recommend 3 relevant industry certifications (certifications).
    - Recommend 3 specific courses to take (courses).
    - Provide 3 sequential milestones/steps to level up, each with step index, title, and detailed instruction description (roadmap_steps).
    
    Format the response strictly as a JSON object:
    {
      "suggested_roles": ["role 1", "role 2", "role 3"],
      "salary_range": "range string",
      "certifications": ["cert 1", "cert 2", "cert 3"],
      "courses": ["course 1", "course 2", "course 3"],
      "roadmap_steps": [
        {
          "step": 1,
          "title": "Milestone title",
          "description": "What they need to learn or build."
        }
      ]
    }
    
    Resume text:
    ${resumeText}
  `;

  try {
    const res = await callGemini(prompt, true);
    return JSON.parse(res);
  } catch (error) {
    console.error(`AI Career Roadmap failed: ${error.message}`);
    return mockCareerRoadmap();
  }
};

module.exports = {
  aiParseResume,
  aiImproveResume,
  aiGenerateCoverLetter,
  aiGenerateInterviewPrep,
  aiGenerateCareerRoadmap
};
