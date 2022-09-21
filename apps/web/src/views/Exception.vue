<template>
  <div class="test">
    <div class="button-neon">
      404
      <div class="light light--top"></div>
      <div class="light light--right"></div>
      <div class="light light--bottom"></div>
      <div class="light light--left"></div>
    </div>
  </div>
  <!--  <a-result :status="status" :title="title" :sub-title="subTitle" class="min-h-screen">-->
  <!--    <template #extra>-->
  <!--      <a-button key="console" type="primary">返回首页</a-button>-->
  <!--    </template>-->
  <!--  </a-result>-->
</template>

<script lang="ts">
import type { PropType } from 'vue'
// import { Button, Result } from 'ant-design-vue'
import { ExceptionEnum } from '@/enums/exception'

// interface MapValue {
//   status?: string
//   title: string
//   subTitle: string
//   icon?: string
//   btnText?: string
//   handler?: Function
// }

export default {
  name: 'Exception',
  components: {
    // [Button.name]: Button,
    // [Result.name]: Result,
  },
  props: {
    status: {
      type: Number as PropType<number>,
      default: ExceptionEnum.PAGE_NOT_FOUND,
    },
    title: {
      type: String as PropType<string>,
      default: '',
    },
    subTitle: {
      type: String as PropType<string>,
      default: '',
    },
  },
}
</script>

<style lang="scss">
.test {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #050901;
}

.button-neon {
  $primary-color: #03e9f4;
  $light-width: 2px;

  position: relative;
  width: fit-content;
  padding: 25px 30px;
  overflow: hidden;
  font-size: 24px;
  letter-spacing: 4px;
  color: $primary-color;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.5s;

  &:hover {
    color: #050801;
    background-color: $primary-color;
    box-shadow: 0 0 5px $primary-color, 0 0 25px $primary-color, 0 0 50px $primary-color,
      0 0 200px $primary-color;
  }

  .light {
    position: absolute;

    &--top,
    &--bottom {
      width: 100%;
      height: $light-width;
    }

    &--left,
    &--right {
      width: $light-width;
      height: 100%;
    }

    &--top {
      top: 0;
      left: -100%;
      background: linear-gradient(to right, transparent, $primary-color);
      animation: leftToRight 1s linear infinite;
    }

    &--right {
      top: -100%;
      right: 0;
      background: linear-gradient(to bottom, transparent, $primary-color);
      animation: topToBottom 1s linear infinite;
      animation-delay: 0.25s;
    }

    &--bottom {
      right: -100%;
      bottom: 0;
      background: linear-gradient(to left, transparent, $primary-color);
      animation: rightToLeft 1s linear infinite;
      animation-delay: 0.5s;
    }

    &--left {
      bottom: -100%;
      left: 0;
      background: linear-gradient(to top, transparent, $primary-color);
      animation: bottomToTop 1s linear infinite;
      animation-delay: 0.75s;
    }
  }

  @keyframes leftToRight {
    0% {
      left: -100%;
    }

    50%,
    100% {
      left: 100%;
    }
  }

  @keyframes topToBottom {
    0% {
      top: -100%;
    }

    50%,
    100% {
      top: 100%;
    }
  }

  @keyframes rightToLeft {
    0% {
      right: -100%;
    }

    50%,
    100% {
      right: 100%;
    }
  }

  @keyframes bottomToTop {
    0% {
      bottom: -100%;
    }

    50%,
    100% {
      bottom: 100%;
    }
  }
}
</style>
