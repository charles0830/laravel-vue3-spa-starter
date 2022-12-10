import { ref, reactive, inject } from 'vue'
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { AbilityBuilder, Ability } from '@casl/ability';
import { ABILITY_TOKEN } from '@casl/vue';
import Cookies from 'js-cookie'

const user = reactive({
    name: '',
    email: '',
})

export default function useAuth() {
    const processing = ref(false)
    const validationErrors = ref({})
    const router = useRouter()
    const store = useStore()
    const swal = inject('$swal')
    const ability = inject(ABILITY_TOKEN)

    const loginForm = reactive({
        email: '',
        password: '',
        remember: false
    })

    const submitLogin = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        axios.post('/login', loginForm)
            .then(async response => {
                loginUser(response)
                await router.push({ name: 'admin.index' })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const loginUser = async (response) => {
        user.name = response.data.name
        user.email = response.data.email
        await store.dispatch('updateUser', response.data)
        Cookies.set('loggedIn', true)
        await getAbilities()
        // await router.push({ name: 'admin.index' })
    }

    const getUser = () => {
        axios.get('/api/user')
            .then(response => {
                loginUser(response)
            }).catch((error) => {
            Cookies.remove('loggedIn')
        })
    }

    const logout = async () => {
        if (processing.value) return

        processing.value = true

        axios.post('/logout')
            .then(response => {
                user.name = ''
                user.email = ''
                store.dispatch('updateUser', null)
                router.push({ name: 'login' })
            })
            .catch(error => {
                swal({
                    icon: 'error',
                    title: error.response.status,
                    text: error.response.statusText
                })
            })
            .finally(() => {
                processing.value = false
                Cookies.remove('loggedIn')
            })
    }

    const getAbilities = async() => {
        axios.get('/api/abilities')
            .then(response => {
                const permissions = response.data
                const { can, rules } = new AbilityBuilder(Ability)

                can(permissions)

                ability.update(rules)
            })
    }

    return {
        loginForm,
        validationErrors,
        processing,
        submitLogin,
        user,
        getUser,
        logout,
        getAbilities
    }
}
