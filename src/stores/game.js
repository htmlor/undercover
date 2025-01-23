import { defineStore } from "pinia";
// import { GameWord } from "../utils";

export const useGameStore = defineStore("game", {
  state: () => {
    return {
      /**
       * 选定词语id
       * @type {number}
       */
      selectedWordId: 0,
      /**
       * 平民词语
       * @type {string}
       */
      civilianWord: "",
      /**
       * 卧底词语
       * @type {string}
       */
      undercoverWord: "",
      /**
       * 总游戏人数
       * @type {number}
       */
      totalPlayerCount: 4,
      /**
       * 卧底人数
       * @type {number}
       */
      undercoverCount: 1,
      /**
       * 是否有白板玩家
       * @type {boolean}
       * @default false
       */
      hasBlankPlayer: false,
      /**
       * 是否已加载词库
       * @type {boolean}
       */
      isLoadedWordList: false,
      /**
       * 是否开始游戏
       * @type {boolean}
       */
      isStartGame: false,
      /**
       * 是否自定义词语模式
       * @type {boolean}
       */
      isCustomWordMode: false,
      /**
       * 是否调试模式
       * @type {boolean}
       */
      isDebugMode: false,
      /**
       * 游戏结局
       * @type {{
       *  winner: "civilian" | "undercover",
       *  gameWords: GameWord[]
       *  }}
       */
      result: {
        winner: "civilian",
        gameWords: [],
      },
      /**
       * 游戏开始
       * @type {() => void}
       */
      handleStartGame: () => {},
    };
  },
  actions: {
    /**
     * 重置
     */
    reset() {
      //this.civilianWord = "";
      //this.undercoverWord = "";
      //this.totalPlayerCount = 4;
      //this.undercoverCount = 1;
      //this.hasBlankPlayer = false;
      //this.isLoadedWordList = false;
      this.isStartGame = false;
      this.isCustomWordMode = false;
      // this.isDebugMode = false;
      this.result = {
        winner: "civilian",
        gameWords: [],
      };
    },
  },
});
