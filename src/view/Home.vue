<template>
  <div class="Main">
    <div class="w-full">
      <div class="logo-home">
        <img class="w-full max-w-[20rem] h-auto mx-auto" src="/static/logo.png" alt="谁是卧底" />
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

<style scoped>
.logo-home {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  margin-bottom: 2.5rem;
}
</style>
