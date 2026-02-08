import API_CONFIG from '../config/api.js';
import TokenManager from './TokenManager.js';

/**
 * Cliente HTTP con interceptor automático para renovación de tokens.
 * HU-AUTH-03: Refresh Token
 * 
 * Funcionalidades:
 * - Agrega automáticamente el Authorization header
 * - Detecta errores 401 y renueva el token
 * - Reintenta la petición original tras renovar
 * - Redirige a login si el refresh falla
 */
class ApiClient {
    constructor() {
        this.isRefreshing = false;
        this.failedQueue = [];
        this.refreshAttempts = 0;
        this.MAX_REFRESH_ATTEMPTS = 2;
    }

    /**
     * Procesa la cola de peticiones fallidas tras renovar el token
     */
    processQueue(error, token = null) {
        this.failedQueue.forEach(promise => {
            if (error) {
                promise.reject(error);
            } else {
                promise.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    /**
     * Realiza petición HTTP con manejo automático de refresh
     */
    async request(url, options = {}) {
        const fullUrl = `${API_CONFIG.BASE_URL}${url}`;

        // Agregar Authorization header si existe token
        const token = TokenManager.getAccessToken();
        if (token && !options.skipAuth) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        // Asegurar Content-Type para JSON
        if (options.body && typeof options.body === 'object') {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(fullUrl, options);

            // Si es 401 y no es el endpoint de refresh, intentar renovar
            if (response.status === 401 && !url.includes('/refresh')) {
                return await this.handleUnauthorized(url, options);
            }

            // Si no es OK, lanzar error con el mensaje del servidor
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('🔴 [API] Request failed:', error);
            throw error;
        }
    }

    /**
     * Maneja error 401 intentando renovar el token
     */
    async handleUnauthorized(originalUrl, originalOptions) {
        // Si ya estamos renovando, encolar la petición
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            }).then(token => {
                originalOptions.headers['Authorization'] = `Bearer ${token}`;
                return this.request(originalUrl, { ...originalOptions, skipAuth: true });
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = TokenManager.getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // Incrementar contador de intentos
            this.refreshAttempts++;

            if (this.refreshAttempts > this.MAX_REFRESH_ATTEMPTS) {
                throw new Error('Max refresh attempts exceeded');
            }

            console.log('🔄 [API] Attempting token refresh...');

            // Llamar al endpoint de refresh
            const refreshResponse = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                }
            );

            if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
            }

            const { accessToken } = await refreshResponse.json();

            // Actualizar token en localStorage
            TokenManager.updateAccessToken(accessToken);

            // Resetear contador de intentos
            this.refreshAttempts = 0;

            console.log('✅ [API] Token refreshed successfully');

            // Procesar cola de peticiones pendientes
            this.processQueue(null, accessToken);

            // Reintentar la petición original
            originalOptions.headers['Authorization'] = `Bearer ${accessToken}`;
            return await this.request(originalUrl, { ...originalOptions, skipAuth: true });

        } catch (error) {
            console.error('❌ [API] Refresh failed:', error);
            this.processQueue(error, null);

            // Limpiar tokens y redirigir a login
            TokenManager.clear();

            // Si hay un juego Phaser activo, redirigir a LoginScene
            if (window.game && window.game.scene) {
                const activeScene = window.game.scene.getScenes(true)[0];
                if (activeScene) {
                    activeScene.scene.start('Boot');
                }
            }

            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * Métodos de conveniencia
     */
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    async post(url, body, options = {}) {
        return this.request(url, { ...options, method: 'POST', body });
    }

    async put(url, body, options = {}) {
        return this.request(url, { ...options, method: 'PUT', body });
    }

    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}

// Exportar instancia singleton
export default new ApiClient();
