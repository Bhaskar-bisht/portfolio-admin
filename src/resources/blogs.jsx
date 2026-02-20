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
    NumberField,
    ReferenceArrayInput,
    required,
    SelectArrayInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
} from "react-admin";
// ============================================
// BLOGS
// ============================================
export const BlogList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="title" />
            <TextField source="status" />
            <BooleanField source="isFeatured" />
            <NumberField source="viewsCount" label="Views" />
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);

export const BlogEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="excerpt" multiline rows={3} fullWidth />
            <TextInput source="body" multiline rows={10} fullWidth />

            <SelectInput
                source="status"
                choices={[
                    { id: "draft", name: "Draft" },
                    { id: "published", name: "Published" },
                ]}
            />

            <ImageInput source="featuredImage" label="Featured Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ReferenceArrayInput source="tags" reference="tags">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>

            <BooleanInput source="isFeatured" />
        </SimpleForm>
    </Edit>
);

export const BlogCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" validate={required()} fullWidth />
            <TextInput source="excerpt" multiline rows={3} fullWidth />
            <TextInput source="body" multiline rows={10} fullWidth validate={required()} />

            <SelectInput
                source="status"
                choices={[
                    { id: "draft", name: "Draft" },
                    { id: "published", name: "Published" },
                ]}
                defaultValue="draft"
            />

            <ImageInput source="featuredImage" label="Featured Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
