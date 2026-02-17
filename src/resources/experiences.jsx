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
// EXPERIENCES
// ============================================
export const ExperienceList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="companyName" />
            <TextField source="position" />
            <BooleanField source="isCurrent" />
            <DateField source="startDate" />
        </Datagrid>
    </List>
);

export const ExperienceEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="companyName" validate={required()} />
            <TextInput source="position" validate={required()} />

            <SelectInput
                source="employmentType"
                choices={[
                    { id: "full_time", name: "Full Time" },
                    { id: "contract", name: "Contract" },
                    { id: "freelance", name: "Freelance" },
                ]}
            />

            <DateInput source="startDate" />
            <DateInput source="endDate" />
            <BooleanInput source="isCurrent" />

            <ImageInput source="companyLogo" label="Company Logo" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

export const ExperienceCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="companyName" validate={required()} />
            <TextInput source="position" validate={required()} />
            <DateInput source="startDate" validate={required()} />
            <BooleanInput source="isCurrent" defaultValue={false} />
        </SimpleForm>
    </Create>
);
