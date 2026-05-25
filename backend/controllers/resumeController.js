const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Resume = require('../models/Resume');
const { analyzeResumeText, generateSuggestionsAndRewrites } = require('../utils/nlpEngine');

// Extract text from buffer based on mimetype
const extractTextFromBuffer = async (buffer, mimetype, originalname) => {
  const extension = originalname.split('.').pop().toLowerCase();
  
  if (mimetype === 'application/pdf' || extension === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    extension === 'docx'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimetype === 'text/plain' || extension === 'txt') {
    return buffer.toString('utf8');
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT resumes.');
  }
};

exports.uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user || null; // Auth is optional for upload

    console.log(`Processing file: ${originalname}, type: ${mimetype}, size: ${buffer.length} bytes`);

    // 1. Text Extraction
    let extractedText = '';
    try {
      extractedText = await extractTextFromBuffer(buffer, mimetype, originalname);
    } catch (err) {
      console.error('File parsing failed:', err);
      return res.status(422).json({ 
        message: 'Could not extract text from this document. Please verify the file is not corrupted or password-protected.' 
      });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return res.status(422).json({
        message: 'The uploaded file appears to contain too little or unreadable text. Please make sure it is not scanned/image-only.'
      });
    }

    // 2. Fetch other resumes for candidate ranking comparison
    const allResumes = await Resume.find({});

    // 3. AI Analysis via NLP Engine
    const analysisResults = analyzeResumeText(extractedText, allResumes);

    // 4. Save to Database
    const savedResume = await Resume.create({
      userId,
      originalName: originalname,
      parsedText: extractedText,
      language: analysisResults.language,
      atsScore: analysisResults.atsScore,
      analysis: analysisResults,
      ranking: analysisResults.ranking
    });

    res.status(201).json({
      message: 'Resume analyzed successfully!',
      resumeId: savedResume._id,
      atsScore: savedResume.atsScore,
      originalName: savedResume.originalName,
      language: savedResume.language,
      analysis: savedResume.analysis,
      ranking: savedResume.ranking
    });

  } catch (error) {
    console.error('Resume processing error:', error);
    res.status(500).json({ message: 'Internal server error during resume analysis.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User context required.' });
    }

    const resumes = await Resume.find({ userId });
    
    // Return summaries to avoid huge payload sizes in listing
    const summaries = resumes.map(r => ({
      id: r._id,
      originalName: r.originalName,
      atsScore: r.atsScore,
      language: r.language,
      career: r.analysis?.career || 'Web Developer',
      createdAt: r.createdAt
    }));

    res.status(200).json(summaries);
  } catch (error) {
    console.error('Error fetching resume history:', error);
    res.status(500).json({ message: 'Failed to retrieve resume history.' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found.' });
    }

    // If resume belongs to a user, optionally check ownership
    if (resume.userId && resume.userId !== req.user) {
      return res.status(403).json({ message: 'Unauthorized access to this analysis.' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Failed to retrieve resume analysis details.' });
  }
};

exports.optimizeResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { career } = req.body;

    if (!career) {
      return res.status(400).json({ message: 'Target career role is required.' });
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume analysis not found.' });
    }

    const optimizationSuggestions = generateSuggestionsAndRewrites(career, resume.analysis);

    res.status(200).json(optimizationSuggestions);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ message: 'Failed to generate resume optimization suggestions.' });
  }
};
