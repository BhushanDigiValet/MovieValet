import { mergeResolvers } from "@graphql-tools/merge";
import theaterResolver from './theater';
import user from './user';
import movieResolver from "./movie";
import showResolver from "./show";

export const resolvers= mergeResolvers([user, theaterResolver, movieResolver, showResolver]);
