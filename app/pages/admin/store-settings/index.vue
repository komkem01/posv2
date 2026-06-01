<template>
  <div class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 overflow-hidden relative">
    <div class="w-full h-full flex flex-col gap-4 overflow-y-auto pr-1">
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h1 class="text-lg sm:text-xl font-extrabold text-slate-800">ตั้งค่าร้านค้า</h1>
        <p class="text-xs text-slate-500 mt-1">แก้ไขข้อมูลร้านค้าและกำหนดการคำนวณภาษีสำหรับหน้าขาย</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        <h2 class="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2">ข้อมูลร้านค้า</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ชื่อร้าน (Store Name)</label>
            <input v-model="form.storeName" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ชื่อสาขา</label>
            <input v-model="form.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">เลขผู้เสียภาษี (Tax ID)</label>
            <input v-model="form.taxId" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">เบอร์โทร</label>
            <input v-model="form.phone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1">ที่อยู่</label>
          <textarea v-model="form.address" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">จังหวัด</label>
            <select v-model="form.provinceId" @change="onProvinceChange" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">เลือกจังหวัด</option>
              <option v-for="item in provinces" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">อำเภอ/เขต</label>
            <select v-model="form.districtId" @change="onDistrictChange" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">เลือกอำเภอ/เขต</option>
              <option v-for="item in districts" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ตำบล/แขวง</label>
            <select v-model="form.subDistrictId" @change="onSubDistrictChange" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">เลือกตำบล/แขวง</option>
              <option v-for="item in subDistricts" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">รหัสไปรษณีย์</label>
            <select v-model="form.zipcodeId" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
              <option value="">เลือกรหัสไปรษณีย์</option>
              <option v-for="item in zipcodes" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">โลโก้ร้าน (URL)</label>
            <input v-model="form.logoUrl" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div class="branch-status-dropdown relative">
            <label class="block text-xs font-bold text-slate-500 mb-1">สถานะการใช้งานสาขา</label>
            <div
              @click="toggleBranchStatusDropdown"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold cursor-pointer flex items-center justify-between"
            >
              <span :class="form.isActive ? 'text-emerald-700' : 'text-rose-700'">
                {{ form.isActive ? 'เปิดใช้งานสาขา' : 'ปิดใช้งานสาขา' }}
              </span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isBranchStatusDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            <Transition name="fade">
              <div v-if="isBranchStatusDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                <button
                  type="button"
                  @click="selectBranchStatus(true)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-emerald-50 transition-colors"
                  :class="form.isActive ? 'text-emerald-700 bg-emerald-50/60' : 'text-slate-700'"
                >
                  เปิดใช้งานสาขา
                </button>
                <button
                  type="button"
                  @click="selectBranchStatus(false)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-rose-50 transition-colors border-t border-slate-100"
                  :class="!form.isActive ? 'text-rose-700 bg-rose-50/60' : 'text-slate-700'"
                >
                  ปิดใช้งานสาขา
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ข้อความหัวบิล</label>
            <textarea v-model="form.receiptHeaderNote" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"></textarea>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">ข้อความท้ายบิล</label>
            <textarea v-model="form.receiptFooterNote" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 class="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2">ตั้งค่าภาษี</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="vat-status-dropdown relative">
            <label class="block text-xs font-bold text-slate-500 mb-1">สถานะภาษี VAT</label>
            <div
              @click="toggleVatStatusDropdown"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold cursor-pointer flex items-center justify-between"
            >
              <span :class="form.vatEnabled ? 'text-emerald-700' : 'text-rose-700'">
                {{ form.vatEnabled ? 'เปิดใช้งาน VAT' : 'ปิดใช้งาน VAT' }}
              </span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isVatStatusDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            <Transition name="fade">
              <div v-if="isVatStatusDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                <button
                  type="button"
                  @click="selectVatEnabled(true)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-emerald-50 transition-colors"
                  :class="form.vatEnabled ? 'text-emerald-700 bg-emerald-50/60' : 'text-slate-700'"
                >
                  เปิดใช้งาน VAT
                </button>
                <button
                  type="button"
                  @click="selectVatEnabled(false)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-rose-50 transition-colors border-t border-slate-100"
                  :class="!form.vatEnabled ? 'text-rose-700 bg-rose-50/60' : 'text-slate-700'"
                >
                  ปิดใช้งาน VAT
                </button>
              </div>
            </Transition>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">อัตรา VAT (%)</label>
            <input
              v-model.number="form.vatRate"
              type="number"
              min="0"
              step="0.01"
              :disabled="!form.vatEnabled"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm disabled:opacity-60"
            />
          </div>

          <div class="vat-include-dropdown relative">
            <label class="block text-xs font-bold text-slate-500 mb-1">รูปแบบราคาสินค้า</label>
            <div
              @click="toggleVatIncludeDropdown"
              :class="!form.vatEnabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between"
            >
              <span :class="form.priceIncludesVat ? 'text-indigo-700' : 'text-slate-700'">
                {{ form.priceIncludesVat ? 'ราคาสินค้ารวม VAT แล้ว' : 'ราคาสินค้ายังไม่รวม VAT' }}
              </span>
              <svg class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isVatIncludeDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            <Transition name="fade">
              <div v-if="isVatIncludeDropdownOpen" class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                <button
                  type="button"
                  @click="selectPriceIncludesVat(true)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-indigo-50 transition-colors"
                  :class="form.priceIncludesVat ? 'text-indigo-700 bg-indigo-50/60' : 'text-slate-700'"
                >
                  ราคาสินค้ารวม VAT แล้ว
                </button>
                <button
                  type="button"
                  @click="selectPriceIncludesVat(false)"
                  class="w-full px-3.5 py-2.5 text-left text-sm font-semibold hover:bg-slate-100 transition-colors border-t border-slate-100"
                  :class="!form.priceIncludesVat ? 'text-slate-800 bg-slate-100/70' : 'text-slate-700'"
                >
                  ราคาสินค้ายังไม่รวม VAT
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="loadInitialData" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold">
          โหลดข้อมูลใหม่
        </button>
        <button :disabled="isSaving || isLoading" @click="save" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold disabled:opacity-60">
          {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

interface LocationItem {
  id: string
  name: string
}

interface BranchSettingsResponse {
  id: string
  store_name: string
  name: string
  tax_id?: string | null
  phone?: string | null
  address: string
  province_id: string
  district_id: string
  sub_district_id: string
  zipcode_id: string
  logo_url?: string | null
  receipt_header_note?: string | null
  receipt_footer_note?: string | null
  vat_enabled: boolean
  vat_rate: number
  price_includes_vat: boolean
  is_active: boolean
}

const { get, patch } = useApi()
const { auth } = useAuth()
const { showToast } = useToast()

const isLoading = ref(false)
const isSaving = ref(false)
const isBranchStatusDropdownOpen = ref(false)
const isVatStatusDropdownOpen = ref(false)
const isVatIncludeDropdownOpen = ref(false)

const provinces = ref<LocationItem[]>([])
const districts = ref<LocationItem[]>([])
const subDistricts = ref<LocationItem[]>([])
const zipcodes = ref<LocationItem[]>([])

const form = ref({
  storeName: '',
  name: '',
  taxId: '',
  phone: '',
  address: '',
  provinceId: '',
  districtId: '',
  subDistrictId: '',
  zipcodeId: '',
  logoUrl: '',
  receiptHeaderNote: '',
  receiptFooterNote: '',
  vatEnabled: true,
  vatRate: 7,
  priceIncludesVat: false,
  isActive: true,
})

const fetchList = async (path: string) => {
  const res = await get<LocationItem[]>(path)
  return res.data ?? []
}

const loadProvinces = async () => {
  provinces.value = await fetchList('/api/v1/public/province?size=999&sort_by=name&order_by=asc')
}

const loadDistrictsByProvince = async (provinceID: string) => {
  districts.value = await fetchList(`/api/v1/public/district?province_id=${provinceID}&size=999&sort_by=name&order_by=asc`)
}

const loadSubDistrictsByDistrict = async (districtID: string) => {
  subDistricts.value = await fetchList(`/api/v1/public/sub-district?district_id=${districtID}&size=999&sort_by=name&order_by=asc`)
}

const loadZipcodesBySubDistrict = async (subDistrictID: string) => {
  zipcodes.value = await fetchList(`/api/v1/public/zipcode?sub_district_id=${subDistrictID}&size=999&sort_by=name&order_by=asc`)
}

const toggleBranchStatusDropdown = () => {
  isBranchStatusDropdownOpen.value = !isBranchStatusDropdownOpen.value
}

const selectBranchStatus = (isActive: boolean) => {
  form.value.isActive = isActive
  isBranchStatusDropdownOpen.value = false
}

const toggleVatStatusDropdown = () => {
  isVatStatusDropdownOpen.value = !isVatStatusDropdownOpen.value
}

const selectVatEnabled = (enabled: boolean) => {
  form.value.vatEnabled = enabled
  if (!enabled) {
    form.value.priceIncludesVat = false
    isVatIncludeDropdownOpen.value = false
  }
  isVatStatusDropdownOpen.value = false
}

const toggleVatIncludeDropdown = () => {
  if (!form.value.vatEnabled) return
  isVatIncludeDropdownOpen.value = !isVatIncludeDropdownOpen.value
}

const selectPriceIncludesVat = (value: boolean) => {
  if (!form.value.vatEnabled) {
    form.value.priceIncludesVat = false
    isVatIncludeDropdownOpen.value = false
    return
  }

  form.value.priceIncludesVat = value
  isVatIncludeDropdownOpen.value = false
}

const closeBranchStatusDropdown = (event: Event) => {
  const target = event.target as Element

  if (!target.closest('.branch-status-dropdown')) {
    isBranchStatusDropdownOpen.value = false
  }

  if (!target.closest('.vat-status-dropdown')) {
    isVatStatusDropdownOpen.value = false
  }

  if (!target.closest('.vat-include-dropdown')) {
    isVatIncludeDropdownOpen.value = false
  }
}

const onProvinceChange = async () => {
  form.value.districtId = ''
  form.value.subDistrictId = ''
  form.value.zipcodeId = ''
  districts.value = []
  subDistricts.value = []
  zipcodes.value = []

  if (!form.value.provinceId) return
  await loadDistrictsByProvince(form.value.provinceId)
}

const onDistrictChange = async () => {
  form.value.subDistrictId = ''
  form.value.zipcodeId = ''
  subDistricts.value = []
  zipcodes.value = []

  if (!form.value.districtId) return
  await loadSubDistrictsByDistrict(form.value.districtId)
}

const onSubDistrictChange = async () => {
  form.value.zipcodeId = ''
  zipcodes.value = []

  if (!form.value.subDistrictId) return
  await loadZipcodesBySubDistrict(form.value.subDistrictId)
  if (zipcodes.value.length > 0) {
    form.value.zipcodeId = zipcodes.value[0]?.id || ''
  }
}

const loadInitialData = async () => {
  const branchId = auth.value.user?.branchId
  if (!branchId) {
    showToast('ไม่พบข้อมูลสาขาในบัญชีผู้ใช้', 'error')
    return
  }

  isLoading.value = true
  try {
    await loadProvinces()

    const branchRes = await get<BranchSettingsResponse>(`/api/v1/store/branch/${branchId}`)
    const branch = branchRes.data
    if (!branch) {
      showToast('ไม่พบข้อมูลสาขา', 'error')
      return
    }

    form.value.storeName = branch.store_name || ''
    form.value.name = branch.name || ''
    form.value.taxId = branch.tax_id || ''
    form.value.phone = branch.phone || ''
    form.value.address = branch.address || ''
    form.value.provinceId = branch.province_id || ''
    form.value.districtId = branch.district_id || ''
    form.value.subDistrictId = branch.sub_district_id || ''
    form.value.zipcodeId = branch.zipcode_id || ''
    form.value.logoUrl = branch.logo_url || ''
    form.value.receiptHeaderNote = branch.receipt_header_note || ''
    form.value.receiptFooterNote = branch.receipt_footer_note || ''
    form.value.vatEnabled = branch.vat_enabled
    form.value.vatRate = Number(branch.vat_rate || 7)
    form.value.priceIncludesVat = branch.price_includes_vat
    form.value.isActive = branch.is_active

    if (form.value.provinceId) {
      await loadDistrictsByProvince(form.value.provinceId)
    }
    if (form.value.districtId) {
      await loadSubDistrictsByDistrict(form.value.districtId)
    }
    if (form.value.subDistrictId) {
      await loadZipcodesBySubDistrict(form.value.subDistrictId)
    }
  } catch (e: any) {
    showToast(e?.data?.message || 'โหลดข้อมูลตั้งค่าไม่สำเร็จ', 'error')
  } finally {
    isLoading.value = false
  }
}

const save = async () => {
  const branchId = auth.value.user?.branchId
  if (!branchId) {
    showToast('ไม่พบข้อมูลสาขาในบัญชีผู้ใช้', 'error')
    return
  }

  if (!form.value.storeName.trim() || !form.value.name.trim() || !form.value.address.trim()) {
    showToast('กรุณากรอกชื่อร้าน ชื่อสาขา และที่อยู่ให้ครบ', 'error')
    return
  }

  if (!form.value.provinceId || !form.value.districtId || !form.value.subDistrictId || !form.value.zipcodeId) {
    showToast('กรุณาเลือกข้อมูลที่อยู่ให้ครบ', 'error')
    return
  }

  if (form.value.vatEnabled && Number(form.value.vatRate) < 0) {
    showToast('อัตรา VAT ต้องมากกว่าหรือเท่ากับ 0', 'error')
    return
  }

  isSaving.value = true
  try {
    await patch(`/api/v1/store/branch/${branchId}`, {
      store_name: form.value.storeName.trim(),
      name: form.value.name.trim(),
      tax_id: form.value.taxId.trim(),
      phone: form.value.phone.trim(),
      address: form.value.address.trim(),
      province_id: form.value.provinceId,
      district_id: form.value.districtId,
      sub_district_id: form.value.subDistrictId,
      zipcode_id: form.value.zipcodeId,
      logo_url: form.value.logoUrl.trim(),
      receipt_header_note: form.value.receiptHeaderNote.trim(),
      receipt_footer_note: form.value.receiptFooterNote.trim(),
      vat_enabled: form.value.vatEnabled,
      vat_rate: form.value.vatEnabled ? Number(form.value.vatRate || 0) : 0,
      price_includes_vat: form.value.vatEnabled ? form.value.priceIncludesVat : false,
      is_active: form.value.isActive,
    })

    showToast('บันทึกข้อมูลร้านค้าและภาษีสำเร็จ', 'success')
    await loadInitialData()
  } catch (e: any) {
    showToast(e?.data?.message || 'บันทึกไม่สำเร็จ', 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadInitialData()
  document.addEventListener('click', closeBranchStatusDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeBranchStatusDropdown)
})
</script>
