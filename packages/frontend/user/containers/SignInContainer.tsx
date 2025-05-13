"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

export default function SignInContainer() {
    const form = useForm({
        defaultValues: {
            email: "",
        },
    });
    return (
        <div className="flex flex-col g-2">
            Sign In
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <form.Field
                    name="email"
                    validators={{
                        onChange: z
                            .string()
                            .email("Please enter a valid email."),
                    }}
                >
                    {({ name, state, handleBlur, handleChange }) => (
                        <div className="flex flex-col g-1">
                            <input
                                name={name}
                                value={state.value}
                                onBlur={handleBlur}
                                type="email"
                                onChange={(e) => handleChange(e.target.value)}
                            />
                            {!state.meta.isValid && (
                                <em>{JSON.stringify(state.meta.errors)}</em>
                            )}
                        </div>
                    )}
                </form.Field>
            </form>
        </div>
    );
}
