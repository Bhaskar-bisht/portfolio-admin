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

export const SocialLinkList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="platform" />
            <TextField source="url" />
        </Datagrid>
    </List>
);

export const SocialLinkEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <SelectInput
                source="platform"
                choices={[
                    { id: "github", name: "GitHub" },
                    { id: "linkedin", name: "LinkedIn" },
                    { id: "twitter", name: "Twitter" },
                ]}
            />
            <TextInput source="url" validate={required()} fullWidth />
            <BooleanInput source="isActive" />
        </SimpleForm>
    </Edit>
);

export const SocialLinkCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <SelectInput
                source="platform"
                choices={[
                    { id: "github", name: "GitHub" },
                    { id: "linkedin", name: "LinkedIn" },
                ]}
                validate={required()}
            />
            <TextInput source="url" validate={required()} fullWidth />
        </SimpleForm>
    </Create>
);
