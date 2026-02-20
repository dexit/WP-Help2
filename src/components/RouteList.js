export default function RouteList({ routes, onEdit, onDelete }) {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Custom Routes</h3>
                    <p className="text-sm text-slate-500">Overview of all active REST API endpoints registered through this manager.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-base">filter_list</span>
                    </button>
                    <button className="p-2 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
                        <span className="material-symbols-outlined text-base">refresh</span>
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Route Path</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Method</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Associated Action</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {routes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No custom routes found. Create one to get started.</td>
                            </tr>
                        ) : (
                            routes.map((route) => (
                                <tr key={route.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-mono text-sm font-semibold ${route.status === 'Draft' ? 'text-slate-600 italic' : 'text-primary'}`}>
                                                /{route.version}/{route.path.replace(/^\//, '')}
                                            </span>
                                            {route.status !== 'Draft' && <span className="material-symbols-outlined text-xs text-slate-300">link</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 ${route.method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'} text-[10px] font-bold rounded`}>
                                            {route.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{route.associatedAction || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${route.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                                            <span className={`size-2 rounded-full ${route.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                            {route.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(route)}
                                                className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded hover:bg-primary/10"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-primary transition-colors rounded hover:bg-primary/10">
                                                <span className="material-symbols-outlined text-lg">content_copy</span>
                                            </button>
                                            <button
                                                onClick={() => onDelete(route.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
