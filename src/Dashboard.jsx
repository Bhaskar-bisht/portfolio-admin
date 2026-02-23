/** @format */

import { Activity, AlertCircle, CheckCircle, Mail, Server, TrendingUp, Zap } from "lucide-react";
import { useGetList } from "react-admin";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div
        style={{
            background: "#FFFFFF",
            borderRadius: "12px",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            flex: "1 1 160px",
            minWidth: 0,
        }}
    >
        <div
            style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
            }}
        >
            <Icon size={22} color={color} />
        </div>
        <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>{value}</div>
            <div style={{ fontSize: "0.78rem", color: "#6B7280", marginTop: 2 }}>{label}</div>
        </div>
    </div>
);

// ─── Method Badge ─────────────────────────────────────────────────────────────
const methodColors = {
    GET: { bg: "#DBEAFE", color: "#1E40AF" },
    POST: { bg: "#D1FAE5", color: "#065F46" },
    PUT: { bg: "#FEF3C7", color: "#92400E" },
    PATCH: { bg: "#FFEDD5", color: "#9A3412" },
    DELETE: { bg: "#FEE2E2", color: "#991B1B" },
};
const MethodBadge = ({ method }) => {
    const c = methodColors[method] || { bg: "#F3F4F6", color: "#374151" };
    return (
        <span
            style={{
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: "0.7rem",
                fontWeight: 700,
                background: c.bg,
                color: c.color,
                letterSpacing: "0.04em",
            }}
        >
            {method}
        </span>
    );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ code }) => {
    const bg =
        code >= 200 && code < 300
            ? "#D1FAE5"
            : code >= 300 && code < 400
              ? "#DBEAFE"
              : code >= 400 && code < 500
                ? "#FEF3C7"
                : "#FEE2E2";
    const color =
        code >= 200 && code < 300
            ? "#065F46"
            : code >= 300 && code < 400
              ? "#1E40AF"
              : code >= 400 && code < 500
                ? "#92400E"
                : "#991B1B";
    return (
        <span
            style={{ padding: "2px 8px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700, background: bg, color }}
        >
            {code}
        </span>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { data: users } = useGetList("users", { pagination: { page: 1, perPage: 1 } });
    const user = users?.[0];

    const { data: logs, isLoading: logsLoading } = useGetList("api-logs", {
        pagination: { page: 1, perPage: 8 },
        sort: { field: "timestamp", order: "DESC" },
    });

    const { data: allLogs } = useGetList("api-logs", {
        pagination: { page: 1, perPage: 500 },
        sort: { field: "timestamp", order: "DESC" },
    });

    const totalRequests = allLogs?.length || 0;
    const successCount = allLogs?.filter((l) => l.statusCode >= 200 && l.statusCode < 300).length || 0;
    const errorCount = allLogs?.filter((l) => l.statusCode >= 400).length || 0;

    return (
        // This div is what scrolls — no fixed height, let parent handle scroll
        <div
            style={{
                padding: "28px 32px",
                background: "#F9FAFB",
                minHeight: "100%",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#111827", margin: 0 }}>
                    👋 Welcome back{user?.name ? `, ${user.name}` : ""}!
                </h1>
                <p style={{ color: "#6B7280", marginTop: 4, fontSize: "0.875rem", margin: "4px 0 0" }}>
                    Here's what's happening with your portfolio backend.
                </p>
            </div>

            {/* User Card + Stats */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
                {/* User Card */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)",
                        borderRadius: 16,
                        padding: "24px 28px",
                        color: "#fff",
                        minWidth: 240,
                        flexShrink: 0,
                        boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                                fontWeight: 700,
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{user?.name || "Admin"}</div>
                            <div style={{ fontSize: "0.78rem", opacity: 0.8 }}>Administrator</div>
                        </div>
                    </div>
                    <div
                        style={{
                            borderTop: "1px solid rgba(255,255,255,0.2)",
                            paddingTop: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 7,
                        }}
                    >
                        <div
                            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", opacity: 0.9 }}
                        >
                            <Mail size={13} /> {user?.email || "—"}
                        </div>
                        {user?.currentPosition && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: "0.82rem",
                                    opacity: 0.9,
                                }}
                            >
                                <Zap size={13} /> {user.currentPosition}
                            </div>
                        )}
                        {user?.yearsOfExperience && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: "0.82rem",
                                    opacity: 0.9,
                                }}
                            >
                                <TrendingUp size={13} /> {user.yearsOfExperience} yrs experience
                            </div>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", flex: 1 }}>
                    <StatCard
                        icon={Activity}
                        label="Total Requests"
                        value={totalRequests}
                        color="#2563EB"
                        bg="#EFF6FF"
                    />
                    <StatCard icon={CheckCircle} label="Successful" value={successCount} color="#10B981" bg="#ECFDF5" />
                    <StatCard icon={AlertCircle} label="Errors" value={errorCount} color="#EF4444" bg="#FEF2F2" />
                </div>
            </div>

            {/* Recent API Logs */}
            <div
                style={{
                    background: "#FFFFFF",
                    borderRadius: 12,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    marginBottom: 32,
                }}
            >
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Server size={18} color="#2563EB" />
                        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>
                            Recent API Activity
                        </span>
                    </div>
                    <a
                        href="#/api-logs"
                        style={{ fontSize: "0.8rem", color: "#2563EB", textDecoration: "none", fontWeight: 600 }}
                    >
                        View all →
                    </a>
                </div>

                {logsLoading ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#F9FAFB" }}>
                                    {["Timestamp", "Method", "Path", "Status", "Time (ms)", "IP"].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "10px 16px",
                                                textAlign: "left",
                                                fontSize: "0.72rem",
                                                fontWeight: 700,
                                                color: "#374151",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.06em",
                                                whiteSpace: "nowrap",
                                                borderBottom: "1px solid #E5E7EB",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(logs || []).map((log, i) => (
                                    <tr
                                        key={log.id}
                                        style={{
                                            borderBottom: "1px solid #F3F4F6",
                                            background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = i % 2 === 0 ? "#FFFFFF" : "#FAFAFA")
                                        }
                                    >
                                        <td
                                            style={{
                                                padding: "10px 16px",
                                                fontSize: "0.78rem",
                                                color: "#6B7280",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td style={{ padding: "10px 16px" }}>
                                            <MethodBadge method={log.method} />
                                        </td>
                                        <td
                                            style={{
                                                padding: "10px 16px",
                                                fontSize: "0.82rem",
                                                color: "#374151",
                                                maxWidth: 240,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {log.path}
                                        </td>
                                        <td style={{ padding: "10px 16px" }}>
                                            <StatusBadge code={log.statusCode} />
                                        </td>
                                        <td style={{ padding: "10px 16px", fontSize: "0.82rem", color: "#374151" }}>
                                            {log.responseTime}ms
                                        </td>
                                        <td style={{ padding: "10px 16px", fontSize: "0.78rem", color: "#9CA3AF" }}>
                                            {log.ipAddress}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!logs || logs.length === 0) && (
                            <div style={{ padding: "32px", textAlign: "center", color: "#9CA3AF" }}>
                                No API logs found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
