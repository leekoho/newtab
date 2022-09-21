<template>
  <div
    ref="refRunway"
    class="music-player__runway relative flex h-12 w-full items-center overflow-hidden rounded-md bg-gray-200 px-2"
  >
    <div
      class="min-w-7 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full p-1 transition duration-500 focus:outline-none"
      :class="state === AudioStateEnum.PLAYING ? 'bg-blue-600' : 'bg-gray-300'"
      @click="toggle"
    >
      <svg-icon
        :name="state === AudioStateEnum.PLAYING ? 'pause' : 'play'"
        class="text-2xl text-white"
      />
      <!--      <div-->
      <!--        :class="-->
      <!--          state === AudioStateEnum.PLAYING ? 'music-player__btn-pause' : 'music-player__btn-play'-->
      <!--        "-->
      <!--        class="transition"-->
      <!--      ></div>-->
    </div>
    <!--        <lottie-player-->
    <!--          class="-->
    <!--            flex-->
    <!--            items-center-->
    <!--            justify-center-->
    <!--            w-7-->
    <!--            h-7-->
    <!--            min-w-7-->
    <!--            p-1-->
    <!--            transition-->
    <!--            duration-1000-->
    <!--            focus:outline-none-->
    <!--            rounded-full-->
    <!--          "-->
    <!--          :class="buttonClass"-->
    <!--          tag="button"-->
    <!--          :animation-data="playAnimData"-->
    <!--          @created="onPlayAnimCreated"-->
    <!--          @click="toggle"-->
    <!--        />-->

    <span class="line-clamp-1 ml-3 text-sm">{{ name }}</span>
  </div>
  <audio
    class="hidden"
    ref="refAudio"
    :src="src"
    @play="onAudioPlay"
    @pause="onAudioPause"
    @ended="onAudioEnded"
    @error="onAudioError"
    @timeupdate="onAudioTimeUpdate"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { throttle } from 'lodash-es'

enum AudioStateEnum {
  // 播放中
  PLAYING,
  // 暂停
  PAUSE,
  // 结束
  ENDED,
  // 错误
  ERROR,
}

const props = defineProps<{
  src: string
  name: string
}>()

// const emit = defineEmits(['play', 'pause', 'ended', 'error'])
const emit = defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'error'): void
}>()

const refAudio = ref<HTMLVideoElement | null>(null)
const refRunway = ref<HTMLElement | null>(null)
const duration = ref(0)
const state = ref<AudioStateEnum>(AudioStateEnum.PAUSE)

onMounted(() => {
  const elAudio = refAudio.value

  if (elAudio !== null) {
    elAudio.addEventListener('canplay', () => {
      // 歌曲的时间, 单位毫秒
      duration.value = elAudio.duration
    })
  }
})

// let anim = {} as AnimationItem

// const onPlayAnimCreated = (_anim: any) => {
//   anim = _anim
//   // _anim.goToAndStop(300)
// }

const play = () => {
  refAudio.value?.play()
}

const pause = () => {
  refAudio.value?.pause()
}

const toggle = () => {
  if (state.value === AudioStateEnum.PLAYING) {
    pause()
  } else {
    play()
  }
}

const onAudioPlay = () => {
  // anim.setDirection(1)
  // anim.play()
  state.value = AudioStateEnum.PLAYING
  emit('play')
}

const onAudioPause = () => {
  // anim.setDirection(-1)
  // anim.play()
  state.value = AudioStateEnum.PAUSE
  emit('pause')
}

const onAudioEnded = () => {
  state.value = AudioStateEnum.ENDED
  emit('ended')
}

const onAudioError = () => {
  state.value = AudioStateEnum.ERROR
  emit('error')
}

const updateRunwayStyle = (currentTime: number) => {
  const elRunway = refRunway.value
  if (elRunway !== null) {
    elRunway.style.backgroundPosition = `${Math.floor((currentTime / duration.value) * -100)}%`
  }
}
// 节流
const throttled = throttle(updateRunwayStyle, 500)
const onAudioTimeUpdate = () => {
  if (refAudio.value !== null) {
    throttled(refAudio.value.currentTime)
  }
}

watch(
  () => props.src,
  () => {
    const elAudio = refAudio.value
    if (elAudio !== null) {
      elAudio.addEventListener('canplay', () => {
        duration.value = elAudio.duration
        elAudio.play()
      })
    }
  }
)
</script>

<style lang="scss">
.music-player {
  &__runway {
    background-image: linear-gradient(to right, #f3f4f6 50%, #bfdbfe 50%);
    background-size: 200%;
    //transition: background-position 0.5s linear;
  }

  &__btn-play {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7.5px 0 7.5px 10px;
    border-color: transparent transparent transparent #fff;
    background: transparent;
  }

  &__btn-pause {
    width: 8px;
    height: 12px;
    border: 2px solid #fff;
    border-top: none;
    border-bottom: none;
    background: transparent;
  }
}
</style>
