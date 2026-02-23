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
    SelectInput,
    SimpleForm,
    TextInput,
    required,
    useGetList,
} from "react-admin";
import { useNavigate } from "react-router-dom";

// ─── Badges ───────────────────────────────────────────────────────────────────
const CAT_COLORS = {
    frontend: { bg: "#DBEAFE", color: "#1E40AF" },
    backend: { bg: "#D1FAE5", color: "#065F46" },
    database: { bg: "#FEF3C7", color: "#92400E" },
    devops: { bg: "#FFEDD5", color: "#9A3412" },
    mobile: { bg: "#F3E8FF", color: "#6B21A8" },
    design: { bg: "#FCE7F3", color: "#9D174D" },
    other: { bg: "#F3F4F6", color: "#374151" },
};
const PROF_COLORS = {
    beginner: { bg: "#F3F4F6", color: "#6B7280" },
    intermediate: { bg: "#DBEAFE", color: "#1E40AF" },
    advanced: { bg: "#D1FAE5", color: "#065F46" },
    expert: { bg: "#FEF3C7", color: "#92400E" },
};
const Badge = ({ value, map }) => {
    const c = map[value] || { bg: "#F3F4F6", color: "#374151" };
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
                whiteSpace: "nowrap",
            }}
        >
            {value || "—"}
        </span>
    );
};
const BoolBadge = ({ value, t = "Yes", f = "No" }) => (
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
        {value ? t : f}
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

// ─── Layout Helpers ───────────────────────────────────────────────────────────
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
const Section = ({ title, subtitle }) => (
    <div style={{ marginBottom: 18, paddingBottom: 10, borderBottom: "2px solid #F1F5F9" }}>
        <h3
            style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#2563EB",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
            }}
        >
            {title}
        </h3>
        {subtitle && <p style={{ fontSize: "0.73rem", color: "#9CA3AF", margin: "3px 0 0" }}>{subtitle}</p>}
    </div>
);
const Grid = ({ cols = 2, children, mb = 16 }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: mb }}>
        {children}
    </div>
);
const Full = ({ children, mb = 16 }) => <div style={{ marginBottom: mb }}>{children}</div>;

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
            columnHelper.accessor("logo", {
                header: "",
                cell: (info) => {
                    const url = info.getValue()?.url;
                    return url ? (
                        <img
                            src={url}
                            alt="logo"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                objectFit: "contain",
                                display: "block",
                                background: "#F9FAFB",
                                padding: 4,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: "#F3F4F6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                color: "#9CA3AF",
                            }}
                        >
                            No img
                        </div>
                    );
                },
            }),
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {info.row.original.colorCode && (
                            <span
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: info.row.original.colorCode,
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />
                        )}
                        <div>
                            <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.875rem" }}>
                                {info.getValue()}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>{info.row.original.slug}</div>
                        </div>
                    </div>
                ),
            }),
            columnHelper.accessor("category", {
                header: "Category",
                cell: (info) => <Badge value={info.getValue()} map={CAT_COLORS} />,
            }),
            columnHelper.accessor("proficiencyLevel", {
                header: "Proficiency",
                cell: (info) =>
                    info.getValue() ? (
                        <Badge value={info.getValue()} map={PROF_COLORS} />
                    ) : (
                        <span style={{ color: "#D1D5DB", fontSize: "0.78rem" }}>—</span>
                    ),
            }),
            columnHelper.accessor("yearsOfExperience", {
                header: "Exp (yrs)",
                cell: (info) =>
                    info.getValue() != null ? (
                        <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.875rem" }}>
                            {info.getValue()}
                        </span>
                    ) : (
                        <span style={{ color: "#D1D5DB" }}>—</span>
                    ),
            }),
            columnHelper.accessor("isFeatured", {
                header: "Featured",
                cell: (info) => <BoolBadge value={info.getValue()} t="⭐ Yes" f="No" />,
            }),
            columnHelper.accessor("displayOrder", {
                header: "Order",
                cell: (info) => (
                    <span style={{ color: "#6B7280", fontSize: "0.82rem", fontWeight: 600 }}>{info.getValue()}</span>
                ),
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
                <div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: 0 }}>Technologies</h1>
                    <p style={{ fontSize: "0.8rem", color: "#9CA3AF", margin: "2px 0 0" }}>{total ?? 0} total</p>
                </div>
                <button
                    onClick={() => navigate("/technologies/create")}
                    style={{
                        padding: "9px 18px",
                        fontSize: "0.83rem",
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
                                                padding: "12px 16px",
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
                                            <td key={j} style={{ padding: "14px 16px" }}>
                                                <div
                                                    style={{
                                                        height: 14,
                                                        background: "#F3F4F6",
                                                        borderRadius: 6,
                                                        width: j === 1 ? "70%" : "50%",
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
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#EFF6FF")}
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = i % 2 === 1 ? "#FAFAFA" : "#fff")
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} style={{ padding: "12px 16px", fontSize: "0.875rem" }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: "0.82rem", color: "#6B7280", marginRight: 8 }}>
                            {total ? `${from}–${to} of ${total}` : "0"}
                        </span>
                        <PBtn onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
                            «
                        </PBtn>
                        <PBtn onClick={() => setPageIndex((p) => p - 1)} disabled={pageIndex === 0}>
                            ‹
                        </PBtn>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
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
                        <PBtn onClick={() => setPageIndex((p) => p + 1)} disabled={pageIndex >= totalPages - 1}>
                            ›
                        </PBtn>
                        <PBtn onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>
                            »
                        </PBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Form Fields ──────────────────────────────────────────────────────────────
const TechnologyFormFields = () => (
    <div style={{ padding: 32, boxSizing: "border-box", width: "100%" }}>
        {/* ── Basic Info ── */}
        <Section title="Basic Information" />
        <Grid cols={2}>
            <TextInput source="name" validate={required()} label="Technology Name *" fullWidth />
            <SelectInput
                source="category"
                label="Category"
                defaultValue="other"
                fullWidth
                choices={[
                    { id: "frontend", name: "Frontend" },
                    { id: "backend", name: "Backend" },
                    { id: "database", name: "Database" },
                    { id: "devops", name: "DevOps" },
                    { id: "mobile", name: "Mobile" },
                    { id: "design", name: "Design" },
                    { id: "other", name: "Other" },
                ]}
            />
        </Grid>
        <Full mb={28}>
            <TextInput source="description" label="Description" multiline minRows={3} fullWidth />
        </Full>

        {/* ── Proficiency ── */}
        <Section title="Proficiency & Experience" />
        <Grid cols={2} mb={28}>
            <SelectInput
                source="proficiencyLevel"
                label="Proficiency Level"
                fullWidth
                choices={[
                    { id: "beginner", name: "Beginner" },
                    { id: "intermediate", name: "Intermediate" },
                    { id: "advanced", name: "Advanced" },
                    { id: "expert", name: "Expert" },
                ]}
            />
            <NumberInput source="yearsOfExperience" label="Years of Experience" min={0} fullWidth />
        </Grid>

        {/* ── Appearance ── */}
        <Section title="Appearance" subtitle="Colors used for display on portfolio" />
        <Grid cols={3} mb={8}>
            <TextInput source="colorCode" label="Text / Icon Color" placeholder="#3B82F6" fullWidth />
            <TextInput source="backgroundColor" label="Background Color" placeholder="#EFF6FF" fullWidth />
            <NumberInput source="displayOrder" label="Display Order" defaultValue={0} min={0} fullWidth />
        </Grid>
        {/* Color preview */}
        <Full mb={28}>
            <p
                style={{
                    fontSize: "0.72rem",
                    color: "#9CA3AF",
                    margin: "0 0 4px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}
            >
                Preview
            </p>
            <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                Color preview will appear based on the hex codes you enter above.
            </div>
        </Full>

        {/* ── Logo ── */}
        <Section title="Logo" subtitle="Upload technology logo (Cloudinary)" />
        <Full mb={28}>
            <div
                style={{
                    padding: 16,
                    border: "1.5px dashed #E5E7EB",
                    borderRadius: 10,
                    background: "#FAFAFA",
                    display: "inline-block",
                    minWidth: 240,
                }}
            >
                <ImageInput
                    source="logo"
                    label=""
                    accept={{ "image/*": [] }}
                    sx={{ "& .RaFileInput-dropZone": { border: "none", p: 0, background: "transparent" } }}
                >
                    <ImageField source="url" title="Logo" />
                </ImageInput>
            </div>
        </Full>

        {/* ── Links ── */}
        <Section title="External Links" />
        <Grid cols={2} mb={28}>
            <TextInput source="officialUrl" label="Official Website URL" placeholder="https://..." fullWidth />
            <TextInput source="documentationUrl" label="Documentation URL" placeholder="https://docs..." fullWidth />
        </Grid>

        {/* ── Settings ── */}
        <Section title="Settings" />
        <div
            style={{
                padding: "12px 16px",
                background: "#F9FAFB",
                borderRadius: 8,
                border: "1px solid #E5E7EB",
                display: "inline-flex",
                alignItems: "center",
            }}
        >
            <BooleanInput source="isFeatured" label="Mark as Featured (shown on portfolio homepage)" />
        </div>
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
