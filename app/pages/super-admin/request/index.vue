<template>
    <div class="min-h-screen bg-slate-50 p-4 md:p-6">
        <div class="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                    <h1 class="text-xl font-extrabold text-slate-800">คำขอเปิดร้านค้า</h1>
                    <p class="text-xs text-slate-500">กดอนุมัติ/ปฏิเสธคำขอ และระบบจะส่งอีเมลให้อัตโนมัติ</p>
                </div>
                <div class="flex items-center justify-end gap-2">
                    <button @click="loadRequests" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700">รีเฟรช</button>
                    <button @click="openLogoutModal" class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200">ออกจากระบบ</button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-xs">
                    <thead>
                        <tr class="text-left border-b border-slate-100 text-slate-500 uppercase">
                            <th class="py-2 pr-2">ร้านค้า</th>
                            <th class="py-2 pr-2">เจ้าของร้าน</th>
                            <th class="py-2 pr-2">อีเมล/โทร</th>
                            <th class="py-2 pr-2">สถานะ</th>
                            <th class="py-2 pr-2">เหตุผล</th>
                            <th class="py-2 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="isLoading"><td colspan="6" class="py-6 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                        <tr v-else-if="requests.length === 0"><td colspan="6" class="py-6 text-center text-slate-400">ยังไม่มีคำขอ</td></tr>
                        <tr v-for="item in requests" :key="item.id" class="border-b border-slate-100 align-top">
                            <td class="py-3 pr-2">
                                <p class="font-bold text-slate-800">{{ item.store_name }}</p>
                                <p class="text-slate-500">{{ item.desired_username || '-' }}</p>
                            </td>
                            <td class="py-3 pr-2">{{ item.owner_firstname }} {{ item.owner_lastname }}</td>
                            <td class="py-3 pr-2">
                                <p>{{ item.owner_email }}</p>
                                <p class="text-slate-500">{{ item.owner_phone }}</p>
                            </td>
                            <td class="py-3 pr-2">
                                <span class="px-2 py-1 rounded-full font-bold" :class="statusClass(item.status)">{{ item.status }}</span>
                            </td>
                            <td class="py-3 pr-2 text-slate-600 max-w-[220px]">{{ item.review_note || item.note || '-' }}</td>
                            <td class="py-3 text-right">
                                <div v-if="item.status === 'PENDING'" class="flex gap-2 justify-end">
                                    <button @click="approve(item)" class="px-2.5 py-1.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 font-bold">อนุมัติ</button>
                                    <button @click="openReject(item)" class="px-2.5 py-1.5 rounded-lg text-white bg-rose-600 hover:bg-rose-700 font-bold">ปฏิเสธ</button>
                                </div>
                                <span v-else class="text-slate-400">-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="showCredentialModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/50" @click="showCredentialModal = false"></div>
                <div class="relative w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
                    <h2 class="text-lg font-extrabold text-slate-800">อนุมัติสำเร็จ</h2>
                    <p class="text-xs text-slate-500 mt-1">ส่งข้อมูลด้านล่างให้ลูกค้า (และระบบพยายามส่งอีเมลอัตโนมัติแล้ว)</p>
                    <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm space-y-2">
                        <p><span class="font-bold">อีเมล:</span> {{ credential.owner_email }}</p>
                        <p><span class="font-bold">Username:</span> {{ credential.owner_username }}</p>
                        <p><span class="font-bold">รหัสผ่านชั่วคราว:</span> {{ credential.temp_password }}</p>
                        <p><span class="font-bold">ส่งอีเมล:</span> {{ credential.email_sent ? 'สำเร็จ' : 'ไม่สำเร็จ/ไม่ตั้งค่า SMTP' }}</p>
                        <p v-if="credential.email_error" class="text-rose-600"><span class="font-bold">รายละเอียด:</span> {{ credential.email_error }}</p>
                    </div>
                    <button @click="showCredentialModal = false" class="mt-4 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700">ปิดหน้าต่าง</button>
                </div>
            </div>
        </Transition>

        <Transition name="fade">
            <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/50" @click="showRejectModal = false"></div>
                <div class="relative w-full max-w-lg bg-white rounded-2xl p-5 shadow-xl border border-slate-200">
                    <h2 class="text-lg font-extrabold text-slate-800">ปฏิเสธคำขอ</h2>
                    <textarea v-model="rejectNote" rows="4" class="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="ระบุเหตุผล"></textarea>
                    <div class="mt-4 flex gap-2">
                        <button @click="reject" class="flex-1 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700">ยืนยันปฏิเสธ</button>
                        <button @click="showRejectModal = false" class="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700">ยกเลิก</button>
                    </div>
                </div>
            </div>
        </Transition>

        <AppModal ref="logoutModalRef" :show-accent="false">
            <div class="flex items-start gap-3">
                <div class="shrink-0 mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                    <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-base font-bold text-slate-800 leading-tight">ยืนยันการออกจากระบบ</h2>
                    <p class="mt-1 text-sm text-slate-500 leading-relaxed">
                        หากออกจากระบบตอนนี้ คุณจะต้องเข้าสู่ระบบใหม่อีกครั้งเพื่อจัดการคำขอร้านค้า
                    </p>
                </div>
            </div>

            <div class="mt-5 flex flex-col-reverse sm:flex-row gap-2">
                <button @click="closeLogoutModal" class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                    ยกเลิก
                </button>
                <button @click="handleLogout" class="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors">
                    ยืนยันออกจากระบบ
                </button>
            </div>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

definePageMeta({
    layout: false,
    middleware: ['super-admin-auth']
})

interface StoreRequest {
    id: string
    store_name: string
    owner_firstname: string
    owner_lastname: string
    owner_email: string
    owner_phone: string
    desired_username?: string | null
    note?: string | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    review_note?: string | null
}

interface ApprovePayload {
    owner_staff_id: string
    owner_username: string
    owner_email: string
    temp_password: string
    email_sent: boolean
    email_error?: string | null
}

const { get, post } = useApi()
const { showToast } = useToast()
const { clearSession } = useAuth()

const requests = ref<StoreRequest[]>([])
const isLoading = ref(false)
const showCredentialModal = ref(false)
const credential = ref<ApprovePayload>({
    owner_staff_id: '',
    owner_username: '',
    owner_email: '',
    temp_password: '',
    email_sent: false,
    email_error: null,
})

const showRejectModal = ref(false)
const rejectTarget = ref<StoreRequest | null>(null)
const rejectNote = ref('')
const logoutModalRef = ref<{ open: () => void; close: () => void } | null>(null)

const statusClass = (status: StoreRequest['status']) => {
    if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-700'
    if (status === 'REJECTED') return 'bg-rose-50 text-rose-700'
    return 'bg-amber-50 text-amber-700'
}

const loadRequests = async () => {
    isLoading.value = true
    try {
        const res = await get<StoreRequest[]>('/api/v1/system/store-registration-request', { size: 100, sort_by: 'created_at', order_by: 'desc' })
        requests.value = res.data ?? []
    } catch (e: any) {
        showToast(e?.data?.message || 'โหลดรายการคำขอไม่สำเร็จ', 'error')
    } finally {
        isLoading.value = false
    }
}

const approve = async (item: StoreRequest) => {
    try {
        const res = await post<ApprovePayload>(`/api/v1/system/store-registration-request/${item.id}/approve`, { review_note: '' })
        credential.value = (res.data || credential.value) as ApprovePayload
        showCredentialModal.value = true
        showToast('อนุมัติคำขอเรียบร้อยแล้ว', 'success')
        await loadRequests()
    } catch (e: any) {
        showToast(e?.data?.message || 'อนุมัติไม่สำเร็จ', 'error')
    }
}

const openReject = (item: StoreRequest) => {
    rejectTarget.value = item
    rejectNote.value = ''
    showRejectModal.value = true
}

const reject = async () => {
    if (!rejectTarget.value) return
    try {
        await post(`/api/v1/system/store-registration-request/${rejectTarget.value.id}/reject`, { review_note: rejectNote.value || '' })
        showToast('ปฏิเสธคำขอเรียบร้อยแล้ว', 'success')
        showRejectModal.value = false
        rejectTarget.value = null
        await loadRequests()
    } catch (e: any) {
        showToast(e?.data?.message || 'ปฏิเสธไม่สำเร็จ', 'error')
    }
}

const handleLogout = async () => {
    logoutModalRef.value?.close()
    clearSession()
    await navigateTo('/super-admin/login')
}

const openLogoutModal = () => {
    logoutModalRef.value?.open()
}

const closeLogoutModal = () => {
    logoutModalRef.value?.close()
}

onMounted(loadRequests)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>