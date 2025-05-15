"use client";

import { Route } from "@/common/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading-circle";
import { generateGameId } from "@/utils/helpers";
import {
    useConnectPlayerMutation,
    useCreateGameMutation,
} from "@ods/server-lib";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useGameStore } from "../zustand/store";

const ZFormSchema = z.object({
    gameId: z.string().min(10),
});

type TFormSchema = z.infer<typeof ZFormSchema>;

export function GameDashboardContainer() {
    const router = useRouter();
    const game = useGameStore((state) => state.game);
    const setGame = useGameStore((state) => state.setGame);
    const removeGame = useGameStore((state) => state.removeGame);

    const [createGameMutation] = useCreateGameMutation();
    const [connectPlayer] = useConnectPlayerMutation();

    const handleCreateGame = () => {
        createGameMutation({
            variables: {
                input: {
                    gameId: generateGameId(),
                },
            },
            onCompleted: ({ createGame }) => {
                setGame(createGame);
            },
            onError: (err) => {
                toast.error(err.message);
            },
        });
    };

    const handleJoinGame = async (gameId: string) => {
        await connectPlayer({
            variables: {
                input: {
                    gameId,
                },
            },
            onCompleted: (data) => {
                setGame(data.connectPlayer);
                router.push(`${Route.game}/${gameId}`);
            },
            onError: (err) => {
                removeGame();
                toast.error(err.message, {
                    duration: 5000,
                });
            },
        });
    };

    const form = useForm({
        defaultValues: {
            gameId: game?.gameId ?? "",
        } as TFormSchema,
        validators: {
            onChange: ZFormSchema,
        },
        onSubmit: async ({ value }) => {
            await handleJoinGame(value.gameId);
        },
    });

    return (
        <div className="flex flex-col gap-2">
            <p>build a UI for creating a game and joining a game</p>
            <Button onClick={handleCreateGame} disabled={game?.gameId !== ""}>
                create game
            </Button>
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
