const fs = require('fs');
const content = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');

// remove SubjectDef and SubjectGrade from imports
let newContent = content.replace(/SubjectDef,\s*/g, '');
newContent = newContent.replace(/SubjectGrade,\s*/g, '');
newContent = newContent.replace(/SubjectDef/g, 'any');
newContent = newContent.replace(/SubjectGrade/g, 'any');

// Remove the input mapel tab and state
newContent = newContent.replace(/  const \[availableSubjects, setAvailableSubjects\] = useState<any\[\]>\(settings.available_subjects || \[\]\);\n/g, '');

newContent = newContent.replace(/average_score:[\s\S]*?total_score:[\s\S]*?,/g, '');

// Since this file is large, I'll use simple string replacements for the tabs.
newContent = newContent.replace(/        <button\s*onClick={\(\) => setActiveTab\('mapel'\)}[\s\S]*?<\/button>/g, '');
newContent = newContent.replace(/\{\/\* ========================================================= \*\/\}\s*\{\/\* TAB 4: KELOLA MATA PELAJARAN \*\/\}\s*\{\/\* ========================================================= \*\/\}\s*\{activeTab === 'mapel' && \([\s\S]*?\}\s*\)\}/, '');

fs.writeFileSync('src/components/Admin/AdminDashboard.tsx', newContent);
