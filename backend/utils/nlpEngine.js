const { seedResumes } = require('./mockData');

// Define standard skill lists for career recommendation
const CAREER_SKILLS = {
  'Web Developer': [
    'react', 'javascript', 'html', 'css', 'node.js', 'node', 'express', 'mongodb', 
    'typescript', 'next.js', 'vue', 'angular', 'tailwind', 'bootstrap', 'git', 'github', 
    'rest api', 'graphql', 'redux', 'webpack', 'frontend', 'backend', 'fullstack', 'sass'
  ],
  'Data Analyst': [
    'python', 'sql', 'tableau', 'power bi', 'excel', 'pandas', 'numpy', 'statistics', 
    'r', 'machine learning', 'data visualization', 'data cleaning', 'analytics', 'matplotlib', 
    'seaborn', 'scikit-learn', 'data modeling', 'powerbi', 'postgresql', 'mysql'
  ],
  'UI/UX Designer': [
    'figma', 'adobe xd', 'sketch', 'user research', 'wireframing', 'prototyping', 
    'usability testing', 'visual design', 'information architecture', 'personas', 
    'illustrator', 'photoshop', 'design systems', 'interaction design', 'heurisitcs', 'mockups'
  ],
  'DevOps Engineer': [
    'docker', 'kubernetes', 'aws', 'jenkins', 'ci/cd', 'linux', 'ansible', 'terraform', 
    'bash', 'nginx', 'git', 'gcp', 'azure', 'prometheus', 'grafana', 'cloud'
  ],
  'Marketing Specialist': [
    'seo', 'sem', 'google analytics', 'copywriting', 'email marketing', 'social media', 
    'content strategy', 'campaign', 'hubspot', 'lead generation', 'branding', 'market research'
  ],
  'Project Manager': [
    'agile', 'scrum', 'kanban', 'jira', 'trello', 'budgeting', 'risk management', 
    'roadmap', 'stakeholder', 'leadership', 'scrum master', 'planning', 'delivery'
  ]
};

// Grammar Audits: Action verbs & Filler words
const WEAK_OR_FILLER_WORDS = [
  'dynamic', 'motivated', 'detail-oriented', 'results-driven', 'synergy', 'go-getter', 
  'hardworking', 'passionate', 'team player', 'responsible for', 'assisted with', 'helped in'
];

const STRONG_ACTION_VERBS = [
  'achieved', 'spearheaded', 'implemented', 'designed', 'optimized', 'engineered', 
  'managed', 'automated', 'orchestrated', 'streamlined', 'transformed', 'delivered', 
  'initiated', 'increased', 'reduced', 'generated', 'expanded', 'launched'
];

// Helper to detect language
const detectLanguage = (text) => {
  const lowercase = text.toLowerCase();
  
  // Spanish keywords
  const esKeywords = ['experiencia', 'educación', 'habilidades', 'proyectos', 'correo', 'teléfono'];
  // French keywords
  const frKeywords = ['expérience', 'éducation', 'compétences', 'projets', 'téléphone', 'courriel'];
  // German keywords
  const deKeywords = ['berufserfahrung', 'ausbildung', 'kenntnisse', 'projekte', 'telefon', 'e-mail'];

  const countMatches = (list) => list.filter(word => lowercase.includes(word)).length;

  const esCount = countMatches(esKeywords);
  const frCount = countMatches(frKeywords);
  const deCount = countMatches(deKeywords);

  if (esCount > 2) return 'Spanish';
  if (frCount > 2) return 'French';
  if (deCount > 2) return 'German';
  return 'English';
};

// Main NLP parsing and scoring function
const analyzeResumeText = (text, userUploadedResumes = []) => {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const lowercaseText = cleanText.toLowerCase();
  
  // 1. Detect language
  const language = detectLanguage(text);

  // 2. Extract portfolio links (LinkedIn, GitHub, Portfolio)
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const githubRegex = /(github\.com\/[\w.-]+)/gi;
  const linkedinRegex = /(linkedin\.com\/in\/[\w.-]+)/gi;
  const portfolioRegex = /((?:https?:\/\/)?(?:www\.)?[\w.-]+\.(?:com|io|me|dev|net)(?:\/[\w.-]*)?)/gi;

  const emailMatch = cleanText.match(emailRegex);
  const phoneMatch = cleanText.match(phoneRegex);
  const githubMatches = cleanText.match(githubRegex);
  const linkedinMatches = cleanText.match(linkedinRegex);
  
  // Exclude common static resource URLs from being personal portfolios
  const allUrls = cleanText.match(portfolioRegex) || [];
  const excludedDomains = ['github.com', 'linkedin.com', 'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'w3.org', 'schema.org'];
  const portfolioUrls = allUrls.filter(url => {
    return !excludedDomains.some(domain => url.toLowerCase().includes(domain));
  });

  const links = {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    github: githubMatches ? `https://${githubMatches[0]}` : null,
    linkedin: linkedinMatches ? `https://${linkedinMatches[0]}` : null,
    portfolio: portfolioUrls.length > 0 ? portfolioUrls[0] : null
  };

  // 3. Extract sections and compute completeness score
  const sections = {
    summary: /summary|objective|profile|sobre mí|résumé|profil/gi.test(cleanText),
    experience: /experience|employment|work history|career|experiencia|expérience|berufserfahrung/gi.test(cleanText),
    education: /education|academic|university|degree|educación|éducation|ausbildung/gi.test(cleanText),
    skills: /skills|competencies|habilidades|compétences|kenntnisse/gi.test(cleanText),
    projects: /projects|portfolio|accomplishments|proyectos|projets|projekte/gi.test(cleanText)
  };

  let formattingScore = 40; // Base score
  if (sections.summary) formattingScore += 10;
  if (sections.experience) formattingScore += 15;
  if (sections.education) formattingScore += 15;
  if (sections.skills) formattingScore += 10;
  if (sections.projects) formattingScore += 10;

  // 4. Grammar & Content Analysis
  const detectedFiller = WEAK_OR_FILLER_WORDS.filter(word => lowercaseText.includes(word));
  const detectedActionVerbs = STRONG_ACTION_VERBS.filter(verb => lowercaseText.includes(verb));
  
  // Sentence structure checks (check for quantitative achievements like %, $, numbers)
  const sentences = cleanText.split(/[.!?]+/);
  let quantifiedCount = 0;
  sentences.forEach(sentence => {
    if (/\d+%\s*|\$\s*\d+|\b\d+\s*(?:percent|users|clients|revenue|hours|seconds|ms|years|developers|leads|increase|reduction)\b/i.test(sentence)) {
      quantifiedCount++;
    }
  });

  const grammarIssues = [];
  if (detectedFiller.length > 0) {
    grammarIssues.push({
      type: 'filler',
      message: `Avoid passive/filler words. Found: "${detectedFiller.slice(0, 3).join(', ')}". Replace with active results-oriented text.`,
      severity: 'warning'
    });
  }
  if (detectedActionVerbs.length < 4) {
    grammarIssues.push({
      type: 'verbs',
      message: `Weak action verb presence. Try using stronger verbs such as: "Spearheaded", "Optimized", or "Engineered" to show active leadership.`,
      severity: 'critical'
    });
  }
  if (quantifiedCount === 0) {
    grammarIssues.push({
      type: 'quantitative',
      message: 'Missing quantitative metrics. Resumes are 40% stronger when accomplishments are backed by numbers, percentages, or dollar amounts.',
      severity: 'critical'
    });
  }

  // 5. Skill Match & Missing Keywords (Checking all skills listed)
  const extractedSkills = [];
  const allKnownSkills = Object.values(CAREER_SKILLS).flat();
  const uniqueSkills = [...new Set(allKnownSkills)];

  uniqueSkills.forEach(skill => {
    // Escape regex characters
    const safeSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match word boundaries, but support things like node.js, C++
    const skillRegex = new RegExp(`(?:\\b|\\s)${safeSkill}(?:\\b|\\s|$)`, 'i');
    if (skillRegex.test(lowercaseText)) {
      extractedSkills.push(skill);
    }
  });

  // Calculate ATS Score
  // ATS scoring model: Skills (30%), Formatting & Sections (20%), Links/Contacts (15%), Grammar/Structure (20%), Quantitative Impact (15%)
  const skillMatchScore = Math.min(100, (extractedSkills.length / 10) * 100);
  const linksScore = (links.email ? 20 : 0) + (links.phone ? 20 : 0) + (links.linkedin ? 30 : 0) + (links.github ? 20 : 0) + (links.portfolio ? 10 : 0);
  const grammarScore = Math.max(20, 100 - (grammarIssues.length * 20));
  const quantScore = Math.min(100, quantifiedCount * 25);

  const atsScore = Math.round(
    (skillMatchScore * 0.3) +
    (formattingScore * 0.2) +
    (linksScore * 0.15) +
    (grammarScore * 0.2) +
    (quantScore * 0.15)
  );

  // 6. Career Recommendations & Skill Gaps
  const recommendations = [];
  Object.keys(CAREER_SKILLS).forEach(career => {
    const careerSkillList = CAREER_SKILLS[career];
    const matched = careerSkillList.filter(skill => extractedSkills.includes(skill));
    const missing = careerSkillList.filter(skill => !extractedSkills.includes(skill));
    
    // Score based on skills match
    const matchPercentage = Math.round((matched.length / Math.min(8, careerSkillList.length)) * 100);
    const finalPercentage = Math.min(100, Math.max(10, matchPercentage));

    recommendations.push({
      career,
      matchPercentage: finalPercentage,
      matchedSkills: matched.slice(0, 8),
      missingSkills: missing.slice(0, 6)
    });
  });

  // Sort recommendations by percentage
  recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
  const topCareer = recommendations[0] ? recommendations[0].career : 'Web Developer';

  // 7. Resume Heatmap Segments
  const heatmapSegments = [];
  const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 5);
  
  paragraphs.forEach((p, idx) => {
    let score = 'green'; // Strong
    let reason = 'Solid content block with good professional length.';

    const lowerP = p.toLowerCase();
    const words = p.split(/\s+/).length;
    const hasVerb = STRONG_ACTION_VERBS.some(verb => lowerP.includes(verb));
    const hasQuant = /\d+/.test(p);
    const isSectionHeader = p.length < 30 && /skills|experience|education|projects|summary|objective/i.test(p);

    if (isSectionHeader) {
      score = 'green';
      reason = 'Perfect section layout title.';
    } else if (words < 8) {
      score = 'red';
      reason = 'Content chunk is too brief. Expand this bullet point with clear action, impact, and results.';
    } else if (!hasVerb && !hasQuant) {
      score = 'red';
      reason = 'Passive sentence structure. Lacks active action verbs and measurable outcomes.';
    } else if (!hasQuant || detectedFiller.some(f => lowerP.includes(f))) {
      score = 'yellow';
      reason = 'Weak description. Incorporate concrete data points (%, $, time) or replace buzzwords with hard achievements.';
    }

    heatmapSegments.push({
      id: `seg-${idx}`,
      text: p,
      score,
      reason
    });
  });

  // 8. Link optimization tips
  const linkTips = {
    linkedin: links.linkedin 
      ? 'LinkedIn profile connected! Action Tip: Ensure your summary has keywords related to your target career and matches this resume\'s dates.'
      : 'LinkedIn profile missing. Action Tip: Linking a fully-optimized LinkedIn profile increases hiring rates by 71%.',
    github: links.github
      ? 'GitHub linked! Action Tip: Highlight your top 3 repos and write rich README files for your main React/Node projects.'
      : 'GitHub profile missing. Action Tip: Essential for Developers. Show off your clean coding habits and repository history.',
    portfolio: links.portfolio
      ? 'Personal site linked! Action Tip: Showcase direct live product links and interactive dashboards.'
      : 'Personal portfolio website missing. Action Tip: Having a personalized custom domain builds a highly premium personal brand.'
  };

  // 9. Ranking System
  // Compare ATS score anonymously against standard seeds + DB records
  const allScores = [...seedResumes.map(r => r.atsScore)];
  userUploadedResumes.forEach(r => {
    if (r.atsScore) allScores.push(r.atsScore);
  });
  allScores.push(atsScore);
  
  allScores.sort((a, b) => a - b);
  const index = allScores.indexOf(atsScore);
  const percentile = Math.round((index / (allScores.length - 1)) * 100);

  let rankText = 'Needs Improvement';
  if (percentile >= 85) rankText = 'Top 10%';
  else if (percentile >= 70) rankText = 'Top 25%';
  else if (percentile >= 40) rankText = 'Average';

  const ranking = {
    percentile,
    rankText,
    totalCompared: allScores.length,
    betterThan: percentile,
    careerAverage: Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
  };

  return {
    language,
    atsScore,
    links,
    linkTips,
    sections,
    grammarIssues,
    extractedSkills,
    careerRecommendations: recommendations,
    heatmapSegments,
    ranking,
    career: topCareer
  };
};

// Optimizer helper to rewrite sections
const generateSuggestionsAndRewrites = (targetCareer, resumeData) => {
  const currentSkills = resumeData.extractedSkills || [];
  const careerSkillList = CAREER_SKILLS[targetCareer] || CAREER_SKILLS['Web Developer'];
  const missing = careerSkillList.filter(skill => !currentSkills.includes(skill));

  const suggestions = {
    career: targetCareer,
    skillsToAdd: missing.slice(0, 6),
    bulletPointRewrites: [
      {
        before: 'Was responsible for working on the main website and adding new pages in React.',
        after: `Spearheaded migration of the core user interface to React.js, implementing custom state management that reduced page-load time by 32%.`
      },
      {
        before: 'Helped in cleaning up database issues and made API calls faster.',
        after: `Optimized critical database queries and structured Node/Express API routes, driving a 45% latency reduction under concurrent request load.`
      },
      {
        before: 'Worked in a team to design the user experience of our product.',
        after: `Collaborated in a cross-functional Agile team to formulate modern UX blueprints in Figma, accelerating prototyping workflows by 40%.`
      }
    ],
    profileDescriptionRewrite: `Highly analytical and results-driven ${targetCareer} with hands-on expertise building performant architectures. Proven track record of leveraging ${currentSkills.slice(0, 3).join(', ')} to drive business impact, streamline engineering workflows, and craft elegant digital solutions.`
  };

  return suggestions;
};

module.exports = {
  analyzeResumeText,
  generateSuggestionsAndRewrites,
  CAREER_SKILLS
};
