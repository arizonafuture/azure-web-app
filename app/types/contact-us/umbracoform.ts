interface FieldType {
  id: string;
  name: string;
  renderInputType: string;
  supportsPreValues: boolean;
  supportsUploadTypes: boolean;
}

interface Field {
  alias: string;
  caption: string;
  helpText?: string;
  id: string;
  pattern?: string;
  patternInvalidErrorMessage?: string;
  required: boolean;
  requiredErrorMessage: string;
  cssClass?: string;
  preValues?: Array<{ caption: string; value: string }>;
  settings?: { placeholder?: string; showLabel?: string; fieldType?: string };
  type: FieldType;
}

interface Page {
  caption: string;
  fieldSets: {
    caption: string;
    id: string;
    containers: {
      caption: string;
      width: number;
      fields: Field[];
    }[];
  }[];
}

interface FormDefinition {
  id: string;
  name: string;
  submitLabel: string;
  messageOnSubmit: string;
  pages: Page[];
}

interface Props {
  formId: string;
  resetTrigger: number;
}

interface FormFieldType {
  id: string;
  name: string;
  renderInputType: string;
  supportsPreValues: boolean;
  supportsUploadTypes: boolean;
}

interface FormField {
  alias: string;
  caption: string;
  helpText?: string;
  id: string;
  pattern?: string;
  patternInvalidErrorMessage?: string;
  required: boolean;
  requiredErrorMessage: string;
  cssClass?: string;
  preValues?: Array<{ caption: string; value: string }>;
  settings?: { placeholder?: string; showLabel?: string; fieldType?: string };
  type: FormFieldType;
}

interface FormPage {
  caption: string;
  fieldsets: {
    caption: string;
    id: string;
    columns: {
      caption: string;
      width: number;
      fields: FormField[];
    }[];
  }[];
}

interface UmbracoForm {
  id: string;
  name: string;
  submitLabel: string;
  messageOnSubmit: string;
  pages: FormPage[];
}

interface Props {
  formId: string;
  resetTrigger: number;
}
