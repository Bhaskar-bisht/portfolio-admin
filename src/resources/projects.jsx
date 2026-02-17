/** @format */

import {
    BooleanField,
    BooleanInput,
    Create,
    Datagrid,
    DateField,
    Edit,
    ImageField,
    ImageInput,
    List,
    NumberInput,
    ReferenceArrayInput,
    required,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from "react-admin";

// ============================================
// PROJECTS
// ============================================
export const ProjectList = (props) => (
    <List {...props} sort={{ field: "createdAt", order: "DESC" }}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="slug" />
            <TextField source="projectType" label="Type" />
            <TextField source="status" />
            <BooleanField source="featured" />
            <BooleanField source="isPublished" label="Published" />
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);

export const ProjectEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="shortDescription" multiline rows={3} fullWidth />
            <TextInput source="fullDescription" multiline rows={5} fullWidth />

            <SelectInput
                source="projectType"
                choices={[
                    { id: "web", name: "Web" },
                    { id: "mobile", name: "Mobile" },
                    { id: "desktop", name: "Desktop" },
                    { id: "api", name: "API" },
                    { id: "other", name: "Other" },
                ]}
                validate={required()}
            />

            <SelectInput
                source="status"
                choices={[
                    { id: "planning", name: "Planning" },
                    { id: "in_progress", name: "In Progress" },
                    { id: "completed", name: "Completed" },
                    { id: "on_hold", name: "On Hold" },
                ]}
            />

            <ImageInput source="thumbnail" label="Thumbnail" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ImageInput source="banner" label="Banner" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ReferenceArrayInput source="categories" reference="categories">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>

            <TextInput source="clientName" fullWidth />
            <TextInput source="projectUrl" fullWidth />
            <TextInput source="githubUrl" fullWidth />

            <NumberInput source="priority" defaultValue={0} />
            <BooleanInput source="featured" />
            <BooleanInput source="isPublished" label="Publish" />
        </SimpleForm>
    </Edit>
);

export const ProjectCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="shortDescription" multiline rows={3} fullWidth />

            <SelectInput
                source="projectType"
                choices={[
                    { id: "web", name: "Web" },
                    { id: "mobile", name: "Mobile" },
                ]}
                defaultValue="web"
            />

            <SelectInput
                source="status"
                choices={[
                    { id: "completed", name: "Completed" },
                    { id: "in_progress", name: "In Progress" },
                ]}
                defaultValue="completed"
            />

            <ImageInput source="thumbnail" label="Thumbnail" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <BooleanInput source="isPublished" defaultValue={false} />
        </SimpleForm>
    </Create>
);
