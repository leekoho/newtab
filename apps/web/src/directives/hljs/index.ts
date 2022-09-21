import { DirectiveBinding, ObjectDirective, VNode } from 'vue'
import { highlight } from '@/plugins/highlight-js'

const _highlight = (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
  const { arg: lang = 'json' } = binding
  el.classList.add('hljs')

  const children = <VNode[]>vnode.children
  const code = children?.length ? <string>children[0]?.children : ''

  highlight(lang, code).then(highlighted => {
    el.innerHTML = highlighted
  })
}

export default <ObjectDirective>{
  mounted: _highlight,
  updated: _highlight,
}
