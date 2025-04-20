import React, { FC, ReactNode } from "react";

interface FormWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  message?: string;
  messageType?: "error" | "success";
}

export const FormWrapper: FC<FormWrapperProps> = ({
  title,
  description,
  children,
  message,
  messageType = "error",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="max-w-md w-full bg-white p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
        {description && (
          <p className="text-center text-sm text-gray-600 mb-4">{description}</p>
        )}
        {message && (
          <p className={`mb-4 text-center ${messageType === "error" ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};
