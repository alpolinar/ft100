import { AuthType, Route } from "@/common/routes";
import { SearchParams } from "@/common/ssr-params";
import AuthContainer from "@/user/containers/AuthContainer";
import { redirect } from "next/navigation";

export default async function AuthUserPage({ searchParams }: SearchParams) {
    const { type } = await searchParams;

    if (
        typeof type !== "undefined" &&
        type !== AuthType.signIn &&
        type !== AuthType.signUp
    ) {
        redirect(`${Route.auth}?type=${AuthType.signIn}`);
    }

    return <AuthContainer authType={type} />;
}
