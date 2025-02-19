import { mergeResolvers } from "@graphql-tools/merge";
import theaterResolver from './theater';
import user from './user';
import movieResolver from "./movie";
import showResolver from "./show";
import reservationResolver from "./reservartion";

export const resolvers= mergeResolvers([user, theaterResolver, movieResolver, showResolver,reservationResolver, theaterResolver]);
