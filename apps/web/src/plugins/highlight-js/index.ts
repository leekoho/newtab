import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/base16/tomorrow.css'

const languages: Record<
  string,
  () => Promise<{
    [key: string]: any
  }>
> = {
  json: () => import('highlight.js/lib/languages/json'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  plaintext: () => import('highlight.js/lib/languages/plaintext'),
}

export const highlight = async (lang: string = 'plaintext', code: string) => {
  if (languages[lang]) {
    hljs.registerLanguage(lang, (await languages[lang]()).default)
  }
  return hljs.highlight(code, { language: lang }).value
}
