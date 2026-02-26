export default function RouteInspector({ route, onUpdate }) {
    if (!route) return null;

    const addParam = () => {
        const newParam = { name: 'new_param', type: 'string', required: false };
        onUpdate({ ...route, params: [...(route.params || []), newParam] });
    };

    const updateParam = (index, updates) => {
        const newParams = [...(route.params || [])];
        newParams[index] = { ...newParams[index], ...updates };
        onUpdate({ ...route, params: newParams });
    };

    const deleteParam = (index) => {
        const newParams = (route.params || []).filter((_, i) => i !== index);
        onUpdate({ ...route, params: newParams });
    };

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col flex-shrink-0">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white uppercase tracking-tighter text-sm">Route Inspector</h3>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded">EDITING</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Namespace</label>
                        <input
                            className="w-full text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-primary"
                            type="text"
                            value={route.namespace || ''}
                            onChange={(e) => onUpdate({ ...route, namespace: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Path</label>
                        <input
                            className="w-full text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-primary"
                            type="text"
                            value={route.path || ''}
                            onChange={(e) => onUpdate({ ...route, path: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Version</label>
                        <div className="flex gap-2">
                            <input
                                className="w-16 text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                type="text"
                                value={route.version || ''}
                                onChange={(e) => onUpdate({ ...route, version: e.target.value })}
                            />
                            <div className="flex-1 px-3 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-400">
                                Base: {route.namespace}/{route.version}/
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Security Settings</h4>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Require Auth</span>
                            <input
                                checked={!!route.requireAuth}
                                onChange={(e) => onUpdate({ ...route, requireAuth: e.target.checked })}
                                className="form-checkbox text-primary rounded-md border-slate-300"
                                type="checkbox"
                            />
                        </label>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">Permission Callback</label>
                            <select
                                value={route.permissionCallback || 'is_user_logged_in'}
                                onChange={(e) => onUpdate({ ...route, permissionCallback: e.target.value })}
                                className="w-full text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-primary"
                            >
                                <option value="is_user_logged_in">is_user_logged_in</option>
                                <option value="manage_options">manage_options</option>
                                <option value="edit_posts">edit_posts</option>
                                <option value="custom">Custom Function...</option>
                            </select>
                        </div>
                        {route.permissionCallback === 'custom' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5">Function Name</label>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg focus:ring-primary"
                                    value={route.customPermissionCallback || ''}
                                    placeholder="my_custom_permission_check"
                                    onChange={(e) => onUpdate({ ...route, customPermissionCallback: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Request Params</h4>
                    </div>
                    <div className="space-y-4">
                        {route.params && route.params.map((param, index) => (
                            <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2 relative group">
                                <button
                                    onClick={() => deleteParam(index)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded focus:ring-primary p-1"
                                        value={param.name}
                                        onChange={(e) => updateParam(index, { name: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Type</label>
                                        <select
                                            className="w-full text-[10px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded p-1"
                                            value={param.type}
                                            onChange={(e) => updateParam(index, { type: e.target.value })}
                                        >
                                            <option value="string">STRING</option>
                                            <option value="integer">INTEGER</option>
                                            <option value="boolean">BOOLEAN</option>
                                            <option value="number">NUMBER</option>
                                            <option value="array">ARRAY</option>
                                            <option value="object">OBJECT</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-4">
                                        <label className="flex items-center gap-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox size-3 text-primary rounded border-slate-300"
                                                checked={!!param.required}
                                                onChange={(e) => updateParam(index, { required: e.target.checked })}
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Req</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addParam}
                            className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                        >
                            + Add New Parameter
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Preview</h4>
                <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-300 overflow-hidden">
                    <span className="text-purple-400">register_rest_route</span>( <span className="text-green-400">'{route.namespace || 'namespace'}/{route.version || 'v1'}'</span>, <span className="text-green-400">'{route.path || '/'}'</span>, [ ... ] );
                </div>
            </div>
        </aside>
    );
}
