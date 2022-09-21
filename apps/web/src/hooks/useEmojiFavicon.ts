export function useEmojiFavicon(emoji: string) {
  const SIZE = 64

  // 创建 canvas 标签
  const canvas = document.createElement('canvas')
  canvas.height = SIZE
  canvas.width = SIZE
  // 获取 canvas 上下文
  const context = canvas.getContext('2d')!
  context.font = '64px serif'
  context.fillText(emoji, 0, SIZE)
  // 获取 emoji url
  const url = canvas.toDataURL()
  // 设置favicon
  // 找到favicon的link标签
  let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null
  // 如果没有就创建一个新的link标签，并插入到head中
  if (!favicon) {
    const linkTag = document.createElement('link')
    linkTag.rel = 'icon'
    linkTag.href = url
    const headTag = document.getElementsByTagName('head')[0]
    headTag.appendChild(linkTag)
  } else {
    // 设置href
    favicon.href = url
  }
}
