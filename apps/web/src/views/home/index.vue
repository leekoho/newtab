<template>
  <section class="grid grid-cols-1 gap-8 pb-10 lg:grid-cols-3">
    <section class="col-span-1 space-y-6 lg:col-span-2">
      <jumbotron />
      <todo />
      <widget />
    </section>

    <section class="col-span-1 space-y-6">
      <music />
      <news />
    </section>
  </section>
</template>

<script lang="ts" setup>
import Music from './Music.vue'
import Jumbotron from './Jumbotron.vue'
import Todo from './Todo.vue'
import Widget from './Widget.vue'
import News from './News.vue'
</script>
