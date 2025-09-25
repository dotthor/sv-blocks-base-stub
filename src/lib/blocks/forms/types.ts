// Base props that all form field components will share
export type BaseFormFieldProps = {
    form: any; // Could be more specific based on your superform type
    formData: any; // Could be more specific based on your form schema
    name: string;
    label?: string | false | null; // Optional: custom label, false/null to hide
    description?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    class?: string;
};