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

export const TagList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
        </Datagrid>
    </List>
);

export const TagEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="colorCode" />
        </SimpleForm>
    </Edit>
);

export const TagCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
        </SimpleForm>
    </Create>
);
