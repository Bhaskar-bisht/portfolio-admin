/** @format */

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { BooleanInput, Create, Edit, required, SelectInput, SimpleForm, TextInput, useGetList } from "react-admin";
import { useNavigate } from "react-router-dom";

const PLATFORM_COLORS = {
    github: { bg: "#F3F4F6", color: "#111827" },
    linkedin: { bg: "#DBEAFE", color: "#1E40AF" },
    twitter: { bg: "#E0F2FE", color: "#0369A1" },
    instagram: { bg: "#FDF2F8", color: "#9D174D" },
    youtube: { bg: "#FEE2E2", color: "#991B1B" },
};
const PlatformBadge = ({ value }) => {
    const c = PLATFORM_COLORS[value?.toLowerCase()] || { bg: "#F3F4F6", color: "#374151" };
    return (
        <span
            style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontWeight: 700,
                background: c.bg,
                color: c.color,
                textTransform: "capitalize",
            }}
        >
            {value || "—"}
        </span>
    );
};
const BoolBadge = ({ value }) => (
    <span
        style={{
            padding: "3px 10px",
            borderRadius: 6,
            fontSize: "0.72rem",
            fontWeight: 700,
            background: value ? "#D1FAE5" : "#F3F4F6",
            color: value ? "#065F46" : "#6B7280",
        }}
    >
        {value ? "Active" : "Inactive"}
    </span>
);

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
const FormCard = ({ children }) => (
    <div
        style={{
            width: "100%",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            border: "1px solid #F3F4F6",
            boxSizing: "border-box",
            overflow: "hidden",
        }}
    >
        {children}
    </div>
);

const PLATFORM_CHOICES = [
    { id: "github", name: "GitHub" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "twitter", name: "Twitter" },
    { id: "instagram", name: "Instagram" },
    { id: "youtube", name: "YouTube" },
];

export const SocialLinkList = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();
    const { data, total, isLoading } = useGetList("social-links", {
        pagination: { page: pageIndex + 1, perPage: pageSize },
        sort: { field: "platform", order: "ASC" },
    });

    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor("platform", {
                header: "Platform",
                cell: (info) => <PlatformBadge value={info.getValue()} />,
            }),
            columnHelper.accessor("url", {
                header: "URL",
                cell: (info) => (
                    <a
                        href={info.getValue()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            color: "#2563EB",
                            fontSize: "0.82rem",
                            textDecoration: "none",
                            maxWidth: 320,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                        }}
                    >
                        {info.getValue()}
                    </a>
                ),
            }),
            columnHelper.accessor("isActive", {
                header: "Status",
                cell: (info) => <BoolBadge value={info.getValue()} />,
            }),
            columnHelper.display({
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/social-links/${row.original.id}`);
                        }}
                        style={{
                            padding: "5px 14px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#2563EB",
                            background: "#EFF6FF",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#DBEAFE")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                    >
                        Edit
                    </button>
                ),
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: 0 }}>Social Links</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{total ?? 0} total</span>
                    <button
                        onClick={() => navigate("/social-links/create")}
                        style={{
                            padding: "8px 16px",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color: "#fff",
                            background: "#2563EB",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
                    >
                        + Add Link
                    </button>
                </div>
            </div>
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
                <div className="sh" style={{ width: "100%", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
                        <thead>
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id} style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                                    {hg.headers.map((h) => (
                                        <th
                                            key={h.id}
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
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                        {columns.map((_, j) => (
                                            <td key={j} style={{ padding: "14px 20px" }}>
                                                <div
                                                    style={{
                                                        height: 14,
                                                        background: "#F3F4F6",
                                                        borderRadius: 6,
                                                        width: "60%",
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
                                        style={{ padding: "48px", textAlign: "center", color: "#9CA3AF" }}
                                    >
                                        No social links found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => navigate(`/social-links/${row.original.id}`)}
                                        style={{
                                            borderBottom: "1px solid #F3F4F6",
                                            background: i % 2 === 1 ? "#FAFAFA" : "#fff",
                                            cursor: "pointer",
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
                            {[5, 10, 20, 50].map((s) => (
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

const SocialLinkFormFields = ({ isCreate = false }) => (
    <div style={{ width: "100%", padding: 32, boxSizing: "border-box" }}>
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827", margin: 0 }}>
                {isCreate ? "Add Social Link" : "Edit Social Link"}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#9CA3AF", margin: "4px 0 0" }}>
                Fill in social link details below
            </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 20, width: "100%" }}>
            <SelectInput
                source="platform"
                label="Platform"
                choices={PLATFORM_CHOICES}
                {...(isCreate ? { validate: required() } : {})}
                fullWidth
            />
            <TextInput source="url" validate={required()} label="URL" placeholder="https://..." fullWidth />
        </div>
        {!isCreate && (
            <div
                style={{
                    padding: "12px 16px",
                    background: "#F9FAFB",
                    borderRadius: 8,
                    border: "1px solid #F3F4F6",
                    display: "inline-flex",
                    alignItems: "center",
                }}
            >
                <BooleanInput source="isActive" label="Active" />
            </div>
        )}
    </div>
);

export const SocialLinkEdit = (props) => (
    <Edit {...props} component="div">
        <SimpleForm>
            <FormCard>
                <SocialLinkFormFields />
            </FormCard>
        </SimpleForm>
    </Edit>
);
export const SocialLinkCreate = (props) => (
    <Create {...props} component="div">
        <SimpleForm>
            <FormCard>
                <SocialLinkFormFields isCreate />
            </FormCard>
        </SimpleForm>
    </Create>
);
