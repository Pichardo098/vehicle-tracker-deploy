// socketService.js
import { io } from 'socket.io-client'
import { getToken } from '@/utils/auth'

class SocketService {
  constructor() {
    this.socket = null
    this.joinedRooms = new Set()
  }

  connect() {
    if (this.socket?.connected) return this.socket

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

    console.log(`Conectando a ${SOCKET_URL}`)
    const token = getToken()

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket conectado:', this.socket.id)
      this.joinedRooms.forEach(vehicleId => {
        this.joinVehicleRoom(vehicleId)
      })
    })

    this.socket.on('disconnect', () => {
      console.log('⚠️ Socket desconectado')
    })

    this.socket.on('connect_error', error => {
      console.error('❌ Error de conexión socket:', error.message)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.joinedRooms.clear()
    }
  }

  /**
   * 🆕 Unirse a un room de vehículo
   */
  joinVehicleRoom(vehicleId) {
    if (!this.socket) this.connect()

    console.log(`🚗 Uniéndose al room: vehicle:${vehicleId}`)
    this.socket.emit('join:vehicle', vehicleId)
    this.joinedRooms.add(vehicleId)
  }

  /**
   * Salir de un room de vehículo
   */
  leaveVehicleRoom(vehicleId) {
    if (this.socket) {
      this.socket.emit('leave:vehicle', vehicleId)
      this.joinedRooms.delete(vehicleId)
    }
  }

  /**
   * Escucha actualizaciones de vehículos en tiempo real.
   */
  onVehicleUpdate(vehicleId, callback) {
    console.log('🔔 Configurando listener para vehículo ID:', vehicleId)
    if (!this.socket) this.connect()

    this.joinVehicleRoom(vehicleId)

    this.socket.on('vehicle:update', data => {
      console.log('📥 Actualización recibida:', data)
      callback(data)
    })
  }

  offVehicleUpdate(vehicleId) {
    if (this.socket) {
      this.socket.off('vehicle:update')
      if (vehicleId) {
        this.leaveVehicleRoom(vehicleId)
      }
    }
  }
}

export default new SocketService()
