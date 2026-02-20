/** @format */

// src/pages/ApiLogStats.jsx
import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

export const ApiLogStats = () => {
    const dataProvider = useDataProvider();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dataProvider
            .getApiLogStats()
            .then((response) => {
                setStats(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [dataProvider]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">API Statistics</h1>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h3>Total Requests</h3>
                    <p className="text-3xl font-bold">{stats?.totalRequests || 0}</p>
                </div>
                {/* Add more stat cards */}
            </div>
        </div>
    );
};
