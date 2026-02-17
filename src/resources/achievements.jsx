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

export const AchievementList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="achievementType" />
        </Datagrid>
    </List>
);

export const AchievementEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="description" multiline fullWidth />
            <BooleanInput source="isFeatured" />
        </SimpleForm>
    </Edit>
);

export const AchievementCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
        </SimpleForm>
    </Create>
);
