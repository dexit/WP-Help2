export default function Sidebar() {
    return (
        <aside className="w-64 bg-[#1e1e1e] text-slate-300 flex-shrink-0 flex flex-col">
            <div className="p-4 flex items-center gap-3 border-b border-white/10 mb-4">
                <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-xl">settings_ethernet</span>
                </div>
                <div>
                    <h1 className="text-sm font-bold text-white leading-tight">WP Admin</h1>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">Site Manager</p>
                </div>
            </div>
            <nav className="flex-1 px-2 space-y-1">
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">dashboard</span>
                    <span className="text-sm">Dashboard</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">article</span>
                    <span className="text-sm">Posts</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">image</span>
                    <span className="text-sm">Media</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">description</span>
                    <span className="text-sm">Pages</span>
                </a>
                <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">Tools</div>
                <a className="flex items-center gap-3 px-3 py-2 rounded bg-primary text-white" href="#">
                    <span className="material-symbols-outlined text-lg">api</span>
                    <span className="text-sm font-medium">Custom Routes</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">extension</span>
                    <span className="text-sm">Plugins</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors" href="#">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    <span className="text-sm">Settings</span>
                </a>
            </nav>
            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span>Collapse menu</span>
                </button>
            </div>
        </aside>
    );
}
