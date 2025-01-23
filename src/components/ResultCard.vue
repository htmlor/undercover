<template>
  <div
    class="w-full bg-white rounded-xl border-[3px] border-solid border-gray-700 shadow-md mt-2 p-4"
  >
    <div class="flex justify-between items-center mb-4">
      <div class="role-text text-base font-medium">
        <slot name="role"></slot>
      </div>
      <div class="text-base font-medium">
        <slot name="word"></slot>
      </div>
    </div>
    <div class="w-full mt-2 flex flex-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.role-text::before {
  content: "▋";
  color: rgb(100, 141, 255);
  @apply rounded-lg mr-1 text-sm;
}
</style>
