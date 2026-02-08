/**
 * Gestor centralizado de tokens JWT en el frontend.
 * Maneja el almacenamiento y recuperación de accessToken y refreshToken en localStorage.
 */
const TokenManager = {
    ACCESS_TOKEN_KEY: 'dw_access_token',
    REFRESH_TOKEN_KEY: 'dw_refresh_token',
    USERNAME_KEY: 'dw_username',

    /**
     * Guarda los tokens y el username en localStorage.
     */
    setTokens(accessToken, refreshToken, username) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(this.USERNAME_KEY, username);
    },

    /**
     * Obtiene el access token.
     */
    getAccessToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    },

    /**
     * Obtiene el refresh token.
     */
    getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    },

    /**
     * Obtiene el username del usuario autenticado.
     */
    getUsername() {
        return localStorage.getItem(this.USERNAME_KEY);
    },

    /**
     * Actualiza solo el access token (usado en refresh).
     */
    updateAccessToken(accessToken) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    },

    /**
     * Verifica si el usuario está autenticado (tiene un access token).
     */
    isAuthenticated() {
        return !!this.getAccessToken();
    },

    /**
     * Elimina todos los tokens y datos de sesión (logout).
     */
    clear() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USERNAME_KEY);
    }
};

export default TokenManager;
