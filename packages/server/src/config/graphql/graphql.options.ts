import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable, Logger } from "@nestjs/common";
import { GqlOptionsFactory } from "@nestjs/graphql";

@Injectable()
export class GraphQLOptions implements GqlOptionsFactory {
    private readonly logger = new Logger("GraphQLOptions");
    createGqlOptions(): ApolloDriverConfig {
        return {
            playground: false,
            typePaths: ["./**/*.gql"],
            path: "/api",
            subscriptions: {
                "graphql-ws": {
                    path: "/api/sub",
                    onConnect: () => {
                        this.logger.log("GraphQL Connection Initialized");
                    },
                },
            },
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
