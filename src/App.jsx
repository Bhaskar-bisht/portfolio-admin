/** @format */

// src/App.jsx
import { Admin, Resource } from "react-admin";
import authProvider from "./authProvider";
import dataProvider from "./dataProvider";

// Icons from lucide-react
import {
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
    // Certificate,
    Trophy,
    Users,
} from "lucide-react";

// Import resources
import { AchievementCreate, AchievementEdit, AchievementList } from "./resources/achievements";
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

const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider} title="Portfolio Admin Panel">
        {/* Users */}
        <Resource name="users" list={UserList} edit={UserEdit} icon={Users} options={{ label: "Users" }} />

        {/* Projects */}
        <Resource
            name="projects"
            list={ProjectList}
            edit={ProjectEdit}
            create={ProjectCreate}
            icon={FolderKanban}
            options={{ label: "Projects" }}
        />

        {/* Blogs */}
        <Resource
            name="blogs"
            list={BlogList}
            edit={BlogEdit}
            create={BlogCreate}
            icon={FileText}
            options={{ label: "Blogs" }}
        />

        {/* Technologies */}
        <Resource
            name="technologies"
            list={TechnologyList}
            edit={TechnologyEdit}
            create={TechnologyCreate}
            icon={Code}
            options={{ label: "Technologies" }}
        />

        {/* Categories */}
        <Resource
            name="categories"
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
            icon={Tag}
            options={{ label: "Categories" }}
        />

        {/* Skills */}
        <Resource
            name="skills"
            list={SkillList}
            edit={SkillEdit}
            create={SkillCreate}
            icon={Award}
            options={{ label: "Skills" }}
        />

        {/* Experiences */}
        <Resource
            name="experiences"
            list={ExperienceList}
            edit={ExperienceEdit}
            create={ExperienceCreate}
            icon={Briefcase}
            options={{ label: "Experiences" }}
        />

        {/* Education */}
        <Resource
            name="educations"
            list={EducationList}
            edit={EducationEdit}
            create={EducationCreate}
            icon={GraduationCap}
            options={{ label: "Education" }}
        />

        {/* Certifications */}
        <Resource
            name="certifications"
            list={CertificationList}
            edit={CertificationEdit}
            create={CertificationCreate}
            icon={FileBadge}
            options={{ label: "Certifications" }}
        />

        {/* Achievements */}
        <Resource
            name="achievements"
            list={AchievementList}
            edit={AchievementEdit}
            create={AchievementCreate}
            icon={Trophy}
            options={{ label: "Achievements" }}
        />

        {/* Services */}
        <Resource
            name="services"
            list={ServiceList}
            edit={ServiceEdit}
            create={ServiceCreate}
            icon={Server}
            options={{ label: "Services" }}
        />

        {/* Testimonials */}
        <Resource
            name="testimonials"
            list={TestimonialList}
            edit={TestimonialEdit}
            create={TestimonialCreate}
            icon={MessageSquare}
            options={{ label: "Testimonials" }}
        />

        {/* Social Links */}
        <Resource
            name="social-links"
            list={SocialLinkList}
            edit={SocialLinkEdit}
            create={SocialLinkCreate}
            icon={Share2}
            options={{ label: "Social Links" }}
        />

        {/* Tags */}
        <Resource name="tags" list={TagList} edit={TagEdit} create={TagCreate} icon={Tag} options={{ label: "Tags" }} />

        {/* Contact Messages */}
        <Resource name="contacts" list={ContactList} edit={ContactEdit} icon={Mail} options={{ label: "Messages" }} />
    </Admin>
);

export default App;
