/** @format */

import { Datagrid, Edit, List, NumberInput, required, SimpleForm, TextField, TextInput } from "react-admin";

export const UserList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="bio" />
            <TextField source="currentPosition" />
            <TextField source="yearsOfExperience" />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="email" validate={required()} />
            <TextInput source="bio" multiline fullWidth />
            <TextInput source="currentPosition" />
            <NumberInput source="yearsOfExperience" />
        </SimpleForm>
    </Edit>
);
