<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <!-- Título y botón agregar -->
      <div class="flex justify-between items-center mb-6">
        <h2 v-if="viewUsers" class="text-3xl font-bold text-gray-800">Todos los Usuarios</h2>
        <h2 v-if="!viewUsers" class="text-3xl font-bold text-gray-800">
          {{ isAdmin ? 'Todos los Vehículos' : 'Mis Vehículos' }}
        </h2>
        <div class="flex flex-row flex-wrap gap-4 justify-end">
          <button
            v-if="isAdmin"
            @click="handleViewUsers()"
            class="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-6 py-2 transition-colors"
          >
            {{ viewUsers ? '+ Agregar Usuarios' : 'Ver usuarios' }}
          </button>
          <button
            @click="handleViewVehicles()"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {{ viewUsers ? 'Ver Vehículos' : '+ Agregar Vehículo' }}
          </button>
          <button
            @click="showChangePasswordModal = true"
            class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            title="Cambiar contraseña"
          >
            <span>Cambiar Contraseña</span>
          </button>
        </div>
      </div>

      <!-- Users Filter (only admin) -->
      <div v-if="isAdmin && !viewUsers" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por usuario:</label>
        <select
          v-model="selectedUserId"
          class="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option :value="null">Todos los usuarios</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.fullName }}
          </option>
        </select>
      </div>

      <!-- Vehicle List -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Cargando vehículos...</p>
      </div>

      <div v-else-if="filteredVehicles.length === 0 && !viewUsers" class="text-center py-12">
        <p class="text-gray-500 text-lg">No tienes vehículos registrados</p>
      </div>

      <div
        v-else-if="filteredVehicles.length > 0 && !viewUsers"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          @click="goToVehicleDetail(vehicle.id)"
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">{{ vehicle.plate_number }}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p v-if="isAdmin" class="text-gray-600">
            <span class="font-semibold">Dueño:</span> {{ vehicle.user?.fullName }}
          </p>
          <p class="text-gray-600"><span class="font-semibold">Marca:</span> {{ vehicle.brand }}</p>
          <p class="text-gray-600">
            <span class="font-semibold">Modelo:</span> {{ vehicle.model }}
          </p>
          <p v-if="vehicle?.createdAt" class="text-gray-600">
            <span class="font-semibold">Fecha de Creación:</span>
            {{
              `${new Date(vehicle?.createdAt).getDate()}/${new Date(vehicle?.createdAt).getMonth()}/${new Date(vehicle?.createdAt).getFullYear()}`
            }}
          </p>

          <div class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-500">Click para ver detalles</p>
          </div>
        </div>
      </div>

      <div v-else-if="viewUsers" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="user in usersToCreateVehicles"
          :key="user.id"
          class="rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6"
          :class="isCurrentUser(user.id) ? 'bg-green-300 text-white' : 'bg-white'"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-800">
              {{ user.fullName }}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p v-if="isAdmin" class="text-gray-600">
            <span class="font-semibold">Correo:</span> {{ user.email }}
          </p>
          <p class="text-gray-600">
            <span class="font-semibold">Es admin:</span> {{ user.admin ? 'SI' : 'NO' }}
          </p>
          <p v-if="user?.createdAt" class="text-gray-600">
            <span class="font-semibold">Fecha de Creación:</span>
            {{
              `${new Date(user?.createdAt).getDate()}/${new Date(user?.createdAt).getMonth()}/${new Date(user?.createdAt).getFullYear()}`
            }}
          </p>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div
        v-if="showChangePasswordModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 class="text-2xl font-bold mb-4">Cambiar Contraseña</h2>
          <form @submit.prevent="handleSubmitChangePassword" class="space-y-4">
            <!-- Old Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Antigua Contraseña</label>
              <input
                v-model="formChangePassword.password"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
              <input
                v-model="formChangePassword.newPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <!-- Confirma New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Confirma Nueva Contraseña</label
              >
              <input
                v-model="formChangePassword.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <!-- Botón Submit -->
            <div class="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="w-fit bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                Cambiar Contraseña
              </button>
              <button
                type="button"
                @click="closeChangePasswordModal"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add User Modal -->
      <div
        v-if="showAddUserModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 class="text-2xl font-bold mb-4">Agregar Nuevo Usuario</h2>
          <form @submit.prevent="handleSubmitCreateUser" class="space-y-4">
            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Primer Nombre</label>
              <input
                v-model="formData.firstName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Primer Nombre"
              />
            </div>

            <!-- Second Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Segundo Nombre</label>
              <input
                v-model="formData.secondName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Segundo Nombre"
              />
            </div>

            <!-- First Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Paterno</label>
              <input
                v-model="formData.firstLastName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apellido Paterno"
              />
            </div>

            <!-- Second Last Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido Materno</label>
              <input
                v-model="formData.secondLastName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apellido Materno"
              />
            </div>

            <!-- Admin checkbox -->
            <div class="flex items-center">
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
            <div class="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="w-fit bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ loading ? 'Cargando...' : 'Crear Usuario' }}
              </button>
              <button
                type="button"
                @click="closeUserModal()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Vehicle Modal -->
      <div
        v-if="showAddVehicleModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 class="text-2xl font-bold mb-4">Agregar Nuevo Vehículo</h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- User -->
            <div v-if="isAdmin">
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select
                v-model="formData.user_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="user in usersToCreateVehicles" :key="user.id" :value="user.id">
                  {{ user.fullName }}
                </option>
              </select>
            </div>
            <!-- Brand -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                v-model="formData.brand"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="FORD"
                maxlength="30"
              />
            </div>
            <!-- Model -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                v-model="formData.model"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="RAPTOR 2020"
                maxlength="30"
              />
            </div>
            <!-- Plate Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Placa</label>
              <input
                v-model="formData.plate_number"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="2345-XYZ"
                maxlength="30"
              />
            </div>
            <!-- Color -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                v-model="formData.color"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                placeholder="AZUL"
                maxlength="30"
              />
            </div>
            <!-- Botón Submit -->
            <div class="flex justify-center gap-4 mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="w-fit bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ loading ? 'Cargando...' : 'Añadir vehículo' }}
              </button>
              <button
                type="button"
                @click="closeModal()"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import AppLayout from '@/components/Layout/AppLayout.vue'
import { authService } from '@/services/authService'
import { vehiclesService } from '@/services/vehiclesService'
import Swal from 'sweetalert2'

export default {
  name: 'DashboardView',
  components: {
    AppLayout
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const loading = ref(false)
    const vehicles = ref([])
    const users = ref([])
    const usersToCreateVehicles = ref([])
    const viewUsers = ref(false)
    const selectedUserId = ref(null)
    const showAddVehicleModal = ref(false)
    const showAddUserModal = ref(false)
    const isAdmin = computed(() => userStore.isAdmin)
    const sessionUserId = computed(() => userStore.userData.id)

    const isCurrentUser = userId => {
      return userId === sessionUserId.value
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/
    const validatePassword = password => {
      return passwordRegex.test(password)
    }

    const handleViewUsers = () => {
      if (viewUsers.value) {
        showAddUserModal.value = true
        return
      }

      viewUsers.value = !viewUsers.value
    }

    const handleViewVehicles = () => {
      if (viewUsers.value) {
        viewUsers.value = false
        return
      }
      showAddVehicleModal.value = true
    }

    // ---------- Function to change password ---------- //
    const showChangePasswordModal = ref(false)
    const formChangePassword = ref({
      password: '',
      newPassword: '',
      confirmPassword: ''
    })

    const closeChangePasswordModal = () => {
      showChangePasswordModal.value = false
      formChangePassword.value = {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    }

    const comparePassword = (password, newPassword, confirmPassword) => {
      if (password === newPassword) {
        return {
          status: false,
          message: 'La nueva contraseña debe ser diferente a la actual.'
        }
      }

      if (newPassword !== confirmPassword) {
        return {
          status: false,
          message: 'La confirmación no coincide.'
        }
      }

      return {
        status: true,
        message: 'Contraseña válida.'
      }
    }

    const handleSubmitChangePassword = async () => {
      loading.value = true

      if (!validatePassword(formChangePassword.value.newPassword)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La nueva debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial.'
        })
        loading.value = false
        return
      }

      const validateCompare = comparePassword(
        formChangePassword.value.password,
        formChangePassword.value.newPassword,
        formChangePassword.value.confirmPassword
      )

      if (!validateCompare.status) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: validateCompare.message
        })
        loading.value = false
        return
      }

      try {
        const payload = {
          oldPassword: formChangePassword.value.password,
          newPassword: formChangePassword.value.newPassword
        }

        const response = await authService.changePassword(payload)

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error en la solicitud')
        }

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        })

        closeChangePasswordModal()
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

    // ---------- Function to get all Users ---------- //
    const loadUsers = async () => {
      try {
        const allUsersResponse = await authService.getUsers()

        const users = allUsersResponse.data.users

        usersToCreateVehicles.value = users
      } catch {
        usersToCreateVehicles.value = []
      }
    }

    // ---------- Functions to handle adding users ---------- //
    // Form data for a new user
    const formUserData = ref({
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      email: '',
      password: '',
      admin: false
    })

    // Reset user form data
    const resetUserFrom = () => {
      formUserData.value = {
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        password: '',
        admin: false
      }
    }

    // Close modal and reset form
    const closeUserModal = () => {
      showAddUserModal.value = false
      resetUserFrom()
    }

    const validateForm = () => {
      if (
        !formData.value.email ||
        !formData.value.password ||
        !formData.value.firstName ||
        !formData.value.firstLastName ||
        !formData.value.secondLastName
      ) {
        return false
      }
      return true
    }

    // Function to create a new user
    const handleSubmitCreateUser = async () => {
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

      if (!validatePassword(formData.value.password)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, un número y un carácter especial.'
        })
        loading.value = false
        return
      }
      try {
        const payload = {
          firstName: formData.value.firstName,
          secondName: formData.value.secondName || '',
          firstLastName: formData.value.firstLastName,
          secondLastName: formData.value.secondLastName,
          email: formData.value.email,
          password: formData.value.password,
          admin: formData.value.admin || false
        }
        const response = await authService.register(payload)

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error en la solicitud')
        }

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false
        })

        loadUsers()
        closeUserModal()
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

    // ---------- Functions to handle adding vehicle ---------- //
    // Form data for new vehicle
    const formData = ref({
      user_id: 0,
      model: '',
      color: '',
      plate_number: '',
      brand: ''
    })

    // Reset form data
    const resetForm = () => {
      formData.value = {
        user_id: '',
        model: '',
        color: '',
        plate_number: '',
        brand: ''
      }
    }

    // Close modal and reset form
    const closeModal = () => {
      showAddVehicleModal.value = false
      resetForm()
    }

    // Handle form submission to add vehicle
    const handleSubmit = async () => {
      loading.value = true
      try {
        const payload = {
          user_id: formData.value.user_id || sessionUserId.value,
          model: formData.value.model,
          color: formData.value.color,
          plate_number: formData.value.plate_number,
          brand: formData.value.brand
        }

        const response = await vehiclesService.addVehicle(payload)

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error al agregar vehículo')
        }

        Swal.fire({
          icon: 'success',
          title: 'Vehículo agregado',
          text: response.data.message || 'El vehículo ha sido agregado correctamente',
          timer: 1500,
          showConfirmButton: false
        })

        showAddVehicleModal.value = false
        resetForm()
        await loadVehicles()
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

    // ---------- Load and filter vehicles ---------- //
    const filteredVehicles = computed(() => {
      if (!isAdmin.value || !selectedUserId.value) {
        return vehicles.value
      }
      return vehicles.value.filter(v => v.user_id === selectedUserId.value)
    })

    const loadVehicles = async () => {
      loading.value = true
      try {
        const getVehiclesResponse = await vehiclesService.getVehicles()

        await loadUsers()

        const vehiclesData = getVehiclesResponse.data.vehicles || []

        // Extract unique owners (for admin user)
        const usersSet = new Set()

        for (const vehicle of vehiclesData) {
          if (vehicle.user && vehicle.user_id) {
            const isSessionUser = Number(sessionUserId.value) === Number(vehicle.user_id)

            usersSet.add(
              JSON.stringify({
                id: vehicle.user_id,
                fullName: isSessionUser ? 'MIS VEHÍCULOS' : vehicle.user.fullName
              })
            )
          }
        }
        const usersArray = Array.from(usersSet.values()).map(u => JSON.parse(u))

        if (isAdmin.value) {
          users.value = usersArray
        }
        vehicles.value = vehiclesData
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

    const goToVehicleDetail = vehicleId => {
      router.push(`/vehicle/${vehicleId}`)
    }

    onMounted(() => {
      loadVehicles()
    })

    return {
      loading,
      vehicles,
      users,
      usersToCreateVehicles,
      selectedUserId,
      isCurrentUser,
      isAdmin,
      filteredVehicles,
      goToVehicleDetail,
      // Handle Add Vehicle
      handleViewVehicles,
      showAddVehicleModal,
      formData,
      handleSubmit,
      closeModal,
      // Handle Add User
      showAddUserModal,
      handleSubmitCreateUser,
      formUserData,
      closeUserModal,
      // View users
      handleViewUsers,
      viewUsers,
      // Handle Change Password
      showChangePasswordModal,
      formChangePassword,
      handleSubmitChangePassword,
      closeChangePasswordModal
    }
  }
}
</script>
