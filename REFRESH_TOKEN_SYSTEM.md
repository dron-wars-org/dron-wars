# 🔄 Sistema de Renovación Automática de Tokens (HU-AUTH-03)

## 📋 Descripción

Implementación completa del sistema de **Refresh Token** para mantener sesiones activas sin interrupciones en el juego Dron Wars.

---

## 🏗️ Arquitectura

### Backend (Spring Boot)
- **Endpoint**: `POST /api/auth/refresh`
- **Request**: `{ "refreshToken": "uuid" }`
- **Response**: `{ "accessToken": "jwt", "expiresIn": 900000 }`

### Frontend (Phaser 3)
- **ApiClient**: Interceptor automático con manejo de cola de peticiones
- **TokenManager**: Gestión centralizada de tokens en localStorage

---

## 🔧 Componentes Implementados

### Backend
1. **RefreshRequest.java** - DTO de entrada con validación
2. **RefreshResponse.java** - DTO de respuesta inmutable
3. **RedisTokenService.java** - Almacenamiento bidireccional (userId ↔ token)
4. **AuthServiceImpl.refresh()** - Lógica de validación y generación
5. **AuthController.refresh()** - Endpoint REST
6. **SecurityConfig** - Endpoint público configurado

### Frontend
1. **ApiClient.js** - Cliente HTTP con interceptor automático
2. **TokenManager.updateAccessToken()** - Actualización de token
3. **api.js** - Configuración de endpoint REFRESH
4. **LoginScene.js** - Integrado con ApiClient
5. **RegisterScene.js** - Integrado con ApiClient

---

## 🚀 Flujo de Renovación Automática

```
1. Usuario hace petición → GET /api/user/stats
2. Backend responde → 401 Unauthorized (token expirado)
3. ApiClient detecta 401 → Bloquea cola de peticiones
4. ApiClient llama → POST /api/auth/refresh
5. Backend valida → Genera nuevo Access Token
6. ApiClient actualiza → localStorage con nuevo token
7. ApiClient reintenta → GET /api/user/stats (con nuevo token)
8. Backend responde → 200 OK con datos
9. Usuario continúa → Sin notar la renovación
```

---

## 💡 Características Clave

### ✅ Renovación Transparente
- El usuario **nunca ve** el proceso de renovación
- Las peticiones se encolan y se reintentan automáticamente
- No se pierde estado del juego durante el refresh

### ✅ Manejo de Errores Robusto
- Máximo 2 intentos de renovación
- Si falla, redirige automáticamente a LoginScene
- Limpia tokens corruptos del localStorage

### ✅ Cola de Peticiones
- Si múltiples peticiones fallan simultáneamente, se encolan
- Todas se reintentan con el nuevo token tras renovar
- Evita múltiples llamadas al endpoint de refresh

### ✅ Seguridad
- Refresh token almacenado en Redis con TTL de 7 días
- Mapeo bidireccional para validación rápida
- Rate limiting preparado (configurable con Resilience4j)

---

## 📝 Uso en el Código

### Ejemplo de Petición Protegida

```javascript
import ApiClient from '../utils/ApiClient.js';

// El refresh es automático, solo usa ApiClient normalmente
async function getUserStats() {
    try {
        const stats = await ApiClient.get('/api/user/stats');
        console.log('Stats:', stats);
    } catch (error) {
        // Si el refresh falla, el usuario ya fue redirigido a Login
        console.error('Error:', error);
    }
}
```

### Ejemplo de Login

```javascript
import ApiClient from '../utils/ApiClient.js';
import TokenManager from '../utils/TokenManager.js';

async function login(email, password) {
    const data = await ApiClient.post('/api/auth/login', { email, password });
    TokenManager.setTokens(data.accessToken, data.refreshToken, data.username);
}
```

---

## 🧪 Testing

### Probar Renovación Manual

1. Abre DevTools → Application → Local Storage
2. Copia el `dw_refresh_token`
3. Borra el `dw_access_token`
4. Haz una petición protegida
5. Verifica en Network que se llama `/refresh` automáticamente

### Logs del ApiClient

```
🔄 [API] Attempting token refresh...
✅ [API] Token refreshed successfully
```

### Logs de Error

```
❌ [API] Refresh failed: Error message
🔴 [API] Request failed: Error details
```

---

## 📊 Criterios de Aceptación Cumplidos

- ✅ **CA-01**: Renovación exitosa con refresh token válido
- ✅ **CA-02**: Retorna 401 si el token expiró o no existe
- ✅ **CA-03**: Rate limiting preparado (backend)
- ✅ **CA-04**: Refresh transparente sin interrumpir el juego
- ✅ **CA-05**: Redirección automática a Login si falla

---

## 🔐 Seguridad

### Backend
- Validación contra Redis (no se confía en el cliente)
- Tokens UUID v4 (imposibles de predecir)
- TTL automático en Redis (7 días)

### Frontend
- Tokens en localStorage (no en cookies por CORS)
- Limpieza automática en logout
- No se exponen tokens en logs de producción

---

## 🎯 Próximos Pasos (Opcional)

1. **Rate Limiting**: Configurar Resilience4j para limitar peticiones
2. **Refresh Token Rotation**: Generar nuevo refresh token en cada renovación
3. **Logout Everywhere**: Endpoint para revocar todos los tokens de un usuario
4. **Métricas**: Agregar observabilidad con Micrometer

---

**Autor**: Antigravity AI  
**Fecha**: 2026-02-08  
**HU**: HU-AUTH-03 - Renovación de Access Token
