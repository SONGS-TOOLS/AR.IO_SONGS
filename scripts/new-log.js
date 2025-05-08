#!/usr/bin/env node

/**
 * Script to create a new development log entry
 * 
 * Usage: 
 *   ./scripts/new-log.js "Log Title"
 *   ./scripts/new-log.js "Log Title" --type discovery
 * 
 * This will create a new log file using the standard template.
 */

const fs = require('fs');
const path = require('path');

// Get the title and optional type from command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Please provide a log title');
  console.error('Usage: ./scripts/new-log.js "Log Title" [--type discovery|meeting|demo]');
  process.exit(1);
}

const title = args[0];
let logType = 'daily';

// Check for type option
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--type' && i + 1 < args.length) {
    logType = args[i + 1].toLowerCase();
    i++; // Skip the next argument
  }
}

// Validate log type
const validLogTypes = ['daily', 'discovery', 'meeting', 'demo'];
if (!validLogTypes.includes(logType)) {
  console.error(`❌ Invalid log type: ${logType}`);
  console.error(`Valid types are: ${validLogTypes.join(', ')}`);
  process.exit(1);
}

// Get the current date in YYYY-MM-DD format
const now = new Date();
const dateStr = now.toISOString().split('T')[0];

// Create kebab-case version of the title for the filename
const kebabTitle = title
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .replace(/\s+/g, '-');

// Set up log directory and file path
let logDir;
if (logType === 'daily') {
  logDir = path.join(__dirname, '..', 'logs');
} else {
  logDir = path.join(__dirname, '..', 'logs', logType);
}

// Create directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
  console.log(`✅ Created directory: ${logDir}`);
}

const filename = `${dateStr}-${kebabTitle}.md`;
const filepath = path.join(logDir, filename);

// Check if file already exists
if (fs.existsSync(filepath)) {
  console.error(`❌ Error: Log file already exists at ${filepath}`);
  process.exit(1);
}

// Generate the log template
const template = `# ${dateStr} - ${title}

## Participants
- ${process.env.USER || 'Developer'}

## Context
Brief explanation of what this log entry covers

## Key Points
- Important discovery 1
- Key finding 2
- Technical insight 3

## Action Items
- [ ] Follow-up task 1
- [ ] Follow-up task 2

## References
- [Related resource](URL)
`;

// Write the log file
try {
  fs.writeFileSync(filepath, template, 'utf8');
  console.log(`✅ Created new log: ${filepath}`);
} catch (err) {
  console.error('❌ Error writing log file:', err);
  process.exit(1);
}

// Create an initial log entry
if (args.includes('--with-content')) {
  console.log("📝 Now edit your log to add your content.");
} 