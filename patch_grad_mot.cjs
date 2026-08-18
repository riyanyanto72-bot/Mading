const fs = require('fs');
let content = fs.readFileSync('src/components/Graduation/GraduationPortal.tsx', 'utf8');

const motivationBlock = `      {/* Motivation Ticker */}
      {settings.graduation_motivation && (
        <div className="overflow-hidden bg-indigo-950 text-amber-300 py-3 rounded-2xl border border-indigo-900 shadow-sm flex items-center px-4 mb-6">
          <Sparkles className="w-5 h-5 flex-shrink-0 mr-3 animate-pulse text-amber-400" />
          <div className="overflow-hidden whitespace-nowrap w-full">
            <p className="inline-block animate-marquee font-bold tracking-wide text-sm">
              {settings.graduation_motivation}
            </p>
          </div>
        </div>
      )}
      `;

// Insert it before the search result or search form. Let's place it right before `{searchResult && (`
content = content.replace(/\{searchResult && \(/, motivationBlock + '\n      {searchResult && (');

fs.writeFileSync('src/components/Graduation/GraduationPortal.tsx', content);
