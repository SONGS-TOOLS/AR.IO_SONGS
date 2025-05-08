#!/usr/bin/env node

/**
 * Script to create a new Architecture Decision Record (ADR)
 * 
 * Usage: npm run adr:new "Decision Title"
 * 
 * This will create a new ADR file using the template and incrementing the number.
 */

const fs = require('fs');
const path = require('path');

// Get the decision title from the command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide a decision title');
  console.error('Usage: npm run adr:new "Decision Title"');
  process.exit(1);
}

const title = args[0];
const adrDirPath = path.join(__dirname, '..', 'adr');

// Make sure the ADR directory exists
if (!fs.existsSync(adrDirPath)) {
  fs.mkdirSync(adrDirPath, { recursive: true });
  console.log('✅ Created ADR directory');
}

// Find the highest numbered ADR
let highestNum = 0;
try {
  const files = fs.readdirSync(adrDirPath);
  for (const file of files) {
    if (file.match(/^ADR-(\d{3})/)) {
      const num = parseInt(file.substring(4, 7), 10);
      if (num > highestNum) {
        highestNum = num;
      }
    }
  }
} catch (err) {
  console.error('❌ Error reading ADR directory:', err);
  process.exit(1);
}

// Create a kebab-case version of the title for the filename
const kebabTitle = title
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, '-');

// Create the new ADR number (increment highest by 1)
const newNum = highestNum + 1;
const adrNum = newNum.toString().padStart(3, '0');
const filename = `ADR-${adrNum}-${kebabTitle}.md`;
const filepath = path.join(adrDirPath, filename);

// Read the template
const templatePath = path.join(adrDirPath, 'ADR-000-template.md');
if (!fs.existsSync(templatePath)) {
  console.error('❌ Error: Template file not found at', templatePath);
  process.exit(1);
}

let template;
try {
  template = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.error('❌ Error reading template:', err);
  process.exit(1);
}

// Replace template placeholders
const content = template
  .replace(/^# ADR-000: Template for Architecture Decision Records/, `# ADR-${adrNum}: ${title}`)
  .replace(/^`PROPOSED` \| `ACCEPTED` \| `DEPRECATED` \| `SUPERSEDED by ADR-XXX`/, '`PROPOSED`');

// Write the new ADR file
try {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Created new ADR: ${filename}`);
} catch (err) {
  console.error('❌ Error writing ADR file:', err);
  process.exit(1);
}

console.log(`📝 Edit your ADR at: ${filepath}`); 