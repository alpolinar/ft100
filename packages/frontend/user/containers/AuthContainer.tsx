"use client";

import { AuthType, Route } from "@/common/routes";
import { CallBack } from "@/common/types";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { ApolloError } from "@apollo/client";
import {
    useRegisterUserMutation,
    useValidateUserEmailMutation,
    useValidateUserTokenMutation,
} from "@ods/server-lib";
import { TabsList } from "@radix-ui/react-tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import SignInForm from "../views/SignInForm";
import { useUserStore } from "../zustand/store";
import SignUpForm from "../views/SignUpForm";

type AuthContainerProps = Readonly<{
    authType: AuthType | undefined;
}>;

export default function AuthContainer({ authType }: AuthContainerProps) {
    const [validateUserEmail] = useValidateUserEmailMutation();
    const [validateUserToken] = useValidateUserTokenMutation();
    const [registerUser] = useRegisterUserMutation();

    const setUser = useUserStore((state) => state.setUser);

    const [userEmail, setUserEmail] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    const handleModeChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        router.push(`?${params.toString()}`);
    };

    const handleValidateEmail = async (
        email: string,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => {
        await validateUserEmail({
            variables: {
                input: {
                    email,
                },
            },
            onCompleted: (data) => {
                if (!data.validateUserEmail) {
                    toast.error("No User Found", {
                        duration: 5000,
                    });
                } else {
                    toast.success(
                        "Your login code has been sent to your email."
                    );
                    setUserEmail(email);
                }
                cb?.onComplete?.(data.validateUserEmail);
            },
            onError: (err) => {
                cb?.onError?.(err);
                toast.error(err.message, {
                    duration: 5000,
                });
            },
        });
    };

    const handleValidateToken = async (
        code: number,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => {
        await validateUserToken({
            variables: {
                input: {
                    code,
                    email: userEmail,
                },
            },
            onCompleted: (data) => {
                cb?.onComplete?.(true);
                setUser(data.validateUserToken);
            },
            onError: (err) => {
                cb?.onError?.(err);
                toast.error("Login code verification failed.");
            },
        });
    };

    const handleRegisterUser = async (
        email: string,
        cb?: Partial<CallBack<boolean, ApolloError>>
    ) => {
        await registerUser({
            variables: {
                input: {
                    email,
                },
            },
            onCompleted: (data) => {
                if (!data.registerUser) {
                    toast.error("Account registration failed.", {
                        duration: 5000,
                    });
                } else {
                    toast.success(
                        "Your login code has been sent to your email."
                    );
                    setUserEmail(email);
                }
                cb?.onComplete?.(data.registerUser);
            },
            onError: (err) => {
                cb?.onError?.(err);
                toast.error(err.message, {
                    duration: 5000,
                });
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8">
            <div className="w-full max-w-sm p-4 md:p-8 rounded-2xl shadow-lg border bg-white">
                <Tabs
                    defaultValue={authType ?? AuthType.signIn}
                    onValueChange={(val) => {
                        handleModeChange("type", val);
                    }}
                    className="gap-4"
                >
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value={AuthType.signIn}>
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value={AuthType.signUp}>
                            Sign Up
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={AuthType.signIn}>
                        <SignInForm
                            onValidateEmail={handleValidateEmail}
                            onValidateCode={handleValidateToken}
                        />
                    </TabsContent>
                    <TabsContent value={AuthType.signUp}>
                        <SignUpForm
                            onRegisterUser={handleRegisterUser}
                            onValidateCode={handleValidateToken}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
