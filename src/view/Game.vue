<template>
  <div v-if="game.isStartGame" class="Main">
    <div class="w-full mb-12">
      <div class="float-left w-fit h-[30px] bg-black rounded-lg">
        <router-link :to="{ name: 'setting' }">
          <ChevronLeftIcon class="text-3xl font-bold text-white" />
        </router-link>
      </div>
      <div class="float-left w-[calc(100%-64px)] h-[30px] m-0 p-0 font-medium text-white text-center">
        {{
          gameIsOn ? "长按或双击投票出局" : "一人看一张牌 不许偷看"
        }}
      </div>
      <div class="float-right w-fit h-[30px] bg-black rounded-lg"></div>
    </div>

    <!-- 游戏区 -->
    <div v-if="gameWords.length" class="flex flex-row flex-wrap w-full my-6">
      <div
        v-for="(item, index) in gameWords"
        :key="`${index}-${item.word}`"
        class="game-card w-1/2 p-3 cursor-pointer relative"
        :class="{
          'pointer-events-none game-eliminated': item.isEliminated,
        }"
        @click="
          () => {
            if (!item.isViewed) {
              showCardModal(item, index);
            }
          }
        "
        @dblclick="
          () => {
            if (gameIsOn) {
              eliminate(item, index);
            }
          }
        "
        v-on-long-press="[
          () => {
            if (gameIsOn) {
              eliminate(item, index);
            }
          },
          { delay: 500 },
        ]"
      >
        <div class="absolute top-3 bottom-3 left-3 right-3 w-auto h-auto flex justify-center items-center">
          <!-- 未查看 -->
          <div
            v-if="!item.isViewed"
            class="absolute text-3xl font-bold text-white w-full text-center"
          >
            <div class="stroke-text stroke select-none font-sans w-[1em] mx-auto">
              {{ index + 1 }} 号
            </div>
          </div>
          <!-- 已查看 -->
          <div v-else class="absolute text-black w-full text-center">
            <!-- 卡片任务头像 -->
            <div class="player-face viewed">
              {{ index + 1 + "号" }}
            </div>
            <div
              class="game-btn btn-small btn-theme-blue mt-1 w-fit mx-auto text-base text-white"
              :class="{
                block: gameIsOn,
                '!hidden': !gameIsOn,
                disabled:
                  (item.isViewed && item.isReviewed) || item.isEliminated,
              }"
              @click="showCardModal(item, index)"
            >
              忘了
            </div>
          </div>
          <!-- 调试专用 -->
          <div
            v-if="game.isDebugMode"
            class="debug-text text-lg absolute top-2 text-sm"
          >
            {{ item.isUndercover ? (item.isBlank ? "白板" : "卧底") : "平民" }}
          </div>
        </div>
        <div 
          :class="
            item.isViewed
              ? 'card-viewed'
              : 'card-unviewed'
          ">
        </div>
      </div>
    </div>

    <!-- 弹出框 -->
    <input
      ref="gameModalRef"
      type="checkbox"
      :id="gameModalId"
      class="modal-toggle"
    />
    <div class="modal flex flex-col justify-center items-center">
      <div class="words-modal modal-box relative">
        <div class="player-face">
          {{ currentViewId + 1 + "号" }}
        </div>
        <p class="py-4 text-3xl text-center w-full font-bold">
          {{ currentViewText }}
        </p>
      </div>
      <div class="w-full mt-8 text-center">
        <div
          class="game-btn mx-auto"
          @click="
            () => {
              if (gameModalRef) {
                onAfterCloseModal();
                gameModalRef.checked = false;
              }
            }
          "
        >
          我记下了
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { vOnLongPress } from "@vueuse/components";
import {
  ChevronLeftIcon
} from "tdesign-icons-vue-next";
import { useGameStore } from "../stores/game";
import { randomNumber, GameWord } from "../utils";

const router = useRouter();
const route = useRoute();
const game = useGameStore();

const gameModalRef = ref<HTMLInputElement | null>(null);
const gameModalId = "game-modal";

const gameWords: Ref<GameWord[]> = ref([]);
const undercoverIndexList: Ref<number[]> = ref([]);
const unViewedWords: Ref<number[]> = ref([]);
const unEliminatedUndercoverIndexList: Ref<number[]> = ref([]);
const unEliminatedCivilianIndexList: Ref<number[]> = ref([]);

const currentViewId = ref(0);
const currentViewText = ref("");

let onAfterCloseModal: any = () => {};

const gameIsOn = computed(() => {
  return gameWords.value.length > 0 && unViewedWords.value.length === 0;
});

const showCardModal = (item: GameWord, index) => {
  if (item.isViewed && item.isReviewed) return;
  if (item.isEliminated) return;
  currentViewId.value = index;
  currentViewText.value = item.word;
  if (gameModalRef.value) {
    gameModalRef.value.checked = true;
    // 卡片关闭后 isViewed 状态改变
    onAfterCloseModal = () => {
      unViewedWords.value = unViewedWords.value.filter((i) => i !== index);
      if (gameWords.value[index].isViewed) {
        // 不再限制重复查看次数
        // gameWords.value[index].isReviewed = true;
      } else {
        gameWords.value[index].isViewed = true;
      }
    };
  }
};

// 淘汰
const eliminate = (item: GameWord, index: number) => {
  if (item.isUndercover) {
    // 卧底被淘汰
    unEliminatedUndercoverIndexList.value = unEliminatedUndercoverIndexList.value.filter(
      (i) => i !== index
    );
  } else {
    // 平民被淘汰
    unEliminatedCivilianIndexList.value =
      unEliminatedCivilianIndexList.value.filter((i) => i !== index);
  }

  item.isEliminated = true;

  // 判断游戏是否结束
  // 1. 平民全被淘汰
  const allCiviliansOut =
    unEliminatedCivilianIndexList.value.length === 0;
  // 2. 卧底全被淘汰
  const allUndercoversOut = unEliminatedUndercoverIndexList.value.length === 0;
  // 3. 只剩下一个平民且剩余一个卧底
  const only1CivilianAnd1Undercover =
    unEliminatedCivilianIndexList.value.length === 1 &&
    unEliminatedUndercoverIndexList.value.length >= 1;

  // 卧底获胜条件：平民全被淘汰 || 只剩下一个平民且剩余一个卧底
  const isUndercoverWin = allCiviliansOut || only1CivilianAnd1Undercover;
  // 平民获胜条件：卧底全被淘汰
  const isCivilianWin = allUndercoversOut;

  const gameOver = isUndercoverWin || isCivilianWin;
  if (gameOver) {
    if (isCivilianWin) {
      // 平民胜利
      game.result.winner = "civilian";
    } else if (isUndercoverWin) {
      // 卧底胜利
      game.result.winner = "undercover";
    } else {
      return alert("游戏异常，请重新开始");
    }
    game.result.gameWords = gameWords.value.map((item, index) => {
      return {
        ...item,
        id: index,
      };
    });
    setTimeout(() => {
      router.push({ name: "result" });
    }, 500);
    //router.push({ name: "result" });
  }
};

const init = () => {
  while (undercoverIndexList.value.length < game.undercoverCount) {
    const randomIndex = randomNumber(game.totalPlayerCount);
    if (!undercoverIndexList.value.includes(randomIndex)) {
      undercoverIndexList.value.push(randomIndex);
      unEliminatedUndercoverIndexList.value.push(randomIndex);
    }
  }
  const blankRandomIndex = randomNumber(game.undercoverCount);

  for (let i = 0; i < game.totalPlayerCount; i++) {
    unViewedWords.value.push(i);
    const isUndercover = undercoverIndexList.value.includes(i);
    const isBlank =
      game.hasBlankPlayer && i === undercoverIndexList.value[blankRandomIndex];
    const word = isUndercover ? game.undercoverWord : game.civilianWord;
    gameWords.value.push({
      word: isBlank ? "" : word,
      isUndercover,
      isBlank,
      isViewed: false,
      isReviewed: false,
      isEliminated: false,
    });
    if (!isUndercover) {
      unEliminatedCivilianIndexList.value.push(i);
    }
  }
  // console.log("卧底", [...undercoverIndexList.value]);
  // console.log(
  //   "白板",
  //   game.hasBlankPlayer ? [undercoverIndexList.value[blankRandomIndex]] : null
  // );
};

onMounted(() => {
  if (!game.isStartGame) {
    router.push({ name: "setting", query: route.query });
  }

  init();
});
</script>

<style scoped>
.game-btn.btn-small {
  @apply text-sm px-3 py-1;
}
:global(.game-btn.btn-theme-blue) {
  background-color: var(--theme-blue);
  @apply !px-6;
}
.stroke-text {
  --font-color: rgb(238, 223, 255);
  --stroke-color: rgb(102, 57, 220);
}
.debug-text {
  --font-color: #fff;
  --stroke-color: #333;
}
.modal {
  --tw-bg-opacity: 0.6;
}
.words-modal {
  width: 15rem;
  height: 19rem;
}
.player-face {
  width: 6rem;
  height: 6rem;
  border: 3px solid #333;
  background-color: rgb(255, 202, 50);
  @apply mx-auto rounded-full mt-8 mb-6 pt-7 text-center text-2xl font-bold;
}
.viewed {
  width: 4rem;
  height: 4rem;
  background-color: #fff;
  border-color: #666;
  color: #666;
  @apply mt-4 pt-4 text-xl;
}
.words-face {
  width: 6rem;
  height: 6rem;
  @apply mx-auto rounded-full mb-1;
}
.game-card::after {
  content: "";
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: calc(100% - 1.5rem);
  height: calc(100% - 1.5rem);
  background-image: url("/static/card-eliminated.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
  z-index: 10;
  @apply transition-opacity duration-150 pointer-events-none;
}
.game-card.game-eliminated::after {
  opacity: 1;
}
.card-viewed, 
.card-unviewed {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  @apply w-[100%] min-h-[12rem];
}
.card-viewed {
  background-image: url("/static/card-viewed.png");
}
.card-unviewed {
  background-image: url("/static/card.png");
}
</style>
