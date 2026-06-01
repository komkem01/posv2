<template>
  <div
    class="min-h-[calc(100vh-140px)] md:h-[calc(100vh-154px)] bg-slate-50 text-slate-800 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 relative md:overflow-hidden"
  >
    <!-- Background glows -->
    <div
      class="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <!-- MAIN PRODUCT SECTION (LEFT) -->
    <div
      class="flex-grow md:w-3/5 lg:w-2/3 flex flex-col gap-4 md:gap-6 z-10 md:h-full md:overflow-hidden"
    >
      <!-- Search & Category Tabs -->
      <div
        class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0"
      >
        <!-- Search bar -->
        <div class="relative flex-grow max-w-md">
          <AppInput
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            inputClass="py-2.5 text-sm"
          >
            <template #prefix>
              <svg
                class="h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </template>
          </AppInput>
        </div>

        <!-- Categories Slider/Buttons -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 transform active:scale-95"
            :class="
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                : 'bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/50 hover:border-slate-350'
            "
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div
        class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto md:flex-grow pr-1 pb-4 content-start auto-rows-max"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          @click="openAddonModal(product)"
          class="group relative bg-white hover:bg-slate-50/50 border border-slate-200 rounded-2xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] flex flex-col justify-between h-48 shadow-sm hover:shadow-md hover:border-blue-300 overflow-hidden"
        >
          <!-- Subtle visual pattern on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <div>
            <!-- Header section of card -->
            <div class="flex justify-between items-start mb-2">
              <span
                class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
              >
                {{ product.category }}
              </span>
              <span class="text-xs text-slate-400">
                คงเหลือ:
                <span
                  :class="
                    product.stock < 5
                      ? 'text-rose-600 font-bold'
                      : 'text-slate-500'
                  "
                  >{{ product.stock }}</span
                >
              </span>
            </div>
            <!-- Product Title -->
            <h3
              class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug"
            >
              {{ product.name }}
            </h3>
          </div>

          <!-- Footer section of card (Price & Action) -->
          <div class="flex justify-between items-end mt-4">
            <div>
              <p class="text-[10px] text-slate-400 leading-none mb-1">ราคา</p>
              <p class="font-extrabold text-base text-slate-900">
                ฿{{
                  product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </p>
            </div>
            <!-- Elegant add button -->
            <div
              class="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-555 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200 group-hover:border-blue-600"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Empty state when no products found -->
        <div
          v-if="filteredProducts.length === 0"
          class="col-span-full py-16 text-center text-slate-400 space-y-2"
        >
          <svg
            class="w-12 h-12 mx-auto text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p class="text-sm font-semibold">ไม่พบรายการสินค้าที่ค้นหา</p>
        </div>
      </div>
    </div>

    <!-- SHOPPING CART PANEL (RIGHT) -->
    <div
      class="md:w-2/5 lg:w-1/3 w-full bg-white border border-slate-200 rounded-3xl p-4 md:p-5 flex flex-col justify-between min-h-[500px] md:min-h-0 md:h-full z-10 shadow-sm md:overflow-hidden"
    >
      <div class="flex-grow flex flex-col overflow-hidden">
        <!-- Cart Header -->
        <div
          class="flex justify-between items-center pb-4 border-b border-slate-100 flex-shrink-0"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
            <h2 class="font-extrabold text-lg text-slate-800">
              รายการสั่งซื้อปัจจุบัน
            </h2>
          </div>
          <button
            @click="clearCart"
            v-if="cart.length > 0"
            class="text-xs text-rose-650 hover:text-rose-500 font-bold transition-colors"
          >
            ล้างทั้งหมด
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="overflow-y-auto flex-grow mt-4 space-y-3 pr-1">
          <div
            v-for="item in cart"
            :key="item.product.id"
            class="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all duration-200"
          >
            <div class="flex justify-between items-start gap-2">
              <h4 class="font-bold text-slate-800 text-sm leading-tight">
                {{ item.product.name }}
              </h4>
              <p class="text-[10px] text-slate-400 font-semibold whitespace-nowrap mt-0.5">
                ฿{{
                  (item.product.price + getAddonsTotal(item.selectedAddons)).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                }}
              </p>
            </div>

            <!-- Display selected addons if any -->
            <div v-if="item.selectedAddons && item.selectedAddons.length > 0" class="flex flex-wrap gap-1">
              <span 
                v-for="addon in item.selectedAddons" 
                :key="addon.id"
                class="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100/50"
              >
                + {{ addon.name }} (฿{{ addon.price }})
              </span>
            </div>

            <p v-if="item.note" class="text-[10px] font-semibold text-slate-500">หมายเหตุ: {{ item.note }}</p>

            <div class="flex items-center justify-between mt-1 pt-2 border-t border-slate-100/70">
              <!-- Quantity controls -->
              <div class="flex items-center gap-2">
                <button
                  @click="decreaseQty(item)"
                  class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-extrabold transition-colors"
                >
                  -
                </button>
                <span
                  class="text-xs font-extrabold text-slate-700 w-4 text-center"
                  >{{ item.quantity }}</span
                >
                <button
                  @click="increaseQty(item)"
                  class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-extrabold transition-colors"
                >
                  +
                </button>
              </div>

              <!-- Action / Price -->
              <div class="text-right">
                <p class="text-xs font-extrabold text-slate-800">
                  ฿{{
                    (getCartLineTotal(item)).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2 },
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty Cart state -->
          <div
            v-if="cart.length === 0"
            class="py-16 text-center text-slate-400 space-y-2"
          >
            <div
              class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 shadow-inner"
            >
              <svg
                class="w-6 h-6 text-slate-350"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                ></path>
              </svg>
            </div>
            <p class="text-xs font-semibold">ไม่มีสินค้าในตะกร้า</p>
          </div>
        </div>
      </div>

      <!-- Summary & Checkout Buttons -->
      <div class="mt-6 border-t border-slate-100 pt-4 space-y-4 flex-shrink-0">
        <div class="space-y-2">
          <div class="flex justify-between text-xs text-slate-500">
            <span>ยอดรวมก่อนภาษี</span>
            <span
              >฿{{
                subtotalExVat.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }}</span
            >
          </div>
          <div class="flex justify-between text-xs text-slate-500">
            <span>ภาษีมูลค่าเพิ่ม (VAT {{ vatRateLabel }}%)</span>
            <span
              >฿{{
                vat.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }}</span
            >
          </div>
          <div
            class="flex justify-between text-sm font-extrabold text-slate-800 pt-2 border-t border-slate-100"
          >
            <span>ยอดชำระสุทธิ</span>
            <span class="text-blue-650 text-base"
              >฿{{
                total.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }}</span
            >
          </div>
        </div>

        <button
          @click="checkout"
          :disabled="cart.length === 0 || !isShiftOpen"
          class="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-750 active:bg-blue-800 transition-all duration-200 transform active:scale-[0.98] shadow-sm shadow-blue-500/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ isShiftOpen ? 'ยืนยันรายการสั่งซื้อ' : 'กรุณาเปิดกะก่อนเริ่มขาย' }}
          <span v-if="isShiftOpen">(ชำระเงิน ฿{{
            total.toLocaleString(undefined, { maximumFractionDigits: 2 })
          }})</span>
        </button>
      </div>
    </div>

    <!-- PAYMENT MODAL -->
    <Transition name="fade">
      <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closePaymentModal"></div>

        <!-- Modal Card -->
        <div class="relative bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-xl flex flex-col overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-lg font-extrabold text-slate-800">เลือกช่องทางชำระเงิน</h3>
            <button
              @click="closePaymentModal"
              :disabled="isProcessingCheckout"
              class="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <!-- Total amount -->
            <div class="text-center">
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">ยอดที่ต้องชำระ</p>
              <p class="text-3xl font-extrabold text-blue-600 mt-1">฿{{ total.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</p>
            </div>

            <!-- Payment Method Tabs -->
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="paymentMethod = 'cash'; receivedAmount = ''"
                class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200"
                :class="paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span class="font-bold text-sm">เงินสด (Cash)</span>
              </button>
              <button 
                @click="paymentMethod = 'promptpay'"
                class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200"
                :class="paymentMethod === 'promptpay' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                <span class="font-bold text-sm">พร้อมเพย์ (QR)</span>
              </button>
            </div>

            <!-- Cash Input -->
            <div v-if="paymentMethod === 'cash'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <AppInput 
                :modelValue="displayReceivedAmount" 
                @update:modelValue="onReceivedAmountInput"
                @blur="formatReceivedAmount"
                @focus="unformatReceivedAmount"
                type="text" 
                label="รับเงินมา (บาท)"
                placeholder="0.00" 
                inputClass="text-right py-3 text-lg font-extrabold"
              />
              <div class="flex justify-between items-center p-4 rounded-xl" :class="changeAmount > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'">
                <span class="font-bold">เงินทอน</span>
                <span class="text-xl font-extrabold">฿{{ changeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
              </div>
              
              <!-- Quick amounts -->
              <div class="flex gap-2">
                <button v-for="amt in [100, 500, 1000]" :key="amt" @click="setQuickAmount(amt)" class="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm">
                  ฿{{ amt }}
                </button>
                <button @click="setQuickAmount(total)" class="flex-1 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold rounded-lg transition-colors shadow-sm">
                  พอดี
                </button>
              </div>
            </div>

            <!-- PromptPay Mock -->
            <div v-if="paymentMethod === 'promptpay'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center flex flex-col items-center pt-2">
               <div class="w-40 h-40 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center p-3">
                 <!-- Mock QR Code -->
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PROMPTPAY-MOCK" alt="QR Code" class="w-full h-full opacity-80" />
               </div>
               <div>
                 <p class="text-sm font-bold text-slate-700">ให้ลูกค้าสแกน QR Code เพื่อชำระเงิน</p>
                 <p class="text-xs text-slate-400 mt-1">ระบบจะยืนยันอัตโนมัติเมื่อโอนสำเร็จ (จำลอง)</p>
               </div>
            </div>
          </div>

          <div class="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50">
            <button 
              @click="confirmPayment"
              :disabled="(paymentMethod === 'cash' && !isCashPaymentValid) || isProcessingCheckout"
              class="w-full inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-2xl text-white transition-all duration-200 transform active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              :class="paymentMethod === 'promptpay' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'"
            >
              {{ isProcessingCheckout ? 'กำลังบันทึกรายการขาย...' : (paymentMethod === 'promptpay' ? 'จำลองการโอนสำเร็จ (ออกใบเสร็จ)' : 'ยืนยันรับเงินสด (ออกใบเสร็จ)') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- RECEIPT MODAL & PRINT VIEW -->
    <Transition name="fade">
      <div v-if="showReceiptModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm print:bg-white print:p-0 print:block">
        
        <!-- Action Buttons (Hidden on print) -->
        <div class="absolute top-6 right-6 flex flex-col sm:flex-row gap-3 print:hidden z-10">
          <button @click="printReceipt" class="px-5 py-2.5 bg-white text-slate-800 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            พิมพ์ใบเสร็จ
          </button>
          <button @click="closeReceiptAndNewOrder" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors">
            ทำรายการใหม่
          </button>
        </div>

        <!-- Receipt Card -->
        <div class="bg-white p-6 sm:p-8 max-w-sm w-full mx-auto shadow-2xl relative print:shadow-none print:max-w-full print:p-4 print:text-black" id="printable-receipt">
          <!-- Header -->
          <div class="text-center border-b-2 border-dashed border-slate-300 print:border-black pb-4 mb-4">
            <h2 class="text-2xl font-extrabold mb-1">{{ receiptStoreName }}</h2>
            <p class="text-xs text-slate-500 print:text-black whitespace-pre-line">{{ receiptStoreAddress }}</p>
            <p v-if="hasReceiptHeaderNote" class="text-xs text-slate-500 print:text-black mt-1 whitespace-pre-line">{{ receiptStoreHeaderNote }}</p>
            <p class="text-xs text-slate-500 print:text-black mt-2 font-mono">Tax ID: {{ receiptStoreTaxId }}</p>
          </div>

          <!-- Info -->
          <div class="flex justify-between text-[11px] mb-4 font-mono">
            <div>
              <p>วันที่: {{ receiptData?.date.toLocaleDateString('th-TH') }}</p>
              <p>เวลา: {{ receiptData?.date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) }}</p>
            </div>
            <div class="text-right">
              <p>ใบเสร็จรับเงินอย่างย่อ</p>
              <p>No: {{ receiptData?.orderNo }}</p>
            </div>
          </div>

          <!-- Items -->
          <div class="border-b-2 border-dashed border-slate-300 print:border-black pb-4 mb-4 space-y-3">
            <div v-for="item in receiptData?.items" :key="item.product.id" class="text-[11px]">
              <div class="flex justify-between items-start font-bold">
                <span class="pr-2">{{ item.quantity }}x {{ item.product.name }}</span>
                <span>{{ getCartLineTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
              </div>
              <!-- Addons -->
              <div v-if="item.selectedAddons && item.selectedAddons.length > 0" class="pl-4 text-slate-500 print:text-black mt-0.5">
                <div v-for="addon in item.selectedAddons" :key="addon.id" class="flex justify-between text-[10px]">
                  <span>- {{ addon.name }}</span>
                  <span>{{ addon.price > 0 ? addon.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '' }}</span>
                </div>
              </div>
              <div v-if="item.note" class="pl-4 text-slate-500 print:text-black mt-0.5 text-[10px]">
                <span>* หมายเหตุ: {{ item.note }}</span>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="space-y-1 text-[11px] mb-4">
            <div class="flex justify-between">
              <span>ยอดรวมก่อนภาษี (Subtotal)</span>
              <span>{{ (receiptData?.subtotalExVat ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="flex justify-between">
              <span>ภาษีมูลค่าเพิ่ม (VAT {{ (receiptData?.vatRate ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 }) }}%)</span>
              <span>{{ receiptData?.vat.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="flex justify-between font-extrabold text-sm pt-2">
              <span>ยอดสุทธิ (Total)</span>
              <span>฿{{ receiptData?.total.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
            </div>
          </div>

          <!-- Payment Info -->
          <div class="border-t border-b border-slate-300 print:border-black py-3 mb-6 text-[11px] space-y-1">
            <div class="flex justify-between">
              <span>ชำระโดย:</span>
              <span class="font-bold">{{ receiptData?.paymentMethod === 'cash' ? 'เงินสด (Cash)' : 'พร้อมเพย์ (PromptPay)' }}</span>
            </div>
            <div class="flex justify-between">
              <span>เงินรับ (Received):</span>
              <span>{{ receiptData?.receivedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div v-if="receiptData?.paymentMethod === 'cash'" class="flex justify-between font-bold">
              <span>เงินทอน (Change):</span>
              <span>{{ receiptData?.changeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center text-[10px] space-y-1 pb-2">
            <p class="font-bold">*** ขอบคุณที่ใช้บริการ ***</p>
            <p class="text-[9px] text-slate-400 print:text-black">Powered by EasyPOS</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- ADDON SELECTION MODAL -->
  <Transition name="fade">
    <div
      v-if="showAddonModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        @click="showAddonModal = false"
      ></div>

      <!-- Modal Card -->
      <div
        class="relative bg-white border border-slate-200 p-6 rounded-3xl max-w-md w-full text-left space-y-5 shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-extrabold text-slate-800">ปรับแต่งรายการสั่งซื้อ</h3>
            <p class="text-[11px] font-bold text-slate-500 mt-0.5">{{ activeProduct?.name }}</p>
          </div>
          <button @click="showAddonModal = false" class="text-slate-450 hover:text-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-2">
          <p class="text-[11px] font-bold text-slate-500">เลือกเซคชัน</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="section in addonSectionsForActiveProduct"
              :key="section.key"
              @click="activeAddonSection = section.key"
              type="button"
              class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors"
              :class="activeAddonSection === section.key ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
            >
              {{ section.title }} ({{ section.items.length }})
            </button>
          </div>
        </div>

        <!-- Addons list -->
        <div class="space-y-2.5 pr-1">
          <div
            v-for="addon in activeAddonSectionItems"
            :key="addon.id"
            @click="toggleAddonSelection(addon)"
            class="flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all duration-200"
            :class="isAddonSelected(addon) ? 'bg-blue-50/50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-200'"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all"
                :class="isAddonSelected(addon) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'"
              >
                <svg v-if="isAddonSelected(addon)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-xs font-bold">{{ addon.name }}</span>
            </div>
            <span class="text-xs font-mono font-bold" :class="isAddonSelected(addon) ? 'text-blue-600' : 'text-slate-500'">
              {{ addon.price > 0 ? `+฿${addon.price}` : 'ฟรี' }}
            </span>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[11px] font-bold text-slate-500">หมายเหตุเพิ่มเติม</label>
          <textarea
            v-model="tempItemNote"
            rows="2"
            maxlength="500"
            placeholder="เช่น หวานน้อยมาก / ไม่ใส่น้ำแข็ง"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:outline-none"
          ></textarea>
        </div>

        <!-- Footer/Action buttons -->
        <div class="flex gap-2.5 pt-3 border-t border-slate-100">
          <button
            @click="confirmAddonSelection"
            class="flex-grow inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] transform"
          >
            เพิ่มลงตะกร้า (฿{{ ((activeProduct?.price || 0) + getAddonsTotal(tempSelectedAddons)).toLocaleString() }})
          </button>
          <button
            @click="showAddonModal = false"
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
import { ref, computed, onMounted } from "vue";
import { useToast } from "~/composables/useToast"

const { showToast } = useToast()
const { get, post } = useApi()
const { auth } = useAuth()
const {
  shiftState,
  isShiftOpen,
  refreshShiftState,
  addShiftSale,
} = useShiftState()

definePageMeta({
  middleware: ["auth"],
});

interface Product {
  id: string;
  sku: string;
  costPrice: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Addon {
  id: string;
  addonId: string;
  name: string;
  price: number;
  productId: string | null;
}

interface AddonSection {
  key: string;
  title: string;
  items: Addon[];
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedAddons?: Addon[];
  note?: string;
}

interface BranchReceiptInfo {
  store_name?: string;
  name?: string;
  tax_id?: string | null;
  address?: string;
  sub_district_name?: string;
  district_name?: string;
  province_name?: string;
  zipcode_name?: string;
  receipt_header_note?: string | null;
  vat_enabled?: boolean;
  vat_rate?: number;
  price_includes_vat?: boolean;
}

// Categories list loaded from API
const rawCategoryNames = ref<string[]>([])
const categories = computed(() => ["ทั้งหมด", ...rawCategoryNames.value])
const selectedCategory = ref("ทั้งหมด");
const searchQuery = ref("");

// Payment & Receipt States
const showPaymentModal = ref(false);
const paymentMethod = ref<'cash' | 'promptpay'>('cash');
const receivedAmount = ref<string>('');
const displayReceivedAmount = ref<string>('');
const isProcessingCheckout = ref(false);

const showReceiptModal = ref(false);
const receiptData = ref<any>(null);
const receiptStore = ref({
  name: "EasyPOS Cafe & Bakery",
  address: "-",
  taxId: "-",
  headerNote: "",
});

const taxSettings = ref({
  vatEnabled: true,
  vatRate: 7,
  priceIncludesVat: false,
})

const receiptStoreName = computed(() => receiptStore.value.name || "-");
const receiptStoreAddress = computed(() => receiptStore.value.address || "-");
const receiptStoreTaxId = computed(() => receiptStore.value.taxId || "-");
const receiptStoreHeaderNote = computed(() => receiptStore.value.headerNote || "");
const hasReceiptHeaderNote = computed(() => receiptStoreHeaderNote.value.trim().length > 0);
const vatRateLabel = computed(() => taxSettings.value.vatRate.toLocaleString(undefined, { maximumFractionDigits: 2 }))

const formatBranchAddress = (branch: BranchReceiptInfo) => {
  const parts = [
    branch.address,
    branch.sub_district_name,
    branch.district_name,
    branch.province_name,
    branch.zipcode_name,
  ]
    .map((v) => (v || "").trim())
    .filter((v) => v.length > 0);

  return parts.join(" ");
};

// Products loaded from API
const products = ref<Product[]>([])

// Addons loaded from API
const addons = ref<Addon[]>([])

onMounted(async () => {
  try {
    await refreshShiftState()
  } catch {
    showToast('โหลดสถานะกะไม่สำเร็จ', 'error')
  }

  try {
    const [catRes, prodRes, stockRes, addonRes, paRes] = await Promise.all([
      get<{ id: string; name: string }[]>('/api/v1/store/category', { size: 1000 }),
      get<{ id: string; sku: string; name: string; price: number; cost_price: number; category_name: string | null }[]>('/api/v1/store/product', { size: 1000 }),
      get<{ id: string; product_id: string; branch_id: string; stock: number }[]>('/api/v1/store/product-stock', { size: 1000 }),
      get<{ id: string; name: string; price: number; is_all_products: boolean; is_active: boolean }[]>('/api/v1/store/addon', { size: 1000 }),
      get<{ addon_id: string; product_id: string }[]>('/api/v1/store/product-addon', { size: 1000 }),
    ])

    rawCategoryNames.value = (catRes.data ?? []).map(c => c.name)

    const stockMap = new Map<string, number>()
    for (const s of stockRes.data ?? []) {
      if (!stockMap.has(s.product_id)) {
        stockMap.set(s.product_id, s.stock)
      }
    }

    products.value = (prodRes.data ?? []).map(p => ({
      id: p.id,
      sku: p.sku,
      costPrice: p.cost_price,
      name: p.name,
      price: p.price,
      category: p.category_name ?? '',
      stock: stockMap.get(p.id) ?? 0,
    }))

    // Build product-addon mapping: addonId → set of productIds
    const paMap = new Map<string, Set<string>>()
    for (const pa of paRes.data ?? []) {
      if (!paMap.has(pa.addon_id)) paMap.set(pa.addon_id, new Set())
      paMap.get(pa.addon_id)!.add(pa.product_id)
    }

    const loadedAddons: Addon[] = []
    for (const a of addonRes.data ?? []) {
      if (!a.is_active) continue
      if (a.is_all_products) {
        loadedAddons.push({ id: a.id, addonId: a.id, name: a.name, price: a.price, productId: null })
        continue
      }
      const pIds = paMap.get(a.id)
      if (!pIds || pIds.size === 0) continue
      for (const pid of pIds) {
        loadedAddons.push({ id: `${a.id}_${pid}`, addonId: a.id, name: a.name, price: a.price, productId: pid })
      }
    }
    addons.value = loadedAddons
  } catch {
    showToast('โหลดข้อมูลไม่สำเร็จ กรุณารีเฟรชหน้า', 'error')
  }

  const branchId = auth.value.user?.branchId
  if (!branchId) return

  try {
    const branchRes = await get<BranchReceiptInfo>(`/api/v1/store/branch/${branchId}`)
    const branch = branchRes.data
    if (!branch) return

    receiptStore.value = {
      name: (branch.store_name || branch.name || '').trim() || 'EasyPOS Cafe & Bakery',
      address: formatBranchAddress(branch) || '-',
      taxId: (branch.tax_id || '').trim() || '-',
      headerNote: (branch.receipt_header_note || '').trim(),
    }

    taxSettings.value = {
      vatEnabled: branch.vat_enabled ?? true,
      vatRate: Number(branch.vat_rate || 7),
      priceIncludesVat: branch.price_includes_vat ?? false,
    }
  } catch {
    // Keep fallback receipt header values when branch metadata cannot be loaded.
  }
})

// Addon Modal States
const showAddonModal = ref(false);
const activeProduct = ref<Product | null>(null);
const tempSelectedAddons = ref<Addon[]>([]);
const tempItemNote = ref('');
const activeAddonSection = ref('sweetness');

const availableAddonsForActiveProduct = computed(() => {
  if (!activeProduct.value) return [];
  return addons.value.filter(
    (addon) => addon.productId === null || addon.productId === activeProduct.value!.id
  );
});

const getAddonSectionKey = (addonName: string) => {
  const name = addonName.toLowerCase();
  if (name.includes('หวาน') || name.includes('sweet')) return 'sweetness';
  if (name.includes('น้ำแข็ง') || name.includes('ice') || name.includes('เย็น')) return 'ice';
  if (name.includes('ไข่มุก') || name.includes('ท็อป') || name.includes('ท้อป') || name.includes('topping') || name.includes('เพิ่ม')) return 'topping';
  return 'other';
};

const addonSectionTitles: Record<string, string> = {
  sweetness: 'ความหวาน',
  ice: 'น้ำแข็ง',
  topping: 'ท็อปปิ้ง',
  other: 'อื่นๆ',
};

const addonSectionsForActiveProduct = computed<AddonSection[]>(() => {
  const grouped: Record<string, Addon[]> = {
    sweetness: [],
    ice: [],
    topping: [],
    other: [],
  };

  for (const addon of availableAddonsForActiveProduct.value) {
    const sectionKey = getAddonSectionKey(addon.name);
    if (!grouped[sectionKey]) {
      grouped[sectionKey] = [];
    }
    grouped[sectionKey]!.push(addon);
  }

  return Object.keys(grouped)
    .map((key) => ({ key, title: addonSectionTitles[key] || 'อื่นๆ', items: grouped[key] || [] }))
    .filter((section) => section.items.length > 0);
});

const activeAddonSectionItems = computed(() => {
  const sections = addonSectionsForActiveProduct.value;
  if (sections.length === 0) return [];
  const target = sections.find((section) => section.key === activeAddonSection.value);
  return target ? target.items : sections[0]?.items || [];
});

const openAddonModal = async (product: Product) => {
  try {
    await refreshShiftState()
  } catch {
    showToast('โหลดสถานะกะไม่สำเร็จ', 'error')
  }

  if (!isShiftOpen.value) {
    showToast('ยังไม่เปิดกะ กรุณาเปิดกะจากหน้าจัดการหลังบ้าน', 'error')
    return
  }

  if (product.stock <= 0) return;
  activeProduct.value = product;
  tempSelectedAddons.value = [];
  tempItemNote.value = '';
  
  // Find applicable addons
  const applicable = addons.value.filter(
    (addon) => addon.productId === null || addon.productId === product.id
  );
  if (applicable.length === 0) {
    addToCart(product, [], '');
  } else {
    const sections = addonSectionsForActiveProduct.value;
    activeAddonSection.value = sections[0]?.key || 'sweetness';
    showAddonModal.value = true;
  }
};

const toggleAddonSelection = (addon: Addon) => {
  const sectionKey = getAddonSectionKey(addon.name)
  const idx = tempSelectedAddons.value.findIndex(a => a.id === addon.id);
  if (idx > -1) {
    tempSelectedAddons.value.splice(idx, 1);
  } else {
    if (sectionKey === 'sweetness') {
      tempSelectedAddons.value = tempSelectedAddons.value.filter((selected) => getAddonSectionKey(selected.name) !== 'sweetness')
    }
    tempSelectedAddons.value.push(addon);
  }
};

const isAddonSelected = (addon: Addon) => {
  return tempSelectedAddons.value.some(a => a.id === addon.id);
};

const confirmAddonSelection = () => {
  if (activeProduct.value) {
    addToCart(activeProduct.value, tempSelectedAddons.value, tempItemNote.value);
    showAddonModal.value = false;
    activeProduct.value = null;
    tempSelectedAddons.value = [];
    tempItemNote.value = '';
  }
};

// Cart state
const cart = ref<CartItem[]>([]);

// Filter logic based on Category and Search Query
const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesCategory =
      selectedCategory.value === "ทั้งหมด" ||
      p.category === selectedCategory.value;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

const getAddonsTotal = (selectedAddons?: Addon[]) => {
  if (!selectedAddons || selectedAddons.length === 0) return 0
  return selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
}

const getCartLineTotal = (item: CartItem) => {
  return (item.product.price + getAddonsTotal(item.selectedAddons)) * item.quantity
}

// Real-time calculations
const subtotal = computed(() => {
  return cart.value.reduce(
    (acc, item) => {
      const addonsPrice = getAddonsTotal(item.selectedAddons)
      return acc + (item.product.price + addonsPrice) * item.quantity;
    },
    0,
  );
});

const subtotalExVat = computed(() => {
  if (!taxSettings.value.vatEnabled) {
    return subtotal.value
  }

  if (!taxSettings.value.priceIncludesVat) {
    return subtotal.value
  }

  const rate = Math.max(0, taxSettings.value.vatRate)
  if (rate === 0) {
    return subtotal.value
  }

  return subtotal.value * (100 / (100 + rate))
})

const vat = computed(() => {
  if (!taxSettings.value.vatEnabled) {
    return 0
  }

  if (taxSettings.value.priceIncludesVat) {
    return subtotal.value - subtotalExVat.value
  }

  return subtotal.value - subtotalExVat.value
});

const total = computed(() => {
  if (!taxSettings.value.vatEnabled) {
    return subtotal.value
  }

  if (taxSettings.value.priceIncludesVat) {
    return subtotal.value
  }

  return subtotalExVat.value + vat.value
});

// Helper comparison for addons
const areAddonsEqual = (a: Addon[], b: Addon[]) => {
  if (a.length !== b.length) return false;
  const aIds = a.map(x => x.id).sort();
  const bIds = b.map(x => x.id).sort();
  return aIds.every((val, index) => val === bIds[index]);
};

// Cart Actions
const addToCart = (product: Product, selectedAddonsList: Addon[] = [], noteText = '') => {
  if (product.stock <= 0) return;

  const normalizedNote = noteText.trim()

  const existingItem = cart.value.find(
    (item) => 
      item.product.id === product.id && 
      areAddonsEqual(item.selectedAddons || [], selectedAddonsList) &&
      (item.note || '') === normalizedNote
  );
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
      showToast(`เพิ่มจำนวน "${product.name}" เป็น ${existingItem.quantity} ชิ้น`, "info")
    }
  } else {
    cart.value.push({ product, quantity: 1, selectedAddons: [...selectedAddonsList], note: normalizedNote || undefined });
    showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`, "success")
  }
};

const increaseQty = (item: CartItem) => {
  if (item.quantity < item.product.stock) {
    item.quantity++;
  }
};

const decreaseQty = (item: CartItem) => {
  item.quantity--;
  if (item.quantity <= 0) {
    removeFromCart(item);
  }
};

const removeFromCart = (item: CartItem) => {
  cart.value = cart.value.filter((c) => {
    return !(c.product.id === item.product.id && areAddonsEqual(c.selectedAddons || [], item.selectedAddons || []));
  });
};

const clearCart = () => {
  cart.value = [];
};

// Cash payment calculations
const changeAmount = computed(() => {
  const received = parseFloat(receivedAmount.value) || 0;
  return Math.max(0, received - total.value);
});

const isCashPaymentValid = computed(() => {
  const received = parseFloat(receivedAmount.value) || 0;
  return received >= total.value;
});

// Checkout simulation
const checkout = async () => {
  try {
    await refreshShiftState()
  } catch {
    showToast('โหลดสถานะกะไม่สำเร็จ', 'error')
  }

  if (!isShiftOpen.value) {
    showToast('ยังไม่เปิดกะ กรุณาเปิดกะจากหน้าจัดการหลังบ้าน', 'error')
    return
  }

  if (cart.value.length === 0) return;
  // Open payment modal
  paymentMethod.value = 'cash';
  receivedAmount.value = '';
  displayReceivedAmount.value = '';
  showPaymentModal.value = true;
};

// Cash Input Formatting Handlers
const onReceivedAmountInput = (val: string) => {
  // Allow only numbers and dot
  const cleaned = val.replace(/[^\d.]/g, '');
  receivedAmount.value = cleaned;
  displayReceivedAmount.value = val; // Reflect user typing
};

const formatReceivedAmount = () => {
  const num = parseFloat(receivedAmount.value);
  if (!isNaN(num)) {
    displayReceivedAmount.value = num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    displayReceivedAmount.value = '';
    receivedAmount.value = '';
  }
};

const unformatReceivedAmount = () => {
  if (receivedAmount.value) {
    displayReceivedAmount.value = receivedAmount.value;
  }
};

const setQuickAmount = (amt: number) => {
  receivedAmount.value = amt.toString();
  formatReceivedAmount();
};

const closePaymentModal = () => {
  if (isProcessingCheckout.value) return;
  showPaymentModal.value = false;
};

const generateOrderNo = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `POS-${datePart}-${rand}`;
};

const checkoutBackendMessageTH: Record<string, string> = {
  "sale-checkout-failed": "บันทึกรายการขายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
  "order-shift-not-open": "ไม่สามารถขายได้ เนื่องจากกะไม่ได้อยู่ในสถานะเปิด",
  "order-cashier-branch-mismatch": "ไม่สามารถขายได้ เนื่องจากข้อมูลสาขาแคชเชียร์ไม่ตรงกับกะ",
  "bad-request": "ข้อมูลคำขอไม่ถูกต้อง กรุณาตรวจสอบรายการอีกครั้ง",
};

const resolveCheckoutErrorMessage = (error: any) => {
  const backendMessage = String(error?.data?.message || "").trim().toLowerCase();
  if (backendMessage && checkoutBackendMessageTH[backendMessage]) {
    return checkoutBackendMessageTH[backendMessage];
  }

  if (backendMessage && !checkoutBackendMessageTH[backendMessage]) {
    return error?.data?.message;
  }

  return "บันทึกรายการขายลงฐานข้อมูลไม่สำเร็จ";
};

const persistSaleToDatabase = async (orderNo: string, finalReceived: number) => {
  const branchId = auth.value.user?.branchId;
  const cashierId = auth.value.user?.id;
  const shiftId = shiftState.value.id;

  if (!branchId || !cashierId || !shiftId) {
    throw new Error('missing sale context');
  }

  const checkoutRes = await post<{ order_id: string; order_no: string }>("/api/v1/store/sale/checkout", {
    branch_id: branchId,
    shift_id: shiftId,
    cashier_id: cashierId,
    order_no: orderNo,
    status: "COMPLETED",
    total_before_discount: subtotalExVat.value,
    discount_amount: 0,
    subtotal_amount: subtotalExVat.value,
    vat_rate: taxSettings.value.vatEnabled ? taxSettings.value.vatRate : 0,
    vat_amount: vat.value,
    net_amount: total.value,
    received_amount: finalReceived,
    change_amount: paymentMethod.value === 'cash' ? finalReceived - total.value : 0,
    payment_method: paymentMethod.value === 'cash' ? 'CASH' : 'PROMPTPAY',
    payment_amount: total.value,
    transaction_no: paymentMethod.value === 'promptpay' ? orderNo : '',
    items: cart.value.map(item => ({
      product_id: item.product.id,
      sku: item.product.sku,
      name: item.product.name,
      note: item.note || '',
      quantity: item.quantity,
      unit_price: item.product.price,
      cost_price: item.product.costPrice,
      discount_amount: 0,
      net_amount: getCartLineTotal(item),
      addons: (item.selectedAddons || []).map(addon => ({
        addon_id: addon.addonId,
        name: addon.name,
        price_at_sale: addon.price,
      })),
    })),
  });

  if (!checkoutRes.data?.order_id) {
    throw new Error('sale checkout failed');
  }

  return {
    orderId: checkoutRes.data.order_id,
    orderNo: checkoutRes.data.order_no || orderNo,
  };
};

// Confirm payment and generate receipt
const confirmPayment = async () => {
  if (isProcessingCheckout.value) return;
  if (paymentMethod.value === 'cash' && !isCashPaymentValid.value) return;

  isProcessingCheckout.value = true;

  const finalReceived = paymentMethod.value === 'cash' ? (parseFloat(receivedAmount.value) || total.value) : total.value;
  const orderNo = generateOrderNo();

  try {
    try {
      await refreshShiftState();
    } catch {
      showToast('โหลดสถานะกะไม่สำเร็จ', 'error');
      return;
    }

    if (!isShiftOpen.value) {
      showToast('ยังไม่เปิดกะ กรุณาเปิดกะจากหน้าจัดการหลังบ้าน', 'error');
      return;
    }

    const persisted = await persistSaleToDatabase(orderNo, finalReceived);

    receiptData.value = {
      date: new Date(),
      orderNo: persisted.orderNo,
      items: JSON.parse(JSON.stringify(cart.value)),
      subtotal: subtotal.value,
      subtotalExVat: subtotalExVat.value,
      vatRate: taxSettings.value.vatEnabled ? taxSettings.value.vatRate : 0,
      vat: vat.value,
      total: total.value,
      paymentMethod: paymentMethod.value,
      receivedAmount: finalReceived,
      changeAmount: paymentMethod.value === 'cash' ? finalReceived - total.value : 0,
    };

    for (const item of cart.value) {
      const prod = products.value.find((p) => p.id === item.product.id);
      if (!prod) continue;
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
    showToast("ชำระเงินสำเร็จและบันทึกลงฐานข้อมูลแล้ว", "success")

    try {
      await addShiftSale(paymentMethod.value, total.value)
    } catch {
      showToast('บันทึกยอดกะไม่สำเร็จ แต่รายการขายสำเร็จแล้ว', 'info')
    }

    showPaymentModal.value = false;
    showReceiptModal.value = true;
    cart.value = []; // clear cart
  } catch (e: any) {
    showToast(resolveCheckoutErrorMessage(e), 'error');
  } finally {
    isProcessingCheckout.value = false;
  }
};

const closeReceiptAndNewOrder = () => {
  showReceiptModal.value = false;
  receiptData.value = null;
};

const printReceipt = () => {
  window.print();
};
</script>

<style>
/* CSS specific for print media */
@media print {
  body * {
    visibility: hidden;
  }
  #printable-receipt, #printable-receipt * {
    visibility: visible;
  }
  #printable-receipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 10px;
    box-shadow: none;
  }
  /* Force hide all background glows and modals */
  .print\:hidden {
    display: none !important;
  }
}
</style>

<style scoped>
/* Custom styled hide scrollbars */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Transitions for modern alert */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
