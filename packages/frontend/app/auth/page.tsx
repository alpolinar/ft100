import { AuthType, Route } from "@/common/routes";
import { SearchParams } from "@/common/ssr-params";
import SignInContainer from "@/user/containers/SignInContainer";
import { redirect } from "next/navigation";
import { match } from "ts-pattern";

export default async function AuthUserPage({ searchParams }: SearchParams) {
    const { type } = await searchParams;

    if (type !== AuthType.signIn && type !== AuthType.signUp) {
        redirect(`${Route.auth}?type=${AuthType.signIn}`);
    }

    return match(type)
        .with(AuthType.signIn, () => {
            return <SignInContainer />;
        })
        .with(AuthType.signUp, () => {
            return <div>sign up</div>;
        })
        .exhaustive();
}
