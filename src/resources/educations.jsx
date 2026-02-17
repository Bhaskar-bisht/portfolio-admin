/** @format */

import {
    BooleanInput,
    Create,
    Datagrid,
    DateField,
    Edit,
    List,
    required,
    SimpleForm,
    TextField,
    TextInput,
} from "react-admin";

// ============================================
// EDUCATION
// ============================================
export const EducationList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="institutionName" />
            <TextField source="degree" />
            <DateField source="startDate" />
        </Datagrid>
    </List>
);

export const EducationEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="institutionName" validate={required()} fullWidth />
            <TextInput source="degree" validate={required()} />
            <TextInput source="fieldOfStudy" />
            <DateInput source="startDate" />
            <DateInput source="endDate" />
            <BooleanInput source="isCurrent" />
        </SimpleForm>
    </Edit>
);

export const EducationCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="institutionName" validate={required()} fullWidth />
            <TextInput source="degree" validate={required()} />
            <DateInput source="startDate" validate={required()} />
        </SimpleForm>
    </Create>
);
