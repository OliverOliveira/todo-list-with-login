"use client"

import { ComponentType, SVGProps, InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
    label: string;
    name: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ Icon, label, name, type = "text", error, ...rest }, ref) => {
        return (
            <div className="w-full flex flex-col gap-1">
                <label htmlFor={name} className="text-white">{label}</label>
                <div className="flex gap-1 items-center rounded-lg bg-white p-1 border border-gray-100">
                    <Icon className="text-gray-400" />
                    <input
                        ref={ref}
                        type={type}
                        id={name}
                        name={name}
                        className="flex-1 p-2 text-gray-400 outline-none"
                        {...rest}
                    />
                </div>
                {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>
        )
    }
);

Input.displayName = "Input";