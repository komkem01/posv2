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

      <!-- Date Filter -->
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
        วันนี้: {{ dashboardDateText }}
      </div>
    </div>

    <div class="z-10 rounded-2xl border p-4 shadow-sm" :class="isShiftOpen ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-white'">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wide" :class="isShiftOpen ? 'text-emerald-700' : 'text-slate-500'">สถานะกะหน้าร้าน</p>
          <div class="mt-1 flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold"
              :class="isShiftOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'"
            >
              <span class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="isShiftOpen ? 'bg-emerald-500' : 'bg-slate-500'"></span>
              {{ isShiftOpen ? 'เปิดกะอยู่' : 'ปิดกะอยู่' }}
            </span>
            <span v-if="isShiftOpen" class="text-[11px] font-bold text-slate-500">เริ่ม {{ openedAtText }}</span>
          </div>
        </div>

        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-stretch sm:justify-end">
          <div class="grid grid-cols-3 gap-2 text-[11px] sm:min-w-[320px]">
            <div class="rounded-xl border border-slate-200 bg-white p-2.5">
              <p class="font-bold text-slate-500">เงินตั้งต้น</p>
              <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ openingFloatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-2.5">
              <p class="font-bold text-slate-500">ยอดเงินสด</p>
              <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ shiftCashSales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-2.5">
              <p class="font-bold text-slate-500">ยอดโอน</p>
              <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ shiftPromptPaySales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
            </div>
          </div>

          <button
            type="button"
            @click="isShiftOpen ? openCloseShiftModal() : openOpenShiftModal()"
            class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-bold transition-colors sm:px-4"
            :class="isShiftOpen ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'"
          >
            {{ isShiftOpen ? 'ปิดกะ' : 'เปิดกะ' }}
          </button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showOpenShiftModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showOpenShiftModal = false"></div>

        <div class="relative max-w-md w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div class="border-b border-slate-100 bg-emerald-50 px-5 py-4">
            <p class="text-[11px] font-bold uppercase tracking-wide text-emerald-700">เริ่มต้นวันขาย</p>
            <h3 class="mt-1 text-lg font-extrabold text-slate-800">เปิดกะหน้าร้าน</h3>
          </div>

          <div class="space-y-4 px-5 py-5">
            <p class="text-xs leading-relaxed text-slate-500">
              กรอกเงินตั้งต้นที่ใส่ไว้ในลิ้นชัก เพื่อใช้เป็นฐานคำนวณตอนปิดกะ
            </p>

            <AppInput
              :modelValue="displayOpenShiftAmount"
              @update:modelValue="onOpenShiftAmountInput"
              @blur="formatOpenShiftAmount"
              @focus="unformatOpenShiftAmount"
              type="text"
              label="เงินตั้งต้นเปิดร้าน (บาท)"
              placeholder="เช่น 2,000.00"
              inputClass="text-right py-3 text-lg font-extrabold"
            />
          </div>

          <div class="flex gap-2.5 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              @click="showOpenShiftModal = false"
              class="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="confirmOpenShift"
              :disabled="openShiftAmount.trim() === ''"
              class="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              ยืนยันเปิดกะ
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCloseShiftModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showCloseShiftModal = false"></div>

        <div class="relative max-w-2xl w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div class="border-b border-slate-100 bg-rose-50 px-5 py-4">
            <p class="text-[11px] font-bold uppercase tracking-wide text-rose-700">สรุปยอดปลายวัน</p>
            <h3 class="mt-1 text-lg font-extrabold text-slate-800">ปิดกะและนับเงินสด</h3>
          </div>

          <div class="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] font-bold text-slate-500">เงินตั้งต้น</p>
                <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ openingFloatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] font-bold text-slate-500">ยอดขายเงินสด</p>
                <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ shiftCashSales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] font-bold text-slate-500">ยอดโอน</p>
                <p class="mt-1 text-sm font-extrabold text-slate-800">฿{{ shiftPromptPaySales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
                <p class="mt-1 text-[10px] font-bold text-slate-400">แสดงผลเท่านั้น (ไม่รวมคำนวณเงินสด)</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] font-bold text-slate-500">เงินสดที่ควรมี</p>
                <p class="mt-1 text-sm font-extrabold text-blue-700">฿{{ expectedCloseCash.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div v-for="denom in cashDenominations" :key="denom.key" class="rounded-xl border border-slate-200 bg-white p-2.5">
                <label class="mb-1 block text-[11px] font-bold text-slate-500">{{ denom.label }}</label>
                <input
                  :value="closeShiftCashCount[denom.key]"
                  @input="onCloseCashCountInput(denom.key, $event)"
                  type="text"
                  inputmode="numeric"
                  class="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-right text-sm font-bold text-slate-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="0"
                />
              </div>
            </div>

            <div class="rounded-2xl border p-4" :class="closeCashDifference === 0 ? 'border-emerald-200 bg-emerald-50' : closeCashDifference > 0 ? 'border-amber-200 bg-amber-50' : 'border-rose-200 bg-rose-50'">
              <div class="flex items-center justify-between text-sm">
                <span class="font-bold text-slate-600">ยอดเงินสดที่นับได้</span>
                <span class="text-xl font-extrabold text-slate-800">฿{{ countedCloseCash.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between text-sm">
                <span class="font-bold text-slate-600">ยอดโอน (แสดงผล)</span>
                <span class="text-base font-extrabold text-slate-800">฿{{ shiftPromptPaySales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="mt-2 flex items-center justify-between text-xs">
                <span class="font-bold text-slate-500">ส่วนต่างจากยอดที่ควรมี</span>
                <span class="font-extrabold" :class="closeCashDifference === 0 ? 'text-emerald-700' : closeCashDifference > 0 ? 'text-amber-700' : 'text-rose-700'">
                  {{ closeCashDifference === 0 ? 'ตรงยอดพอดี' : closeCashDifference > 0 ? `เกิน ฿${Math.abs(closeCashDifference).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `ขาด ฿${Math.abs(closeCashDifference).toLocaleString(undefined, { minimumFractionDigits: 2 })}` }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex gap-2.5 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              @click="showCloseShiftModal = false"
              class="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="confirmCloseShift"
              class="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
            >
              ยืนยันปิดกะ
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showShiftSummaryReceiptModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showShiftSummaryReceiptModal = false"></div>

        <div class="relative max-w-lg w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div class="border-b border-slate-100 bg-blue-50 px-5 py-4">
            <p class="text-[11px] font-bold uppercase tracking-wide text-blue-700">ใบเสร็จสรุปปิดกะ</p>
            <h3 class="mt-1 text-lg font-extrabold text-slate-800">สรุปรายการขายของร้าน</h3>
          </div>

          <div class="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm" id="shift-summary-receipt">
            <div class="text-center border-b border-dashed border-slate-300 pb-3">
              <p class="text-base font-extrabold text-slate-800">{{ closeShiftSummary.storeName || 'EasyPOS Store' }}</p>
              <p class="mt-1 text-[11px] text-slate-500 whitespace-pre-line">{{ closeShiftSummary.storeAddress || '-' }}</p>
              <p class="mt-1 text-[11px] text-slate-500">Tax ID: {{ closeShiftSummary.taxId || '-' }}</p>
            </div>

            <div class="mt-3 space-y-1 text-[11px] text-slate-600 border-b border-dashed border-slate-300 pb-3">
              <div class="flex items-start justify-between gap-2">
                <span>รหัสกะทำงาน</span>
                <div class="text-right">
                  <p class="font-semibold font-mono text-[12px] text-slate-800">{{ shiftDisplayCode }}</p>
                  <button
                    v-if="closeShiftSummary.shiftId"
                    type="button"
                    @click="copyShiftId"
                    class="mt-0.5 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    คัดลอกรหัสเต็ม
                  </button>
                </div>
              </div>
              <div class="flex justify-between"><span>เวลาปิดกะ</span><span class="font-semibold">{{ closeShiftSummary.closedAtText }}</span></div>
              <div class="flex justify-between"><span>จำนวนบิล</span><span class="font-semibold">{{ closeShiftSummary.orderCount.toLocaleString() }}</span></div>
            </div>

            <div class="mt-3 border-b border-dashed border-slate-300 pb-3">
              <div class="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>รายการบิลขาย (สรุป)</span>
                <span>ยอดสุทธิ</span>
              </div>
              <div v-if="closeShiftSummary.orders.length === 0" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                ไม่พบรายการขายในกะนี้
              </div>
              <div v-else class="space-y-1.5">
                <div v-for="item in closeShiftSummary.orders" :key="item.id" class="flex items-start justify-between gap-3 text-[11px]">
                  <div class="min-w-0">
                    <p class="font-bold text-slate-700 truncate">{{ item.orderNo }}</p>
                    <p class="text-slate-500">{{ item.createdAtText }}</p>
                  </div>
                  <p class="font-extrabold text-slate-700">฿{{ item.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
                </div>
              </div>
            </div>

            <div class="mt-3 space-y-1.5 text-[12px]">
              <div class="flex justify-between"><span class="text-slate-600">ยอดรวมสุทธิจากบิล</span><span class="font-bold text-slate-800">฿{{ closeShiftSummary.totalNetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">ยอดขายเงินสด</span><span class="font-bold text-slate-800">฿{{ closeShiftSummary.cashSales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">ยอดขายโอน</span><span class="font-bold text-slate-800">฿{{ closeShiftSummary.promptPaySales.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">เงินสดที่นับได้</span><span class="font-bold text-slate-800">฿{{ closeShiftSummary.countedCash.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span></div>
              <div class="flex justify-between"><span class="text-slate-600">ส่วนต่างเงินสด</span><span class="font-extrabold" :class="closeShiftSummary.cashDifference === 0 ? 'text-emerald-700' : closeShiftSummary.cashDifference > 0 ? 'text-amber-700' : 'text-rose-700'">{{ closeShiftSummary.cashDifference === 0 ? 'ตรงยอดพอดี' : closeShiftSummary.cashDifference > 0 ? `เกิน ฿${Math.abs(closeShiftSummary.cashDifference).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `ขาด ฿${Math.abs(closeShiftSummary.cashDifference).toLocaleString(undefined, { minimumFractionDigits: 2 })}` }}</span></div>
            </div>
          </div>

          <div class="flex gap-2.5 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              @click="showShiftSummaryReceiptModal = false"
              class="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
            >
              ปิด
            </button>
            <button
              type="button"
              @click="printShiftSummaryReceipt"
              class="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              พิมพ์ใบสรุป
            </button>
          </div>
        </div>
      </div>
    </Transition>

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
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" :title="formattedTotalSales">
            {{ formattedTotalSales }}
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
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" :title="formattedTotalOrders">
            {{ formattedTotalOrders }}
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
          <h3 class="text-sm md:text-lg font-extrabold text-slate-800 truncate" :title="formattedAverageTicket">
            {{ formattedAverageTicket }}
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
            :title="lowStockLabel"
          >
            {{ lowStockLabel }}
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
import { computed, onMounted, ref } from "vue";
import { useToast } from "~/composables/useToast";

const { showToast } = useToast()
const { get } = useApi()
const { auth } = useAuth()
const {
  shiftState,
  isShiftOpen,
  openingFloatAmount,
  shiftCashSales,
  shiftPromptPaySales,
  refreshShiftState,
  openShift,
  closeShift,
} = useShiftState()

interface CashDenomination {
  key: string;
  label: string;
  value: number;
}

interface OrderListItem {
  id: string
  branch_id: string
  shift_id: string
  order_no: string
  status: string
  net_amount: number
  created_at?: string | null
}

interface BranchSummaryInfo {
  store_name?: string
  name?: string
  tax_id?: string | null
  address?: string
  sub_district_name?: string
  district_name?: string
  province_name?: string
  zipcode_name?: string
}

interface CloseShiftSummaryOrder {
  id: string
  orderNo: string
  netAmount: number
  createdAtText: string
}

interface DashboardRecentTransaction {
  id: string
  order_id: string
  time: string
  items_summary: string
  amount: number
  status: string
}

interface DashboardTopProduct {
  name: string
  sales_count: number
  revenue: number
}

interface DashboardSummaryResponse {
  date_text?: string
  total_sales?: number
  total_orders?: number
  average_ticket?: number
  low_stock_count?: number
  recent_transactions?: DashboardRecentTransaction[]
  top_products?: DashboardTopProduct[]
}

const showOpenShiftModal = ref(false)
const showCloseShiftModal = ref(false)
const showShiftSummaryReceiptModal = ref(false)
const openShiftAmount = ref('')
const displayOpenShiftAmount = ref('')

const closeShiftSummary = ref({
  shiftId: '',
  closedAtText: '-',
  storeName: '',
  storeAddress: '',
  taxId: '-',
  orders: [] as CloseShiftSummaryOrder[],
  orderCount: 0,
  totalNetAmount: 0,
  cashSales: 0,
  promptPaySales: 0,
  countedCash: 0,
  cashDifference: 0,
})

const dashboardDateText = ref(
  new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)
const totalSales = ref(0)
const totalOrders = ref(0)
const averageTicket = ref(0)
const lowStockCount = ref(0)

const recentTransactions = ref<Array<{
  id: string
  orderId: string
  time: string
  itemsSummary: string
  amount: number
  status: string
}>>([])

const topProducts = ref<Array<{
  name: string
  salesCount: number
  revenue: number
}>>([])

const formattedTotalSales = computed(
  () => `฿${totalSales.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
)
const formattedTotalOrders = computed(() => `${totalOrders.value.toLocaleString()} รายการ`)
const formattedAverageTicket = computed(
  () => `฿${averageTicket.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
)
const lowStockLabel = computed(() => {
  if (lowStockCount.value <= 0) {
    return 'สต็อกปกติ'
  }
  return `ใกล้หมด ${lowStockCount.value.toLocaleString()} รายการ`
})

const shiftDisplayCode = computed(() => {
  const raw = (closeShiftSummary.value.shiftId || '').trim()
  if (!raw) return '-'

  const normalized = raw.replace(/-/g, '')
  let hash = 0
  for (const ch of normalized) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 1000000
  }

  return `SHID-${hash.toString().padStart(6, '0')}`
})

const copyShiftId = async () => {
  const raw = (closeShiftSummary.value.shiftId || '').trim()
  if (!raw) return

  try {
    await navigator.clipboard.writeText(raw)
    showToast('คัดลอก Shift ID แล้ว', 'success')
  } catch {
    showToast('คัดลอกรหัสไม่สำเร็จ', 'error')
  }
}

const cashDenominations: CashDenomination[] = [
  { key: '1000', label: 'แบงก์ ฿1,000', value: 1000 },
  { key: '500', label: 'แบงก์ ฿500', value: 500 },
  { key: '100', label: 'แบงก์ ฿100', value: 100 },
  { key: '50', label: 'แบงก์ ฿50', value: 50 },
  { key: '20', label: 'แบงก์ ฿20', value: 20 },
  { key: '10', label: 'เหรียญ ฿10', value: 10 },
  { key: '5', label: 'เหรียญ ฿5', value: 5 },
  { key: '2', label: 'เหรียญ ฿2', value: 2 },
  { key: '1', label: 'เหรียญ ฿1', value: 1 },
  { key: '050', label: 'เหรียญ 50 สต.', value: 0.5 },
  { key: '025', label: 'เหรียญ 25 สต.', value: 0.25 },
]

const initialCashCountState = () =>
  cashDenominations.reduce<Record<string, string>>((acc, denom) => {
    acc[denom.key] = ''
    return acc
  }, {})

const closeShiftCashCount = ref<Record<string, string>>(initialCashCountState())

const expectedCloseCash = computed(() => openingFloatAmount.value + shiftCashSales.value)

const countedCloseCash = computed(() => {
  return cashDenominations.reduce((sum, denom) => {
    const count = parseInt(closeShiftCashCount.value[denom.key] || '0', 10) || 0
    return sum + count * denom.value
  }, 0)
})

const closeCashDifference = computed(() => countedCloseCash.value - expectedCloseCash.value)

const parsedOpenShiftAmount = computed(() => {
  const amount = parseFloat(openShiftAmount.value)
  return Number.isFinite(amount) && amount >= 0 ? amount : 0
})

const onOpenShiftAmountInput = (val: string) => {
  const cleaned = val.replace(/[^\d.]/g, '')
  openShiftAmount.value = cleaned
  displayOpenShiftAmount.value = val
}

const formatOpenShiftAmount = () => {
  const num = parseFloat(openShiftAmount.value)
  if (!isNaN(num)) {
    displayOpenShiftAmount.value = num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else {
    openShiftAmount.value = ''
    displayOpenShiftAmount.value = ''
  }
}

const unformatOpenShiftAmount = () => {
  displayOpenShiftAmount.value = openShiftAmount.value
}

const openOpenShiftModal = () => {
  openShiftAmount.value = openingFloatAmount.value > 0 ? openingFloatAmount.value.toString() : ''
  displayOpenShiftAmount.value = openShiftAmount.value
  showOpenShiftModal.value = true
}

const confirmOpenShift = async () => {
  try {
    await openShift(parsedOpenShiftAmount.value)
    closeShiftCashCount.value = initialCashCountState()
    showOpenShiftModal.value = false
    showToast('เปิดกะเรียบร้อย', 'success')
  } catch (e: any) {
    showToast(e?.data?.message || 'เปิดกะไม่สำเร็จ', 'error')
  }
}

const openCloseShiftModal = () => {
  closeShiftCashCount.value = initialCashCountState()
  showCloseShiftModal.value = true
}

const onCloseCashCountInput = (key: string, event: Event) => {
  const target = event.target as HTMLInputElement | null
  closeShiftCashCount.value[key] = (target?.value || '').replace(/[^\d]/g, '')
}

const formatBranchAddress = (branch: BranchSummaryInfo) => {
  const parts = [
    branch.address,
    branch.sub_district_name,
    branch.district_name,
    branch.province_name,
    branch.zipcode_name,
  ]
    .map((v) => (v || '').trim())
    .filter((v) => v.length > 0)

  return parts.join(' ')
}

const fetchShiftOrders = async (shiftID: string, branchID: string) => {
  const pageSize = 100
  let page = 1
  const result: CloseShiftSummaryOrder[] = []

  while (true) {
    const res = await get<OrderListItem[]>('/api/v1/store/order', {
      page,
      size: pageSize,
      sort_by: 'created_at',
      order_by: 'asc',
    })

    const list = res.data ?? []
    const inShift = list.filter(
      (item) => item.shift_id === shiftID && item.branch_id === branchID && item.status === 'COMPLETED',
    )

    for (const item of inShift) {
      result.push({
        id: item.id,
        orderNo: item.order_no,
        netAmount: Number(item.net_amount || 0),
        createdAtText: item.created_at
          ? new Date(item.created_at).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit' })
          : '-',
      })
    }

    if (list.length < pageSize) {
      break
    }
    page += 1
  }

  return result
}

const prepareCloseShiftSummaryReceipt = async (shiftID: string, countedCash: number, diff: number) => {
  const branchID = auth.value.user?.branchId || ''

  let storeName = 'EasyPOS Store'
  let storeAddress = '-'
  let taxId = '-'

  if (branchID) {
    try {
      const branchRes = await get<BranchSummaryInfo>(`/api/v1/store/branch/${branchID}`)
      const branch = branchRes.data
      if (branch) {
        storeName = (branch.store_name || branch.name || '').trim() || 'EasyPOS Store'
        storeAddress = formatBranchAddress(branch) || '-'
        taxId = (branch.tax_id || '').trim() || '-'
      }
    } catch {
      // keep fallback header values
    }
  }

  let orders: CloseShiftSummaryOrder[] = []
  try {
    if (shiftID && branchID) {
      orders = await fetchShiftOrders(shiftID, branchID)
    }
  } catch {
    showToast('โหลดรายการขายสรุปไม่สำเร็จ จะแสดงเฉพาะยอดรวมกะ', 'info')
  }

  const totalNet = orders.reduce((sum, item) => sum + item.netAmount, 0)

  closeShiftSummary.value = {
    shiftId: shiftID,
    closedAtText: new Date().toLocaleString('th-TH'),
    storeName,
    storeAddress,
    taxId,
    orders,
    orderCount: orders.length,
    totalNetAmount: totalNet,
    cashSales: shiftCashSales.value,
    promptPaySales: shiftPromptPaySales.value,
    countedCash,
    cashDifference: diff,
  }
}

const printShiftSummaryReceipt = () => {
  window.print()
}

const confirmCloseShift = async () => {
  const diff = closeCashDifference.value
  const countedCash = countedCloseCash.value
  const closingShiftID = shiftState.value.id || ''

  try {
    await closeShift(countedCash)
    closeShiftCashCount.value = initialCashCountState()
    showCloseShiftModal.value = false

    await prepareCloseShiftSummaryReceipt(closingShiftID, countedCash, diff)
    showShiftSummaryReceiptModal.value = true

    if (diff === 0) {
      showToast('ปิดกะเรียบร้อย ยอดเงินสดตรงตามระบบ', 'success')
      return
    }
    if (diff > 0) {
      showToast('ปิดกะเรียบร้อย พบเงินเกินจากระบบ', 'info')
      return
    }
    showToast('ปิดกะเรียบร้อย พบเงินขาดจากระบบ', 'error')
  } catch (e: any) {
    showToast(e?.data?.message || 'ปิดกะไม่สำเร็จ', 'error')
  }
}

const loadDashboardSummary = async () => {
  const res = await get<DashboardSummaryResponse>('/api/v1/store/dashboard/summary')
  const data = res.data || {}

  totalSales.value = Number(data.total_sales || 0)
  totalOrders.value = Number(data.total_orders || 0)
  averageTicket.value = Number(data.average_ticket || 0)
  lowStockCount.value = Number(data.low_stock_count || 0)

  if (typeof data.date_text === 'string' && data.date_text.trim().length > 0) {
    dashboardDateText.value = data.date_text
  }

  recentTransactions.value = (data.recent_transactions || []).map((tx) => ({
    id: tx.id,
    orderId: tx.order_id,
    time: tx.time,
    itemsSummary: tx.items_summary,
    amount: Number(tx.amount || 0),
    status: tx.status || 'สำเร็จ',
  }))

  topProducts.value = (data.top_products || []).map((item) => ({
    name: item.name,
    salesCount: Number(item.sales_count || 0),
    revenue: Number(item.revenue || 0),
  }))
}

onMounted(async () => {
  try {
    await Promise.all([refreshShiftState(), loadDashboardSummary()])
  } catch (e: any) {
    showToast(e?.data?.message || 'โหลดข้อมูลแดชบอร์ดไม่สำเร็จ', 'error')
  }
})

const openedAtText = computed(() => {
  if (!shiftState.value.openedAt) return '-'
  return new Date(shiftState.value.openedAt).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
});
</script>
