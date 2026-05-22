<template>
  <div class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 flex flex-col-reverse lg:flex-row gap-6 overflow-hidden lg:h-full relative">
    
    <!-- Background glows -->
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Left Pane: Stock List and Quick Actions -->
    <div class="flex-grow lg:w-3/5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:h-full lg:overflow-hidden shadow-sm z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 flex-shrink-0">
        <div>
          <h2 class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            ควบคุมสต็อกสินค้า
          </h2>
          <p class="text-[10px] text-slate-450">ปรับเปลี่ยนสต็อกเร่งด่วน หรือเช็คยอดคงเหลือสินค้าในร้าน</p>
        </div>
        <!-- Search bar -->
        <div class="relative w-full sm:max-w-xs">
          <input
            v-model="stockSearch"
            type="text"
            placeholder="ค้นหาตามชื่อสินค้า..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-blue-500 font-semibold"
          />
          <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
        </div>
      </div>

      <!-- Low Stock Warnings banner -->
      <div v-if="lowStockItems.length > 0" class="mb-4 bg-amber-50 border border-amber-250 rounded-2xl p-3 flex-shrink-0">
        <h4 class="text-xs font-bold text-amber-800 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          แจ้งเตือน: สินค้าใกล้หมดสต็อก (ต่ำกว่า 5 ชิ้น)
        </h4>
        <p class="text-[10px] text-slate-600 mt-1">
          มีจำนวน {{ lowStockItems.length }} รายการที่ต้องการการเติมสินค้า: 
          <span class="font-bold text-amber-900">{{ lowStockItems.map(i => i.name).join(', ') }}</span>
        </p>
      </div>

      <!-- Scrollable Table -->
      <div class="flex-grow overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pr-1 pb-4 lg:pb-0">
        <table class="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
              <th class="pb-3 pl-2 whitespace-nowrap">ชื่อสินค้า</th>
              <th class="pb-3 whitespace-nowrap">หมวดหมู่</th>
              <th class="pb-3 text-center w-28 whitespace-nowrap">สต็อกปัจจุบัน</th>
              <th class="pb-3 text-center w-40 whitespace-nowrap">ปรับปรุงจำนวนแบบด่วน</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3 pl-2 text-slate-800 font-bold text-sm max-w-[200px] truncate" :title="prod.name">
                {{ prod.name }}
              </td>
              <td class="py-3 text-slate-500 font-medium whitespace-nowrap">
                {{ prod.category }}
              </td>
              <td class="py-3 text-center whitespace-nowrap">
                <span 
                  class="px-3 py-1 rounded-xl text-xs font-mono font-bold"
                  :class="prod.stock < 5 
                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                    : prod.stock <= 15 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'"
                >
                  {{ prod.stock }} ชิ้น
                </span>
              </td>
              <!-- Quick stock modifiers (+1 / -1 / refill) -->
              <td class="py-3 text-center whitespace-nowrap">
                <div class="inline-flex items-center gap-1.5">
                  <button 
                    @click="adjustStock(prod.id, -1)"
                    class="w-7 h-7 inline-flex items-center justify-center bg-slate-100 text-slate-650 hover:bg-slate-200 rounded-lg text-sm font-extrabold transition-all"
                    :disabled="prod.stock <= 0"
                  >
                    -
                  </button>
                  <button 
                    @click="adjustStock(prod.id, 1)"
                    class="w-7 h-7 inline-flex items-center justify-center bg-slate-100 text-slate-650 hover:bg-slate-200 rounded-lg text-sm font-extrabold transition-all"
                  >
                    +
                  </button>
                  <button 
                    @click="selectReplenishProduct(prod)"
                    class="ml-2 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100/50 hover:bg-blue-100/50 rounded-lg font-bold text-[10px] transition-colors"
                  >
                    เติมระบุจำนวน
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right Pane: Replenish Stock card -->
    <div class="lg:w-2/5 w-full flex flex-col gap-4 z-10 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          ฟอร์มปรับสต็อกสินค้า
        </h3>

        <div class="space-y-3">
          <div class="relative product-dropdown z-20">
            <label class="block text-xs font-bold text-slate-500 mb-1">เลือกสินค้า</label>
            <div 
              @click="toggleProductDropdown"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold cursor-pointer flex justify-between items-center transition-colors hover:bg-slate-100"
              :class="replenishForm.productId ? 'text-slate-800' : 'text-slate-400'"
            >
              <span class="truncate pr-2">{{ selectedProductDisplay || 'กรุณาเลือกสินค้า...' }}</span>
              <svg class="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isProductDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <Transition name="fade">
              <div v-if="isProductDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-30 max-h-48 overflow-y-auto">
                <div 
                  v-for="prod in products" 
                  :key="prod.id"
                  @click="selectProduct(prod.id)"
                  class="px-4 py-2.5 text-xs hover:bg-blue-50 cursor-pointer transition-colors flex flex-col gap-0.5"
                  :class="replenishForm.productId === prod.id ? 'bg-blue-50/50' : ''"
                >
                  <div class="flex items-center justify-between font-bold" :class="replenishForm.productId === prod.id ? 'text-blue-600' : 'text-slate-700'">
                    {{ prod.name }}
                    <svg v-if="replenishForm.productId === prod.id" class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span class="text-[10px] text-slate-500 font-medium">มีอยู่ {{ prod.stock }} ชิ้น</span>
                </div>
              </div>
            </Transition>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ประเภทการปรับสต็อก</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                @click="replenishForm.mode = 'add'"
                type="button"
                class="px-3 py-2 rounded-xl border text-xs font-bold transition-colors"
                :class="replenishForm.mode === 'add' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                เพิ่มสต็อก
              </button>
              <button
                @click="replenishForm.mode = 'subtract'"
                type="button"
                class="px-3 py-2 rounded-xl border text-xs font-bold transition-colors"
                :class="replenishForm.mode === 'subtract' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
              >
                ลดสต็อก
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">จำนวนที่ต้องการปรับ</label>
            <input
              v-model="replenishForm.quantity"
              type="text"
              placeholder="เช่น 10, 50, 100"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="submitReplenish"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-[0.98] transform"
          >
            ยืนยันการปรับสต็อก
          </button>
          <button
            @click="resetReplenishForm"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors"
          >
            ล้างค่า
          </button>
        </div>
      </div>

      <!-- Quick actions panel -->
      <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
          ตัวเลือกการจัดการด่วน
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button 
            @click="triggerResetStocks" 
            class="p-3 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl border border-slate-200 hover:border-rose-100 text-[11px] font-bold text-center transition-all"
          >
            ตั้งสต็อกสินค้าเป็น 0 ทั้งหมด
          </button>
          <button 
            @click="triggerRefillStocks" 
            class="p-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl border border-slate-200 hover:border-blue-100 text-[11px] font-bold text-center transition-all"
          >
            เติมสต็อกสินค้าเป็น 50 ชิ้นทั้งหมด
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- CUSTOM CONFIRM RESET STOCKS MODAL -->
  <Transition name="fade">
    <div v-if="showConfirmResetModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showConfirmResetModal = false"></div>
      
      <!-- Modal Card -->
      <div class="relative bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-xl transform transition-all">
        <div class="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto border border-rose-100/50">
          <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-sm font-extrabold text-slate-800">ยืนยันการล้างสต็อกทั้งหมด</h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการรีเซ็ตจำนวนสินค้าทุกรายการในร้านให้เป็น 0 ชิ้น ใช่หรือไม่?</p>
        </div>
        <div class="flex gap-2.5 pt-1">
          <button @click="executeResetStocks" class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] transform">
            ยืนยันการตั้งค่าเป็น 0
          </button>
          <button @click="showConfirmResetModal = false" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- CUSTOM CONFIRM REFILL STOCKS MODAL -->
  <Transition name="fade">
    <div v-if="showConfirmRefillModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showConfirmRefillModal = false"></div>
      
      <!-- Modal Card -->
      <div class="relative bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-xl transform transition-all">
        <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto border border-blue-100/50">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-sm font-extrabold text-slate-800">ยืนยันการเติมสต็อกทั้งหมด</h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการเติมสต็อกสินค้าทุกรายการให้เต็มเป็น 50 ชิ้น ใช่หรือไม่?</p>
        </div>
        <div class="flex gap-2.5 pt-1">
          <button @click="executeRefillStocks" class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] transform">
            ยืนยันการเติมเป็น 50
          </button>
          <button @click="showConfirmRefillModal = false" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from '~/composables/useToast'

const { showToast } = useToast()
const { get, post, patch } = useApi()
const { auth } = useAuth()

// Page Configurations
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

interface StockItem {
  productId: string
  productName: string
  categoryName: string
  stockId: string | null
  stock: number
  branchId: string
}

const stockItems = ref<StockItem[]>([])
const isLoading = ref(false)

// Convert to the shape used in template
// Template uses `products` and expects { id, name, category, stock }
const products = computed(() => stockItems.value.map(s => ({
  id: s.productId,
  name: s.productName,
  category: s.categoryName,
  stock: s.stock
})))

const loadStockData = async () => {
  isLoading.value = true
  try {
    const [prodRes, stockRes] = await Promise.all([
      get<{ id: string; name: string; category_name: string | null }[]>('/api/v1/store/product', { size: 1000 }),
      get<{ id: string; product_id: string; branch_id: string; stock: number }[]>('/api/v1/store/product-stock', { size: 1000 })
    ])
    const branchId = auth.value.user?.branchId ?? ''
    const stockMap = new Map<string, { id: string; stock: number; branchId: string }>()
    for (const s of stockRes.data ?? []) {
      if (!stockMap.has(s.product_id)) {
        stockMap.set(s.product_id, { id: s.id, stock: s.stock, branchId: s.branch_id })
      }
    }
    stockItems.value = (prodRes.data ?? []).map(p => {
      const s = stockMap.get(p.id)
      return {
        productId: p.id,
        productName: p.name,
        categoryName: p.category_name ?? '',
        stockId: s?.id ?? null,
        stock: s?.stock ?? 0,
        branchId: s?.branchId ?? branchId
      }
    })
  } catch {
    showToast('โหลดข้อมูลสต็อกไม่สำเร็จ', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStockData)

const updateStock = async (productId: string, newStock: number) => {
  const item = stockItems.value.find(s => s.productId === productId)
  if (!item) return
  try {
    if (item.stockId) {
      await patch(`/api/v1/store/product-stock/${item.stockId}`, {
        product_id: item.productId,
        branch_id: item.branchId || auth.value.user?.branchId,
        stock: newStock
      })
    } else {
      const branchId = auth.value.user?.branchId
      if (!branchId) { showToast('ไม่พบข้อมูลสาขา', 'error'); return }
      const res = await post<{ id: string; stock: number }>('/api/v1/store/product-stock', {
        product_id: item.productId,
        branch_id: branchId,
        stock: newStock
      })
      if (res.data) item.stockId = res.data.id
    }
    item.stock = newStock
  } catch (e: any) {
    showToast(e?.data?.message || 'อัปเดตสต็อกไม่สำเร็จ', 'error')
  }
}

// Search & Replenish Form states
const stockSearch = ref('')
const replenishForm = ref({
  productId: '' as string,
  mode: 'add' as 'add' | 'subtract',
  quantity: '' as string | number,
  error: ''
})

// Custom Reset/Refill Confirms
const showConfirmResetModal = ref(false)
const showConfirmRefillModal = ref(false)

// Custom dropdown logic
const isProductDropdownOpen = ref(false)
const toggleProductDropdown = () => {
  isProductDropdownOpen.value = !isProductDropdownOpen.value
}
const selectProduct = (pId: string) => {
  replenishForm.value.productId = pId
  isProductDropdownOpen.value = false
}

const selectedProductDisplay = computed(() => {
  if (!replenishForm.value.productId) return ''
  const p = stockItems.value.find(s => s.productId === replenishForm.value.productId)
  return p ? `${p.productName} (มีอยู่ ${p.stock} ชิ้น)` : ''
})

// Close dropdown when clicking outside
const closeDropdown = (e: Event) => {
  if (!(e.target as Element).closest('.product-dropdown')) {
    isProductDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

// Filtered products list
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    return p.name.toLowerCase().includes(stockSearch.value.toLowerCase())
  })
})

// Low stock computation
const lowStockItems = computed(() => {
  return products.value.filter(p => p.stock < 5)
})

// Quick adjust quantity by +/- increments
const adjustStock = async (productId: string, amount: number) => {
  const item = stockItems.value.find(s => s.productId === productId)
  if (!item) return
  const newStock = Math.max(0, item.stock + amount)
  await updateStock(productId, newStock)
  const prod = products.value.find(p => p.id === productId)
  showToast(`ปรับสต็อกสินค้า "${prod?.name}" เป็น ${newStock} ชิ้น`, 'info')
}

const selectReplenishProduct = (prod: { id: string; name: string; stock: number }) => {
  replenishForm.value.productId = prod.id
  replenishForm.value.mode = 'add'
  replenishForm.value.quantity = 10
  replenishForm.value.error = ''
}

const resetReplenishForm = () => {
  replenishForm.value = { productId: '', mode: 'add', quantity: '', error: '' }
}

const submitReplenish = async () => {
  const pId = replenishForm.value.productId
  const rawQty = replenishForm.value.quantity

  if (!pId || rawQty === '') {
    showToast('กรุณาเลือกสินค้าและใส่จำนวนที่ต้องการเติม', 'error')
    return
  }

  const qty = parseInt(String(rawQty).replace(/,/g, ''), 10)
  if (isNaN(qty) || qty <= 0) {
    showToast('จำนวนสินค้าที่เติมต้องเป็นตัวเลขและมากกว่า 0', 'error')
    return
  }

  const item = stockItems.value.find(s => s.productId === pId)
  if (!item) return
  if (replenishForm.value.mode === 'subtract' && qty > item.stock) {
    showToast(`สต็อกไม่พอสำหรับการลด (คงเหลือ ${item.stock} ชิ้น)`, 'error')
    return
  }

  const newStock = replenishForm.value.mode === 'add'
    ? item.stock + qty
    : item.stock - qty

  await updateStock(pId, newStock)
  const verb = replenishForm.value.mode === 'add' ? 'เพิ่ม' : 'ลด'
  const sign = replenishForm.value.mode === 'add' ? '+' : '-'
  showToast(`${verb}สต็อกสินค้า "${item.productName}" จำนวน ${sign}${qty} ชิ้น สำเร็จ`, 'success')
  resetReplenishForm()
}

const triggerResetStocks = () => {
  showConfirmResetModal.value = true
}

const executeResetStocks = async () => {
  for (const item of stockItems.value) {
    await updateStock(item.productId, 0)
  }
  showToast('รีเซ็ตสต็อกสินค้าทั้งหมดเป็น 0 สำเร็จ', 'success')
  showConfirmResetModal.value = false
}

const triggerRefillStocks = () => {
  showConfirmRefillModal.value = true
}

const executeRefillStocks = async () => {
  for (const item of stockItems.value) {
    await updateStock(item.productId, 50)
  }
  showToast('เติมสต็อกสินค้าทั้งหมดเป็น 50 ชิ้นสำเร็จ', 'success')
  showConfirmRefillModal.value = false
}
</script>
