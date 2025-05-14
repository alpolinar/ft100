import { CallBack } from "@/common/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading-circle";
import { ApolloError } from "@apollo/client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { match } from "ts-pattern";
import { z } from "zod";
import AuthCodeForm from "./AuthCodeForm";

const ZFormSchema = z.object({
    email: z.string().email("Please enter a valid email."),
});

type TFormSchema = z.infer<typeof ZFormSchema>;

export type SignInFormProps = Readonly<{
    onValidateEmail: (
        email: string,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => Promise<void>;
    onValidateCode: (code: number) => Promise<void>;
}>;

enum SignInFormSteps {
    form = "form",
    code = "code",
}

export default function SignInForm({
    onValidateEmail,
    onValidateCode,
}: SignInFormProps) {
    const [step, setStep] = useState<SignInFormSteps>(SignInFormSteps.form);
    return match(step)
        .with(SignInFormSteps.form, () => (
            <SignInView
                onSubmit={async (email) => {
                    await onValidateEmail(email, {
                        onComplete: (data) => {
                            if (data) {
                                setStep(SignInFormSteps.code);
                            }
                        },
                    });
                }}
            />
        ))
        .with(SignInFormSteps.code, () => (
            <AuthCodeForm onSubmit={onValidateCode} />
        ))
        .exhaustive();
}

function SignInView({
    onSubmit,
}: Readonly<{
    onSubmit: (email: string) => Promise<void>;
}>) {
    const form = useForm({
        defaultValues: {
            email: "",
        } as TFormSchema,
        validators: {
            onChange: ZFormSchema,
        },
        onSubmit: async ({ value }) => {
            await onSubmit(value.email);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <div className="flex flex-col gap-4">
                <form.Field name="email">
                    {({ name, state, handleBlur, handleChange }) => (
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <Input
                                aria-invalid={
                                    !state.meta.isValid && state.meta.isTouched
                                }
                                name={name}
                                value={state.value}
                                onBlur={handleBlur}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="my@email.com"
                            />
                            {!state.meta.isValid && (
                                <em className="text-destructive">
                                    {state.meta.errors
                                        .map((e) => e?.message || "")
                                        .join(" ")}
                                </em>
                            )}
                        </div>
                    )}
                </form.Field>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button disabled={!canSubmit || isSubmitting}>
                            {isSubmitting && <LoadingCircle />} Sign In
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
