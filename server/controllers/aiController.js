const fs = require('fs');
const Resume = require('../models/Resume');
const CoverLetter = require('../models/CoverLetter');
const ai = require('../services/ai');

const improveResume = async (req, res) => {
  try {
    let resume = null;
    if (global.dbMode === 'mock') {
      resume = global.mockDB.resumes.find(r => r._id === req.params.resumeId && r.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    }

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    let resumeText = '';
    if (fs.existsSync(resume.filePath)) {
      resumeText = fs.readFileSync(resume.filePath, 'utf-8');
    }
    if (!resumeText) {
      resumeText = `${resume.parsedContent.summary} ${resume.parsedContent.skills.technical.join(' ')}`;
    }

    const improvedResult = await ai.aiImproveResume(resumeText);
    res.json(improvedResult);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const generateCoverLetter = async (req, res) => {
  try {
    const { resume_id, company_name, job_title, job_description, tone } = req.body;

    let resume = null;
    if (global.dbMode === 'mock') {
      resume = global.mockDB.resumes.find(r => r._id === resume_id && r.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: resume_id, userId: req.user.id });
    }

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    let resumeText = '';
    if (fs.existsSync(resume.filePath)) {
      resumeText = fs.readFileSync(resume.filePath, 'utf-8');
    }
    if (!resumeText) {
      resumeText = `${resume.parsedContent.summary} ${resume.parsedContent.skills.technical.join(' ')}`;
    }

    const letterText = await ai.aiGenerateCoverLetter(
      resumeText,
      company_name,
      job_title,
      job_description || '',
      tone || 'professional'
    );

    if (global.dbMode === 'mock') {
      const mockLetter = {
        _id: 'mock_letter_' + Date.now(),
        resumeId: resume._id,
        companyName: company_name,
        jobTitle: job_title,
        letterText,
        tone: tone || 'professional',
        createdAt: new Date()
      };
      global.mockDB.coverLetters.push(mockLetter);

      return res.status(201).json({
        id: mockLetter._id,
        resume_id: mockLetter.resumeId,
        job_title: mockLetter.jobTitle,
        company_name: mockLetter.companyName,
        letter_text: mockLetter.letterText,
        tone: mockLetter.tone,
        created_at: mockLetter.createdAt
      });
    }

    const newLetter = new CoverLetter({
      resumeId: resume._id,
      companyName: company_name,
      jobTitle: job_title,
      letterText,
      tone: tone || 'professional'
    });

    await newLetter.save();

    res.status(201).json({
      id: newLetter._id,
      resume_id: newLetter.resumeId,
      job_title: newLetter.jobTitle,
      company_name: newLetter.companyName,
      letter_text: newLetter.letterText,
      tone: newLetter.tone,
      created_at: newLetter.createdAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getCoverLetters = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const userResumes = global.mockDB.resumes.filter(r => r.userId === req.user.id);
      const resumeIds = userResumes.map(r => r._id);
      const letters = global.mockDB.coverLetters.filter(l => resumeIds.includes(l.resumeId));

      const mapped = letters.map(l => ({
        id: l._id,
        resume_id: l.resumeId,
        job_title: l.jobTitle,
        company_name: l.companyName,
        letter_text: l.letterText,
        tone: l.tone,
        created_at: l.createdAt
      }));
      return res.json(mapped);
    }

    const userResumes = await Resume.find({ userId: req.user.id });
    const resumeIds = userResumes.map(r => r._id);

    const letters = await CoverLetter.find({ resumeId: { $in: resumeIds } }).sort({ createdAt: -1 });
    
    // Map to client schema format
    const mapped = letters.map(l => ({
      id: l._id,
      resume_id: l.resumeId,
      job_title: l.jobTitle,
      company_name: l.companyName,
      letter_text: l.letterText,
      tone: l.tone,
      created_at: l.createdAt
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const generateInterviewPrep = async (req, res) => {
  try {
    const { resume_id, job_title, job_description } = req.body;

    let resume = null;
    if (global.dbMode === 'mock') {
      resume = global.mockDB.resumes.find(r => r._id === resume_id && r.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: resume_id, userId: req.user.id });
    }

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    let resumeText = '';
    if (fs.existsSync(resume.filePath)) {
      resumeText = fs.readFileSync(resume.filePath, 'utf-8');
    }
    if (!resumeText) {
      resumeText = `${resume.parsedContent.summary} ${resume.parsedContent.skills.technical.join(' ')}`;
    }

    const questions = await ai.aiGenerateInterviewPrep(resumeText, job_title, job_description || '');
    
    res.status(201).json({
      id: Math.floor(Math.random() * 10000), // Mock numerical ID for client
      resume_id: resume._id,
      job_title,
      questions,
      created_at: new Date()
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const generateCareerRoadmap = async (req, res) => {
  try {
    let resume = null;
    if (global.dbMode === 'mock') {
      resume = global.mockDB.resumes.find(r => r._id === req.params.resumeId && r.userId === req.user.id);
    } else {
      resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.user.id });
    }

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    let resumeText = '';
    if (fs.existsSync(resume.filePath)) {
      resumeText = fs.readFileSync(resume.filePath, 'utf-8');
    }
    if (!resumeText) {
      resumeText = `${resume.parsedContent.summary} ${resume.parsedContent.skills.technical.join(' ')}`;
    }

    const roadmapData = await ai.aiGenerateCareerRoadmap(resumeText);
    
    res.status(201).json({
      id: Math.floor(Math.random() * 10000),
      resume_id: resume._id,
      roadmap_json: roadmapData,
      created_at: new Date()
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

module.exports = {
  improveResume,
  generateCoverLetter,
  getCoverLetters,
  generateInterviewPrep,
  generateCareerRoadmap
};
