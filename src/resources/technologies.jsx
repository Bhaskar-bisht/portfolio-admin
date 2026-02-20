/** @format */

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
    BooleanInput,
    Create,
    Edit,
    ImageField,
    ImageInput,
    NumberInput,
    required,
    SelectInput,
    SimpleForm,
    TextInput,
    useGetList,
} from "react-admin";
import { useNavigate } from "react-router-dom";

// ─── Inject global CSS to force full width on Edit/Create pages ───────────────
if (typeof document !== "undefined" && !document.getElementById("ra-fullwidth-fix")) {
    const s = document.createElement("style");
    s.id = "ra-fullwidth-fix";
    s.textContent = `
        /* Kill max-width on every react-admin form wrapper */
        .RaEdit-main,
        .RaCreate-main,
        .RaEdit-main > div,
        .RaCreate-main > div,
        .RaEdit-main > div > div,
        .RaCreate-main > div > div {
            width: 100% !important;
            max-width: 100% !important;
        }
        /* Kill MUI Paper/Card inside edit/create */
        .RaEdit-main .MuiPaper-root,
        .RaCreate-main .MuiPaper-root,
        .RaEdit-main .MuiCard-root,
        .RaCreate-main .MuiCard-root {
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            background: transparent !important;
            border-radius: 0 !important;
        }
        /* Kill padding on MuiCardContent */
        .RaEdit-main .MuiCardContent-root,
        .RaCreate-main .MuiCardContent-root {
            padding: 0 !important;
            width: 100% !important;
        }
        /* SimpleForm wrapper */
        .RaEdit-main .RaSimpleForm-root,
        .RaCreate-main .RaSimpleForm-root,
        .RaEdit-main .RaSimpleForm-form,
        .RaCreate-main .RaSimpleForm-form {
            width: 100% !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(s);
}

// ─── Category badge ───────────────────────────────────────────────────────────
const CAT_COLORS = {
    frontend: { bg: "#DBEAFE", color: "#1E40AF" },
    backend: { bg: "#D1FAE5", color: "#065F46" },
    database: { bg: "#FEF3C7", color: "#92400E" },
    devops: { bg: "#FFEDD5", color: "#9A3412" },
};
const CatBadge = ({ value }) => {
    const c = CAT_COLORS[value] || { bg: "#F3F4F6", color: "#374151" };
    return (
        <span
            style={{
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: "0.72rem",
                fontWeight: 700,
                background: c.bg,
                color: c.color,
                letterSpacing: "0.04em",
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
        {value ? "Yes" : "No"}
    </span>
);

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

// ─── TechnologyList ───────────────────────────────────────────────────────────
export const TechnologyList = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const navigate = useNavigate();

    const { data, total, isLoading } = useGetList("technologies", {
        pagination: { page: pageIndex + 1, perPage: pageSize },
        sort: { field: "displayOrder", order: "ASC" },
    });

    const columnHelper = createColumnHelper();
    const columns = useMemo(
        () => [
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => <span style={{ fontWeight: 500, color: "#111827" }}>{info.getValue()}</span>,
            }),
            columnHelper.accessor("category", {
                header: "Category",
                cell: (info) => <CatBadge value={info.getValue()} />,
            }),
            columnHelper.accessor("isFeatured", {
                header: "Featured",
                cell: (info) => <BoolBadge value={info.getValue()} />,
            }),
            columnHelper.accessor("displayOrder", {
                header: "Order",
                cell: (info) => <span style={{ color: "#6B7280", fontSize: "0.82rem" }}>{info.getValue()}</span>,
            }),
            columnHelper.display({
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/technologies/${row.original.id}`);
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
                <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: 0 }}>Technologies</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{total ?? 0} total</span>
                    <button
                        onClick={() => navigate("/technologies/create")}
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
                        + Add Technology
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
                                        style={{
                                            padding: "48px",
                                            textAlign: "center",
                                            color: "#9CA3AF",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        No technologies found.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => navigate(`/technologies/${row.original.id}`)}
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

// ─── Shared Form Content ──────────────────────────────────────────────────────
const TechnologyFormFields = () => (
    <div style={{ width: "100%", padding: 32, boxSizing: "border-box" }}>
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827", margin: 0 }}>Technology Details</h2>
            <p style={{ fontSize: "0.78rem", color: "#9CA3AF", margin: "4px 0 0" }}>
                Fill in the technology information below
            </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20, width: "100%" }}>
            <TextInput source="name" validate={required()} label="Name" fullWidth />
            <SelectInput
                source="category"
                label="Category"
                fullWidth
                choices={[
                    { id: "frontend", name: "Frontend" },
                    { id: "backend", name: "Backend" },
                    { id: "database", name: "Database" },
                    { id: "devops", name: "DevOps" },
                ]}
            />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20, width: "100%" }}>
            <TextInput source="colorCode" label="Color Code" placeholder="#3B82F6" fullWidth />
            <NumberInput source="displayOrder" label="Display Order" defaultValue={0} />
        </div>

        <div style={{ marginBottom: 20, width: "100%" }}>
            <ImageInput source="logo" label="Logo Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </div>

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
            <BooleanInput source="isFeatured" label="Mark as Featured" />
        </div>
    </div>
);

// ─── Wrapper card — THIS is what the user sees as the "card" ─────────────────
// We render it OUTSIDE react-admin's form card, as a sibling via a custom layout
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

// ─── TechnologyEdit ───────────────────────────────────────────────────────────
export const TechnologyEdit = (props) => (
    <Edit {...props} component="div">
        <SimpleForm>
            <FormCard>
                <TechnologyFormFields />
            </FormCard>
        </SimpleForm>
    </Edit>
);

// ─── TechnologyCreate ─────────────────────────────────────────────────────────
export const TechnologyCreate = (props) => (
    <Create {...props} component="div">
        <SimpleForm>
            <FormCard>
                <TechnologyFormFields />
            </FormCard>
        </SimpleForm>
    </Create>
);
