<template>
  <div class="Main">
    <div class="w-full">
      <div class="flex justify-center items-center">
        <img
          class="w-full h-auto max-w-[400px] mx-auto"
          src="../assets/logo.png"
          alt="谁是卧底"
        />
      </div>
      <div class="w-full text-center">
        <router-link
          :to="{ name: 'setting', query: route.query }"
          class="game-btn mx-auto"
        >
          创建游戏
        </router-link>
      </div>
    </div>
<!--
    <div class="absolute bottom-2 left-0 right-0 hidden">
      <div class="w-full text-center text-xs text-white">
        <p>
          <span>谁是卧底网页版 </span>
          <span class="border-b border-dashed border-white">{{
            new Date(now).toLocaleDateString()
          }}</span>
          <span> - </span>
          <span class="border-b border-dashed border-white">{{
            commitSha
          }}</span>
        </p>
      </div>
    </div>
-->
</div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
// @ts-ignore
const commitSha = __COMMIT_HASH__;
// @ts-ignore
const now = __BUILD_DATE__;
</script>

<style scoped></style>
