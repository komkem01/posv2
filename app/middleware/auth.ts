export default defineNuxtRouteMiddleware((to) => {
  const isProtectedRoute = to.path.startsWith("/admin") || to.path.startsWith("/pos") || to.path.startsWith("/change-password") || to.path.startsWith("/super-admin/request");
  if (!isProtectedRoute) {
    return;
  }

  const { isAuthenticated, clearSession } = useAuth();
  if (!isAuthenticated()) {
    clearSession();
    return navigateTo("/login?reason=expired");
  }
});
