<template>
  <div
    class="min-h-[calc(100vh-140px)] md:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-6 flex flex-col gap-4 md:gap-6 relative md:overflow-hidden"
  >
    <!-- Background glows -->
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <!-- Page Header (Static) -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0 z-10"
    >
      <div>
        <h1 class="text-xl font-extrabold text-slate-800 tracking-tight">
          ระบบจัดการหลังบ้าน (Backoffice)
        </h1>
        <p class="text-xs text-slate-400">
          ควบคุมยอดขาย วิเคราะห์ข้อมูลสินค้า และตรวจสอบสถานะสต็อกสินค้า
        </p>
      </div>

      <!-- Date Filter Mock -->
      <div
        class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-600"
      >
        <svg
          class="w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        วันนี้: 19 พฤษภาคม 2026
      </div>
    </div>

    <!-- Analytics Cards Grid (Static) -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-shrink-0 z-10"
    >
      <!-- Total Sales -->
      <div
        class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate"
          >
            ยอดขายทั้งหมด
          </p>
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" title="฿45,290.00">
            ฿45,290.00
          </h3>
        </div>
      </div>

      <!-- Orders -->
      <div
        class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate"
          >
            คำสั่งซื้อทั้งหมด
          </p>
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" title="142 รายการ">
            142 รายการ
          </h3>
        </div>
      </div>

      <!-- Average Ticket -->
      <div
        class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 flex-shrink-0"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
            ></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate"
          >
            ยอดขายเฉลี่ยต่อบิล
          </p>
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" title="฿318.90">
            ฿318.90
          </h3>
        </div>
      </div>

      <!-- Stock Alerts -->
      <div
        class="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 flex-shrink-0"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate"
          >
            แจ้งเตือนสต็อกต่ำ
          </p>
          <h3
            class="text-xs md:text-sm font-extrabold text-slate-800 leading-tight truncate"
            title="ใกล้หมด 2 รายการ"
          >
            ใกล้หมด 2 รายการ
          </h3>
        </div>
      </div>
    </div>

    <!-- Dashboard Content Area (Scrollable Flex) -->
    <div
      class="flex-grow flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden z-10 md:h-full"
    >
      <!-- Recent Transactions Table (Left, 2/3 width) -->
      <div
        class="flex-grow md:w-3/5 lg:w-2/3 bg-white border border-slate-200 rounded-3xl p-4 md:p-5 flex flex-col md:h-full md:overflow-hidden shadow-sm"
      >
        <h2
          class="font-extrabold text-sm text-slate-800 mb-4 flex-shrink-0 flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-blue-600"></span>
          รายการธุรกรรมล่าสุด
        </h2>

        <!-- Table container -->
        <div class="flex-grow overflow-y-auto pr-1">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                class="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider"
              >
                <th class="pb-3 pl-2">เลขที่ใบเสร็จ</th>
                <th class="pb-3">เวลา</th>
                <th class="pb-3">รายการสินค้า</th>
                <th class="pb-3 text-right pr-2">ยอดชำระสุทธิ</th>
                <th class="pb-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="tx in recentTransactions"
                :key="tx.id"
                class="hover:bg-slate-50/50 transition-colors"
              >
                <td class="py-3.5 pl-2 font-mono font-bold text-blue-650">
                  #{{ tx.orderId }}
                </td>
                <td class="py-3.5 text-slate-500">{{ tx.time }}</td>
                <td class="py-3.5 text-slate-700 font-medium">
                  {{ tx.itemsSummary }}
                </td>
                <td class="py-3.5 text-right pr-2 font-bold text-slate-800">
                  ฿{{
                    tx.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                  }}
                </td>
                <td class="py-3.5 text-center">
                  <span
                    class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100/50"
                  >
                    {{ tx.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Selling Products (Right, 1/3 width) -->
      <div
        class="md:w-2/5 lg:w-1/3 w-full bg-white border border-slate-200 rounded-3xl p-4 md:p-5 flex flex-col md:h-full md:overflow-hidden shadow-sm"
      >
        <h2
          class="font-extrabold text-sm text-slate-800 mb-4 flex-shrink-0 flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
          สินค้าขายดี
        </h2>

        <div class="flex-grow overflow-y-auto space-y-4 pr-1">
          <div
            v-for="(prod, idx) in topProducts"
            :key="prod.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <!-- Ranking Badge -->
              <span
                class="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500"
              >
                {{ idx + 1 }}
              </span>
              <div>
                <h4 class="text-xs font-bold text-slate-800">
                  {{ prod.name }}
                </h4>
                <p class="text-[10px] text-slate-400">
                  ขายแล้ว {{ prod.salesCount }} ชิ้น
                </p>
              </div>
            </div>
            <span class="text-xs font-extrabold text-slate-850"
              >฿{{ prod.revenue.toLocaleString() }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
});

// Mock Transactions
const recentTransactions = ref([
  {
    id: 1,
    orderId: "POS-260519-01",
    time: "11:15 น.",
    itemsSummary: "มัทฉะลาเต้เย็น, ครัวซองต์คลาสสิก",
    amount: 180.0,
    status: "สำเร็จ",
  },
  {
    id: 2,
    orderId: "POS-260519-02",
    time: "11:08 น.",
    itemsSummary: "ขนมปังหน้าอโวคาโดและไข่, เอสเพรสโซ่ร้อน",
    amount: 250.0,
    status: "สำเร็จ",
  },
  {
    id: 3,
    orderId: "POS-260519-03",
    time: "10:52 น.",
    itemsSummary: "อเมริกาโน่พรีเมียม x2, เค้กช็อกโกแลตฟัดจ์",
    amount: 260.0,
    status: "สำเร็จ",
  },
  {
    id: 4,
    orderId: "POS-260519-04",
    time: "10:41 น.",
    itemsSummary: "ทรัฟเฟิลฟรายส์พร้อมมายองเนส, สมูทตี้เบอร์รี่สด",
    amount: 225.0,
    status: "สำเร็จ",
  },
  {
    id: 5,
    orderId: "POS-260519-05",
    time: "10:12 น.",
    itemsSummary: "เอสเพรสโซ่ร้อน, ครัวซองต์คลาสสิก",
    amount: 150.0,
    status: "สำเร็จ",
  },
  {
    id: 6,
    orderId: "POS-260519-06",
    time: "09:45 น.",
    itemsSummary: "คลับแซนด์วิช, ขนมปังกระเทียมอบชีส",
    amount: 245.0,
    status: "สำเร็จ",
  },
]);

// Mock Top Products
const topProducts = ref([
  { name: "มัทฉะลาเต้เย็น", salesCount: 58, revenue: 5510 },
  { name: "ครัวซองต์คลาสสิก", salesCount: 42, revenue: 3570 },
  { name: "อเมริกาโน่พรีเมียม", salesCount: 39, revenue: 2925 },
  { name: "ขนมปังหน้าอโวคาโดและไข่", salesCount: 24, revenue: 4440 },
]);
</script>
