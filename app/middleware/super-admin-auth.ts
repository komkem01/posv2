export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, auth, clearSession } = useAuth()

  if (!isAuthenticated()) {
    clearSession()
    return navigateTo('/super-admin/login?reason=expired')
  }

  const role = auth.value.user?.role || ''
  if (role !== 'SUPER_ADMIN') {
    return navigateTo('/pos')
  }
})
