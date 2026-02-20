export default function Header({ onCreateRoute }) {
    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">REST Route & Action Manager</h2>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
                <nav className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    <a className="hover:text-primary transition-colors" href="#">All Routes</a>
                    <a className="hover:text-primary transition-colors" href="#">Logs</a>
                    <a className="hover:text-primary transition-colors" href="#">Documentation</a>
                </nav>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">search</span>
                    </span>
                    <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search endpoints..." type="text"/>
                </div>
                <button
                    onClick={onCreateRoute}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Create New Route
                </button>
                <div className="ml-2 size-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    <img alt="Admin" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBelm1wUyc9TDyzImEaQm53HRHS6lpHGT8glDeJQhZQmMWYRiB_sVH2Cl0u_3KWLgcjEUlAObAl-Eh9zeZFfZ_dZPzJMhkGB78CJ-Ms6uib_SBdPsSgp3lXzXZPMh1ns2bnTii_cvP5BPRoELXsSrgW82ptbFO1mIMby3BtKJ0MAI07GdvpHSKM-9va5qGPAYc8iEtCROsHQ-tZ00hoyRrwNuI3YfSLdHSaNjsb3UsZOkRUdBVDCq6o8fDHpvEhSDirSpyLBeYXOGw"/>
                </div>
            </div>
        </header>
    );
}
