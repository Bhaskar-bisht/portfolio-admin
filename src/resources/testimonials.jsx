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

export const TestimonialList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="company" />
            <NumberField source="rating" />
        </Datagrid>
    </List>
);

export const TestimonialEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="company" />
            <TextInput source="content" multiline rows={5} fullWidth />
            <NumberInput source="rating" min={1} max={5} />
            <BooleanInput source="isApproved" />
        </SimpleForm>
    </Edit>
);

export const TestimonialCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="content" multiline rows={5} fullWidth validate={required()} />
            <NumberInput source="rating" min={1} max={5} defaultValue={5} />
        </SimpleForm>
    </Create>
);
