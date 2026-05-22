<template>
  <div
    class="min-h-[calc(100vh-140px)] lg:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-6 flex flex-col-reverse lg:flex-row gap-6 overflow-hidden lg:h-full relative"
  >
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div
      class="flex-grow lg:w-3/5 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col lg:h-full lg:overflow-hidden shadow-sm z-10"
    >
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <div>
          <h2
            class="font-extrabold text-sm text-slate-800 flex items-center gap-1.5"
          >
            <span class="w-2 h-2 rounded-full bg-blue-600"></span>
            พนักงานในสาขา ({{ staffs.length }})
          </h2>
          <p class="text-[10px] text-slate-450">
            เพิ่ม แก้ไข และลบพนักงานภายในสาขา
          </p>
        </div>
      </div>

      <div
        class="flex-grow overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pr-1 pb-4 lg:pb-0"
      >
        <table class="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr
              class="border-b border-slate-100 text-slate-450 font-bold uppercase tracking-wider"
            >
              <th class="pb-3 pl-2 whitespace-nowrap">ชื่อผู้ใช้</th>
              <th class="pb-3 whitespace-nowrap">ชื่อ-นามสกุล</th>
              <th class="pb-3 whitespace-nowrap">ตำแหน่ง</th>
              <th class="pb-3 whitespace-nowrap">ติดต่อ</th>
              <th class="pb-3 whitespace-nowrap">สถานะ</th>
              <th class="pb-3 text-center w-36 whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="staff in staffs"
              :key="staff.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td
                class="py-3.5 pl-2 text-slate-850 font-bold text-sm whitespace-nowrap"
              >
                {{ staff.username }}
              </td>
              <td class="py-3.5 whitespace-nowrap">
                <span class="font-semibold text-slate-700"
                  >{{ staff.firstname }} {{ staff.lastname }}</span
                >
              </td>
              <td class="py-3.5 whitespace-nowrap">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="
                    staff.role === 'OWNER'
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : staff.role === 'MANAGER'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-650 border-slate-200'
                  "
                >
                  {{ roleLabel(staff.role) }}
                </span>
              </td>
              <td class="py-3.5 whitespace-nowrap">
                <div class="text-[11px] text-slate-600 font-semibold">
                  {{ staff.email || "-" }}
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ staff.phone || "-" }}
                </div>
              </td>
              <td class="py-3.5 whitespace-nowrap">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  :class="
                    staff.is_active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  "
                >
                  {{ staff.is_active ? "ใช้งาน" : "ปิดใช้งาน" }}
                </span>
              </td>
              <td class="py-3.5 text-center space-x-2 whitespace-nowrap">
                <button
                  v-if="canUpdateStaff(staff)"
                  @click="startEditStaff(staff)"
                  class="px-2.5 py-1 bg-blue-50 text-blue-650 rounded-lg font-bold hover:bg-blue-100 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  v-if="canDeleteStaff(staff)"
                  @click="confirmDelete(staff.id, staff.username)"
                  class="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg font-bold hover:bg-rose-100 transition-colors"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="canCreateOrUpdate" class="lg:w-2/5 w-full flex flex-col gap-4 z-10 flex-shrink-0">
      <div
        class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4"
      >
        <h3
          class="font-extrabold text-sm text-slate-800 border-b border-slate-100 pb-3"
        >
          {{ isEditingStaff ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่" }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >ชื่อผู้ใช้</label
            >
            <input
              v-model="staffForm.username"
              type="text"
              placeholder="กรอกชื่อผู้ใช้"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >รหัสผ่าน</label
            >
            <input
              v-model="staffForm.password"
              type="password"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >ชื่อ</label
            >
            <input
              v-model="staffForm.firstname"
              type="text"
              placeholder="กรอกชื่อ"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >นามสกุล</label
            >
            <input
              v-model="staffForm.lastname"
              type="text"
              placeholder="กรอกนามสกุล"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >อีเมล</label
            >
            <input
              v-model="staffForm.email"
              type="text"
              placeholder="กรอกอีเมล"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >เบอร์โทร</label
            >
            <input
              v-model="staffForm.phone"
              type="text"
              placeholder="กรอกเบอร์โทร"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1"
              >ตำแหน่ง</label
            >
            <select
              v-model="staffForm.role"
              placeholder="เลือกตำแหน่ง"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
            >
              <option v-for="role in availableRoles" :key="role" :value="role">
                {{ roleLabel(role) }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 mt-6">
            <input
              v-model="staffForm.is_active"
              id="staff-active"
              type="checkbox"
              placeholder="เลือกสถานะ"
              class="w-4 h-4 rounded border-slate-300 text-blue-600"
            />
            <label for="staff-active" class="text-xs font-bold text-slate-600"
              >สถานะใช้งาน</label
            >
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            @click="saveStaff"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            {{ isEditingStaff ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน" }}
          </button>
          <button
            @click="cancelStaffEdit"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <div
      v-if="showConfirmDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        @click="showConfirmDeleteModal = false"
      ></div>
      <div
        class="relative bg-white border border-slate-200 p-6 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-xl"
      >
        <div class="space-y-1.5">
          <h3 class="text-sm font-extrabold text-slate-800">
            ยืนยันการลบพนักงาน
          </h3>
          <p class="text-[11px] font-bold text-slate-500 leading-normal">
            คุณต้องการลบพนักงาน "{{ staffToDeleteName }}" ใช่หรือไม่?
          </p>
        </div>
        <div class="flex gap-2.5 pt-1">
          <button
            @click="executeDelete"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            ยืนยันการลบ
          </button>
          <button
            @click="showConfirmDeleteModal = false"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useToast } from "~/composables/useToast";

const { showToast } = useToast();
const { get, post, patch, del } = useApi();
const { auth } = useAuth();

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

interface Staff {
  id: string;
  branch_id: string | null;
  role: "SUPER_ADMIN" | "OWNER" | "MANAGER" | "CASHIER";
  username: string;
  firstname: string;
  lastname: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  must_change_password: boolean;
}

const staffs = ref<Staff[]>([]);
const isEditingStaff = ref(false);
const editingStaffId = ref<string | null>(null);
const showConfirmDeleteModal = ref(false);
const staffToDeleteId = ref<string | null>(null);
const staffToDeleteName = ref("");

const roleLabel = (role: string) => {
  if (role === "OWNER") return "เจ้าของร้าน";
  if (role === "MANAGER") return "ผู้จัดการ";
  if (role === "CASHIER") return "แคชเชียร์";
  return "ผู้ดูแลระบบ";
};

const currentRole = computed(() =>
  String(auth.value.user?.role || "").toUpperCase(),
);

const canCreateOrUpdate = computed(() =>
  ["SUPER_ADMIN", "OWNER", "MANAGER"].includes(currentRole.value),
);

const canDelete = computed(() =>
  ["SUPER_ADMIN", "OWNER"].includes(currentRole.value),
);

const canUpdateStaff = (staff: Staff) => {
  if (!canCreateOrUpdate.value) return false;
  if (currentRole.value === "SUPER_ADMIN") return true;
  if (currentRole.value === "OWNER") return true;
  if (currentRole.value === "MANAGER") {
    return staff.role !== "OWNER" && staff.role !== "SUPER_ADMIN";
  }
  return false;
};

const canDeleteStaff = (staff: Staff) => {
  if (!canDelete.value) return false;
  if (currentRole.value === "SUPER_ADMIN") return true;
  if (currentRole.value === "OWNER") {
    return staff.role !== "OWNER" && staff.role !== "SUPER_ADMIN";
  }
  return false;
};

const availableRoles = computed(() => {
  const authRole = String(auth.value.user?.role || "").toUpperCase();
  if (authRole === "SUPER_ADMIN")
    return ["SUPER_ADMIN", "OWNER", "MANAGER", "CASHIER"];
  if (authRole === "OWNER") return ["OWNER", "MANAGER", "CASHIER"];
  if (authRole === "MANAGER") return ["MANAGER", "CASHIER"];
  return [];
});

const staffForm = ref({
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  role: "CASHIER",
  is_active: true,
  must_change_password: false,
});

const branchId = computed(() => auth.value.user?.branchId || "");

const loadStaffs = async () => {
  try {
    const res = await get<Staff[]>("/api/v1/store/staff", { size: 1000 });
    staffs.value = res.data ?? [];
  } catch (e: any) {
    showToast(e?.data?.message || "โหลดรายการพนักงานไม่สำเร็จ", "error");
  }
};

onMounted(loadStaffs);

const validateForm = () => {
  if (!staffForm.value.username.trim()) return "กรุณากรอกชื่อผู้ใช้";
  if (!staffForm.value.password.trim()) return "กรุณากรอกรหัสผ่าน";
  if (!staffForm.value.firstname.trim()) return "กรุณากรอกชื่อ";
  if (!staffForm.value.lastname.trim()) return "กรุณากรอกนามสกุล";
  if (!staffForm.value.role) return "กรุณาเลือกตำแหน่ง";
  if (!branchId.value) return "ไม่พบข้อมูลสาขา";
  return "";
};

const saveStaff = async () => {
  if (!canCreateOrUpdate.value) {
    showToast("คุณไม่มีสิทธิ์เพิ่มหรือแก้ไขพนักงาน", "error");
    return;
  }

  const validationMsg = validateForm();
  if (validationMsg) {
    showToast(validationMsg, "error");
    return;
  }

  const payload = {
    branch_id: branchId.value,
    role: staffForm.value.role,
    username: staffForm.value.username.trim(),
    password: staffForm.value.password,
    firstname: staffForm.value.firstname.trim(),
    lastname: staffForm.value.lastname.trim(),
    email: staffForm.value.email.trim(),
    phone: staffForm.value.phone.trim(),
    is_active: staffForm.value.is_active,
    must_change_password: false,
  };

  try {
    if (isEditingStaff.value && editingStaffId.value) {
      await patch(`/api/v1/store/staff/${editingStaffId.value}`, payload);
      showToast("แก้ไขข้อมูลพนักงานสำเร็จ", "success");
    } else {
      await post("/api/v1/store/staff", payload);
      showToast("เพิ่มพนักงานใหม่สำเร็จ", "success");
    }
    await loadStaffs();
    cancelStaffEdit();
  } catch (e: any) {
    showToast(e?.data?.message || "บันทึกข้อมูลพนักงานไม่สำเร็จ", "error");
  }
};

const startEditStaff = (staff: Staff) => {
  if (!canUpdateStaff(staff)) {
    showToast("คุณไม่มีสิทธิ์แก้ไขพนักงานรายการนี้", "error");
    return;
  }

  isEditingStaff.value = true;
  editingStaffId.value = staff.id;
  staffForm.value = {
    username: staff.username,
    password: "",
    firstname: staff.firstname,
    lastname: staff.lastname,
    email: staff.email || "",
    phone: staff.phone || "",
    role: staff.role,
    is_active: staff.is_active,
    must_change_password: false,
  };
};

const cancelStaffEdit = () => {
  isEditingStaff.value = false;
  editingStaffId.value = null;
  staffForm.value = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "CASHIER",
    is_active: true,
    must_change_password: false,
  };
};

const confirmDelete = (id: string, username: string) => {
  const staff = staffs.value.find((item) => item.id === id);
  if (!staff || !canDeleteStaff(staff)) {
    showToast("คุณไม่มีสิทธิ์ลบพนักงานรายการนี้", "error");
    return;
  }

  staffToDeleteId.value = id;
  staffToDeleteName.value = username;
  showConfirmDeleteModal.value = true;
};

const executeDelete = async () => {
  if (!staffToDeleteId.value) return;
  try {
    await del(`/api/v1/store/staff/${staffToDeleteId.value}`);
    showToast("ลบพนักงานสำเร็จ", "success");
    await loadStaffs();
  } catch (e: any) {
    showToast(e?.data?.message || "ลบพนักงานไม่สำเร็จ", "error");
  } finally {
    showConfirmDeleteModal.value = false;
    staffToDeleteId.value = null;
    staffToDeleteName.value = "";
  }
};
</script>
