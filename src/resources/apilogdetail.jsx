/** @format */

import { Activity, ArrowLeft, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiLogService } from "../services/apiLogService";

const ApiLogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogDetail();
    }, [id]);

    const fetchLogDetail = async () => {
        try {
            const response = await apiLogService.getLogById(id);
            setLog(response.data);
        } catch (error) {
            console.error("Error fetching log details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        if (status >= 200 && status < 300) return "bg-green-100 text-green-800";
        if (status >= 300 && status < 400) return "bg-blue-100 text-blue-800";
        if (status >= 400 && status < 500) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const getMethodBadgeColor = (method) => {
        const colors = {
            GET: "bg-blue-100 text-blue-800",
            POST: "bg-green-100 text-green-800",
            PUT: "bg-yellow-100 text-yellow-800",
            PATCH: "bg-orange-100 text-orange-800",
            DELETE: "bg-red-100 text-red-800",
        };
        return colors[method] || "bg-gray-100 text-gray-800";
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!log) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>Log not found</p>
                <button
                    onClick={() => navigate("/api-logs")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Logs
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/api-logs")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft /> Back to Logs
                </button>
                <h1 className="text-2xl font-bold text-gray-800">API Log Details</h1>
            </div>

            {/* Main Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Method</label>
                        <span
                            className={`inline-block px-3 py-1 text-sm font-semibold rounded ${getMethodBadgeColor(
                                log.method,
                            )}`}
                        >
                            {log.method}
                        </span>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1">Status Code</label>
                        <span
                            className={`inline-block px-3 py-1 text-sm font-semibold rounded ${getStatusBadgeColor(
                                log.statusCode,
                            )}`}
                        >
                            {log.statusCode}
                        </span>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                            <Clock size={14} /> Response Time
                        </label>
                        <span className="text-lg font-semibold text-gray-800">{log.responseTime}ms</span>
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block mb-1 flex items-center gap-1">
                            <MapPin size={14} /> IP Address
                        </label>
                        <span className="text-lg font-semibold text-gray-800">{log.ipAddress}</span>
                    </div>
                </div>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity /> Request Details
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Full URL</label>
                            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded break-all">{log.fullUrl}</div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Path</label>
                            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{log.path}</div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Timestamp</label>
                            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                                {new Date(log.timestamp).toLocaleString("en-US", {
                                    dateStyle: "full",
                                    timeStyle: "long",
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">Origin</label>
                            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded break-all">
                                {log.origin || "N/A"}
                            </div>
                        </div>
                        {log.referer && (
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Referer</label>
                                <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded break-all">
                                    {log.referer}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Client Info</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-600 block mb-1">User Agent</label>
                            <div className="text-sm text-gray-800 bg-gray-50 p-2 rounded break-all">
                                {log.userAgent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Query Parameters */}
            {log.requestQuery && Object.keys(log.requestQuery).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Query Parameters</h3>
                    <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">
                        {JSON.stringify(log.requestQuery, null, 2)}
                    </pre>
                </div>
            )}

            {/* Request Body */}
            {log.requestBody && Object.keys(log.requestBody).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Request Body</h3>
                    <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">
                        {JSON.stringify(log.requestBody, null, 2)}
                    </pre>
                </div>
            )}

            {/* Response Body */}
            {log.responseBody && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Response Body</h3>
                    <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto max-h-96">
                        {JSON.stringify(log.responseBody, null, 2)}
                    </pre>
                </div>
            )}

            {/* Request Headers */}
            {log.requestHeaders && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Request Headers</h3>
                    <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto max-h-96">
                        {JSON.stringify(log.requestHeaders, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ApiLogDetail;
