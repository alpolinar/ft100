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
import SignUpConfirmation from "./SignUpConfirmation";

const ZFormSchema = z.object({
    email: z.string().email("Please enter a valid email."),
});

type TFormSchema = z.infer<typeof ZFormSchema>;

type SignUpFormProps = Readonly<{
    onRegisterUser: (
        email: string,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => Promise<void>;
    onValidateCode: (
        code: number,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => Promise<void>;
}>;

enum SignUpFormSteps {
    form = "form",
    code = "code",
    confirmation = "confirmation",
}

export default function SignUpForm({
    onRegisterUser,
    onValidateCode,
}: SignUpFormProps) {
    const [step, setStep] = useState<SignUpFormSteps>(SignUpFormSteps.form);
    return match(step)
        .with(SignUpFormSteps.form, () => (
            <SignUpView
                onSubmit={async (email) => {
                    await onRegisterUser(email, {
                        onComplete: (data) => {
                            if (data) {
                                setStep(SignUpFormSteps.code);
                            }
                        },
                    });
                }}
            />
        ))
        .with(SignUpFormSteps.code, () => (
            <AuthCodeForm
                onSubmit={async (code) => {
                    await onValidateCode(code, {
                        onComplete: () => {
                            setStep(SignUpFormSteps.confirmation);
                        },
                    });
                }}
            />
        ))
        .with(SignUpFormSteps.confirmation, () => <SignUpConfirmation />)
        .exhaustive();
}

function SignUpView({
    onSubmit,
}: Readonly<{ onSubmit: (email: string) => Promise<void> }>) {
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
            <div className="flex flex-col gap-2">
                <form.Field name="email">
                    {({ name, state, handleBlur, handleChange }) => (
                        <div className="flex flex-col gap-2">
                            <Label>Email</Label>
                            <div className="flex flex-col gap-1">
                                <Input
                                    aria-invalid={
                                        !state.meta.isValid &&
                                        state.meta.isTouched
                                    }
                                    name={name}
                                    value={state.value}
                                    onBlur={handleBlur}
                                    onChange={(e) =>
                                        handleChange(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    disabled={form.state.isSubmitting}
                                />
                                <p className="text-destructive text-sm min-h-5">
                                    {state.meta.errors
                                        .map((e) => e?.message || "")
                                        .join(" ")}
                                </p>
                            </div>
                        </div>
                    )}
                </form.Field>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button disabled={!canSubmit || isSubmitting}>
                            {isSubmitting && <LoadingCircle />} Sign Up
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
