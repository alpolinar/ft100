import { Route } from "@/common/routes";
import { CallBack } from "@/common/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading-circle";
import { ApolloError } from "@apollo/client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
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
    onValidateCode: (
        code: number,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => Promise<void>;
}>;

enum SignInFormSteps {
    form = "form",
    code = "code",
}

export default function SignInForm({
    onValidateEmail,
    onValidateCode,
}: SignInFormProps) {
    const router = useRouter();
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
            <AuthCodeForm
                onSubmit={async (code) => {
                    await onValidateCode(code, {
                        onComplete: () => {
                            router.push(Route.game);
                        },
                    });
                }}
            />
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
                            {isSubmitting && <LoadingCircle />} Sign In
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
