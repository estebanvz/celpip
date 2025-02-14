const fs = require('fs');
const path = require('path');

async function processJsonAndFolders(jsonFilePath, examPagesPath, templateFile) {
  try {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON data must be an array.');
    }

    // Iterate over each exam in the JSON data
    for (const exam of jsonData) {
      const examId = exam.id; // Main exam ID
      if (!examId) {
        console.warn('Exam missing "id" property:', exam);
        continue; // Skip to the next exam
      }

      // Create the exam directory (no [id].astro file here)
      const examDir = path.join(examPagesPath, examId);

      if (!fs.existsSync(examDir)) {
        fs.mkdirSync(examDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Process each question within the exam
      for (const question of exam.questions) {
        const questionId = question.id;
        if (!questionId) {
          console.warn(`Question missing "id" property in exam "${examId}":`, question);
          continue; // Skip to the next question
        }

        const questionDir = path.join(examDir, questionId);
        const questionPage = path.join(questionDir, "[id].astro");

        if (!fs.existsSync(questionDir)) {
          fs.mkdirSync(questionDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        if (!fs.existsSync(questionPage)) {
          fs.copyFileSync(templateFile, questionPage); // Copy the template file
          console.log(`Copied: ${templateFile} -> ${questionPage}`);
          replaceIdInAstroFile(questionPage, questionId); // Replace placeholder with the question ID
        }
      }
    }

    console.log('Processing complete.');
  } catch (err) {
    console.error('Error:', err);
  }
}

function replaceIdInAstroFile(filePath, newId) {
  try {
    let data = fs.readFileSync(filePath, 'utf8');
    // Replace all occurrences of {REPLACEID} with newId
    const updatedData = data.replace(/{REPLACEID}/g, newId);
    fs.writeFileSync(filePath, updatedData, 'utf8');
  } catch (error) {
    throw new Error(`Error processing file: ${error.message}`);
  }
}

// Example usage:
const jsonFilePath = 'listening/src/data/exams.json'; // Replace with your JSON file path
const examPagesPath = 'listening/src/pages/exam'; // Replace with the path to your source folders
const templateFile = 'listening/src/layouts/[id].astro'; // Replace with the path to your destination folders

processJsonAndFolders(jsonFilePath, examPagesPath, templateFile);