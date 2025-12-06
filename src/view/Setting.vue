<template>
  <div class="Main">
    <div class="w-fit bg-black rounded-lg">
      <router-link :to="{ name: 'home' }">
        <ChevronLeftIcon class="text-3xl font-bold text-white" />
      </router-link>
    </div>
    
    <div class="w-full bg-white rounded-xl border-[3px] border-solid border-gray-700 shadow-md mt-8 p-4">
      <div class="w-full mt-3 text-center">
        <h1 class="text-2xl font-bold">游戏设置</h1>
      </div>
      <div class="w-full mt-8 px-4">
        <!-- 游戏人数 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">玩家人数</h2>
          <InputNumber
            :step="1"
            :min="minTotalPlayerCount"
            :max="maxTotalPlayerCount"
            v-model="game.totalPlayerCount"
          />
        </div>
        <!-- 卧底人数 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">卧底人数</h2>
          <InputNumber
            :step="1"
            :min="1"
            :max="maxUndercoverCount"
            v-model="game.undercoverCount"
          />
        </div>
        <!-- 白板玩家 -->
<!--
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">白板玩家</h2>
          <RadioGroup v-model="game.hasBlankPlayer">
            <Radio :value="true">有</Radio>
            <Radio :value="false">无</Radio>
          </RadioGroup>
        </div>
-->
        <!-- 自定义词语 -->
        <div class="flex flex-row justify-between items-center mb-6">
          <h2 class="text-lg font-medium">自定义词语</h2>
          <label :for="settingModalId">
            <h2 class="text-base font-medium text-[var(--td-brand-color)] cursor-pointer flex flex-row items-center">
              {{ isSetCustomWords ? "已设置" : "未设置" }}<ChevronRightIcon />
            </h2>
          </label>
        </div>
        <div class="w-full mb-6 text-sm text-gray-500">若自定义词语未设置，将自动生成平民词和卧底词。</div>
        <!-- 调试模式 -->
<!--
        <div class="flex flex-row justify-between items-center border-t border-[var(--td-border-level-1-color)] border-dashed pt-6 mb-6">
          <h2 class="text-lg font-medium">调试模式</h2>
          <RadioGroup v-model="game.isDebugMode">
            <Radio :value="true">开</Radio>
            <Radio :value="false">关</Radio>
          </RadioGroup>
        </div>
-->
    </div>
    </div>
    <!-- 开始游戏 -->
    <div class="w-full mt-8 text-center">
      <span class="game-btn mx-auto" @click="handleStartGame"> 开始游戏 </span>
    </div>

    <!-- 自定义词语弹窗 -->
    <input
      ref="modalRef"
      type="checkbox"
      :id="settingModalId"
      class="modal-toggle"
    />
    <div class="modal flex flex-col justify-center items-center">
      <div class="customized modal-box">
        <h2 class="font-bold text-lg text-center">自定义词语</h2>
        <div class="absolute top-2 right-2 z-50">
          <label
            :for="settingModalId"
            class="btn btn-sm btn-circle btn-ghost"
            title="关闭"
          >
            <CloseIcon size="1.5rem" />
          </label>
        </div>
        <p class="py-4 text-left space-y-4">
          <Input
            label="平民词"
            placeholder="请输入平民词"
            v-model="customCivilianWord"
          />
          <Input
            label="卧底词"
            placeholder="请输入卧底词"
            v-model="customUndercoverWord"
          />
        </p>
        <div class="text-center mt-4">
          <span
            class="game-btn game-btn-small mx-auto"
            :class="{
              disabled: !isSetCustomWords,
            }"
            @click="handleCustomWords"
          >
            确定
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Input, InputNumber, Radio, RadioGroup } from 'tdesign-vue-next'
import 'tdesign-vue-next/dist/reset.css'
import 'tdesign-vue-next/dist/tdesign.css'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon
} from "tdesign-icons-vue-next";
import { useGameStore } from "../stores/game";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const game = useGameStore();

const settingModalId = "setting-modal";
const modalRef = ref<HTMLInputElement | null>(null);
const modalElement = ref<HTMLDivElement | null>(null);

const customCivilianWord = ref("");
const customUndercoverWord = ref("");

const minTotalPlayerCount = computed(() => {
  return 3;
});
const maxTotalPlayerCount = computed(() => {
  return 10;
});

const maxUndercoverCount = computed(() => {
  if (game.totalPlayerCount < 6) {
    return 1;
  }
  if (game.totalPlayerCount < 11) {
    return 2;
  }
});

const isSetCustomWords = computed(() => {
  return customCivilianWord.value && customUndercoverWord.value;
});

const handleModalToggle = () => {
  if (modalRef.value && modalElement.value) {
    if (modalRef.value.checked) {
      modalElement.value.classList.add('is-open');
    } else {
      modalElement.value.classList.remove('is-open');
    }
  }
};

const handleCustomWords = () => {
  if (isSetCustomWords.value) {
    game.isCustomWordMode = true;
    game.civilianWord = customCivilianWord.value;
    game.undercoverWord = customUndercoverWord.value;
    game.selectedWordId = -1;
    if (modalRef.value) {
      modalRef.value.checked = false;
      handleModalToggle(); // 确保弹窗关闭
    }
  }
};

const handleStartGame = async () => {
  if (!game.isCustomWordMode) {
    const words = (await import("../assets/data/words.json")).default;
    const randomIndex = Math.floor(Math.random() * words.length);
    game.selectedWordId = randomIndex;
    game.civilianWord = words[randomIndex][0];
    game.undercoverWord = words[randomIndex][1];
  }
  game.isStartGame = true;
  router.push({ name: "game", query: route.query });
};

game.handleStartGame = handleStartGame;
</script>

<style scoped>
/*
  :deep is a CSS combinator that allows you to target elements that are deeply nested within other elements.
  It is a shorthand for the >>> combinator, which is part of the Shadow DOM specification.
  It is supported in Vue 3, but not in Vue 2.
  If you want to target elements that are nested within other elements, you can use the >>> combinator instead.
  For example:
  :deep(.parent >>> .child) {
    // styles here
  }
  Or:
  .parent >>> .child {
    // styles here
  }
*/
.t-input-number {
  width: 6rem;
  height: 2rem;
}
.customized {
  height: 18rem;
}
:deep(.t-input-number .t-input-number__decrease),
:deep(.t-input-number .t-input-number__increase) {
  background-color: var(--theme-yellow);
  border-color: var(--bg-black);
  border-radius: 9999px;
  border-width: 2px;
  border-style: solid;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
:deep(.t-input-number .t-input-number__decrease.t-is-disabled:hover),
:deep(.t-input-number .t-input-number__increase.t-is-disabled:hover) {
  border-color: var(--bg-black);
}
:deep(.t-input-number::before) {
  content: "";
  width: calc(100% - 32px);
  left: 16px;
  background-color: var(--bg-black);
  position: absolute;
  height: 100%;
}
:deep(.t-input-number .t-input) {
  background-color: var(--bg-black);
  border: none;
  padding: 0;
}
:deep(.t-input-number .t-input__inner) {
  color: white;
  font-weight: normal;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
}
:deep(.t-input-number .t-button:not(.t-is-disabled) .t-icon) {
  color: var(--bg-black);
}
:deep(.t-input-number .t-button .t-icon) {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: bold;
}
:deep(.t-radio__input) {
  border-color: var(--bg-black) !important;
  border-width: 2px;
  border-style: solid;
  border-radius: 9999px;
}
:deep(.t-radio .t-radio__input) {
  width: 20px;
  height: 20px;
  background-color: #fff;
}
:deep(.t-radio.t-is-checked .t-radio__input) {
  border-color: var(--bg-black) !important;
}
:deep(.t-radio__input::after) {
  background-color: var(--theme-yellow);
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
}
:deep(.t-radio-group .t-radio) {
  margin-right: 1rem;
}
:deep(.t-radio-group .t-radio:last-child) {
  margin-right: 0;
}
:deep(.t-input) {
  background-color: rgb(238, 238, 238);
  width: 100%;
  border: none;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  border-radius: 0.5rem;
}
:deep(.t-input .t-input__prefix) {
  font-weight: 500;
  color: rgb(107, 114, 128);
}
:deep(.t-input .t-input__prefix),
:deep(.t-input .t-input__inner) {
  font-size: 1rem;
  line-height: 1.5rem;
}
:deep(.t-input .t-input__prefix:not(:empty)) {
  margin-right: 1rem;
}
:deep(.t-input--focused) {
  box-shadow: none;
}
</style>
