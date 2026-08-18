const fs = require('fs');
let content = fs.readFileSync('src/components/Graduation/GraduationPortal.tsx', 'utf8');

const regex = /\{\/\* Student Info & Stats Grid \*\/\}[\s\S]*?\{\/\* Bottom Actions \*\/\}/;

content = content.replace(regex, `{/* Bottom Actions */}`);

fs.writeFileSync('src/components/Graduation/GraduationPortal.tsx', content);
