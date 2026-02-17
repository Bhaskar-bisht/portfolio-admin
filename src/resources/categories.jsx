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
// CATEGORIES
// ============================================
export const CategoryList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <BooleanField source="isActive" />
        </Datagrid>
    </List>
);

export const CategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="description" multiline fullWidth />
            <TextInput source="colorCode" />
            <BooleanInput source="isActive" />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <BooleanInput source="isActive" defaultValue={true} />
        </SimpleForm>
    </Create>
);
