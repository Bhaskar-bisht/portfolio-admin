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
// TECHNOLOGIES
// ============================================
export const TechnologyList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="category" />
            <BooleanField source="isFeatured" />
        </Datagrid>
    </List>
);

export const TechnologyEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />

            <SelectInput
                source="category"
                choices={[
                    { id: "frontend", name: "Frontend" },
                    { id: "backend", name: "Backend" },
                    { id: "database", name: "Database" },
                    { id: "devops", name: "DevOps" },
                ]}
            />

            <ImageInput source="logo" label="Logo" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <TextInput source="colorCode" placeholder="#3B82F6" />
            <BooleanInput source="isFeatured" />
            <NumberInput source="displayOrder" defaultValue={0} />
        </SimpleForm>
    </Edit>
);

export const TechnologyCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />

            <SelectInput
                source="category"
                choices={[
                    { id: "frontend", name: "Frontend" },
                    { id: "backend", name: "Backend" },
                    { id: "database", name: "Database" },
                ]}
                defaultValue="frontend"
            />

            <ImageInput source="logo" label="Logo" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <TextInput source="colorCode" placeholder="#3B82F6" />
        </SimpleForm>
    </Create>
);
