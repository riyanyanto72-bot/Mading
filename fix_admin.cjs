const fs = require('fs');
let content = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');

// I will remove the entire block related to editing a student, because the user wants to remove "data for inputting grades and subjects".
// What about editing the student's status or NISN? Let's just remove the grade fields.
content = content.replace(/\{gradingStudent && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*\)\}/g, '</div></div>)}');

fs.writeFileSync('src/components/Admin/AdminDashboard.tsx', content);
