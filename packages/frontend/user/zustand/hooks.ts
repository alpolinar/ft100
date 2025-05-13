import { useValidateJwtQuery } from "@ods/server-lib";
import { useUserStore } from "./store";
import { useEffect } from "react";

export function useAuthenticatedUser() {
    const user = useUserStore((state) => state.authedUser);
    const setUser = useUserStore((state) => state.setUser);

    const { data } = useValidateJwtQuery();

    useEffect(() => {
        if (data?.validateJwt && !user) {
            setUser(data.validateJwt);
        }
    }, [data, user, setUser]);

    return user;
}
