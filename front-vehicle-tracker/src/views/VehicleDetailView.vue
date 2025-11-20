<template>
  <AppLayout>
    <div class="container mx-auto px-4 py-8">
      <!-- Botón volver -->
      <button
        @click="$router.push('/dashboard')"
        class="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Volver al Dashboard
      </button>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Cargando vehículo...</p>
      </div>

      <div v-else-if="vehicle" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Información del vehículo -->
        <div class="space-y-6">
          <!-- Card de información -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between mb-4 items-center">
              <h2 class="text-3xl font-bold text-gray-800">{{ vehicle.plate_number }}</h2>
              <span
                :class="vehicle.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ vehicle.active ? 'Activo' : 'Inactivo' }}
              </span>
              <button
                @click="showEditVehicleModal = true"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Editar Vehículo
              </button>
            </div>

            <div class="space-y-3">
              <div class="flex items-center">
                <span class="font-semibold text-gray-600 w-32">Marca:</span>
                <span class="text-gray-800">{{ vehicle.brand }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-600 w-32">Modelo:</span>
                <span class="text-gray-800">{{ vehicle.model }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-600 w-32">Color:</span>
                <span class="text-gray-800">{{ vehicle.color }}</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold text-gray-600 w-32">Placa:</span>
                <span class="text-gray-800">{{ vehicle.plate_number }}</span>
              </div>
            </div>

            <!-- Botón desactivar -->
            <button
              v-if="vehicle.active"
              @click="handleDeactivate"
              class="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Desactivar Vehículo
            </button>
          </div>

          <!-- Formulario de coordenadas -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Actualizar Coordenadas</h3>

            <form @submit.prevent="handleUpdateCoordinates" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                <input
                  v-model.number="coordinates.latitude"
                  type="number"
                  step="any"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 20.6597"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                <input
                  v-model.number="coordinates.longitude"
                  type="number"
                  step="any"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: -103.3496"
                />
              </div>

              <button
                type="submit"
                :disabled="updatingCoords"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {{ updatingCoords ? 'Actualizando...' : 'Actualizar Ubicación' }}
              </button>
            </form>

            <!-- Coordenadas actuales -->
            <div
              v-if="vehicle.latitude && vehicle.longitude"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <p class="text-sm text-gray-600">
                <span class="font-semibold">Ubicación actual:</span><br />
                Lat: {{ vehicle.latitude }}, Lng: {{ vehicle.longitude }}
              </p>
            </div>
          </div>
        </div>

        <!-- Edit Vehicle Modal -->
        <div
          v-if="showEditVehicleModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 class="text-2xl font-bold mb-4">Editar Vehículo</h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
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
                  Editar vehículo
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

        <!-- Mapa -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Ubicación en Tiempo Real</h3>
          <VehicleMap :latitude="vehicle.latitude" :longitude="vehicle.longitude" />

          <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <div
              class="w-3 h-3 rounded-full animate-pulse"
              :class="socketConnected ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span>{{ socketConnected ? 'Conectado en tiempo real' : 'Desconectado' }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { vehiclesService } from '@/services/vehiclesService'
import socketService from '@/services/socketService'
import AppLayout from '@/components/Layout/AppLayout.vue'
import VehicleMap from '@/components/Vehicle/VehicleMap.vue'
import Swal from 'sweetalert2'

export default {
  name: 'VehicleDetailView',
  components: {
    AppLayout,
    VehicleMap
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const loading = ref(true)
    const vehicle = ref(null)
    const showEditVehicleModal = ref(false)
    const updatingCoords = ref(false)
    const socketConnected = ref(false)
    const coordinates = ref({
      latitude: null,
      longitude: null
    })
    // Form data for new vehicle
    const formData = ref({
      model: '',
      color: '',
      plate_number: '',
      brand: ''
    })

    const vehicleId = route.params.id

    const loadVehicle = async () => {
      loading.value = true
      try {
        const response = await vehiclesService.getVehicleById(vehicleId)

        vehicle.value = response.data.vehicle

        const lastPosition = response.data.vehicle.positions?.[0]

        formData.value = {
          model: vehicle.value.model,
          color: vehicle.value.color,
          plate_number: vehicle.value.plate_number,
          brand: vehicle.value.brand
        }

        // Complete coordinates if available
        if (lastPosition?.latitude && lastPosition?.longitude) {
          coordinates.value.latitude = lastPosition.latitude
          coordinates.value.longitude = lastPosition.longitude
          vehicle.value.latitude = lastPosition.latitude
          vehicle.value.longitude = lastPosition.longitude
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el vehículo'
        })
        router.push('/dashboard')
      } finally {
        loading.value = false
      }
    }

    const validateCoordinates = () => {
      const lat = coordinates.value.latitude
      const lng = coordinates.value.longitude
      return (
        typeof lat === 'number' &&
        lat >= -90 &&
        lat <= 90 &&
        typeof lng === 'number' &&
        lng >= -180 &&
        lng <= 180
      )
    }

    const handleUpdateCoordinates = async () => {
      updatingCoords.value = true

      if (!validateCoordinates()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, ingresa coordenadas válidas.'
        })
        updatingCoords.value = false
        return
      }
      try {
        const payload = {
          vehicle_id: vehicleId,
          latitude: coordinates.value.latitude,
          longitude: coordinates.value.longitude
        }
        const response = await vehiclesService.updateCoordinates(payload)

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error al actualizar las coordenadas')
        }

        vehicle.value.latitude = coordinates.value.latitude
        vehicle.value.longitude = coordinates.value.longitude

        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Coordenadas actualizadas correctamente',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        })
      } finally {
        updatingCoords.value = false
      }
    }

    const handleDeactivate = async () => {
      const result = await Swal.fire({
        title: '¿Desactivar vehículo?',
        text: 'El vehículo será desactivado pero no eliminado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        try {
          const response = await vehiclesService.deleteVehicle({ id: vehicleId })

          if (!response.status.toString().startsWith('2')) {
            throw new Error(response.data.message || 'Error al desactivar el vehículo')
          }

          Swal.fire({
            icon: 'success',
            title: 'Desactivado',
            text: 'El vehículo ha sido desactivado',
            timer: 2000,
            showConfirmButton: false
          })

          router.push('/dashboard')
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
          })
        }
      }
    }

    // ---------- Function to handle adding vehicle ---------- //
    // Reset form data
    const resetForm = () => {
      formData.value = {
        model: '',
        color: '',
        plate_number: '',
        brand: ''
      }
    }

    // Close modal and reset form
    const closeModal = () => {
      showEditVehicleModal.value = false
      resetForm()
    }

    // Handle form submission to add vehicle
    const handleSubmit = async () => {
      loading.value = true
      try {
        const payload = {
          id: vehicleId,
          model: formData.value.model,
          color: formData.value.color,
          plate_number: formData.value.plate_number,
          brand: formData.value.brand
        }

        const response = await vehiclesService.updateVehicle(payload)

        if (!response.status.toString().startsWith('2')) {
          throw new Error(response.data.message || 'Error al editar vehículo')
        }

        Swal.fire({
          icon: 'success',
          title: 'Vehículo editado',
          text: response.data.message || 'El vehículo ha sido editado correctamente',
          timer: 1500,
          showConfirmButton: false
        })

        showEditVehicleModal.value = false
        resetForm()
        await loadVehicle()
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

    // Socket.io - Listen updates
    const setupSocket = () => {
      socketService.connect()
      socketConnected.value = true

      socketService.onVehicleUpdate(vehicleId, data => {
        if (vehicle.value) {
          vehicle.value.latitude = data.latitude
          vehicle.value.longitude = data.longitude
          coordinates.value.latitude = data.latitude
          coordinates.value.longitude = data.longitude
        }
      })
    }

    onMounted(() => {
      loadVehicle()
      setupSocket()
    })

    onUnmounted(() => {
      socketService.offVehicleUpdate()
      socketService.disconnect()
    })

    return {
      loading,
      vehicle,
      coordinates,
      updatingCoords,
      socketConnected,
      handleUpdateCoordinates,
      handleDeactivate,
      showEditVehicleModal,
      formData,
      onMounted,
      onUnmounted,
      handleSubmit,
      closeModal,
      socketService
    }
  }
}
</script>
