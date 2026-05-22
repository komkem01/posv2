<template>
  <div
    class="min-h-screen bg-slate-50 relative overflow-hidden px-4 py-8 md:py-12"
  >
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"
    ></div>

    <div
      class="relative w-full max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/60 p-6 md:p-8"
    >
      <div class="mb-7 text-center md:text-left">
        <h1
          class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight"
        >
          ลงทะเบียนร้านค้า
        </h1>
        <p class="text-sm text-slate-500 mt-1.5">
          กรอกข้อมูลร้านค้าเพื่อส่งคำขอใช้งานระบบ POS
          เมื่ออนุมัติแล้วจะได้รับบัญชีผ่านอีเมล
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="submitRequest">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >ชื่อร้านค้า</label
            >
            <input
              v-model="form.storeName"
              type="text"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกชื่อร้านของคุณ "
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >ชื่อเจ้าของร้าน</label
            >
            <input
              v-model="form.ownerFirstname"
              type="text"
              placeholder="กรอกชื่อเจ้าของร้าน"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >นามสกุลเจ้าของร้าน</label
            >
            <input
              v-model="form.ownerLastname"
              type="text"
              placeholder="กรอกนามสกุลเจ้าของร้าน"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >อีเมลติดต่อ</label
            >
            <input
              v-model="form.ownerEmail"
              type="email"
              placeholder="กรอกอีเมลสำหรับติดต่อกลับ"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >เบอร์โทรศัพท์</label
            >
            <input
              v-model="form.ownerPhone"
              type="text"
              placeholder="กรอกเบอร์โทรศัพท์สำหรับติดต่อกลับ"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
        </div>

        <div class="h-px bg-slate-200"></div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >ที่อยู่ (บ้านเลขที่/ถนน/ซอย)</label
            >
            <textarea
              v-model="form.addressDetail"
              rows="3"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกที่อยู่ร้านโดยละเอียด เช่น บ้านเลขที่ ถนน ซอย หมู่บ้าน"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1"
                >จังหวัด</label
              >
              <AppDropdown
                id="province"
                v-model="form.provinceId"
                :options="provinces"
                placeholder="เลือกจังหวัด"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1"
                >อำเภอ / เขต</label
              >
              <AppDropdown
                id="district"
                v-model="form.districtId"
                :options="districts"
                placeholder="เลือกอำเภอ"
                :disabled="!form.provinceId"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1"
                >ตำบล / แขวง</label
              >
              <AppDropdown
                id="sub-district"
                v-model="form.subDistrictId"
                :options="subDistricts"
                placeholder="เลือกตำบล"
                :disabled="!form.districtId"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1"
                >รหัสไปรษณีย์</label
              >
              <AppDropdown
                id="zipcode"
                v-model="form.zipcodeId"
                :options="zipcodes"
                placeholder="เลือกรหัสไปรษณีย์"
                :disabled="!form.subDistrictId"
                required
              />
            </div>
          </div>

          <p v-if="isAddressLoading" class="text-xs text-slate-500">
            กำลังโหลดข้อมูลที่อยู่...
          </p>
        </div>

        <div class="h-px bg-slate-200"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >ชื่อผู้ใช้ที่ต้องการ (ถ้ามี)</label
            >
            <input
              v-model="form.desiredUsername"
              type="text"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกชื่อผู้ใช้ที่ต้องการ"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-slate-600 mb-1"
              >รายละเอียดเพิ่มเติม</label
            >
            <textarea
              v-model="form.note"
              rows="3"
              class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกข้อมูลเกี่ยวกับร้านหรือความต้องการเพิ่มเติม"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting || isAddressLoading"
          class="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 text-sm font-bold disabled:opacity-60 transition-colors"
        >
          {{ isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอสมัครร้านค้า" }}
        </button>
      </form>

      <AppModal
        ref="successModalRef"
        max-width-class="max-w-lg"
        :show-accent="false"
        :close-on-backdrop="false"
      >
        <div class="space-y-5 text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg viewBox="0 0 24 24" class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div>
            <h3 class="text-lg font-extrabold text-slate-800">ส่งคำขอเรียบร้อยแล้ว</h3>
            <p class="mt-2 text-sm text-slate-600 leading-6">
              ระบบได้รับคำขอสมัครร้านค้าของคุณแล้ว
              เมื่อทีมงานอนุมัติ จะส่งข้อมูลเข้าสู่ระบบไปที่อีเมลที่ลงทะเบียนไว้
            </p>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
            @click="closeSuccessModal"
          >
            ปิด
          </button>
        </div>
      </AppModal>

      <!-- <p class="text-xs text-slate-500 mt-5 text-center md:text-left">
        มีบัญชีอยู่แล้ว?
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-bold">เข้าสู่ระบบ</NuxtLink>
      </p> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useToast } from "~/composables/useToast";

const { showToast } = useToast();
const runtimeConfig = useRuntimeConfig();

definePageMeta({
  middleware: [],
});

interface LocationItem {
  id: string;
  name: string;
}

interface DistrictItem extends LocationItem {
  province_id: string;
}

interface SubDistrictItem extends LocationItem {
  district_id: string;
}

interface ZipcodeItem extends LocationItem {
  sub_district_id: string;
}

interface ApiListResponse<T> {
  data?: T[] | null;
}

const isSubmitting = ref(false);
const isAddressLoading = ref(false);
const successModalRef = ref<{ open: () => void; close: () => void } | null>(
  null,
);

const provinces = ref<LocationItem[]>([]);
const districts = ref<DistrictItem[]>([]);
const subDistricts = ref<SubDistrictItem[]>([]);
const zipcodes = ref<ZipcodeItem[]>([]);

const form = ref({
  storeName: "",
  ownerFirstname: "",
  ownerLastname: "",
  ownerEmail: "",
  ownerPhone: "",
  addressDetail: "",
  provinceId: "",
  districtId: "",
  subDistrictId: "",
  zipcodeId: "",
  desiredUsername: "",
  note: "",
});

const fetchList = async <T,>(path: string): Promise<T[]> => {
  const baseApi = runtimeConfig.public.baseApi || "http://localhost:8080";
  const res = await $fetch<ApiListResponse<T>>(`${baseApi}${path}`, {
    method: "GET"
  });
  return res?.data || [];
};

const loadProvinces = async () => {
  provinces.value = await fetchList<LocationItem>(
    "/api/v1/public/province?size=999&sort_by=name&order_by=asc",
  );
};

const loadDistrictsByProvince = async (provinceID: string) => {
  districts.value = await fetchList<DistrictItem>(
    `/api/v1/public/district?province_id=${provinceID}&size=999&sort_by=name&order_by=asc`,
  );
};

const loadSubDistrictsByDistrict = async (districtID: string) => {
  subDistricts.value = await fetchList<SubDistrictItem>(
    `/api/v1/public/sub-district?district_id=${districtID}&size=999&sort_by=name&order_by=asc`,
  );
};

const loadZipcodesBySubDistrict = async (subDistrictID: string) => {
  zipcodes.value = await fetchList<ZipcodeItem>(
    `/api/v1/public/zipcode?sub_district_id=${subDistrictID}&size=999&sort_by=name&order_by=asc`,
  );
};

watch(
  () => form.value.provinceId,
  async (value, oldValue) => {
    if (value === oldValue) return;
    form.value.districtId = "";
    form.value.subDistrictId = "";
    form.value.zipcodeId = "";
    districts.value = [];
    subDistricts.value = [];
    zipcodes.value = [];

    if (!value) return;

    try {
      isAddressLoading.value = true;
      await loadDistrictsByProvince(value);
    } catch (e: any) {
      showToast(e?.data?.message || "โหลดข้อมูลอำเภอไม่สำเร็จ", "error");
    } finally {
      isAddressLoading.value = false;
    }
  },
);

watch(
  () => form.value.districtId,
  async (value, oldValue) => {
    if (value === oldValue) return;
    form.value.subDistrictId = "";
    form.value.zipcodeId = "";
    subDistricts.value = [];
    zipcodes.value = [];

    if (!value) return;

    try {
      isAddressLoading.value = true;
      await loadSubDistrictsByDistrict(value);
    } catch (e: any) {
      showToast(e?.data?.message || "โหลดข้อมูลตำบลไม่สำเร็จ", "error");
    } finally {
      isAddressLoading.value = false;
    }
  },
);

watch(
  () => form.value.subDistrictId,
  async (value, oldValue) => {
    if (value === oldValue) return;
    form.value.zipcodeId = "";
    zipcodes.value = [];

    if (!value) return;

    try {
      isAddressLoading.value = true;
      await loadZipcodesBySubDistrict(value);
      if (zipcodes.value.length > 0) {
        form.value.zipcodeId = zipcodes.value[0]?.id || "";
      }
    } catch (e: any) {
      showToast(e?.data?.message || "โหลดข้อมูลรหัสไปรษณีย์ไม่สำเร็จ", "error");
    } finally {
      isAddressLoading.value = false;
    }
  },
);

const resetForm = () => {
  form.value = {
    storeName: "",
    ownerFirstname: "",
    ownerLastname: "",
    ownerEmail: "",
    ownerPhone: "",
    addressDetail: "",
    provinceId: "",
    districtId: "",
    subDistrictId: "",
    zipcodeId: "",
    desiredUsername: "",
    note: "",
  };
  districts.value = [];
  subDistricts.value = [];
  zipcodes.value = [];
};

const buildFullAddress = () => {
  const provinceName =
    provinces.value.find((item) => item.id === form.value.provinceId)?.name ||
    "";
  const districtName =
    districts.value.find((item) => item.id === form.value.districtId)?.name ||
    "";
  const subDistrictName =
    subDistricts.value.find((item) => item.id === form.value.subDistrictId)
      ?.name || "";
  const zipcodeName =
    zipcodes.value.find((item) => item.id === form.value.zipcodeId)?.name ||
    "";

  return [
    form.value.addressDetail.trim(),
    subDistrictName ? `ต.${subDistrictName}` : "",
    districtName ? `อ.${districtName}` : "",
    provinceName,
    zipcodeName,
  ]
    .filter(Boolean)
    .join(" ");
};

const openSuccessModal = () => {
  successModalRef.value?.open();
};

const closeSuccessModal = async () => {
  successModalRef.value?.close();
  await navigateTo("/login");
};

const submitRequest = async () => {
  if (
    !form.value.provinceId ||
    !form.value.districtId ||
    !form.value.subDistrictId ||
    !form.value.zipcodeId
  ) {
    showToast("กรุณาเลือกข้อมูลที่อยู่ให้ครบถ้วน", "error");
    return;
  }

  isSubmitting.value = true;
  try {
    const baseApi = runtimeConfig.public.baseApi || "http://localhost:8080";
    const fullAddress = buildFullAddress();

    await $fetch(`${baseApi}/api/v1/public/store-registration-request`, {
      method: "POST",
      body: {
        store_name: form.value.storeName,
        owner_firstname: form.value.ownerFirstname,
        owner_lastname: form.value.ownerLastname,
        owner_email: form.value.ownerEmail,
        owner_phone: form.value.ownerPhone,
        address: fullAddress || form.value.addressDetail,
        province_id: form.value.provinceId,
        district_id: form.value.districtId,
        sub_district_id: form.value.subDistrictId,
        zipcode_id: form.value.zipcodeId,
        desired_username: form.value.desiredUsername || undefined,
        note: form.value.note?.trim() || undefined,
      },
    });
    resetForm();
    openSuccessModal();
  } catch (e: any) {
    showToast(e?.data?.message || "ส่งคำขอไม่สำเร็จ", "error");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    isAddressLoading.value = true;
    await loadProvinces();
  } catch (e: any) {
    showToast(e?.data?.message || "โหลดข้อมูลจังหวัดไม่สำเร็จ", "error");
  } finally {
    isAddressLoading.value = false;
  }
});
</script>
