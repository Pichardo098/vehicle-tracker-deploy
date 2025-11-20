<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-blue-500 to-purple-600"
  >
    <h1 class="text-white text-4xl mx-auto font-extrabold">Vehicle Tracker APP</h1>

    <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md min-w-[320px] mx-5">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- First Name (only Register) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
          <input
            v-model="formData.firstName"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Primer Nombre"
          />
        </div>

        <!-- Second Name (only Register) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
          <input
            v-model="formData.secondName"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Segundo Nombre"
          />
        </div>

        <!-- First Last Name (only Register) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
          <input
            v-model="formData.firstLastName"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apellido Paterno"
          />
        </div>

        <!-- Second Last Name (only Register) -->
        <div v-if="!isLogin">
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
          <input
            v-model="formData.secondLastName"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apellido Materno"
          />
        </div>

        <!-- Admin checkbox (only Register) -->
        <div v-if="!isLogin" class="flex items-center">
          <label for="admin-checkbox" class="mr-2 text-sm font-medium text-gray-700">
            ¿Eres administrador?
          </label>
          <input
            v-model="formData.admin"
            type="checkbox"
            id="admin-checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="formData.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <!-- Botón Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {{ loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>
      </form>

      <!-- Toggle Login/Register -->
      <p class="text-center mt-4 text-gray-600">
        {{ isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button @click="isLogin = !isLogin" class="text-blue-600 hover:underline font-medium">
          {{ isLogin ? 'Regístrate' : 'Inicia Sesión' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'
import { ref } from 'vue'
import { saveToken } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Swal from 'sweetalert2'

export default {
  name: 'AuthView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const isLogin = ref(true)
    const loading = ref(false)
    const formData = ref({
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      email: '',
      password: '',
      admin: false
    })

    const validateForm = () => {
      if (!formData.value.email || !formData.value.password) {
        return false
      }
      if (!isLogin.value) {
        if (
          !formData.value.firstName ||
          !formData.value.firstLastName ||
          !formData.value.secondLastName
        ) {
          return false
        }
      }
      return true
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/
    const validatePassword = () => {
      return passwordRegex.test(formData.value.password)
    }

    const handleSubmit = async () => {
      loading.value = true

      if (!validateForm()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos requeridos.'
        })
        loading.value = false
        return
      }

      if (!validatePassword() && !isLogin.value) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial.'
        })
        loading.value = false
        return
      }

      try {
        let response

        if (isLogin.value) {
          response = await authService.login({
            email: formData.value.email,
            password: formData.value.password
          })
        } else {
          const payload = {
            firstName: formData.value.firstName,
            secondName: formData.value.secondName || '',
            firstLastName: formData.value.firstLastName,
            secondLastName: formData.value.secondLastName,
            email: formData.value.email,
            password: formData.value.password,
            admin: formData.value.admin
          }
          response = await authService.register(payload)
        }

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error en la solicitud')
        }

        // Save token and update user store
        userStore.setToken(response.data.token)
        saveToken(response.data.token)

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        })

        // Redirect to dashboard
        router.push('/dashboard')
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        })
      } finally {
        loading.value = false
      }
    }

    return {
      isLogin,
      loading,
      formData,
      handleSubmit
    }
  }
}
</script>
