<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Vehicle Tracker</h1>
          <p class="text-sm text-blue-100 flex items-center max-md:flex-col gap-2">
            Bienvenido, {{ userData?.fullName }}
            <span
              v-if="isAdmin"
              class="ml-2 bg-yellow-400 text-blue-900 px-2 py-0.5 rounded text-xs font-semibold self-start"
            >
              ADMIN
            </span>
          </p>
        </div>
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 p-1 rounded-lg transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="flex-1 bg-gray-100">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm">Desarrollado por <span class="font-semibold">Jesús Pichardo</span></p>
        <p class="text-xs text-gray-400 mt-1">
          © {{ new Date().getFullYear() }} Vehicle Tracker. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Swal from 'sweetalert2'

export default {
  name: 'AppLayout',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const userData = computed(() => userStore.userData)
    const isAdmin = computed(() => userStore.isAdmin)

    const handleLogout = async () => {
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres salir?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        userStore.logout()
        router.push('/')

        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          timer: 1500,
          showConfirmButton: false
        })
      }
    }

    return {
      userData,
      isAdmin,
      handleLogout
    }
  }
}
</script>
