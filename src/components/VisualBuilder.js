export default function VisualBuilder({ route, onUpdate }) {
    if (!route) return null;

    const addAction = (type) => {
        const newAction = {
            id: Date.now().toString(),
            type,
            name: type === 'db_query' ? 'Get User Meta' : 'New Action',
            description: type === 'db_query' ? 'Query wp_usermeta where user_id matches request param.' : 'Description of the action',
        };
        const newActions = [...(route.actions || []), newAction];
        onUpdate({
            ...route,
            actions: newActions,
            associatedAction: newActions.length > 0 ? newActions[0].name.toLowerCase().replace(/\s+/g, '_') : 'N/A'
        });
    };

    const updateAction = (id, updates) => {
        const newActions = (route.actions || []).map(action =>
            action.id === id ? { ...action, ...updates } : action
        );
        onUpdate({ ...route, actions: newActions });
    };

    const deleteAction = (id) => {
        const newActions = (route.actions || []).filter(action => action.id !== id);
        onUpdate({ ...route, actions: newActions });
    };

    return (
        <div className="relative bg-slate-100 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[500px] overflow-hidden builder-grid flex flex-col items-center py-12 px-8">
            {/* Initial Trigger Node */}
            <div className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-4 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase">Trigger</p>
                        <h4 className="font-bold text-sm">Incoming Request</h4>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded p-2 text-xs font-mono text-slate-500 flex justify-between">
                    <span>Method:</span>
                    <span className="text-primary font-bold">{route.method}</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 size-8 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-sm">south</span>
                </div>
            </div>

            {route.actions && route.actions.map((action, index) => (
                <div key={action.id} className="flex flex-col items-center">
                    <div className="h-12 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden group hover:border-primary/50 transition-all relative">
                        <div className="bg-primary/5 px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                                {action.type.replace('_', ' ')}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => deleteAction(action.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-sm">settings</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex gap-4">
                            <div className="size-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined">
                                    {action.type === 'db_query' ? 'database' : action.type === 'mail' ? 'mail' : 'terminal'}
                                </span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    className="w-full font-bold text-sm bg-transparent border-none p-0 focus:ring-0"
                                    value={action.name}
                                    onChange={(e) => updateAction(action.id, { name: e.target.value })}
                                    placeholder="Action Name"
                                />
                                <textarea
                                    className="w-full text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 resize-none h-12"
                                    value={action.description}
                                    onChange={(e) => updateAction(action.id, { description: e.target.value })}
                                    placeholder="Describe what this action does..."
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 size-8 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-sm">south</span>
                        </div>
                    </div>
                </div>
            ))}

            <div className="h-12 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
            {/* Drop Target */}
            <div className="w-80 h-24 border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-2 group hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary/50 group-hover:scale-110 transition-transform">add_circle</span>
                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Drop Action Block Here</span>
            </div>

            {/* Floating Action Inserter Panel */}
            <div className="absolute bottom-8 left-8 flex gap-3">
                <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex gap-1">
                    <button
                        onClick={() => addAction('db_query')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                    >
                        <span className="material-symbols-outlined text-primary">database</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-primary">DB</span>
                    </button>
                    <button
                        onClick={() => addAction('mail')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                    >
                        <span className="material-symbols-outlined text-amber-500">mail</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-amber-500">Mail</span>
                    </button>
                    <button
                        onClick={() => addAction('script')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                    >
                        <span className="material-symbols-outlined text-purple-500">javascript</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-purple-500">Script</span>
                    </button>
                    <button
                        onClick={() => addAction('output')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex flex-col items-center gap-1 group"
                    >
                        <span className="material-symbols-outlined text-green-500">terminal</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 group-hover:text-green-500">Output</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
