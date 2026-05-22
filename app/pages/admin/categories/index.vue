<template>
  <div class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 flex flex-col-reverse lg:flex-row gap-6 overflow-hidden lg:h-full relative">
    
    <!-- Background glows -->
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Left: Categories List Pane -->
    <div class="flex-grow lg:w-3/5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:h-full lg:overflow-hidden shadow-sm z-10">
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
          <h2 class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            หมวดหมู่สินค้าทั้งหมด ({{ categories.length }})
          </h2>
          <p class="text-[10px] text-slate-450">เพิ่ม ลบ หรือแก้ไขประเภทสินค้าของร้านค้าคุณ</p>
        </div>
      </div>

      <!-- Table Scrollable -->
      <div class="flex-grow overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pr-1 pb-4 lg:pb-0">
        <table class="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider">
              <th class="pb-3 pl-2 w-16 whitespace-nowrap">ลำดับ</th>
              <th class="pb-3 whitespace-nowrap">ชื่อหมวดหมู่</th>
              <th class="pb-3 text-center w-36 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="isLoading">
              <td colspan="3" class="py-8 text-center text-xs text-slate-400 font-semibold">กำลังโหลดข้อมูล...</td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="3" class="py-8 text-center text-xs text-slate-400 font-semibold">ยังไม่มีหมวดหมู่สินค้า</td>
            </tr>
            <tr v-else v-for="(cat, idx) in categories" :key="cat.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-3.5 pl-2 font-mono text-slate-450 font-semibold whitespace-nowrap">{{ idx + 1 }}</td>
              <td class="py-3.5 text-slate-800 font-bold text-sm whitespace-nowrap">{{ cat.name }}</td>
              <td class="py-3.5 text-center space-x-2 whitespace-nowrap">
                <button 
                  @click="startEditCategory(cat, idx)"
                  class="px-2.5 py-1 bg-blue-50 text-blue-650 rounded-lg font-bold hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  แก้ไข
                </button>
                <button 
                  @click="confirmDelete(cat, idx)"
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

    <!-- Right: Form Pane -->
    <div class="lg:w-2/5 w-full flex flex-col gap-4 z-10 flex-shrink-0">
      <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 class="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          {{ isEditingCategory ? 'แก้ไขหมวดหมู่สินค้า' : 'เพิ่มหมวดหมู่สินค้าใหม่' }}
        </h3>
        
        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-500">ชื่อหมวดหมู่</label>
          <input
            v-model="categoryForm.name"
            type="text"
            placeholder="เช่น เครื่องดื่ม, เบเกอรี่..."
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="saveCategory"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm active:scale-[0.98] transform"
          >
            {{ isEditingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่' }}
          </button>
          <button
            @click="cancelCategoryEdit"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>

      <!-- Hint Info card -->
      <div class="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 space-y-2">
        <h4 class="text-xs font-bold text-blue-800 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          คำแนะนำในการตั้งค่า
        </h4>
        <p class="text-[10px] text-slate-550 leading-relaxed">
          หากทำการแก้ไขชื่อหมวดหมู่ ระบบหลังบ้านจะทำการอัปเดตประเภทให้กับสินค้าที่เชื่อมโยงอยู่กับหมวดหมู่นี้โดยอัตโนมัติ เพื่อป้องกันการสูญเสียข้อมูล
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
          <h3 class="text-sm font-extrabold text-slate-800">ยืนยันการลบหมวดหมู่</h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">คุณต้องการลบหมวดหมู่ "{{ categoryToDelete?.name }}" ออกจากระบบใช่หรือไม่? การกระทำนี้ไม่สามารถกู้คืนได้</p>
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
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const { showToast } = useToast()
const { get, post, patch, del } = useApi()
const { auth } = useAuth()

// Page configurations
definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

interface Category {
  id: string
  name: string
  isActive: boolean
}

const categories = ref<Category[]>([])
const isLoading = ref(false)

const loadCategories = async () => {
  isLoading.value = true
  try {
    const res = await get<{ id: string; name: string; is_active: boolean }[]>('/api/v1/store/category', { size: 1000 })
    categories.value = (res.data ?? []).map(c => ({ id: c.id, name: c.name, isActive: c.is_active }))
  } catch {
    showToast('โหลดหมวดหมู่ไม่สำเร็จ', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCategories)

// Local Edit/Form States
const isEditingCategory = ref(false)
const editCategoryId = ref<string | null>(null)
const editCategoryIndex = ref<number | null>(null)
const categoryForm = ref({ name: '', error: '' })

// Custom Delete Confirmation Modal States
const showConfirmDeleteModal = ref(false)
const categoryToDelete = ref<{ id: string; name: string; index: number } | null>(null)
const isDeleting = ref(false)
const isSaving = ref(false)

const startEditCategory = (cat: Category, index: number) => {
  isEditingCategory.value = true
  editCategoryId.value = cat.id
  editCategoryIndex.value = index
  categoryForm.value = { name: cat.name, error: '' }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelCategoryEdit = () => {
  isEditingCategory.value = false
  editCategoryId.value = null
  editCategoryIndex.value = null
  categoryForm.value = { name: '', error: '' }
}

const saveCategory = async () => {
  const name = categoryForm.value.name.trim()
  if (!name) {
    showToast('กรุณากรอกชื่อหมวดหมู่', 'error')
    return
  }
  const duplicate = categories.value.some(
    (c, idx) => c.name.toLowerCase() === name.toLowerCase() && (!isEditingCategory.value || idx !== editCategoryIndex.value)
  )
  if (duplicate) {
    showToast('มีชื่อหมวดหมู่นี้ในระบบแล้ว', 'error')
    return
  }

  const branchId = auth.value.user?.branchId
  if (!branchId) {
    showToast('ไม่พบข้อมูลสาขา', 'error')
    return
  }

  isSaving.value = true
  try {
    if (isEditingCategory.value && editCategoryId.value) {
      await patch(`/api/v1/store/category/${editCategoryId.value}`, { name, is_active: true, branch_id: branchId })
      showToast('แก้ไขหมวดหมู่สำเร็จ', 'success')
    } else {
      await post('/api/v1/store/category', { name, is_active: true, branch_id: branchId })
      showToast('เพิ่มหมวดหมู่ใหม่สำเร็จ', 'success')
    }
    await loadCategories()
    cancelCategoryEdit()
  } catch (e: any) {
    showToast(e?.data?.message || 'บันทึกไม่สำเร็จ', 'error')
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = (cat: Category, index: number) => {
  categoryToDelete.value = { id: cat.id, name: cat.name, index }
  showConfirmDeleteModal.value = true
}

const executeDelete = async () => {
  if (!categoryToDelete.value) return
  const { id, name } = categoryToDelete.value
  isDeleting.value = true
  try {
    await del(`/api/v1/store/category/${id}`)
    showToast(`ลบหมวดหมู่ "${name}" สำเร็จ`, 'success')
    showConfirmDeleteModal.value = false
    categoryToDelete.value = null
    cancelCategoryEdit()
    await loadCategories()
  } catch (e: any) {
    showToast(e?.data?.message || 'ลบไม่สำเร็จ', 'error')
  } finally {
    isDeleting.value = false
  }
}
</script>
