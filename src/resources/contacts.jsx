/** @format */

import { Datagrid, Edit, List, SelectInput, SimpleForm, TextField } from "react-admin";

export const ContactList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="subject" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

export const ContactEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="message" />
            <SelectInput
                source="status"
                choices={[
                    { id: "new", name: "New" },
                    { id: "read", name: "Read" },
                    { id: "replied", name: "Replied" },
                ]}
            />
        </SimpleForm>
    </Edit>
);
