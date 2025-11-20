<template>
  <div class="relative">
    <div ref="mapContainer" class="h-96 rounded-lg shadow-lg"></div>
    <div
      v-if="!latitude || !longitude"
      class="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 rounded-lg"
    >
      <p class="text-gray-600">No hay coordenadas disponibles</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para los iconos de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
})

export default {
  name: 'VehicleMap',
  props: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    const mapContainer = ref(null)
    let map = null
    let marker = null

    const initMap = () => {
      if (!mapContainer.value) return

      const lat = props?.latitude || null
      const lng = props?.longitude || null

      if (lat === null || lng === null) return

      map = L.map(mapContainer.value).setView([lat, lng], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map)

      if (props.latitude && props.longitude) {
        marker = L.marker([props.latitude, props.longitude]).addTo(map)
      }
    }

    const updateMarker = (lat, lng) => {
      if (!map) return

      if (marker) {
        marker.setLatLng([lat, lng])
      } else {
        marker = L.marker([lat, lng]).addTo(map)
      }

      map.setView([lat, lng], 13)
    }

    watch(
      () => [props.latitude, props.longitude],
      ([newLat, newLng]) => {
        if (newLat && newLng && map) {
          updateMarker(newLat, newLng)
        }
      }
    )

    onMounted(() => {
      setTimeout(initMap, 100)
    })

    onUnmounted(() => {
      if (map) {
        map.remove()
      }
    })

    return {
      mapContainer
    }
  }
}
</script>

<style scoped>
/* Asegurar que el mapa tenga un z-index bajo */
:deep(.leaflet-container) {
  z-index: 1;
}

/* Asegurar que los controles del mapa también tengan z-index bajo */
:deep(.leaflet-control-container) {
  z-index: 1;
}
</style>
