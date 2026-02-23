/** @format */

import { Box, IconButton, Tooltip } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Moon, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import { Admin, AppBar, defaultTheme, Resource, TitlePortal } from "react-admin";
import authProvider from "./authProvider";
// import { CustomLayout } from "./CustomLayout";
import Dashboard from "./Dashboard";
import dataProvider from "./dataProvider";

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
    Server,
    Share2,
    Tag,
    Trophy,
    Users,
} from "lucide-react";

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

// ─── AppBar with dark toggle ──────────────────────────────────────────────────
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

    // Pass appBar with dark toggle; CustomLayout handles sidebar itself
    // const AppLayout = (props) => (
    //     <CustomLayout {...props} appBar={() => <CustomAppBar dark={dark} onToggle={() => setDark((d) => !d)} />} />
    // );

    return (
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            title="Portfolio Admin Panel"
            theme={theme}
            dashboard={Dashboard}
            // layout={AppLayout}
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
