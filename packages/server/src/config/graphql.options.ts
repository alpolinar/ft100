import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { GqlOptionsFactory } from "@nestjs/graphql";

@Injectable()
export class GraphQLOptions implements GqlOptionsFactory {
    createGqlOptions(): ApolloDriverConfig {
        return {
            playground: false,
            typePaths: ["./**/*.gql"],
            path: "/api",
            // biome-ignore lint/suspicious/noExplicitAny: allow
            context: ({ req, res }: { req: any; res: any }) => ({
                req,
                res,
            }),
            // biome-ignore lint/suspicious/noExplicitAny: allow
            rootValue: ({ req }: any) => req,
            useGlobalPrefix: true,
            formatError: (error) => error,
        };
    }
}
