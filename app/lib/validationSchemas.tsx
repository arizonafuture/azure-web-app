import * as yup from "yup";

export const step1Schema = yup.object().shape({
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
    email: yup
        .string()
        .email("Enter a valid email.")
        .required("Email is required."),
    mediaOutlet: yup.string().required("Media outlet is required."),
    password: yup
        .string()
        .required("Password is required.")
        .min(10, "Password must be at least 10 characters.")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter.")
        .matches(/[0-9]/, "Must contain at least one number.")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one symbol."),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match.")
        .required("Please confirm your password."),
});

// Custom relaxed URL regex (accepts localhost + http/https)
const urlRegex =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([/#?]?.*)$/i;

export const step2Schema = yup.object().shape({
    title: yup.string().required("Title is required."),

    cellPhone: yup
        .string()
        .matches(/^[0-9]+$/, "Enter a valid phone number.")
        .min(10, "Enter a valid phone number.")
        .max(15, "Enter a valid phone number.")
        .required("Cell phone is required."),

    workPhone: yup
        .string()
        .matches(/^[0-9]+$/, "Enter a valid phone number.")
        .min(10, "Enter a valid phone number.")
        .max(15, "Enter a valid phone number.")
        .required("Work phone is required."),

    // linkedIn: yup
    //     .string()
    //     .matches(urlRegex, "Enter a valid URL.")
    //     .nullable()
    //     .transform((value) => (value === "" ? null : value)),

    biography: yup.string().required("Biography is required."),

    // categories: yup
    //     .array()
    //     .of(yup.string())
    //     .min(1, "Please select at least one category.")
    //     .required("Please select at least one category."),


    yearInMedia: yup
        .string()
        .matches(/^\d{4}$/, "Enter a valid year (YYYY).")
        .test(
            "valid-year",
            "Year must be between 1900 and current year.",
            (value) => {
                const year = Number(value);
                const current = new Date().getFullYear();
                return year >= 1900 && year <= current;
            }
        )
        .required("Year is required."),

    yearInArizona: yup
        .string()
        .matches(/^\d{4}$/, "Enter a valid year (YYYY).")
        .test(
            "valid-year",
            "Year must be between 1900 and current year.",
            (value) => {
                const year = Number(value);
                const current = new Date().getFullYear();
                return year >= 1900 && year <= current;
            }
        )
        .required("Year is required."),

    receiveCommunications: yup.boolean()
});

export const myAccountSchema = yup.object().shape({
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),

    workemail: yup
        .string()
        .email("Enter a valid email address.")
        .required("Email is required."),

    mediaOutlet: yup.string().required("Media outlet is required."),
    title: yup.string().required("Title is required."),

    cellPhone: yup
        .string()
        .matches(/^[0-9]+$/, "Enter a valid phone number.")
        .min(10, "Enter a valid phone number.")
        .max(15, "Enter a valid phone number.")
        .required("Cell phone is required."),

    workPhone: yup
        .string()
        .matches(/^[0-9]+$/, "Enter a valid phone number.")
        .min(10, "Enter a valid phone number.")
        .max(15, "Enter a valid phone number.")
        .required("Work phone is required."),

    interestCategories: yup
        .array()
        .of(yup.string())
        .min(1, "Please select at least one category.")
        .required("Please select at least one category."),

    yearBegan: yup
        .string()
        .matches(/^\d{4}$/, "Enter a valid year (YYYY).")
        .test(
            "valid-year",
            "Year must be between 1900 and current year.",
            (value) => {
                const year = Number(value);
                const current = new Date().getFullYear();
                return year >= 1900 && year <= current;
            }
        )
        .required("Year is required."),

    yearStarted: yup
        .string()
        .matches(/^\d{4}$/, "Enter a valid year (YYYY).")
        .test(
            "valid-year",
            "Year must be between 1900 and current year.",
            (value) => {
                const year = Number(value);
                const current = new Date().getFullYear();
                return year >= 1900 && year <= current;
            }
        )
        .required("Year is required."),

    receiveComm: yup.boolean(),
});