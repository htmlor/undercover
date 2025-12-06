<template>
  <div class="Main">
    <div class="result-title">
      <h1 class="m-0 p-0 stroke-text stroke">{{ resultTitle }}</h1>
    </div>

    <ResultCard>
      <template #role>
        <span>卧底</span>
      </template>
      <template #word>
        <span class="text-red-500 font-bold">
          {{ undercoverWord }}
        </span>
      </template>
      <template #default>
        <div
          class="w-1/5 mb-3 items-center"
          v-for="(item, index) of undercoverPlayerList"
          :key="`${index}-${item.word}`"
        >
          <div class="player-face undercover">
            {{ item.id + 1 + "号" }}
          </div>
        </div>
      </template>
    </ResultCard>

    <ResultCard>
      <template #role>
        <span>平民</span>
      </template>
      <template #word>
        <span class="text-blue-500 font-bold">
          {{ civilianWord }}
        </span>
      </template>
      <template #default>
        <div
          class="w-1/5 mb-3 items-center"
          v-for="(item, index) of civilianPlayerList"
          :key="`${index}-${item.word}`"
        >
          <div class="player-face civilian">
            {{ item.id + 1 + "号" }}
          </div>
        </div>
      </template>
    </ResultCard>

    <div class="w-full mt-8 text-center space-y-2">
      <span
        class="game-btn mx-auto"
        @click="
          () => {
            game.reset();
            game.handleStartGame();
          }
        "
      >
        快速再来一局
      </span>
      <span
        class="game-btn mx-auto btn-theme-blue text-white"
        @click="
          () => {
            router.push({
              name: 'setting',
            });
          }
        "
      >
        重新设置
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import ResultCard from "../components/ResultCard.vue";
import { useGameStore } from "../stores/game";

const game = useGameStore();
const router = useRouter();

const undercoverWord = ref("");
const civilianWord = ref("");

const undercoverPlayerList: Ref<any> = ref([]);
const civilianPlayerList: Ref<any> = ref([]);

const resultTitle = computed(() => {
  if (game.result.winner === "civilian") {
    return '平民胜利';
  } else {
    return '卧底胜利';
  }
});

const init = () => {
  for (let item of game.result.gameWords) {
    if (item.isUndercover) {
      undercoverWord.value = undercoverWord.value || item.word;
      undercoverPlayerList.value.push(item);
    } else {
      civilianWord.value = item.word;
      civilianPlayerList.value.push(item);
    }
  }
};

onMounted(() => {
  if (game.result.gameWords.length === 0) {
    router.push({ name: "setting" });
  }
  init();
});
</script>

<style scoped>
.result-title {
  background-image: url("/static/win-bg.png");
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 85%;
  height: 8rem;
  margin: 0 auto 1.5rem;
  padding-top: 1.25rem;
  text-align: center;
  font-size: 1.25rem;
  line-height: 2.5rem;
  color: rgb(254, 243, 199);
  font-weight: bold;
  font-style: italic;
}
.stroke-text {
  --stroke-color: #333;
}
.player-face {
  width: 3rem;
  height: 3rem;
  border: 2px solid #333;
  margin-left: auto;
  margin-right: auto;
  border-radius: 9999px;
  padding-top: 0.75rem;
  text-align: center;
}
.player-face.undercover {
  background-color: #666;
  color: #fff;
}
.player-face.civilian {
  border-color: #333;
  color: #333;
}
</style>
