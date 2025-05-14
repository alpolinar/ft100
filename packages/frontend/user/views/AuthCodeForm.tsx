import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import LoadingCircle from "@/components/ui/loading-circle";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";

const ZFormSchema = z.object({
    code: z.string().min(6),
});

type TFormSchema = z.infer<typeof ZFormSchema>;

type AuthCodeFormProps = {
    onSubmit: (code: number) => Promise<void>;
};

export default function AuthCodeForm({ onSubmit }: AuthCodeFormProps) {
    const form = useForm({
        defaultValues: {
            code: "",
        } as TFormSchema,
        validators: {
            onChange: ZFormSchema,
        },
        onSubmit: async ({ value, formApi }) => {
            await onSubmit(Number(value.code));
            formApi.reset();
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
            <div className="flex flex-col gap-4 items-center">
                <h1 className="text sm:text-2xl font-extrabold tracking-tight text-center text-black">
                    Enter Login Code
                </h1>
                <form.Field name="code">
                    {({ name, state, handleBlur, handleChange }) => (
                        <InputOTP
                            name={name}
                            maxLength={6}
                            value={state.value}
                            pattern={REGEXP_ONLY_DIGITS}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={form.state.isSubmitting}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />

                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    )}
                </form.Field>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            disabled={!canSubmit || isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting && <LoadingCircle />}Submit
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
