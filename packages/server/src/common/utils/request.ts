import { ExecutionContext } from "@nestjs/common";
import { GqlContextType } from "@nestjs/graphql";
import { Effect } from "effect";
import { match } from "ts-pattern";

type RequestOptions = Readonly<{
    traceId: string | null;
    // biome-ignore lint/suspicious/noExplicitAny: allow
    method: any;
    // biome-ignore lint/suspicious/noExplicitAny: allow
    url: any;
    // biome-ignore lint/suspicious/noExplicitAny: allow
    operation: any;
    // biome-ignore lint/suspicious/noExplicitAny: allow
    fieldName: any;
}>;

export const getOpts = (context: ExecutionContext, traceId?: string) => {
    return Effect.try({
        try: () => {
            return match<GqlContextType, RequestOptions>(
                context.getType<GqlContextType>()
            )
                .with("graphql", () => ({
                    traceId: traceId || null,
                    method: context.getArgs()[2].req.method || null,
                    url: context.getArgs()[2].req.url || null,
                    operation: context.getArgs()[3].operation.operation || null,
                    fieldName: context.getArgs()[3].fieldName || null,
                }))
                .otherwise(() => ({
                    traceId: traceId || null,
                    method: context.switchToHttp().getRequest().method,
                    url: context.switchToHttp().getRequest().url,
                    operation: null,
                    fieldName: null,
                }));
        },
        catch: () => ({
            traceId: "unknown",
            method: "unknown",
            url: "unknown",
            operation: "unknown",
            fieldName: "unknown",
        }),
    });
};
