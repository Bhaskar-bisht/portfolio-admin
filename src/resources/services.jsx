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

export const ServiceList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <BooleanField source="isActive" />
        </Datagrid>
    </List>
);

export const ServiceEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="description" multiline fullWidth />
            <NumberInput source="startingPrice" />
            <BooleanInput source="isActive" />
        </SimpleForm>
    </Edit>
);

export const ServiceCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <BooleanInput source="isActive" defaultValue={true} />
        </SimpleForm>
    </Create>
);

