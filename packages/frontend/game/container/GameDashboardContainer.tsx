"use client";

import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading-circle";
import { generateGameId } from "@/utils/helpers";
import { useCreateGameMutation } from "@ods/server-lib";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const ZFormSchema = z.object({
    gameId: z.string().min(10),
});

type TFormSchema = z.infer<typeof ZFormSchema>;

export function GameDashboardContainer() {
    const router = useRouter();

    const [createGameMutation] = useCreateGameMutation();

    const handleCreateGame = () => {
        createGameMutation({
            variables: {
                input: {
                    gameId: generateGameId(),
                },
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleJoinGame = (gameId: string) => {
        router.push(`${Route.game}/${gameId}`);
    };

    const form = useForm({
        defaultValues: {
            gameId: "",
        } as TFormSchema,
        validators: {
            onChange: ZFormSchema,
        },
        onSubmit: ({ value }) => {
            handleJoinGame(value.gameId);
        },
    });

    return (
        <div className="flex flex-col gap-2">
            <Button onClick={handleCreateGame}>Create Game</Button>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <div className="flex flex-col gap-2">
                    <form.Field name="gameId">
                        {({ name, state, handleBlur, handleChange }) => (
                            <Input
                                name={name}
                                aria-invalid={
                                    !state.meta.isValid && state.meta.isTouched
                                }
                                value={state.value}
                                placeholder="Enter game ID"
                                onChange={(e) => handleChange(e.target.value)}
                                onBlur={handleBlur}
                                disabled={form.state.isSubmitting}
                            />
                        )}
                    </form.Field>
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button disabled={!canSubmit || isSubmitting}>
                                {isSubmitting && <LoadingCircle />} Join Game
                            </Button>
                        )}
                    </form.Subscribe>
                </div>
            </form>
        </div>
    );
}
