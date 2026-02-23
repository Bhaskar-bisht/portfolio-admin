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
    DateInput,
    Edit,
    ImageField,
    ImageInput,
    NumberInput,
    ReferenceArrayInput,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
    TextInput,
    required,
    useGetList,
} from "react-admin";
import { useNavigate } from "react-router-dom";

// ─── Badges ───────────────────────────────────────────────────────────────────
const TYPE_COLORS = {
    web:     { bg: "#DBEAFE", color: "#1E40AF" },
    mobile:  { bg: "#D1FAE5", color: "#065F46" },
    desktop: { bg: "#FEF3C7", color: "#92400E" },
    api:     { bg: "#FFEDD5", color: "#9A3412" },
    other:   { bg: "#F3F4F6", color: "#374151" },
};
const STATUS_COLORS = {
    completed:   { bg: "#D1FAE5", color: "#065F46" },
    in_progress: { bg: "#DBEAFE", color: "#1E40AF" },
    planning:    { bg: "#FEF3C7", color: "#92400E" },
    on_hold:     { bg: "#F3F4F6", color: "#374151" },
    cancelled:   { bg: "#FEE2E2", color: "#991B1B" },
};
const Badge = ({ value, map }) => {
    const key = value?.toLowerCase().replace(" ", "_");
    const c = map[key] || { bg: "#F3F4F6", color: "#374151" };
    return (
        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, background: c.bg, color: c.color, textTransform: "capitalize", whiteSpace: "nowrap" }}>
            {value?.replace("_", " ") || "—"}
        </span>
    );
};
const BoolBadge = ({ value, t = "Yes", f = "No" }) => (
    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, background: value ? "#D1FAE5" : "#F3F4F6", color: value ? "#065F46" : "#6B7280" }}>
        {value ? t : f}
    </span>
);

// ─── Pagination Button ────────────────────────────────────────────────────────
const PBtn = ({ onClick, disabled, children, active }) => (
    <button onClick={onClick} disabled={disabled}
        style={{ minWidth: 32, height: 32, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", fontSize: "0.82rem", fontWeight: active ? 700 : 500, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1, background: active ? "#2563EB" : "transparent", color: active ? "#fff" : "#374151" }}
        onMouseEnter={e => { if (!disabled && !active) e.currentTarget.style.background = "#F3F4F6"; }}
        onMouseLeave={e => { if (!disabled && !active) e.currentTarget.style.background = "transparent"; }}>
        {children}
    </button>
);

// ─── Layout Helpers ───────────────────────────────────────────────────────────
const FormCard = ({ children }) => (
    <div style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6", boxSizing: "border-box", overflow: "hidden" }}>
        {children}
    </div>
);
const Section = ({ title, subtitle }) => (
    <div style={{ marginBottom: 20, paddingBottom: 10, borderBottom: "2px solid #F1F5F9" }}>
        <h3 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563EB", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</h3>
        {subtitle && <p style={{ fontSize: "0.73rem", color: "#9CA3AF", margin: "3px 0 0" }}>{subtitle}</p>}
    </div>
);
const Grid = ({ cols = 2, children, mb = 16 }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: mb }}>{children}</div>
);
const Full = ({ children, mb = 16 }) => <div style={{ marginBottom: mb }}>{children}</div>;

// ─── Technologies Pivot Input ─────────────────────────────────────────────────
// Allows adding multiple technologies with usagePercentage and role
const TechnologiesInput = ({ value = [], onChange }) => {
    const { data: techList } = useGetList("technologies", { pagination: { page: 1, perPage: 200 }, sort: { field: "name", order: "ASC" } });

    const add = () => onChange([...value, { technology: "", usagePercentage: 50, role: "" }]);
    const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
    const update = (i, field, val) => {
        const copy = [...value];
        copy[i] = { ...copy[i], [field]: val };
        onChange(copy);
    };

    return (
        <div style={{ width: "100%" }}>
            {value.map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr auto", gap: 12, marginBottom: 10, alignItems: "flex-end" }}>
                    {/* Technology select */}
                    <div>
                        {i === 0 && <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Technology</label>}
                        <select value={item.technology || ""} onChange={e => update(i, "technology", e.target.value)}
                            style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: "0.875rem", color: "#111827", background: "#fff", outline: "none" }}>
                            <option value="">Select technology...</option>
                            {(techList || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    {/* Usage % */}
                    <div>
                        {i === 0 && <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Usage %</label>}
                        <input type="number" min={0} max={100} value={item.usagePercentage ?? 50} onChange={e => update(i, "usagePercentage", Number(e.target.value))}
                            style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    {/* Role */}
                    <div>
                        {i === 0 && <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Role</label>}
                        <input type="text" placeholder="e.g. Frontend, Backend..." value={item.role || ""} onChange={e => update(i, "role", e.target.value)}
                            style={{ width: "100%", height: 40, padding: "0 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: "0.875rem", color: "#111827", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    {/* Remove */}
                    <div style={{ display: "flex", alignItems: "flex-end" }}>
                        {i === 0 && <div style={{ height: 20 }} />}
                        <button type="button" onClick={() => remove(i)}
                            style={{ height: 40, width: 40, border: "1px solid #FEE2E2", borderRadius: 8, background: "#FEF2F2", color: "#EF4444", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            ×
                        </button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={add}
                style={{ marginTop: 4, padding: "8px 16px", border: "1.5px dashed #2563EB", borderRadius: 8, background: "#EFF6FF", color: "#2563EB", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}>
                + Add Technology
            </button>
        </div>
    );
};

// Wrapper to connect to react-admin form
import { useController } from "react-hook-form";
const TechnologiesField = () => {
    const { field } = useController({ name: "technologies", defaultValue: [] });
    return <TechnologiesInput value={field.value || []} onChange={field.onChange} />;
};

// ─── Shared Form ──────────────────────────────────────────────────────────────
const ProjectFormFields = ({ isCreate = false }) => (
    <div style={{ padding: 32, boxSizing: "border-box", width: "100%" }}>

        {/* ── Basic Info ── */}
        <Section title="Basic Information" />
        <Full>
            <TextInput source="title" validate={required()} label="Project Title *" fullWidth />
        </Full>
        <Grid cols={2}>
            <SelectInput source="projectType" label="Project Type *" validate={required()} defaultValue="web" choices={[
                { id: "web",     name: "Web"     },
                { id: "mobile",  name: "Mobile"  },
                { id: "desktop", name: "Desktop" },
                { id: "api",     name: "API"     },
                { id: "other",   name: "Other"   },
            ]} fullWidth />
            <SelectInput source="status" label="Status" defaultValue="completed" choices={[
                { id: "planning",    name: "Planning"    },
                { id: "in_progress", name: "In Progress" },
                { id: "completed",   name: "Completed"   },
                { id: "on_hold",     name: "On Hold"     },
                { id: "cancelled",   name: "Cancelled"   },
            ]} fullWidth />
        </Grid>
        <Full>
            <TextInput source="shortDescription" label="Short Description (max 500 chars)" multiline minRows={2} fullWidth />
        </Full>
        <Full mb={28}>
            <TextInput source="fullDescription" label="Full Description" multiline minRows={6} fullWidth />
        </Full>

        {/* ── Images ── */}
        <Section title="Images" subtitle="Thumbnail (card preview), Banner (hero image), Gallery (multiple)" />
        <Grid cols={2} mb={0}>
            <div style={{ padding: 16, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#FAFAFA" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Thumbnail</p>
                <ImageInput source="thumbnail" label="" accept={{ "image/*": [] }}
                    sx={{ "& .RaFileInput-dropZone": { border: "none", p: 0, background: "transparent" } }}>
                    <ImageField source="url" title="Thumbnail" />
                </ImageInput>
            </div>
            <div style={{ padding: 16, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#FAFAFA" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Banner</p>
                <ImageInput source="banner" label="" accept={{ "image/*": [] }}
                    sx={{ "& .RaFileInput-dropZone": { border: "none", p: 0, background: "transparent" } }}>
                    <ImageField source="url" title="Banner" />
                </ImageInput>
            </div>
        </Grid>
        <Full mb={28} style={{ padding: 16, border: "1.5px dashed #E5E7EB", borderRadius: 10, background: "#FAFAFA" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", margin: "0 0 8px" }}>Gallery (multiple images)</p>
            <ImageInput source="gallery" label="" multiple accept={{ "image/*": [] }}
                sx={{ "& .RaFileInput-dropZone": { border: "none", p: 0, background: "transparent" } }}>
                <ImageField source="url" title="Gallery" />
            </ImageInput>
        </Full>

        {/* ── Links ── */}
        <Section title="Links & URLs" />
        <Grid cols={3} mb={28}>
            <TextInput source="projectUrl" label="Live Project URL" placeholder="https://..." fullWidth />
            <TextInput source="githubUrl"  label="GitHub URL"       placeholder="https://github.com/..." fullWidth />
            <TextInput source="demoUrl"    label="Demo URL"         placeholder="https://..." fullWidth />
        </Grid>

        {/* ── Client ── */}
        <Section title="Client Information" />
        <Grid cols={2}>
            <TextInput source="clientName"   label="Client Name"    fullWidth />
            <TextInput source="budgetRange"  label="Budget Range"   placeholder="e.g. $500–$2000" fullWidth />
        </Grid>
        <Full mb={28}>
            <TextInput source="clientFeedback" label="Client Feedback" multiline minRows={3} fullWidth />
        </Full>

        {/* ── Timeline ── */}
        <Section title="Timeline & Team" />
        <Grid cols={3} mb={28}>
            <DateInput source="startedAt"   label="Started At"   fullWidth />
            <DateInput source="completedAt" label="Completed At" fullWidth />
            <NumberInput source="teamSize"  label="Team Size"    min={1} fullWidth />
        </Grid>

        {/* ── Categories ── */}
        <Section title="Categories" />
        <Full mb={28}>
            <ReferenceArrayInput source="categories" reference="categories">
                <SelectArrayInput optionText="name" label="Categories" fullWidth />
            </ReferenceArrayInput>
        </Full>

        {/* ── Technologies ── */}
        <Section title="Technologies" subtitle="Add technologies with usage percentage and role" />
        <Full mb={28}>
            <TechnologiesField />
        </Full>

        {/* ── SEO ── */}
        <Section title="SEO Metadata" />
        <Full>
            <TextInput source="metaTitle"       label="Meta Title"       fullWidth />
        </Full>
        <Full mb={28}>
            <TextInput source="metaDescription" label="Meta Description" multiline minRows={2} fullWidth />
        </Full>

        {/* ── Priority & Visibility ── */}
        <Section title="Priority & Visibility" />
        <Grid cols={2} mb={0}>
            <NumberInput source="priority" label="Priority (higher = shown first)" defaultValue={0} min={0} fullWidth />
            {!isCreate && <NumberInput source="viewsCount" label="Views Count" min={0} fullWidth />}
        </Grid>
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ padding: "10px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", display: "inline-flex", alignItems: "center" }}>
                <BooleanInput source="featured"    label="Mark as Featured" />
            </div>
            <div style={{ padding: "10px 16px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB", display: "inline-flex", alignItems: "center" }}>
                <BooleanInput source="isPublished" label="Publish Project"  defaultValue={false} />
            </div>
        </div>
    </div>
);

// ─── ProjectList ──────────────────────────────────────────────────────────────
export const ProjectList = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize]   = useState(10);
    const navigate = useNavigate();

    const { data, total, isLoading } = useGetList("projects", {
        pagination: { page: pageIndex + 1, perPage: pageSize },
        sort: { field: "createdAt", order: "DESC" },
    });

    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.accessor("thumbnail", {
            header: "",
            cell: info => {
                const url = info.getValue()?.url;
                return url
                    ? <img src={url} alt="thumb" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", display: "block" }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: "#9CA3AF" }}>No img</div>;
            },
        }),
        columnHelper.accessor("title", {
            header: "Title",
            cell: info => (
                <div>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.875rem" }}>{info.getValue()}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: 2 }}>{info.row.original.slug}</div>
                </div>
            ),
        }),
        columnHelper.accessor("projectType", {
            header: "Type",
            cell: info => <Badge value={info.getValue()} map={TYPE_COLORS} />,
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: info => <Badge value={info.getValue()} map={STATUS_COLORS} />,
        }),
        columnHelper.accessor("featured", {
            header: "Featured",
            cell: info => <BoolBadge value={info.getValue()} t="⭐ Featured" f="Normal" />,
        }),
        columnHelper.accessor("isPublished", {
            header: "Published",
            cell: info => <BoolBadge value={info.getValue()} t="🟢 Live" f="Draft" />,
        }),
        columnHelper.accessor("priority", {
            header: "Priority",
            cell: info => (
                <span style={{ fontWeight: 700, color: "#374151", fontSize: "0.875rem" }}>{info.getValue() ?? 0}</span>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <button onClick={e => { e.stopPropagation(); navigate(`/projects/${row.original.id}`); }}
                    style={{ padding: "5px 14px", fontSize: "0.78rem", fontWeight: 600, color: "#2563EB", background: "#EFF6FF", border: "none", borderRadius: 8, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#DBEAFE"}
                    onMouseLeave={e => e.currentTarget.style.background = "#EFF6FF"}>
                    Edit
                </button>
            ),
        }),
    ], [navigate]);

    const totalPages = total ? Math.ceil(total / pageSize) : 0;
    const from = total ? pageIndex * pageSize + 1 : 0;
    const to   = Math.min((pageIndex + 1) * pageSize, total ?? 0);

    const table = useReactTable({
        data: data ?? [], columns,
        pageCount: totalPages,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: updater => {
            const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(next.pageIndex); setPageSize(next.pageSize);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: 0 }}>Projects</h1>
                    <p style={{ fontSize: "0.8rem", color: "#9CA3AF", margin: "2px 0 0" }}>{total ?? 0} total projects</p>
                </div>
                <button onClick={() => navigate("/projects/create")}
                    style={{ padding: "9px 18px", fontSize: "0.83rem", fontWeight: 600, color: "#fff", background: "#2563EB", border: "none", borderRadius: 8, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
                    onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}>
                    + Add Project
                </button>
            </div>

            <div style={{ width: "100%", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #F3F4F6", overflow: "hidden" }}>
                <div className="sh" style={{ width: "100%", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
                        <thead>
                            {table.getHeaderGroups().map(hg => (
                                <tr key={hg.id} style={{ background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                                    {hg.headers.map(h => (
                                        <th key={h.id} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading
                                ? [...Array(5)].map((_, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                                        {columns.map((_, j) => (
                                            <td key={j} style={{ padding: "14px 16px" }}>
                                                <div style={{ height: 14, background: "#F3F4F6", borderRadius: 6, width: j === 1 ? "70%" : "50%" }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : table.getRowModel().rows.length === 0
                                    ? <tr><td colSpan={columns.length} style={{ padding: "48px", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>No projects found. Create your first project!</td></tr>
                                    : table.getRowModel().rows.map((row, i) => (
                                        <tr key={row.id}
                                            onClick={() => navigate(`/projects/${row.original.id}`)}
                                            style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 1 ? "#FAFAFA" : "#fff", cursor: "pointer" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                                            onMouseLeave={e => e.currentTarget.style.background = i % 2 === 1 ? "#FAFAFA" : "#fff"}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} style={{ padding: "12px 16px", fontSize: "0.875rem" }}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#6B7280" }}>
                        <span>Rows per page:</span>
                        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
                            style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "3px 8px", fontSize: "0.82rem", color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}>
                            {[5, 10, 20, 50].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: "0.82rem", color: "#6B7280", marginRight: 8 }}>
                            {total ? `${from}–${to} of ${total}` : "0"}
                        </span>
                        <PBtn onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>«</PBtn>
                        <PBtn onClick={() => setPageIndex(p => p - 1)} disabled={pageIndex === 0}>‹</PBtn>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            let page = i;
                            if (totalPages > 5) {
                                if (pageIndex < 3) page = i;
                                else if (pageIndex > totalPages - 3) page = totalPages - 5 + i;
                                else page = pageIndex - 2 + i;
                            }
                            return <PBtn key={page} onClick={() => setPageIndex(page)} active={page === pageIndex}>{page + 1}</PBtn>;
                        })}
                        <PBtn onClick={() => setPageIndex(p => p + 1)} disabled={pageIndex >= totalPages - 1}>›</PBtn>
                        <PBtn onClick={() => setPageIndex(totalPages - 1)} disabled={pageIndex >= totalPages - 1}>»</PBtn>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── ProjectEdit ──────────────────────────────────────────────────────────────
export const ProjectEdit = (props) => (
    <Edit {...props} component="div">
        <SimpleForm>
            <FormCard>
                <ProjectFormFields isCreate={false} />
            </FormCard>
        </SimpleForm>
    </Edit>
);

// ─── ProjectCreate ────────────────────────────────────────────────────────────
export const ProjectCreate = (props) => (
    <Create {...props} component="div">
        <SimpleForm>
            <FormCard>
                <ProjectFormFields isCreate={true} />
            </FormCard>
        </SimpleForm>
    </Create>
);