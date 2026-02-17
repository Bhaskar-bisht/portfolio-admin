/** @format */

import {
    AutocompleteInput,
    BooleanInput,
    Create,
    Datagrid,
    Edit,
    List,
    NumberField,
    NumberInput,
    ReferenceInput,
    SimpleForm,
    TextField,
} from "react-admin";

// ============================================
// SKILLS
// ============================================
export const SkillList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="technologyId.name" label="Technology" />
            <NumberField source="proficiencyPercentage" label="%" />
            <NumberField source="yearsOfExperience" label="Years" />
        </Datagrid>
    </List>
);

export const SkillEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput source="technologyId" reference="technologies">
                <AutocompleteInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="proficiencyPercentage" min={0} max={100} />
            <NumberInput source="yearsOfExperience" min={0} />
            <BooleanInput source="isPrimarySkill" />
        </SimpleForm>
    </Edit>
);

export const SkillCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="technologyId" reference="technologies">
                <AutocompleteInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="proficiencyPercentage" min={0} max={100} defaultValue={50} />
            <NumberInput source="yearsOfExperience" min={0} defaultValue={0} />
        </SimpleForm>
    </Create>
);
