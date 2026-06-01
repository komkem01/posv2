import { computed } from 'vue'

type PaymentMethod = 'cash' | 'promptpay'

interface ShiftState {
  id: string | null
  cashRegisterId: string | null
  staffId: string | null
  isOpen: boolean
  openedAt: string | null
  closedAt: string | null
  openingFloatAmount: number
  endingCashExpected: number
  endingCashActual: number
  shiftCashSales: number
  shiftPromptPaySales: number
  updatedAt: string | null
}

interface ShiftApiItem {
  id: string
  cash_register_id: string
  staff_id: string
  opened_at?: string | null
  closed_at?: string | null
  starting_cash: number
  ending_cash_expected: number
  ending_cash_actual: number
  promptpay_amount: number
  status: 'OPEN' | 'CLOSED'
}

interface CashRegisterApiItem {
  id: string
  branch_id: string
  is_active: boolean
}

const defaultState = (): ShiftState => ({
  id: null,
  cashRegisterId: null,
  staffId: null,
  isOpen: false,
  openedAt: null,
  closedAt: null,
  openingFloatAmount: 0,
  endingCashExpected: 0,
  endingCashActual: 0,
  shiftCashSales: 0,
  shiftPromptPaySales: 0,
  updatedAt: null,
})

export const useShiftState = () => {
  const { get, post, patch } = useApi()
  const { auth } = useAuth()

  const shiftState = useState<ShiftState>('shift-state', defaultState)
  const isShiftLoading = useState<boolean>('shift-state-loading', () => false)

  const applyOpenShift = (data: ShiftApiItem) => {
    const startingCash = Number(data.starting_cash || 0)
    const endingExpected = Number(data.ending_cash_expected || 0)
    const endingActual = Number(data.ending_cash_actual || 0)

    shiftState.value = {
      ...shiftState.value,
      id: data.id,
      cashRegisterId: data.cash_register_id,
      staffId: data.staff_id,
      isOpen: data.status === 'OPEN',
      openedAt: data.opened_at || null,
      closedAt: data.closed_at || null,
      openingFloatAmount: startingCash,
      endingCashExpected: endingExpected,
      endingCashActual: endingActual,
      shiftCashSales: Math.max(0, endingExpected - startingCash),
      shiftPromptPaySales: Number(data.promptpay_amount || 0),
      updatedAt: new Date().toISOString(),
    }
  }

  const clearActiveShift = () => {
    shiftState.value = {
      ...defaultState(),
      cashRegisterId: shiftState.value.cashRegisterId,
      updatedAt: new Date().toISOString(),
    }
  }

  const resolveCashRegisterId = async () => {
    if (shiftState.value.cashRegisterId) {
      return shiftState.value.cashRegisterId
    }

    const branchId = auth.value.user?.branchId
    const res = await get<CashRegisterApiItem[]>('/api/v1/store/cash-register', { size: 1000 })
    const list = res.data ?? []

    const target =
      list.find((item) => item.is_active && item.branch_id === branchId) ||
      list.find((item) => item.is_active) ||
      list.find((item) => item.branch_id === branchId) ||
      list[0]

    if (!target?.id) {
      throw new Error('cash register not found')
    }

    shiftState.value.cashRegisterId = target.id
    return target.id
  }

  const refreshShiftState = async () => {
    if (!auth.value.user?.id) {
      clearActiveShift()
      return
    }

    isShiftLoading.value = true
    try {
      const cashRegisterId = await resolveCashRegisterId()
      const res = await get<ShiftApiItem>('/api/v1/store/shift/active', {
        cash_register_id: cashRegisterId,
      })

      if (res.data) {
        applyOpenShift(res.data)
      } else {
        clearActiveShift()
      }
    } finally {
      isShiftLoading.value = false
    }
  }

  const openShift = async (openingFloatAmount: number) => {
    const staffId = auth.value.user?.id
    if (!staffId) {
      throw new Error('staff not found')
    }

    const cashRegisterId = await resolveCashRegisterId()
    const body = {
      cash_register_id: cashRegisterId,
      staff_id: staffId,
      starting_cash: openingFloatAmount,
      ending_cash_expected: openingFloatAmount,
      ending_cash_actual: openingFloatAmount,
      promptpay_amount: 0,
    }

    const res = await post<ShiftApiItem>('/api/v1/store/shift', body)
    if (!res.data) {
      throw new Error('failed to open shift')
    }

    shiftState.value.shiftPromptPaySales = 0
    applyOpenShift(res.data)
    return res.data
  }

  const closeShift = async (endingCashActual: number) => {
    if (!shiftState.value.id) {
      throw new Error('open shift not found')
    }

    await patch<ShiftApiItem>(`/api/v1/store/shift/${shiftState.value.id}`, {
      ending_cash_expected: shiftState.value.endingCashExpected,
      ending_cash_actual: endingCashActual,
      promptpay_amount: shiftState.value.shiftPromptPaySales,
      status: 'CLOSED',
    })

    clearActiveShift()
  }

  const addShiftSale = async (method: PaymentMethod, amount: number) => {
    if (!shiftState.value.isOpen || !shiftState.value.id || amount <= 0) {
      return
    }

    if (method === 'promptpay') {
      const nextPromptPay = shiftState.value.shiftPromptPaySales + amount
      const res = await patch<ShiftApiItem>(`/api/v1/store/shift/${shiftState.value.id}`, {
        ending_cash_expected: shiftState.value.endingCashExpected,
        ending_cash_actual: shiftState.value.endingCashExpected,
        promptpay_amount: nextPromptPay,
        status: 'OPEN',
      })

      if (res.data) {
        applyOpenShift(res.data)
      }
      return
    }

    const nextExpected = shiftState.value.endingCashExpected + amount

    const res = await patch<ShiftApiItem>(`/api/v1/store/shift/${shiftState.value.id}`, {
      ending_cash_expected: nextExpected,
      ending_cash_actual: nextExpected,
      promptpay_amount: shiftState.value.shiftPromptPaySales,
      status: 'OPEN',
    })

    if (res.data) {
      applyOpenShift(res.data)
    }
  }

  const isShiftOpen = computed(() => shiftState.value.isOpen)
  const openingFloatAmount = computed(() => shiftState.value.openingFloatAmount)
  const shiftCashSales = computed(() => shiftState.value.shiftCashSales)
  const shiftPromptPaySales = computed(() => shiftState.value.shiftPromptPaySales)

  return {
    shiftState,
    isShiftLoading,
    isShiftOpen,
    openingFloatAmount,
    shiftCashSales,
    shiftPromptPaySales,
    refreshShiftState,
    openShift,
    closeShift,
    addShiftSale,
  }
}
