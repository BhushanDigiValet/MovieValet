export const requireAuth = (user: any) => {
  if (!user) {
    throw new Error("You must be authenticated.");
  }
};

export const requireRole = (user: any, role: string) => {
  requireAuth(user);
  if (user.role !== role) {
    throw new Error("You do not have the required permissions.");
  }
};
