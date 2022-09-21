import { getCurrentInstance, onUnmounted } from 'vue'

export function tryOnUnmounted(cb: () => any): void {
  if (getCurrentInstance()) {
    onUnmounted(cb)
  }
}

export function range(size: number = 0, startAt: number = 1): number[] {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}

interface JsonPreOptions {
  indent: number
}

const defaultOptions: JsonPreOptions = {
  indent: 2,
}
export function jsonPre(json: object, options: JsonPreOptions = defaultOptions): string {
  const _options = Object.assign(defaultOptions, options)
  return JSON.stringify(json, null, _options.indent)
}
