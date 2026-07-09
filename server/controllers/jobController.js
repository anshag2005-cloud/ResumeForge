const fs = require('fs');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const JobMatch = require('../models/JobMatch');
const nlp = require('../utils/nlp');

const matchResumeToJob = async (req, res) => {
  try {
    const { resume_id, title, company, job_content } = req.body;

    let resume = null;
    if (global.dbMode === 'mock') {
      resume = global.mockDB.resumes.find(r => r._id === resume_id && r.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: resume_id, userId: req.user.id });
    }

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found or does not belong to active user.' });
    }

    // Read resume text from local file path
    let resumeText = '';
    if (fs.existsSync(resume.filePath)) {
      resumeText = fs.readFileSync(resume.filePath, 'utf-8');
    }
    
    // Fallback to parsedContent concatenation if file read fails
    if (!resumeText) {
      resumeText = `${resume.parsedContent.summary} ${resume.parsedContent.skills.technical.join(' ')}`;
    }

    // Perform Javascript-based TF-IDF cosine matching
    const matchResult = nlp.analyzeJobMatch(resumeText, job_content);

    if (global.dbMode === 'mock') {
      const mockJdId = 'mock_jd_' + Date.now();
      const newJd = {
        _id: mockJdId,
        userId: req.user.id,
        title,
        company: company || '',
        textContent: job_content,
        createdAt: new Date()
      };
      global.mockDB.jobDescriptions.push(newJd);

      const mockMatchId = 'mock_match_' + Date.now();
      const newMatch = {
        _id: mockMatchId,
        resumeId: resume._id,
        jobId: mockJdId,
        matchScore: matchResult.matchScore,
        matchingSkills: matchResult.matchingSkills,
        missingKeywords: matchResult.missingKeywords,
        suggestions: matchResult.suggestions,
        createdAt: new Date()
      };
      global.mockDB.jobMatches.push(newMatch);

      return res.status(201).json({
        id: newMatch._id,
        resume_id: newMatch.resumeId,
        job_id: newMatch.jobId,
        match_score: newMatch.matchScore,
        matching_skills: newMatch.matchingSkills,
        missing_keywords: newMatch.missingKeywords,
        suggestions: newMatch.suggestions,
        created_at: newMatch.createdAt
      });
    }

    // Save Job Description
    const newJd = new JobDescription({
      userId: req.user.id,
      title,
      company: company || '',
      textContent: job_content
    });
    await newJd.save();

    // Save Job Match
    const newMatch = new JobMatch({
      resumeId: resume._id,
      jobId: newJd._id,
      matchScore: matchResult.matchScore,
      matchingSkills: matchResult.matchingSkills,
      missingKeywords: matchResult.missingKeywords,
      suggestions: matchResult.suggestions
    });
    await newMatch.save();

    // Return object mapped to client formats
    res.status(201).json({
      id: newMatch._id,
      resume_id: newMatch.resumeId,
      job_id: newMatch.jobId,
      match_score: newMatch.matchScore,
      matching_skills: newMatch.matchingSkills,
      missing_keywords: newMatch.missingKeywords,
      suggestions: newMatch.suggestions,
      created_at: newMatch.createdAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getMatchHistory = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const userResumes = global.mockDB.resumes.filter(r => r.userId === req.user.id);
      const resumeIds = userResumes.map(r => r._id);

      const matches = global.mockDB.jobMatches.filter(m => resumeIds.includes(m.resumeId));
      
      const mapped = matches.map(m => ({
        id: m._id,
        resume_id: m.resumeId,
        job_id: m.jobId,
        match_score: m.matchScore,
        matching_skills: m.matchingSkills,
        missing_keywords: m.missingKeywords,
        suggestions: m.suggestions,
        created_at: m.createdAt
      }));
      
      return res.json(mapped);
    }

    // Fetch matches associated with any of the user's resumes
    const userResumes = await Resume.find({ userId: req.user.id });
    const resumeIds = userResumes.map(r => r._id);

    const matches = await JobMatch.find({ resumeId: { $in: resumeIds } }).sort({ createdAt: -1 });
    
    // Map to client format
    const mapped = matches.map(m => ({
      id: m._id,
      resume_id: m.resumeId,
      job_id: m.jobId,
      match_score: m.matchScore,
      matching_skills: m.matchingSkills,
      missing_keywords: m.missingKeywords,
      suggestions: m.suggestions,
      created_at: m.createdAt
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

module.exports = {
  matchResumeToJob,
  getMatchHistory
};
