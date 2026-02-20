/** @format */

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Show, useGetList, useShowContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

SyntaxHighlighter.registerLanguage("json", json);

// ─── Inject scrollbar-hide CSS once ──────────────────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("ra-scrollbar-hide")) {
    const s = document.createElement("style");
    s.id = "ra-scrollbar-hide";
    s.textContent = `
        .sh { scrollbar-width: none; -ms-overflow-style: none; }
        .sh::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(s);
}

// ─── Color helpers ────────────────────────────────────────────────────────────
const METHOD_COLORS = {
    GET: { bg: "#DBEAFE", color: "#1E40AF" },
    POST: { bg: "#D1FAE5", color: "#065F46" },
    PUT: { bg: "#FEF3C7", color: "#92400E" },
    PATCH: { bg: "#FFEDD5", color: "#9A3412" },
    DELETE: { bg: "#FEE2E2", color: "#991B1B" },
};
const statusColors = (code) => {
    if (code >= 200 && code < 300) return { bg: "#D1FAE5", color: "#065F46" };
    if (code >= 300 && code < 400) return { bg: "#DBEAFE", color: "#1E40AF" };
    if (code >= 400 && code < 500) return { bg: "#FEF3C7", color: "#92400E" };
    return { bg: "#FEE2E2", color: "#991B1B" };
};

const Badge = ({ label, bg, color }) => (
    <span
        style={{
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: "0.72rem",
            fontWeight: 700,
            background: bg,
            color,
            letterSpacing: "0.04em",
        }}
    >
        {label}
    </span>
);
const MethodBadge = ({ method }) => {
    const c = METHOD_COLORS[method] || { bg: "#F3F4F6", color: "#374151" };
    return <Badge label={method} bg={c.bg} color={c.color} />;
};
const StatusBadge = ({ code }) => {
    const c = statusColors(code);
    return <Badge label={code} bg={c.bg} color={c.color} />;
};

// ─── Pagination Button ────────────────────────────────────────────────────────
const PBtn = ({ onClick, disabled, children, active }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            minWidth: 32,
            height: 32,
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            border: "none",
            fontSize: "0.82rem",
            fontWeight: active ? 700 : 500,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.35 : 1,
            background: active ? "#2563EB" : "transparent",
            color: active ? "#fff" : "#374151",
            transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
            if (!disabled && !active) e.currentTarget.style.background = "#F3F4F6";
        }}
        onMouseLeave={(e) => {
            if (!disabled && !active) e.currentTarget.style.background = "transparent";
        }}
    >
        {children}
    </button>
);

// ─── JSON Widget ──────────────────────────────────────────────────────────────
const JsonWidget = ({ title, icon, data, emptyMsg }) => {
    const isEmpty = !data || (typeof data === "object" && Object.keys(data).length === 0);
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                border: "1px solid #F3F4F6",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "14px 20px",
                    borderBottom: "1px solid #F3F4F6",
                    background: "#FAFAFA",
                }}
            >
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151" }}>{title}</span>
                {isEmpty && (
                    <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#9CA3AF", fontStyle: "italic" }}>
                        empty
                    </span>
                )}
            </div>
            <div style={{ padding: isEmpty ? "20px" : "0" }}>
                {isEmpty ? (
                    <span style={{ color: "#9CA3AF", fontSize: "0.82rem" }}>{emptyMsg}</span>
                ) : (
                    // ← className="sh" hides the webkit scrollbar
                    <div className="sh" style={{ maxHeight: 340, overflow: "auto" }}>
                        <SyntaxHighlighter
                            language="json"
                            style={atomOneLight}
                            customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                fontSize: "0.82rem",
                                background: "#FAFAFA",
                                padding: "16px 20px",
                            }}
                        >
                            {JSON.stringify(data, null, 2)}
                        </SyntaxHighlighter>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, valueNode }) => (
    <div
        style={{
            display: "flex",
            gap: 12,
            padding: "10px 0",
            borderBottom: "1px solid #F9FAFB",
            alignItems: "flex-start",
        }}
    >
        <span
            style={{
                width: 160,
                flexShrink: 0,
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                paddingTop: 2,
            }}
        >
            {label}
        </span>
        <span style={{ fontSize: "0.875rem", color: "#111827", wordBreak: "break-all", flex: 1 }}>
            {valueNode || value || <span style={{ color: "#D1D5DB" }}>—</span>}
        </span>
    </div>
);

// ─── API LOG LIST ─────────────────────────────────────────────────────────────
export const ApiLogList = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({ method: "", statusCode: "", path: "" });
    const navigate = useNavigate();

    const { data, total, isLoading } = useGetList("api-logs", {
        pagination: { page: pageIndex + 1, perPage: pageSize },
        sort: { field: "timestamp", order: "DESC" },
        filter: Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
    });

    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor("timestamp", {
                header: "Timestamp",
                cell: (info) => (
                    <span style={{ color: "#6B7280", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(info.getValue()).toLocaleString()}
                    </span>
                ),
            }),
            columnHelper.accessor("method", {
                header: "Method",
                cell: (info) => <MethodBadge method={info.getValue()} />,
            }),
            columnHelper.accessor("path", {
                header: "Path",
                cell: (info) => (
                    <span
                        style={{
                            color: "#374151",
                            fontFamily: "monospace",
                            fontSize: "0.82rem",
                            maxWidth: 280,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                        }}
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("statusCode", {
                header: "Status",
                cell: (info) => <StatusBadge code={info.getValue()} />,
            }),
            columnHelper.accessor("responseTime", {
                header: "Time (ms)",
                cell: (info) => <span style={{ color: "#374151", fontWeight: 500 }}>{info.getValue()}ms</span>,
            }),
            columnHelper.accessor("ipAddress", {
                header: "IP",
                cell: (info) => <span style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{info.getValue()}</span>,
            }),
            columnHelper.accessor("origin", {
                header: "Origin",
                cell: (info) => <span style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{info.getValue()}</span>,
            }),
        ],
        [navigate],
    );

    const totalPages = total ? Math.ceil(total / pageSize) : 0;
    const from = total ? pageIndex * pageSize + 1 : 0;
    const to = Math.min((pageIndex + 1) * pageSize, total ?? 0);

    const table = useReactTable({
        data: data ?? [],
        columns,
        pageCount: totalPages,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: (updater) => {
            const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: 0 }}>API Logs</h1>
                <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{total ?? 0} total</span>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <select
                    value={filters.method}
                    onChange={(e) => {
                        setFilters((f) => ({ ...f, method: e.target.value }));
                        setPageIndex(0);
                    }}
                    style={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: "0.82rem",
                        color: "#374151",
                        background: "#fff",
                        outline: "none",
                        cursor: "pointer",
                    }}
                >
                    <option value="">All Methods</option>
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
                <select
                    value={filters.statusCode}
                    onChange={(e) => {
                        setFilters((f) => ({ ...f, statusCode: e.target.value }));
                        setPageIndex(0);
                    }}
                    style={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: "0.82rem",
                        color: "#374151",
                        background: "#fff",
                        outline: "none",
                        cursor: "pointer",
                    }}
                >
                    <option value="">All Statuses</option>
                    {[
                        ["200", "200 OK"],
                        ["201", "201 Created"],
                        ["304", "304 Not Modified"],
                        ["400", "400 Bad Request"],
                        ["404", "404 Not Found"],
                        ["500", "500 Server Error"],
                    ].map(([v, l]) => (
                        <option key={v} value={v}>
                            {l}
                        </option>
                    ))}
                </select>
                <input
                    placeholder="Filter by path…"
                    value={filters.path}
                    onChange={(e) => {
                        setFilters((f) => ({ ...f, path: e.target.value }));
                        setPageIndex(0);
                    }}
                    style={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: "0.82rem",
                        color: "#374151",
                        background: "#fff",
                        outline: "none",
                        minWidth: 200,
                    }}
                />
            </div>

            {/* Table Card */}
            <div
                style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    border: "1px solid #F3F4F6",
                    overflow: "hidden",
                }}
            >
                {/* ← className="sh" hides horizontal scrollbar on table */}
                <div className="sh" style={{ width: "100%", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                                    {hg.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            style={{
                                                padding: "12px 20px",
                                                textAlign: "left",
                                                fontSize: "0.72rem",
                                                fontWeight: 700,
                                                color: "#6B7280",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.06em",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(8)].map((_, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                        {columns.map((_, j) => (
                                            <td key={j} style={{ padding: "14px 20px" }}>
                                                <div
                                                    style={{
                                                        height: 14,
                                                        background: "#F3F4F6",
                                                        borderRadius: 6,
                                                        width: "70%",
                                                    }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        style={{
                                            padding: "48px",
                                            textAlign: "center",
                                            color: "#9CA3AF",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        No logs found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => navigate(`/api-logs/${row.original.id}/show`)}
                                        style={{
                                            borderBottom: "1px solid #F3F4F6",
                                            background: i % 2 === 1 ? "#FAFAFA" : "#fff",
                                            cursor: "pointer",
                                            transition: "background 0.12s",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = i % 2 === 1 ? "#FAFAFA" : "#fff")
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} style={{ padding: "13px 20px", fontSize: "0.875rem" }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 20px",
                        borderTop: "1px solid #F3F4F6",
                        background: "#FAFAFA",
                    }}
                >
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#6B7280" }}
                    >
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPageIndex(0);
                            }}
                            style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: 8,
                                padding: "3px 8px",
                                fontSize: "0.82rem",
                                color: "#374151",
                                background: "#fff",
                                cursor: "pointer",
                                outline: "none",
                            }}
                        >
                            {[10, 20, 50, 100].map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.82rem", color: "#6B7280" }}
                    >
                        <span style={{ marginRight: 8 }}>{total ? `${from}–${to} of ${total}` : "0 results"}</span>
                        <PBtn onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
                                />
                            </svg>
                        </PBtn>
                        <PBtn onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex === 0}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </PBtn>
                        {totalPages > 0 &&
                            [...Array(Math.min(totalPages, 5))].map((_, i) => {
                                let page = i;
                                if (totalPages > 5) {
                                    if (pageIndex < 3) page = i;
                                    else if (pageIndex > totalPages - 3) page = totalPages - 5 + i;
                                    else page = pageIndex - 2 + i;
                                }
                                return (
                                    <PBtn key={page} onClick={() => setPageIndex(page)} active={page === pageIndex}>
                                        {page + 1}
                                    </PBtn>
                                );
                            })}
                        <PBtn
                            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={pageIndex >= totalPages - 1}
                        >
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </PBtn>
                        <PBtn onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M6 5l7 7-7 7"
                                />
                            </svg>
                        </PBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── API LOG SHOW ─────────────────────────────────────────────────────────────
export const ApiLogShow = (props) => (
    <Show
        {...props}
        component="div"
        sx={{
            width: "100%",
            "& .RaShow-main": { width: "100%" },
            "& .RaShow-main .MuiCard-root": {
                width: "100%",
                maxWidth: "100%",
                borderRadius: 0,
                boxShadow: "none",
                background: "transparent",
            },
            "& .MuiCardContent-root": { padding: "0 !important" },
        }}
    >
        <ApiLogShowContent />
    </Show>
);

const ApiLogShowContent = () => {
    const { record, isLoading } = useShowContext();

    if (isLoading || !record) {
        return (
            <div style={{ padding: "28px 32px" }}>
                <div style={{ height: 200, background: "#F3F4F6", borderRadius: 12 }} />
            </div>
        );
    }

    return (
        <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box" }}>
            {/* Page Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <MethodBadge method={record.method} />
                <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
                    {record.path}
                </span>
                <StatusBadge code={record.statusCode} />
                <span style={{ marginLeft: "auto", fontSize: "0.82rem", color: "#9CA3AF" }}>
                    {new Date(record.timestamp).toLocaleString()}
                </span>
            </div>

            {/* Row 1: Overview + Client Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Overview */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        border: "1px solid #F3F4F6",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid #F3F4F6",
                            background: "#FAFAFA",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <span>📋</span>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151" }}>Overview</span>
                    </div>
                    <div style={{ padding: "4px 20px 12px" }}>
                        <InfoRow label="ID" value={record.id} />
                        <InfoRow label="Method" valueNode={<MethodBadge method={record.method} />} />
                        <InfoRow label="Path" value={record.path} />
                        <InfoRow label="Full URL" value={record.fullUrl} />
                        <InfoRow label="Status" valueNode={<StatusBadge code={record.statusCode} />} />
                        <InfoRow label="Response Time" value={`${record.responseTime}ms`} />
                        <InfoRow label="Timestamp" value={new Date(record.timestamp).toLocaleString()} />
                    </div>
                </div>

                {/* Client Info */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        border: "1px solid #F3F4F6",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid #F3F4F6",
                            background: "#FAFAFA",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <span>🌐</span>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#374151" }}>Client Info</span>
                    </div>
                    <div style={{ padding: "4px 20px 12px" }}>
                        <InfoRow label="IP Address" value={record.ipAddress} />
                        <InfoRow label="Origin" value={record.origin} />
                        <InfoRow label="Referer" value={record.referer} />
                        <InfoRow label="User Agent" value={record.userAgent} />
                    </div>
                </div>
            </div>

            {/* Row 2: Query Params + Request Body */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <JsonWidget
                    title="Query Parameters"
                    icon="🔍"
                    data={record.requestQuery}
                    emptyMsg="No query parameters"
                />
                <JsonWidget title="Request Body" icon="📤" data={record.requestBody} emptyMsg="No request body" />
            </div>

            {/* Row 3: Response Body (full width) */}
            <div style={{ marginBottom: 20 }}>
                <JsonWidget title="Response Body" icon="📥" data={record.responseBody} emptyMsg="No response body" />
            </div>

            {/* Row 4: Request Headers (full width) */}
            <JsonWidget title="Request Headers" icon="📨" data={record.requestHeaders} emptyMsg="No request headers" />
        </div>
    );
};
