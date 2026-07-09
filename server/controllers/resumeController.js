const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const nlp = require('../utils/nlp');
const ai = require('../services/ai');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'Please upload a resume file.' });
    }

    const filename = req.file.originalname;
    const buffer = req.file.buffer;
    
    // Extract raw text from buffer
    const rawText = nlp.extractTextFromBuffer(filename, buffer);
    if (!rawText || !rawText.trim()) {
      return res.status(422).json({ detail: 'Could not extract any text from the uploaded file.' });
    }

    // Parse resume fields (Gemini AI or fallback)
    const parsedJson = await ai.aiParseResume(rawText);

    // Save temporary local file for reference or multer fallback
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const localPath = path.join(uploadDir, `${req.user.id}_${Date.now()}_${filename}`);
    fs.writeFileSync(localPath, buffer);

    if (global.dbMode === 'mock') {
      const mockResumeId = 'mock_resume_' + Date.now();
      const newResume = {
        _id: mockResumeId,
        userId: req.user.id,
        filename,
        filePath: localPath,
        parsedContent: parsedJson,
        uploadedAt: new Date()
      };
      global.mockDB.resumes.push(newResume);

      const sections = nlp.segmentResumeSections(rawText);
      const skills = nlp.extractSkills(rawText);
      const contacts = nlp.extractContactInfo(rawText);
      const atsReportData = nlp.calculateATSScore(rawText, sections, skills, contacts);

      const newReport = {
        _id: 'mock_report_' + Date.now(),
        resumeId: mockResumeId,
        atsScore: atsReportData.atsScore,
        formattingScore: atsReportData.breakdown.formatting,
        keywordScore: atsReportData.breakdown.keywords,
        sectionScores: new Map(Object.entries(atsReportData.breakdown)),
        suggestions: atsReportData.suggestions,
        skillsFound: skills,
        createdAt: new Date()
      };
      global.mockDB.analyses.push(newReport);

      return res.status(201).json(newResume);
    }

    const newResume = new Resume({
      userId: req.user.id,
      filename,
      filePath: localPath,
      parsedContent: parsedJson
    });

    await newResume.save();

    // Generate ATS score report
    const sections = nlp.segmentResumeSections(rawText);
    const skills = nlp.extractSkills(rawText);
    const contacts = nlp.extractContactInfo(rawText);

    const atsReportData = nlp.calculateATSScore(rawText, sections, skills, contacts);

    const newReport = new ResumeAnalysis({
      resumeId: newResume._id,
      atsScore: atsReportData.atsScore,
      formattingScore: atsReportData.breakdown.formatting,
      keywordScore: atsReportData.breakdown.keywords,
      sectionScores: atsReportData.breakdown,
      suggestions: atsReportData.suggestions,
      skillsFound: skills
    });

    await newReport.save();

    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getResumes = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const resumes = global.mockDB.resumes.filter(r => r.userId === req.user.id);
      return res.json(resumes);
    }
    const resumes = await Resume.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const resume = global.mockDB.resumes.find(r => r._id === req.params.id && r.userId === req.user.id);
      if (!resume) {
        return res.status(404).json({ detail: 'Resume not found' });
      }
      return res.json(resume);
    }
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getResumeReport = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const resume = global.mockDB.resumes.find(r => r._id === req.params.id && r.userId === req.user.id);
      if (!resume) {
        return res.status(404).json({ detail: 'Resume not found' });
      }

      const report = global.mockDB.analyses.find(r => r.resumeId === req.params.id);
      if (!report) {
        return res.status(404).json({ detail: 'ATS Report not generated for this resume' });
      }

      return res.json({
        id: report._id,
        resume_id: report.resumeId,
        ats_score: report.atsScore,
        structure_score: report.formattingScore,
        keyword_score: report.keywordScore,
        section_scores: Object.fromEntries(report.sectionScores || new Map()),
        feedback: {
          suggestions: report.suggestions,
          skills_found: report.skillsFound
        },
        created_at: report.createdAt
      });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const report = await ResumeAnalysis.findOne({ resumeId: req.params.id });
    if (!report) {
      return res.status(404).json({ detail: 'ATS Report not generated for this resume' });
    }

    // Map Mongoose schema output format to match FastAPI client expectations
    res.json({
      id: report._id,
      resume_id: report.resumeId,
      ats_score: report.atsScore,
      structure_score: report.formattingScore,
      keyword_score: report.keywordScore,
      section_scores: Object.fromEntries(report.sectionScores || new Map()),
      feedback: {
        suggestions: report.suggestions,
        skills_found: report.skillsFound
      },
      created_at: report.createdAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const idx = global.mockDB.resumes.findIndex(r => r._id === req.params.id && r.userId === req.user.id);
      if (idx === -1) {
        return res.status(404).json({ detail: 'Resume not found' });
      }
      const resume = global.mockDB.resumes[idx];
      if (fs.existsSync(resume.filePath)) {
        try {
          fs.unlinkSync(resume.filePath);
        } catch (err) {
          console.error('File delete fail:', err);
        }
      }
      global.mockDB.resumes.splice(idx, 1);
      const repIdx = global.mockDB.analyses.findIndex(a => a.resumeId === req.params.id);
      if (repIdx !== -1) global.mockDB.analyses.splice(repIdx, 1);
      return res.status(204).json(null);
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    // Delete local file
    if (fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.error('File delete fail:', err);
      }
    }

    await Resume.deleteOne({ _id: req.params.id });
    await ResumeAnalysis.deleteOne({ resumeId: req.params.id });
    
    res.status(204).json(null);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResume,
  getResumeReport,
  deleteResume
};
