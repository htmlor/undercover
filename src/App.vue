<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" :duration="300">
      <component :is="Component" />
    </transition>
  </router-view>
  <Teleport to="body">
    <!-- 背景图片 -->
    <div id="bg"></div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "./stores/game";

const router = useRouter();
const game = useGameStore();
const transitionName = ref("slide-right");

router.beforeEach((to, from) => {
  if (!from.meta.level) {
    transitionName.value = "";
    return;
  }
  const fromLevel = from.meta.level || 0;
  const toLevel = to.meta.level || 1;
  if (fromLevel > toLevel) {
    transitionName.value = "slide-right";
  } else {
    transitionName.value = "slide-left";
  }
});

onMounted(() => {
  game.reset();

  // 禁止网页右键、长按
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("touchstart", (e) => e.preventDefault());
  document.addEventListener("selectstart", (e) => e.preventDefault());
});
</script>

<style>
.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  overflow: hidden;
}

.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.3s;
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.5s;
}

.slide-left-enter-from {
  opacity: 1;
  transform: translateX(100%);
}

.slide-right-enter-from {
  opacity: 1;
  transform: translateX(-100%);
}

.slide-left-leave-to {
  opacity: 0.7;
  transform: translateX(-50%);
}

.slide-right-leave-to {
  opacity: 0.7;
  transform: translateX(50%);
}

.Main::after {
  content: "";
  pointer-events: none;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background-color: rgba(0, 0, 0, 0.4);
  transition-property: opacity;
  transition-duration: 150ms;
}

.Main.slide-left-leave-to::after,
.Main.slide-right-leave-to::after {
  opacity: 1;
}
</style>
