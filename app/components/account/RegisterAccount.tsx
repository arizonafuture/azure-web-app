"use client";
import React from "react";
import RegisterForm from "./RegisterUser";
import AuthPageHeader from "../common/AuthPageHeader";

interface RegisterAccountProps {
    content: {
        properties: {
            headline: string;
            subHeadline?: string;
        };
    };
}


const RegisterAccount = ({ content }: RegisterAccountProps) => {
    const { headline, subHeadline } = content.properties;


    {
        return (
            <>

                <RegisterForm></RegisterForm>
            </>
        );
    }
};

export default RegisterAccount;
