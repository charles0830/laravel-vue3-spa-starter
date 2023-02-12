import store from '../store'

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: {}, // set locale messages
    // If you need to specify other options, you can set other options
    // ...
})

/**
 * @param {String} locale
 */
export async function loadMessages (locale) {
    if (Object.keys(i18n.global.getLocaleMessage(locale)).length === 0) {
        const messages = await import(/* webpackChunkName: '' */ `../lang/${locale}`)
        i18n.global.setLocaleMessage(locale, messages)
    }

    if (i18n.locale !== locale) {
        i18n.locale = locale
    }
}

;(async function () {
    await loadMessages(store.getters['lang/locale'])
})()

export default i18n;
