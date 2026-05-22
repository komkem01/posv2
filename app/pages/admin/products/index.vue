<template>
  <div class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 flex flex-col-reverse lg:flex-row gap-6 overflow-hidden lg:h-full relative">
    
    <!-- Background glows -->
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Left Pane: Product List -->
    <div class="flex-grow lg:w-3/5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:h-full lg:overflow-hidden shadow-sm z-10">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 flex-shrink-0">
        <div>
          <h2 class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            สินค้าทั้งหมด ({{ products.length }})
          </h2>
          <p class="text-[10px] text-slate-450">เพิ่มข้อมูลสินค้า อัปเดตราคา และจัดการรายละเอียด</p>
        </div>
        <!-- Search bar -->
        <div class="relative w-full sm:max-w-xs">
          <input
            v-model="productSearch"
            type="text"
            placeholder="ค้นหาตามชื่อ หรือหมวดหมู่..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-850 focus:outline-none focus:border-blue-500 font-semibold"
          />
          <span class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
        </div>
      </div>
      
      <!-- Scrollable Table -->
      <div class="flex-grow overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pr-1 pb-4 lg:pb-0">
        <table class="w-full text-left text-xs border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
              <th class="pb-3 pl-2 whitespace-nowrap">ชื่อสินค้า</th>
              <th class="pb-3 whitespace-nowrap">หมวดหมู่</th>
              <th class="pb-3 text-right whitespace-nowrap">ราคา</th>
              <th class="pb-3 text-center whitespace-nowrap">คงเหลือในสต็อก</th>
              <th class="pb-3 text-center w-32 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3 pl-2 text-slate-800 font-bold max-w-[200px] truncate text-sm" :title="prod.name">
                {{ prod.name }}
              </td>
              <td class="py-3 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-550 border border-slate-200/30 inline-block">
                  {{ prod.categoryName }}
                </span>
              </td>
              <td class="py-3 text-right font-mono font-bold text-slate-700 text-sm whitespace-nowrap">
                ฿{{ prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              </td>
              <td class="py-3 text-center font-bold text-sm whitespace-nowrap">
                <span :class="(prod.stock ?? 0) < 5 ? 'text-rose-600 bg-rose-50 border border-rose-100/50 px-2.5 py-0.5 rounded-lg' : 'text-slate-600'">
                  {{ prod.stock ?? '-' }}
                </span>
              </td>
              <td class="py-3 text-center space-x-2 whitespace-nowrap">
                <button 
                  @click="startEditProduct(prod)"
                  class="px-2.5 py-1 bg-blue-50 text-blue-650 rounded-lg font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  แก้ไข
                </button>
                <button 
                  @click="confirmDelete(prod.id)"
                  class="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg font-bold hover:bg-rose-100 hover:text-rose-700 transition-colors"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Right Pane: Add/Edit Form -->
    <div class="lg:w-2/5 w-full flex flex-col gap-4 z-10 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ isEditingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่' }}
        </h3>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ชื่อสินค้า</label>
            <input
              v-model="productForm.name"
              type="text"
              placeholder="เช่น มอคค่าเย็น, ครัวซองต์ครีม..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
            />
          </div>

          <div class="relative category-dropdown z-20">
            <label class="block text-xs font-bold text-slate-500 mb-1">หมวดหมู่สินค้า</label>
            <div 
              @click="toggleCategoryDropdown"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold cursor-pointer flex justify-between items-center transition-colors hover:bg-slate-100"
              :class="productForm.categoryId ? 'text-slate-800' : 'text-slate-400'"
            >
              <span>{{ productForm.categoryName || 'เลือกหมวดหมู่สินค้า...' }}</span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <Transition name="fade">
              <div v-if="isCategoryDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-30">
                <div 
                  v-for="cat in categories" 
                  :key="cat.id"
                  @click="selectCategory(cat.id, cat.name)"
                  class="px-4 py-2.5 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors flex items-center justify-between"
                  :class="productForm.categoryId === cat.id ? 'bg-blue-50/50 text-blue-600' : 'text-slate-600'"
                >
                  {{ cat.name }}
                  <svg v-if="productForm.categoryId === cat.id" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </Transition>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">ราคาขาย (บาท)</label>
              <input
                v-model="productForm.price"
                @blur="formatPrice"
                type="text"
                placeholder="เช่น 80.00"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">ราคาต้นทุน (บาท)</label>
              <input
                v-model="productForm.costPrice"
                type="text"
                placeholder="เช่น 60.00"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="saveProduct"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-[0.98] transform"
          >
            {{ isEditingProduct ? 'บันทึกข้อมูล' : 'บันทึกสินค้าใหม่' }}
          </button>
          <button
            @click="cancelProductEdit"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- CUSTOM CONFIRM DELETE MODAL -->
  <Transition name="fade">
    <div v-if="showConfirmDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showConfirmDeleteModal = false"></div>
      
      <!-- Modal Card -->
      <div class="relative bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-xl transform transition-all">
        <div class="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto border border-rose-100/50">
          <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-sm font-extrabold text-slate-800">ยืนยันการลบสินค้า</h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการลบสินค้า "{{ deleteProductName }}" ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้</p>
        </div>
        <div class="flex gap-2.5 pt-1">
          <button @click="executeDelete" class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] transform">
            ยืนยันการลบ
          </button>
          <button @click="showConfirmDeleteModal = false" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors">
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
const { get, post, patch, del } = useApi()
const { auth } = useAuth()

// Page Configurations
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Categories and products from API
interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  costPrice: number
  categoryId: string
  categoryName: string
  barcode: string
  sku: string
  isActive: boolean
  stock?: number
}

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const isLoading = ref(false)

const loadCategories = async () => {
  try {
    const res = await get<{ id: string; name: string }[]>('/api/v1/store/category', { size: 1000 })
    categories.value = (res.data ?? []).map(c => ({ id: c.id, name: c.name }))
  } catch {
    showToast('โหลดหมวดหมู่ไม่สำเร็จ', 'error')
  }
}

const loadProducts = async () => {
  isLoading.value = true
  try {
    const [prodRes, stockRes] = await Promise.all([
      get<{ id: string; name: string; price: number; cost_price: number; category_id: string; category_name: string | null; barcode: string; sku: string; is_active: boolean }[]>('/api/v1/store/product', { size: 1000 }),
      get<{ product_id: string; stock: number }[]>('/api/v1/store/product-stock', { size: 1000 })
    ])
    const stockMap = new Map<string, number>()
    for (const s of stockRes.data ?? []) {
      stockMap.set(s.product_id, (stockMap.get(s.product_id) ?? 0) + s.stock)
    }
    products.value = (prodRes.data ?? []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      costPrice: p.cost_price,
      categoryId: p.category_id,
      categoryName: p.category_name ?? '',
      barcode: p.barcode,
      sku: p.sku,
      isActive: p.is_active,
      stock: stockMap.get(p.id)
    }))
  } catch {
    showToast('โหลดสินค้าไม่สำเร็จ', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})

// Search & Form states
const productSearch = ref('')
const isEditingProduct = ref(false)
const productForm = ref({
  id: null as string | null,
  name: '',
  categoryId: '',
  categoryName: '',
  price: '' as string | number,
  costPrice: '' as string | number,
})

const formatPrice = () => {
  if (productForm.value.price !== '') {
    const parsed = parseFloat(String(productForm.value.price).replace(/,/g, ''))
    if (!isNaN(parsed)) productForm.value.price = parsed.toFixed(2)
  }
}

// Custom Delete Confirmation Modal States
const showConfirmDeleteModal = ref(false)
const productToDelete = ref<string | null>(null)
const deleteProductName = ref('')
const isSaving = ref(false)
const isDeleting = ref(false)

// Custom dropdown logic
const isCategoryDropdownOpen = ref(false)
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}
const selectCategory = (id: string, name: string) => {
  productForm.value.categoryId = id
  productForm.value.categoryName = name
  isCategoryDropdownOpen.value = false
}

// Close dropdown when clicking outside
const closeDropdown = (e: Event) => {
  if (!(e.target as Element).closest('.category-dropdown')) {
    isCategoryDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

// Search computation logic
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    return p.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
           p.categoryName.toLowerCase().includes(productSearch.value.toLowerCase())
  })
})

const startEditProduct = (prod: Product) => {
  isEditingProduct.value = true
  productForm.value = {
    id: prod.id,
    name: prod.name,
    categoryId: prod.categoryId,
    categoryName: prod.categoryName,
    price: prod.price,
    costPrice: prod.costPrice,
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelProductEdit = () => {
  isEditingProduct.value = false
  productForm.value = { id: null, name: '', categoryId: '', categoryName: '', price: '', costPrice: '' }
}

const saveProduct = async () => {
  const name = productForm.value.name.trim()
  const categoryId = productForm.value.categoryId
  const rawPrice = productForm.value.price
  const rawCostPrice = productForm.value.costPrice

  if (!name || !categoryId || rawPrice === '' || rawCostPrice === '') {
    showToast('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง', 'error')
    return
  }

  const price = parseFloat(String(rawPrice).replace(/,/g, ''))
  const costPrice = parseFloat(String(rawCostPrice).replace(/,/g, ''))

  if (isNaN(price) || isNaN(costPrice) || price < 0 || costPrice < 0) {
    showToast('ราคาต้องเป็นตัวเลขบวกเท่านั้น', 'error')
    return
  }

  const branchId = auth.value.user?.branchId
  if (!branchId) {
    showToast('ไม่พบข้อมูลสาขา', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditingProduct.value && productForm.value.id) {
      const current = products.value.find(p => p.id === productForm.value.id)
      await patch(`/api/v1/store/product/${productForm.value.id}`, {
        branch_id: branchId,
        category_id: categoryId,
        barcode: current?.barcode || `BAR-${Date.now()}`,
        sku: current?.sku || `SKU-${Date.now()}`,
        name,
        price,
        cost_price: costPrice,
        is_active: true
      })
      showToast('บันทึกการแก้ไขสินค้าสำเร็จ', 'success')
    } else {
      const ts = Date.now()
      await post('/api/v1/store/product', {
        branch_id: branchId,
        category_id: categoryId,
        barcode: `BAR-${ts}`,
        sku: `SKU-${ts}`,
        name,
        price,
        cost_price: costPrice,
        is_active: true
      })
      showToast('เพิ่มสินค้าใหม่สำเร็จ', 'success')
    }
    await loadProducts()
    cancelProductEdit()
  } catch (e: any) {
    showToast(e?.data?.message || 'บันทึกไม่สำเร็จ', 'error')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (id: string) => {
  const prod = products.value.find(p => p.id === id)
  deleteProductName.value = prod?.name ?? ''
  productToDelete.value = id
  showConfirmDeleteModal.value = true
}

const executeDelete = async () => {
  if (!productToDelete.value) return
  isDeleting.value = true
  try {
    await del(`/api/v1/store/product/${productToDelete.value}`)
    showToast(`ลบสินค้า "${deleteProductName.value}" สำเร็จ`, 'success')
    showConfirmDeleteModal.value = false
    productToDelete.value = null
    deleteProductName.value = ''
    cancelProductEdit()
    await loadProducts()
  } catch (e: any) {
    showToast(e?.data?.message || 'ลบไม่สำเร็จ', 'error')
  } finally {
    isDeleting.value = false
  }
}
</script>
