export const useLoading = () => {
  const isLoading = useState<boolean>('global_loading', () => false)

  const showLoading = () => {
    isLoading.value = true
  }

  const hideLoading = () => {
    isLoading.value = false
  }

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    showLoading()
    try {
      return await fn()
    } finally {
      hideLoading()
    }
  }

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
  }
}
