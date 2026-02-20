/** @format */

import { Box, IconButton, Tooltip } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
    Activity,
    Award,
    Briefcase,
    Code,
    FileBadge,
    FileText,
    FolderKanban,
    GraduationCap,
    Mail,
    MessageSquare,
    Moon,
    Server,
    Share2,
    Sun,
    Tag,
    Trophy,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Admin, AppBar, defaultTheme, Layout, Resource, TitlePortal } from "react-admin";

import authProvider from "./authProvider";
import Dashboard from "./Dashboard";
import dataProvider from "./dataProvider";

import { AchievementCreate, AchievementEdit, AchievementList } from "./resources/achievements";
import { ApiLogList, ApiLogShow } from "./resources/apiLogs";
import { BlogCreate, BlogEdit, BlogList } from "./resources/blogs";
import { CategoryCreate, CategoryEdit, CategoryList } from "./resources/categories";
import { CertificationCreate, CertificationEdit, CertificationList } from "./resources/certifications";
import { ContactEdit, ContactList } from "./resources/contacts";
import { EducationCreate, EducationEdit, EducationList } from "./resources/educations";
import { ExperienceCreate, ExperienceEdit, ExperienceList } from "./resources/experiences";
import { ProjectCreate, ProjectEdit, ProjectList } from "./resources/projects";
import { ServiceCreate, ServiceEdit, ServiceList } from "./resources/services";
import { SkillCreate, SkillEdit, SkillList } from "./resources/skills";
import { SocialLinkCreate, SocialLinkEdit, SocialLinkList } from "./resources/socialLinks";
import { TagCreate, TagEdit, TagList } from "./resources/tags";
import { TechnologyCreate, TechnologyEdit, TechnologyList } from "./resources/technologies";
import { TestimonialCreate, TestimonialEdit, TestimonialList } from "./resources/testimonials";
import { UserEdit, UserList } from "./resources/users";

// ─── Global CSS — sidebar sticky fix + fullwidth forms ────────────────────────
if (typeof document !== "undefined" && !document.getElementById("ra-app-fix")) {
    const s = document.createElement("style");
    s.id = "ra-app-fix";
    s.textContent = `
        /* Root layout fills viewport, no body scroll */
        html, body, #root { height: 100%; overflow: hidden !important; }

        /* Sidebar stays fixed — NEVER scrolls with content */
        .RaSidebar-root,
        .RaSidebar-fixed {
            position: sticky !important;
            top: 0 !important;
            height: 100vh !important;
            overflow-y: auto !important;
            flex-shrink: 0 !important;
            align-self: flex-start !important;
        }
        .RaSidebar-root::-webkit-scrollbar { display: none; }
        .RaSidebar-root { scrollbar-width: none; }

        /* Layout fills height, content area is the only scrolling element */
        .RaLayout-root,
        .RaLayout-appFrame { height: 100vh !important; overflow: hidden !important; }
        .RaLayout-contentWithSidebar {
            height: 100% !important;
            overflow: hidden !important;
            display: flex !important;
        }
        .RaLayout-content {
            flex: 1 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: 100% !important;
            padding: 0 !important;
        }

        /* Full-width edit / create / show */
        .RaEdit-main, .RaCreate-main, .RaShow-main,
        .RaEdit-main > *, .RaCreate-main > *, .RaShow-main > *,
        .RaEdit-main > * > *, .RaCreate-main > * > * {
            width: 100% !important; max-width: 100% !important;
        }
        .RaEdit-main .MuiCard-root, .RaCreate-main .MuiCard-root {
            width: 100% !important; max-width: 100% !important;
            box-shadow: none !important; background: transparent !important;
            border-radius: 0 !important;
        }
        .RaEdit-main .MuiCardContent-root,
        .RaCreate-main .MuiCardContent-root { padding: 0 !important; }
        .RaEdit-main .RaSimpleForm-form,
        .RaCreate-main .RaSimpleForm-form {
            width: 100% !important; padding: 0 !important;
            background: transparent !important; box-shadow: none !important;
        }

        /* Scrollbar hide utility */
        .sh { scrollbar-width: none; -ms-overflow-style: none; }
        .sh::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(s);
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const buildTheme = (dark) =>
    createTheme({
        ...defaultTheme,
        palette: {
            mode: dark ? "dark" : "light",
            primary: { main: "#2563EB", light: "#3B82F6", dark: "#1E40AF" },
            secondary: { main: "#10B981" },
            background: { default: dark ? "#0F172A" : "#F1F5F9", paper: dark ? "#1E293B" : "#FFFFFF" },
            text: { primary: dark ? "#F1F5FA" : "#111827", secondary: dark ? "#94A3B8" : "#6B7280" },
            error: { main: "#EF4444" },
            warning: { main: "#F59E0B" },
            info: { main: "#3B82F6" },
            success: { main: "#10B981" },
        },
        shape: { borderRadius: 8 },
        components: {
            // ── Sidebar: blue background, white text ──
            RaSidebar: {
                styleOverrides: {
                    root: {
                        backgroundColor: dark ? "#1E3A5F" : "#1D4ED8",
                        minHeight: "100vh",
                        "& .MuiDrawer-paper": {
                            backgroundColor: dark ? "#1E3A5F" : "#1D4ED8",
                            borderRight: "none",
                        },
                    },
                },
            },
            RaMenuItemLink: {
                styleOverrides: {
                    root: {
                        color: "#BFDBFE",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        margin: "2px 8px",
                        transition: "all 0.2s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" },
                        "& .MuiListItemIcon-root": { color: "#93C5FD", minWidth: "40px" },
                        "&.RaMenuItemLink-active": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                            borderLeft: "4px solid #fff",
                            color: "#fff",
                            fontWeight: 700,
                            "& .MuiListItemIcon-root": { color: "#fff" },
                        },
                    },
                },
            },
            // ── AppBar ──
            RaAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: dark ? "#1E293B" : "#FFFFFF",
                        color: dark ? "#F1F5FA" : "#111827",
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                    },
                },
            },
            MuiPaper: { styleOverrides: { root: { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", borderRadius: "8px" } } },
            MuiButton: {
                styleOverrides: {
                    root: { textTransform: "none", fontWeight: 600, borderRadius: "8px" },
                    contained: { boxShadow: "none" },
                },
            },
            MuiTableCell: { styleOverrides: { root: { padding: "13px 20px" } } },
            MuiChip: { styleOverrides: { root: { fontWeight: 600, fontSize: "0.75rem", height: "24px" } } },
            MuiOutlinedInput: { styleOverrides: { root: { borderRadius: "8px" } } },
            RaDatagrid: {
                styleOverrides: {
                    root: {
                        width: "100%",
                        "& table": { width: "100%", tableLayout: "auto" },
                        "& .RaDatagrid-headerCell": {
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            padding: "14px 20px",
                            whiteSpace: "nowrap",
                        },
                        "& .RaDatagrid-rowCell": { padding: "13px 20px", fontSize: "0.875rem" },
                    },
                },
            },
        },
    });

// ─── AppBar with dark/light toggle ───────────────────────────────────────────
const CustomAppBar = ({ dark, onToggle }) => (
    <AppBar>
        <TitlePortal />
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title={dark ? "Light Mode" : "Dark Mode"}>
            <IconButton onClick={onToggle} sx={{ color: "inherit", mr: 1 }}>
                {dark ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
        </Tooltip>
    </AppBar>
);

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => {
    const [dark, setDark] = useState(false);
    const theme = useMemo(() => buildTheme(dark), [dark]);

    const AppLayout = (props) => (
        <Layout {...props} appBar={() => <CustomAppBar dark={dark} onToggle={() => setDark((d) => !d)} />} />
    );

    return (
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            title="Portfolio Admin Panel"
            theme={theme}
            dashboard={Dashboard}
            layout={AppLayout}
        >
            <Resource name="users" list={UserList} edit={UserEdit} icon={Users} options={{ label: "Users" }} />
            <Resource
                name="api-logs"
                list={ApiLogList}
                show={ApiLogShow}
                icon={Activity}
                options={{ label: "API Logs" }}
            />
            <Resource
                name="projects"
                list={ProjectList}
                edit={ProjectEdit}
                create={ProjectCreate}
                icon={FolderKanban}
                options={{ label: "Projects" }}
            />
            <Resource
                name="blogs"
                list={BlogList}
                edit={BlogEdit}
                create={BlogCreate}
                icon={FileText}
                options={{ label: "Blogs" }}
            />
            <Resource
                name="technologies"
                list={TechnologyList}
                edit={TechnologyEdit}
                create={TechnologyCreate}
                icon={Code}
                options={{ label: "Technologies" }}
            />
            <Resource
                name="categories"
                list={CategoryList}
                edit={CategoryEdit}
                create={CategoryCreate}
                icon={Tag}
                options={{ label: "Categories" }}
            />
            <Resource
                name="skills"
                list={SkillList}
                edit={SkillEdit}
                create={SkillCreate}
                icon={Award}
                options={{ label: "Skills" }}
            />
            <Resource
                name="experiences"
                list={ExperienceList}
                edit={ExperienceEdit}
                create={ExperienceCreate}
                icon={Briefcase}
                options={{ label: "Experiences" }}
            />
            <Resource
                name="educations"
                list={EducationList}
                edit={EducationEdit}
                create={EducationCreate}
                icon={GraduationCap}
                options={{ label: "Education" }}
            />
            <Resource
                name="certifications"
                list={CertificationList}
                edit={CertificationEdit}
                create={CertificationCreate}
                icon={FileBadge}
                options={{ label: "Certifications" }}
            />
            <Resource
                name="achievements"
                list={AchievementList}
                edit={AchievementEdit}
                create={AchievementCreate}
                icon={Trophy}
                options={{ label: "Achievements" }}
            />
            <Resource
                name="services"
                list={ServiceList}
                edit={ServiceEdit}
                create={ServiceCreate}
                icon={Server}
                options={{ label: "Services" }}
            />
            <Resource
                name="testimonials"
                list={TestimonialList}
                edit={TestimonialEdit}
                create={TestimonialCreate}
                icon={MessageSquare}
                options={{ label: "Testimonials" }}
            />
            <Resource
                name="social-links"
                list={SocialLinkList}
                edit={SocialLinkEdit}
                create={SocialLinkCreate}
                icon={Share2}
                options={{ label: "Social Links" }}
            />
            <Resource
                name="tags"
                list={TagList}
                edit={TagEdit}
                create={TagCreate}
                icon={Tag}
                options={{ label: "Tags" }}
            />
            <Resource
                name="contacts"
                list={ContactList}
                edit={ContactEdit}
                icon={Mail}
                options={{ label: "Messages" }}
            />
        </Admin>
    );
};

export default App;
