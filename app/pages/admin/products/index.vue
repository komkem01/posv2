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
                  {{ prod.category }}
                </span>
              </td>
              <td class="py-3 text-right font-mono font-bold text-slate-700 text-sm whitespace-nowrap">
                ฿{{ prod.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              </td>
              <td class="py-3 text-center font-bold text-sm whitespace-nowrap">
                <span :class="prod.stock < 5 ? 'text-rose-600 bg-rose-50 border border-rose-100/50 px-2.5 py-0.5 rounded-lg' : 'text-slate-600'">
                  {{ prod.stock }}
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
              :class="productForm.category ? 'text-slate-800' : 'text-slate-400'"
            >
              <span>{{ productForm.category || 'เลือกหมวดหมู่สินค้า...' }}</span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isCategoryDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <Transition name="fade">
              <div v-if="isCategoryDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-30">
                <div 
                  v-for="cat in rawCategories" 
                  :key="cat"
                  @click="selectCategory(cat)"
                  class="px-4 py-2.5 text-xs font-bold hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors flex items-center justify-between"
                  :class="productForm.category === cat ? 'bg-blue-50/50 text-blue-600' : 'text-slate-600'"
                >
                  {{ cat }}
                  <svg v-if="productForm.category === cat" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
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
              <label class="block text-xs font-bold text-slate-500 mb-1">จำนวนตั้งต้น</label>
              <input
                v-model="productForm.stock"
                type="text"
                placeholder="เช่น 50"
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
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการลบสินค้า "{{ products.find(p => p.id === productToDelete)?.name }}" ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้</p>
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

// Page Configurations
definePageMeta({
  layout: 'admin',
  middleware: [
    () => {
      const authState = useState('auth') as any
      if (!authState.value || !authState.value.isLoggedIn) {
        return navigateTo('/login')
      }
    }
  ]
})

// Categories shared global state
const rawCategories = useState<string[]>('categories', () => ['เครื่องดื่ม', 'อาหาร', 'ของหวาน', 'ของทานเล่น'])

// Products shared global state
interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}
const products = useState<Product[]>('products', () => [
  { id: 1, name: 'เอสเพรสโซ่ร้อน (Hot Espresso)', price: 65, category: 'เครื่องดื่ม', stock: 45 },
  { id: 2, name: 'มัทฉะลาเต้เย็น (Iced Matcha Latte)', price: 95, category: 'เครื่องดื่ม', stock: 3 },
  { id: 3, name: 'อเมริกาโน่พรีเมียม (Premium Americano)', price: 75, category: 'เครื่องดื่ม', stock: 50 },
  { id: 4, name: 'ครัวซองต์คลาสสิก (Classic Croissant)', price: 85, category: 'ของหวาน', stock: 12 },
  { id: 5, name: 'ขนมปังหน้าอโวคาโดและไข่ (Avocado Toast with Egg)', price: 185, category: 'อาหาร', stock: 8 },
  { id: 6, name: 'ทรัฟเฟิลฟรายส์พร้อมมายองเนส (Truffle Fries)', price: 120, category: 'ของทานเล่น', stock: 25 },
  { id: 7, name: 'เค้กช็อกโกแลตฟัดจ์ (Chocolate Fudge Cake)', price: 110, category: 'ของหวาน', stock: 6 },
  { id: 8, name: 'คลับแซนด์วิช (Club Sandwich)', price: 155, category: 'อาหาร', stock: 15 },
  { id: 9, name: 'สมูทตี้เบอร์รี่สด (Fresh Berry Smoothie)', price: 105, category: 'เครื่องดื่ม', stock: 20 },
  { id: 10, name: 'ขนมปังกระเทียมอบชีส (Cheesy Garlic Bread)', price: 90, category: 'ของทานเล่น', stock: 18 }
])

// Search & Form states
const productSearch = ref('')
const isEditingProduct = ref(false)
const productForm = ref({
  id: null as number | null,
  name: '',
  category: '',
  price: '' as string | number,
  stock: '' as string | number,
  error: ''
})

const formatPrice = () => {
  if (productForm.value.price !== '' && productForm.value.price !== null) {
    const parsed = parseFloat(String(productForm.value.price).replace(/,/g, ''))
    if (!isNaN(parsed)) {
      productForm.value.price = parsed.toFixed(2)
    }
  }
}

// Custom Delete Confirmation Modal States
const showConfirmDeleteModal = ref(false)
const productToDelete = ref<number | null>(null)

// Custom dropdown logic
const isCategoryDropdownOpen = ref(false)
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value
}
const selectCategory = (cat: string) => {
  productForm.value.category = cat
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
           p.category.toLowerCase().includes(productSearch.value.toLowerCase())
  })
})

const startEditProduct = (prod: Product) => {
  isEditingProduct.value = true
  productForm.value = {
    id: prod.id,
    name: prod.name,
    category: prod.category,
    price: prod.price,
    stock: prod.stock,
    error: ''
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelProductEdit = () => {
  isEditingProduct.value = false
  productForm.value = { id: null, name: '', category: '', price: null, stock: null, error: '' }
}

const saveProduct = () => {
  const name = productForm.value.name.trim()
  const cat = productForm.value.category
  const rawPrice = productForm.value.price
  const rawStock = productForm.value.stock

  if (!name || !cat || rawPrice === '' || rawStock === '' || rawPrice === null || rawStock === null) {
    showToast('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง', 'error')
    return
  }

  const price = parseFloat(String(rawPrice).replace(/,/g, ''))
  const stock = parseInt(String(rawStock).replace(/,/g, ''), 10)

  if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
    showToast('ราคาและจำนวนสินค้าต้องเป็นตัวเลขบวกเท่านั้น', 'error')
    return
  }

  if (isEditingProduct.value && productForm.value.id !== null) {
    const prod = products.value.find(p => p.id === productForm.value.id)
    if (prod) {
      prod.name = name
      prod.category = cat
      prod.price = price
      prod.stock = stock
      showToast('บันทึกการแก้ไขสินค้าสำเร็จ', 'success')
    }
  } else {
    // Add Product to global shared state
    const newId = products.value.length ? Math.max(...products.value.map(p => p.id)) + 1 : 1
    products.value.push({
      id: newId,
      name,
      category: cat,
      price,
      stock
    })
    showToast('เพิ่มสินค้าใหม่สำเร็จ', 'success')
  }

  cancelProductEdit()
}

const confirmDelete = (id: number) => {
  productToDelete.value = id
  showConfirmDeleteModal.value = true
}

const executeDelete = () => {
  if (productToDelete.value !== null) {
    const id = productToDelete.value
    const prod = products.value.find(p => p.id === id)
    if (prod) {
      products.value = products.value.filter(p => p.id !== id)
      showToast(`ลบสินค้า "${prod.name}" สำเร็จ`, 'success')
    }
    showConfirmDeleteModal.value = false
    productToDelete.value = null
    cancelProductEdit()
  }
}
</script>
