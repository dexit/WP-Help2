import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RouteList from './components/RouteList';
import VisualBuilder from './components/VisualBuilder';
import RouteInspector from './components/RouteInspector';

export default function App() {
    const [routes, setRoutes] = useState([]);
    const [activeRoute, setActiveRoute] = useState(null);
    const [view, setView] = useState('list'); // 'list' or 'builder'

    useEffect(() => {
        apiFetch({ path: '/wp-rr-manager/v1/routes' }).then((data) => {
            setRoutes(data || []);
        });
    }, []);

    const saveRoutes = (newRoutes) => {
        setRoutes(newRoutes);
        apiFetch({
            path: '/wp-rr-manager/v1/routes',
            method: 'POST',
            data: newRoutes,
        });
    };

    const handleCreateRoute = () => {
        const newRoute = {
            id: Date.now().toString(),
            namespace: 'custom-api',
            path: '/new-route',
            method: 'GET',
            associatedAction: 'N/A',
            status: 'Draft',
            active: false,
            version: 'v1',
            requireAuth: true,
            permissionCallback: 'is_user_logged_in',
            params: [],
            actions: []
        };
        const newRoutes = [...routes, newRoute];
        saveRoutes(newRoutes);
        setActiveRoute(newRoute);
        setView('builder');
    };

    const handleEditRoute = (route) => {
        setActiveRoute(route);
        setView('builder');
    };

    const handleDeleteRoute = (id) => {
        const newRoutes = routes.filter(r => r.id !== id);
        saveRoutes(newRoutes);
    };

    const handleUpdateActiveRoute = (updates) => {
        const updatedRoute = { ...activeRoute, ...updates };
        setActiveRoute(updatedRoute);
        const newRoutes = routes.map(r => r.id === updatedRoute.id ? updatedRoute : r);
        setRoutes(newRoutes);
    };

    const handleDeploy = () => {
        const updatedRoute = { ...activeRoute, status: 'Active', active: true };
        const newRoutes = routes.map(r => r.id === updatedRoute.id ? updatedRoute : r);
        saveRoutes(newRoutes);
        setActiveRoute(updatedRoute);
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Header onCreateRoute={handleCreateRoute} />

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark">
                        {view === 'list' ? (
                            <RouteList
                                routes={routes}
                                onEdit={handleEditRoute}
                                onDelete={handleDeleteRoute}
                            />
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Visual Route Builder</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setView('list')}
                                            className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium"
                                        >
                                            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to List
                                        </button>
                                        <button
                                            onClick={handleDeploy}
                                            className="text-sm flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg font-medium"
                                        >
                                            <span className="material-symbols-outlined text-sm">save</span> Deploy Changes
                                        </button>
                                    </div>
                                </div>
                                <VisualBuilder route={activeRoute} onUpdate={handleUpdateActiveRoute} />
                            </div>
                        )}
                    </div>

                    {view === 'builder' && (
                        <RouteInspector route={activeRoute} onUpdate={handleUpdateActiveRoute} />
                    )}
                </div>
            </main>
        </div>
    );
}
