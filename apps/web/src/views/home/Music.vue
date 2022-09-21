<template>
  <section-title icon="headset" title="Music" />

  <div class="min-h-80 relative space-y-4 rounded-xl bg-white p-4">
    <el-skeleton :rows="5" animated :loading="loading" class="space-y-4">
      <template #template>
        <el-skeleton-item v-for="item in 5" :key="item" class="!block !h-12" />
      </template>
      <template #default>
        <!--        <div class="space-y-4">-->
        <music-player
          v-for="item in myPlaylists"
          :key="item.id"
          :src="item.src"
          :name="item.name"
          @play="onMusicPlayerPlay(item)"
          @ended="changeMusicPlayerSrc(item)"
          @error="changeMusicPlayerSrc(item)"
        />
        <!--        </div>-->
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getTopPlaylist, PlaylistModel } from '@/apis/music'
import { random } from 'lodash-es'

interface MyPlaylistModel extends PlaylistModel {
  src: string
  playing: boolean
}

const loading = ref(true)
const myPlaylists = ref<MyPlaylistModel[] | null>(null)

getTopPlaylist({ cat: '全部', order: 'hot', limit: 5, offset: 0 }).then(playlists => {
  try {
    loading.value = true
    myPlaylists.value = playlists.map(t => ({
      ...t,
      src: getRandomSongUrlByTraceIds(t.trackIds),
      playing: false,
    }))
  } finally {
    loading.value = false
    // setTimeout(() => {
    //   loading.value = false
    // }, 2000)
  }
})

const genSongUrlById = (id: number): string =>
  `https://music.163.com/song/media/outer/url?id=${id}.mp3`

const getRandomSongUrlByTraceIds = (trackIds: [number]): string =>
  genSongUrlById(trackIds[random(0, trackIds.length - 1)])

const changeMusicPlayerSrc = (item: MyPlaylistModel) => {
  if (!item.playing) return

  let newSongUrl = ''
  do {
    newSongUrl = getRandomSongUrlByTraceIds(item.trackIds)
  } while (item.src === newSongUrl)

  item.src = newSongUrl
}

const onMusicPlayerPlay = (item: MyPlaylistModel) => {
  item.playing = true
}
</script>
