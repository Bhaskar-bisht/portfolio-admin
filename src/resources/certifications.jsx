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

export const CertificationList = (props) => (
  <List {...props}><Datagrid rowClick="edit">
    <TextField source="title" />
    <TextField source="issuingOrganization" />
    <DateField source="issueDate" />
  </Datagrid></List>
);

export const CertificationEdit = (props) => (
  <Edit {...props}><SimpleForm>
    <TextInput source="title" validate={required()} fullWidth />
    <TextInput source="issuingOrganization" validate={required()} />
    <DateInput source="issueDate" />
  </SimpleForm></Edit>
);

export const CertificationCreate = (props) => (
  <Create {...props}><SimpleForm>
    <TextInput source="title" validate={required()} fullWidth />
    <TextInput source="issuingOrganization" validate={required()} />
    <DateInput source="issueDate" validate={required()} />
  </SimpleForm></Create>
);
