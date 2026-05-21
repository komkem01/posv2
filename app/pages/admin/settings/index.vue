<template>
  <div class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 flex flex-col-reverse lg:flex-row gap-6 overflow-hidden lg:h-full relative">
    
    <!-- Background glows -->
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Left: Add-ons List -->
    <div class="flex-grow lg:w-3/5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:h-full lg:overflow-hidden shadow-sm z-10">
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
          <h2 class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            รายการเสริม (Add-ons) ทั้งหมด ({{ addons.length }})
          </h2>
          <p class="text-[10px] text-slate-450">เพิ่มหรือลบตัวเลือกสำหรับให้ลูกค้าเลือกเพิ่มพิเศษ เช่น เพิ่มไข่มุก, หวานน้อย</p>
        </div>
      </div>

      <!-- Table Scrollable -->
      <div class="flex-grow overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pr-1 pb-4 lg:pb-0">
        <table class="w-full text-left text-xs border-collapse min-w-[400px]">
          <thead>
            <tr class="border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
              <th class="pb-3 pl-2 whitespace-nowrap">ชื่อรายการเสริม</th>
              <th class="pb-3 whitespace-nowrap">สินค้าที่ใช้งาน</th>
              <th class="pb-3 text-right pr-6 w-32 whitespace-nowrap">ราคาบวกเพิ่ม</th>
              <th class="pb-3 text-center w-36 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="add in addons" :key="add.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3.5 pl-2 text-slate-850 font-bold text-sm whitespace-nowrap">{{ add.name }}</td>
              <td class="py-3.5 whitespace-nowrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="add.productId === null ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-650 border border-slate-200/30'">
                  {{ getProductName(add.productId) }}
                </span>
              </td>
              <td class="py-3.5 text-right pr-6 font-mono font-bold text-slate-700 text-sm whitespace-nowrap">
                +฿{{ add.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              </td>
              <td class="py-3.5 text-center space-x-2 whitespace-nowrap">
                <button 
                  @click="startEditAddon(add)"
                  class="px-2.5 py-1 bg-blue-50 text-blue-650 rounded-lg font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  แก้ไข
                </button>
                <button 
                  @click="confirmDelete(add.id)"
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

    <!-- Right: Add/Edit Form -->
    <div class="lg:w-2/5 w-full flex flex-col gap-4 z-10 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ isEditingAddon ? 'แก้ไขรายการเสริม' : 'เพิ่มรายการเสริมใหม่' }}
        </h3>

        <div class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ชื่อรายการเสริม</label>
            <input
              v-model="addonForm.name"
              type="text"
              placeholder="เช่น เพิ่มวิปครีม, หวาน 25%..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div class="relative product-dropdown z-20">
            <label class="block text-xs font-bold text-slate-500 mb-1">ใช้กับสินค้า</label>
            <div 
              @click="toggleProductDropdown"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-bold cursor-pointer flex justify-between items-center transition-colors hover:bg-slate-100"
            >
              <span class="truncate pr-2 text-slate-800">{{ selectedProductDisplay }}</span>
              <svg class="w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isProductDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            <Transition name="fade">
              <div v-if="isProductDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-30 max-h-48 overflow-y-auto">
                <div 
                  @click="selectProduct(null)"
                  class="px-4 py-2.5 text-xs font-bold hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="addonForm.productId === null ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'"
                >
                  ทุกสินค้า (All Products)
                  <svg v-if="addonForm.productId === null" class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div 
                  v-for="prod in products" 
                  :key="prod.id"
                  @click="selectProduct(prod.id)"
                  class="px-4 py-2.5 text-xs font-bold hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between"
                  :class="addonForm.productId === prod.id ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'"
                >
                  {{ prod.name }}
                  <svg v-if="addonForm.productId === prod.id" class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </Transition>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">บวกราคาเพิ่ม (บาท)</label>
            <input
              v-model="addonForm.price"
              @blur="formatPrice"
              type="text"
              placeholder="เช่น 15.00"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="saveAddon"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-[0.98] transform"
          >
            {{ isEditingAddon ? 'บันทึกการแก้ไข' : 'บันทึกรายการเสริม' }}
          </button>
          <button
            @click="cancelAddonEdit"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>

      <!-- Quick Tips card -->
      <div class="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 space-y-2">
        <h4 class="text-xs font-bold text-indigo-850 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          การบวกราคารายการเสริม
        </h4>
        <p class="text-[10px] text-slate-550 leading-relaxed">
          หากรายการเสริมประเภทนั้นไม่มีค่าใช้จ่ายเพิ่มเติม (เช่น หวานมาก, หวานน้อย, ไม่ใส่น้ำแข็ง) คุณสามารถตั้งราคาบวกเพิ่มเป็น <span class="font-bold text-indigo-900">0 บาท</span> ได้ตามปกติครับ
        </p>
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
          <h3 class="text-sm font-extrabold text-slate-800">ยืนยันการลบรายการเสริม</h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการลบรายการเสริม "{{ addons.find(a => a.id === addonToDelete)?.name }}" ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้</p>
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

// Page Configurations
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

interface Product {
  id: string
  name: string
}

interface Addon {
  id: string
  name: string
  price: number
  productId: string | null
}

interface ProductAddonLink {
  id: string
  addon_id: string
  product_id: string
}

const products = ref<Product[]>([])
const addons = ref<Addon[]>([])
const addonLinks = ref<Record<string, ProductAddonLink[]>>({})
const isLoading = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const [prodRes, addonRes, productAddonRes] = await Promise.all([
      get<{ id: string; name: string }[]>('/api/v1/store/product', { size: 1000 }),
      get<{ id: string; name: string; price: number; is_all_products: boolean; is_active: boolean }[]>('/api/v1/store/addon', { size: 1000 }),
      get<ProductAddonLink[]>('/api/v1/store/product-addon', { size: 1000 }),
    ])

    products.value = (prodRes.data ?? []).map(p => ({ id: p.id, name: p.name }))

    const linksByAddon: Record<string, ProductAddonLink[]> = {}
    for (const link of productAddonRes.data ?? []) {
      if (!linksByAddon[link.addon_id]) linksByAddon[link.addon_id] = []
      linksByAddon[link.addon_id].push(link)
    }
    addonLinks.value = linksByAddon

    addons.value = (addonRes.data ?? [])
      .filter(a => a.is_active)
      .map(a => {
        const firstLink = linksByAddon[a.id]?.[0]
        return {
          id: a.id,
          name: a.name,
          price: a.price,
          productId: a.is_all_products ? null : (firstLink?.product_id ?? null)
        }
      })
  } catch (e: any) {
    showToast(e?.data?.message || 'โหลดข้อมูลไม่สำเร็จ', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)

// Edit/Form states
const isEditingAddon = ref(false)
const addonForm = ref({
  id: null as string | null,
  name: '',
  price: '' as string | number,
  productId: null as string | null,
  error: ''
})

const formatPrice = () => {
  if (addonForm.value.price !== '' && addonForm.value.price !== null) {
    const parsed = parseFloat(String(addonForm.value.price).replace(/,/g, ''))
    if (!isNaN(parsed)) {
      addonForm.value.price = parsed.toFixed(2)
    }
  }
}

// Custom Delete Confirmation Modal States
const showConfirmDeleteModal = ref(false)
const addonToDelete = ref<string | null>(null)

// Custom dropdown logic for products
const isProductDropdownOpen = ref(false)
const toggleProductDropdown = () => {
  isProductDropdownOpen.value = !isProductDropdownOpen.value
}
const selectProduct = (pId: string | null) => {
  addonForm.value.productId = pId
  isProductDropdownOpen.value = false
}
const selectedProductDisplay = computed(() => {
  if (addonForm.value.productId === null) return 'ทุกสินค้า (All Products)'
  const p = products.value.find(p => p.id === addonForm.value.productId)
  return p ? p.name : 'กรุณาเลือกสินค้า...'
})

const getProductName = (pId: string | null) => {
  if (pId === null) return 'ทุกสินค้า'
  const p = products.value.find(p => p.id === pId)
  return p ? p.name : '-'
}

// Close dropdown when clicking outside
const closeDropdown = (e: Event) => {
  if (!(e.target as Element).closest('.product-dropdown')) {
    isProductDropdownOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

const startEditAddon = (add: Addon) => {
  isEditingAddon.value = true
  addonForm.value = {
    id: add.id,
    name: add.name,
    price: add.price,
    productId: add.productId,
    error: ''
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelAddonEdit = () => {
  isEditingAddon.value = false
  addonForm.value = { id: null, name: '', price: null, productId: null, error: '' }
}

const saveAddon = async () => {
  const name = addonForm.value.name.trim()
  const rawPrice = addonForm.value.price

  if (!name || rawPrice === '' || rawPrice === null) {
    showToast('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error')
    return
  }

  const price = parseFloat(String(rawPrice).replace(/,/g, ''))

  if (isNaN(price) || price < 0) {
    showToast('ราคาบวกเพิ่มต้องมากกว่าหรือเท่ากับ 0 บาท', 'error')
    return
  }

  try {
    if (isEditingAddon.value && addonForm.value.id !== null) {
      const addonId = addonForm.value.id
      await patch(`/api/v1/store/addon/${addonId}`, {
        name,
        price,
        is_all_products: addonForm.value.productId === null,
        is_active: true
      })

      const links = addonLinks.value[addonId] ?? []
      if (addonForm.value.productId === null) {
        for (const link of links) {
          await del(`/api/v1/store/product-addon/${link.id}`)
        }
      } else {
        const matched = links.find(l => l.product_id === addonForm.value.productId)
        if (!matched) {
          for (const link of links) {
            await del(`/api/v1/store/product-addon/${link.id}`)
          }
          await post('/api/v1/store/product-addon', {
            addon_id: addonId,
            product_id: addonForm.value.productId
          })
        } else {
          for (const link of links) {
            if (link.id !== matched.id) {
              await del(`/api/v1/store/product-addon/${link.id}`)
            }
          }
        }
      }

      showToast('แก้ไขรายการเสริมสำเร็จ', 'success')
    } else {
      const created = await post<{ id: string }>('/api/v1/store/addon', {
        name,
        price,
        is_all_products: addonForm.value.productId === null,
        is_active: true
      })

      if (addonForm.value.productId !== null && created.data?.id) {
        await post('/api/v1/store/product-addon', {
          addon_id: created.data.id,
          product_id: addonForm.value.productId
        })
      }

      showToast('เพิ่มรายการเสริมใหม่สำเร็จ', 'success')
    }

    await loadData()
    cancelAddonEdit()
  } catch (e: any) {
    showToast(e?.data?.message || 'บันทึกไม่สำเร็จ', 'error')
  }
}

const confirmDelete = (id: string) => {
  addonToDelete.value = id
  showConfirmDeleteModal.value = true
}

const executeDelete = async () => {
  if (addonToDelete.value !== null) {
    const id = addonToDelete.value
    const add = addons.value.find(a => a.id === id)
    try {
      const links = addonLinks.value[id] ?? []
      for (const link of links) {
        await del(`/api/v1/store/product-addon/${link.id}`)
      }
      await del(`/api/v1/store/addon/${id}`)
      showToast(`ลบรายการเสริม "${add?.name ?? ''}" สำเร็จ`, 'success')
      await loadData()
    } catch (e: any) {
      showToast(e?.data?.message || 'ลบไม่สำเร็จ', 'error')
    }
    showConfirmDeleteModal.value = false
    addonToDelete.value = null
    cancelAddonEdit()
  }
}
</script>
