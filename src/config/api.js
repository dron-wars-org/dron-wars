// Configuración centralizada de endpoints del backend
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/api/auth/register',
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout'
        }
    }
};

export default API_CONFIG;
