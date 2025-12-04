"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type RegisterData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mediaOutlet?: string;
  password?: string;
  confirmPassword?: string;
  categories?: string[];
};

type RegisterContextType = {
  formData: RegisterData;
  updateForm: (data: Partial<RegisterData>) => void;
  resetForm: () => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<RegisterData>({});

  const updateForm = (data: Partial<RegisterData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    sessionStorage.setItem(
      "registerData",
      JSON.stringify({ ...formData, ...data })
    );
  };

  const resetForm = () => {
    setFormData({});
    sessionStorage.removeItem("registerData");
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("registerData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  return (
    <RegisterContext.Provider value={{ formData, updateForm, resetForm }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error("useRegister must be used inside RegisterProvider");
  return ctx;
};
