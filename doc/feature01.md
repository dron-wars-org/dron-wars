# Feature 01: MVP - Core Gameplay (Drone & Enemies)

## 1. Descripción
Implementación de la mecánica base del juego: control de la nave (Drone), disparo básico y dos tipos de enemigos con comportamientos simples. El objetivo es tener un "loop" jugable donde el jugador pueda moverse, disparar y destruir enemigos.

## 2. Alcance (Scope)

### 2.1. Jugador (The Drone)
- **Visual**: Sprite pixel-art de un drone futurista/orgánico.
- **Movimiento**:
    - Control con **WASD** o **Flechas**.
    - Movimiento en 8 direcciones.
    - Velocidad constante.
    - Restringido a los límites de la pantalla (no puede salir).
- **Disparo**:
    - Tecla **ESPACIO** o **Click Izquierdo**.
    - Disparo lineal hacia la derecha (scrolling horizontal).
    - Cooldown simple entre disparos (ej: 200ms).

### 2.2. Enemigos (The Monsters)
Se implementarán 2 tipos de enemigos "moustritos":

#### Tipo A: "Floater" (El Básico)
- **Visual**: Pequeña masa orgánica flotante.
- **Comportamiento**:
    - Aparece por la derecha de la pantalla.
    - Se mueve linealmente hacia la izquierda.
    - Velocidad lenta/constante.
    - No dispara.
- **Vida**: 1 golpe.

#### Tipo B: "Chaser" (El Seguidor)
- **Visual**: Criatura con ojos o tentáculos, más agresiva.
- **Comportamiento**:
    - Aparece por la derecha.
    - Se mueve hacia la izquierda pero ajusta su posición Y lentamente hacia el jugador (seguimiento suave).
- **Vida**: 2 golpes.

### 2.3. Sistema de Juego
- **Scrolling**: Fondo con movimiento parallax simple (estrellas o tejido orgánico) hacia la izquierda para simular avance.
- **Colisiones**:
    - Bala vs Enemigo -> Enemigo muere (o recibe daño), Bala desaparece.
    - Jugador vs Enemigo -> Jugador recibe daño (o Game Over directo por ahora).
- **Spawning**: Generación aleatoria de enemigos por el borde derecho cada X segundos.

## 3. Criterios de Aceptación
- [ ] El jugador puede mover el drone en todas direcciones sin salir de la pantalla.
- [ ] El jugador puede disparar proyectiles que viajan a la derecha.
- [ ] Los enemigos Tipo A aparecen y cruzan la pantalla.
- [ ] Los enemigos Tipo B aparecen y persiguen levemente al jugador.
- [ ] Las balas destruyen a los enemigos.
- [ ] Chocar con un enemigo reinicia la escena (Game Over simple).

## 4. Assets Necesarios (Placeholders o Generados)
- `drone.png`
- `bullet.png`
- `enemy_floater.png`
- `enemy_chaser.png`
- `background.png`
