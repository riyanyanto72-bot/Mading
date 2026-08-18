const fs = require('fs');
let content = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');

const madingReplacement = `{activeTab === 'mading' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Kelola Karya Mading</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3">Judul</th>
                  <th className="p-3">Penulis</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-slate-100">
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3">{post.author_name}</td>
                    <td className="p-3">
                      <span className={\`px-2 py-1 rounded text-xs font-bold \${post.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}\`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => {
                        const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
                        onUpdatePosts(posts.map(p => p.id === post.id ? {...p, status: newStatus} : p));
                      }} className="px-2 py-1 border rounded text-xs font-bold mr-2">
                        {post.status === 'PUBLISHED' ? 'Draft' : 'Publish'}
                      </button>
                      <button onClick={() => onUpdatePosts(posts.filter(p => p.id !== post.id))} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}`;

content = content.replace(/\{activeTab === 'mading' && \([\s\S]*?\}\s*\)\}/, madingReplacement);

fs.writeFileSync('src/components/Admin/AdminDashboard.tsx', content);
