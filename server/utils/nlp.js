const TECH_SKILLS = [
  "python", "javascript", "typescript", "react", "next.js", "nextjs", "vue", "angular",
  "fastapi", "django", "flask", "nodejs", "node.js", "express", "postgresql", "postgres",
  "mysql", "sqlite", "mongodb", "redis", "cassandra", "dynamodb", "docker", "kubernetes",
  "aws", "azure", "gcp", "google cloud", "git", "github", "gitlab", "ci/cd", "jenkins",
  "github actions", "terraform", "ansible", "linux", "nginx", "apache", "graphql", "rest api",
  "microservices", "serverless", "html", "css", "tailwind", "bootstrap", "sass", "java",
  "c++", "c#", "go", "golang", "rust", "ruby", "rails", "php", "laravel", "swift", "kotlin",
  "tensorflow", "pytorch", "keras", "scikit-learn", "numpy", "pandas", "spacy", "nltk",
  "opencv", "hadoop", "spark", "tableau", "power bi", "excel", "sql", "nosql", "elasticsearch"
];

const SOFT_SKILLS = [
  "leadership", "communication", "teamwork", "collaboration", "problem solving", 
  "critical thinking", "time management", "adaptability", "creativity", "work ethic",
  "conflict resolution", "emotional intelligence", "project management", "agile", "scrum",
  "mentoring", "presentation", "negotiation", "active listening"
];

const SECTION_KEYWORDS = {
  experience: ["experience", "employment", "work history", "professional background", "work experience"],
  education: ["education", "academic", "university", "college", "degree", "school"],
  projects: ["projects", "personal projects", "academic projects", "key projects"],
  skills: ["skills", "technical skills", "technologies", "expertise", "competencies", "soft skills"],
  certifications: ["certifications", "certificates", "courses", "licenses"],
  achievements: ["achievements", "awards", "honors", "accomplishments"]
};

// Raw Text Extractor Fallback
const extractTextFromBuffer = (filename, buffer) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'txt' || ext === 'md') {
    return buffer.toString('utf-8');
  }
  
  // Extraction filter for PDF and Word streams
  // Captures printable string blocks, ignoring compressed binary noise
  const rawText = buffer.toString('ascii');
  const blocks = rawText.match(/[a-zA-Z0-9\s\.\,\@\-\:\/\(\)\#\+]{6,200}/g) || [];
  
  // Filter noise
  const filtered = blocks.filter(block => {
    const trimmed = block.trim();
    if (trimmed.length < 10) return false;
    // Discard blocks with too many special character artifacts
    const specCount = (trimmed.match(/[\%\/\\\_\[\]\{\}\<\>]/g) || []).length;
    return specCount / trimmed.length < 0.15;
  });
  
  return filtered.join('\n');
};

const extractContactInfo = (text) => {
  const info = { email: "", phone: "", linkedin: "", github: "", portfolio: "" };
  const lowered = text.toLowerCase();

  // Email Match
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  if (emailMatch) info.email = emailMatch[0];

  // Phone Match
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) info.phone = phoneMatch[0];

  // Social Links
  const liMatch = text.match(/(linkedin\.com\/in\/[\w\-]+)/i);
  if (liMatch) info.linkedin = "https://" + liMatch[0];

  const ghMatch = text.match(/(github\.com\/[\w\-]+)/i);
  if (ghMatch) info.github = "https://" + ghMatch[0];

  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([\w\-]+\.(?:com|io|me|dev|net))(?!\/(?:in|github))/i);
  if (portfolioMatch) {
    const clean = portfolioMatch[0].toLowerCase();
    if (!clean.includes("gmail") && !clean.includes("yahoo") && !clean.includes("outlook") && !clean.includes("linkedin") && !clean.includes("github")) {
      info.portfolio = portfolioMatch[0];
    }
  }

  return info;
};

const segmentResumeSections = (text) => {
  const lines = text.split("\n");
  const sections = {};
  Object.keys(SECTION_KEYWORDS).forEach(k => { sections[k] = []; });
  sections["summary"] = [];

  let currentSection = "summary";

  for (let line of lines) {
    const cleaned = line.trim();
    if (!cleaned) continue;

    let foundSection = false;
    if (cleaned.length < 40) {
      for (const [sec, keywords] of Object.entries(SECTION_KEYWORDS)) {
        if (keywords.some(kw => new RegExp(`^${kw}\\b`, 'i').test(cleaned) || new RegExp(`^${kw}:`, 'i').test(cleaned))) {
          currentSection = sec;
          foundSection = true;
          break;
        }
      }
    }

    if (!foundSection) {
      sections[currentSection].push(cleaned);
    }
  }

  const result = {};
  Object.entries(sections).forEach(([k, v]) => {
    result[k] = v.join("\n");
  });
  return result;
};

const extractSkills = (text) => {
  const foundTech = [];
  const foundSoft = [];
  const lowered = text.toLowerCase();

  TECH_SKILLS.forEach(skill => {
    let pattern;
    if (["c++", "c#", "next.js", "node.js"].includes(skill)) {
      pattern = new RegExp(skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    } else {
      pattern = new RegExp(`\\b${skill}\\b`, 'i');
    }
    if (pattern.test(lowered)) {
      foundTech.push(skill);
    }
  });

  SOFT_SKILLS.forEach(skill => {
    const pattern = new RegExp(`\\b${skill}\\b`, 'i');
    if (pattern.test(lowered)) {
      foundSoft.push(skill);
    }
  });

  return {
    technical: [...new Set(foundTech)].sort(),
    soft: [...new Set(foundSoft)].sort()
  };
};

const calculateATSScore = (text, sections, skills, contacts) => {
  const breakdown = {
    formatting: 100,
    keywords: 0,
    sections: 0,
    experience: 0,
    education: 0,
    contact_info: 0
  };

  const suggestions = [];

  // 1. Formatting
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    breakdown.formatting -= 30;
    suggestions.push("Your resume seems too short. Aim for at least 300-600 words.");
  } else if (wordCount > 1200) {
    breakdown.formatting -= 20;
    suggestions.push("Your resume is very long. Consider condensing it to 1-2 pages.");
  }

  // 2. Contact details
  let contactHits = 0;
  if (contacts.email) contactHits++;
  if (contacts.phone) contactHits++;
  if (contacts.linkedin) contactHits++;
  if (contacts.github) contactHits++;
  if (contacts.portfolio) contactHits++;

  breakdown.contact_info = (contactHits / 5) * 100;
  if (!contacts.email) suggestions.push("Missing email address.");
  if (!contacts.phone) suggestions.push("Missing phone number.");
  if (!contacts.linkedin) suggestions.push("Add your LinkedIn profile link.");

  // 3. Sections completeness
  const essentialSecs = ["experience", "education", "skills"];
  let sectionHits = 0;
  essentialSecs.forEach(s => {
    if (sections[s] && sections[s].trim().length > 20) {
      sectionHits++;
    } else {
      suggestions.push(`Missing or very short '${s}' section.`);
    }
  });
  breakdown.sections = (sectionHits / essentialSecs.length) * 100;

  // 4. Keywords
  const totalSkills = skills.technical.length + skills.soft.length;
  if (totalSkills >= 15) breakdown.keywords = 100;
  else if (totalSkills >= 8) {
    breakdown.keywords = 75;
    suggestions.push("Good skill coverage, but adding a few more technologies could help filters.");
  } else {
    breakdown.keywords = 40;
    suggestions.push("Very few skills detected. Add specific software, tools, and methodologies.");
  }

  // 5. Experience
  const expWordCount = (sections.experience || "").split(/\s+/).length;
  if (expWordCount > 150) breakdown.experience = 100;
  else if (expWordCount > 50) {
    breakdown.experience = 65;
    suggestions.push("Add more quantified details to your experience bullets.");
  } else {
    breakdown.experience = 20;
    suggestions.push("Your experience section is sparse. Describe past projects and achievements.");
  }

  // 6. Education
  if (sections.education && sections.education.trim().length > 30) {
    breakdown.education = 100;
  } else {
    breakdown.education = 45;
    suggestions.push("Provide more details about your degrees, majors, and university names.");
  }

  const overallScore = (
    breakdown.formatting * 0.15 +
    breakdown.keywords * 0.25 +
    breakdown.sections * 0.15 +
    breakdown.experience * 0.25 +
    breakdown.education * 0.10 +
    breakdown.contact_info * 0.10
  );

  return {
    atsScore: Math.round(overallScore * 10) / 10,
    breakdown,
    suggestions
  };
};

// JavaScript Cosine Similarity Engine
const getCosineSimilarity = (textA, textB) => {
  const tokenize = (text) => text.toLowerCase().match(/\b[a-z]{3,15}\b/g) || [];
  const getFreqMap = (words) => {
    const map = {};
    words.forEach(w => { map[w] = (map[w] || 0) + 1; });
    return map;
  };

  const wordsA = tokenize(textA);
  const wordsB = tokenize(textB);
  
  const freqA = getFreqMap(wordsA);
  const freqB = getFreqMap(wordsB);

  // Exclude common stop words
  const stopWords = new Set(['and', 'the', 'with', 'for', 'you', 'will', 'are', 'that', 'this', 'our', 'team', 'work']);
  const allWords = new Set([
    ...Object.keys(freqA).filter(w => !stopWords.has(w)),
    ...Object.keys(freqB).filter(w => !stopWords.has(w))
  ]);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  allWords.forEach(word => {
    const valA = freqA[word] || 0;
    const valB = freqB[word] || 0;
    dotProduct += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  });

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
};

const analyzeJobMatch = (resumeText, jobText) => {
  const rawSimilarity = getCosineSimilarity(resumeText, jobText);
  
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobText);

  // Intersects
  const matchingSkills = resumeSkills.technical.filter(s => jobSkills.technical.includes(s));
  const missingSkills = jobSkills.technical.filter(s => !resumeSkills.technical.includes(s));

  // Compute a weighted match score
  let matchScore = rawSimilarity * 100;
  if (jobSkills.technical.length > 0) {
    const skillRatio = matchingSkills.length / jobSkills.technical.length;
    matchScore = (matchScore * 0.4) + (skillRatio * 60.0);
  }
  
  matchScore = Math.min(100.0, Math.max(0.0, Math.round(matchScore * 10) / 10));

  // Find missing keywords
  const tokenize = (text) => text.toLowerCase().match(/\b[a-z]{3,15}\b/g) || [];
  const resumeWords = new Set(tokenize(resumeText));
  const jobWords = new Set(tokenize(jobText));
  const missingKeywords = [...jobWords].filter(w => !resumeWords.has(w) && (TECH_SKILLS.includes(w) || SOFT_SKILLS.includes(w))).slice(0, 10);

  const suggestions = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Incorporate missing tech skills: ${missingSkills.slice(0, 4).join(", ")}.`);
  }
  if (matchingSkills.length < 3) {
    suggestions.push("Your resume does not reflect the core technologies requested in the description.");
  } else {
    suggestions.push("You have a strong base of matching technologies. Focus on linking them directly to business achievements in your bullets.");
  }

  return {
    matchScore,
    matchingSkills,
    missingKeywords,
    suggestions
  };
};

module.exports = {
  extractTextFromBuffer,
  extractContactInfo,
  segmentResumeSections,
  extractSkills,
  calculateATSScore,
  analyzeJobMatch
};
