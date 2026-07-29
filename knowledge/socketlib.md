# Socketlib (socketlib) — v1.1.4

## API Global
`socketlib` — Objeto global disponible tras la inicialización.

## Funciones Principales
- `socketlib.registerModule(moduleName)` — Registra un módulo para usar sockets.
- `socketlib.registerSocket(name, callbacks)` — Registra funciones que pueden ser invocadas remotamente.
- `socket.executeForEveryone(function, ...args)` — Ejecuta una función en todos los clientes.
- `socket.executeAsGM(function, ...args)` — Ejecuta una función solo en el GM.
- `socket.executeForOtherGMs(function, ...args)` — Ejecuta en GMs excepto el emisor.
- `socket.executeForUsers(function, ...args, users)` — Ejecuta en usuarios específicos.

## Hooks
- `init` — Se dispara al iniciar, ideal para registrar sockets.
- `ready` — Se dispara cuando el mundo está listo.

## Uso
Permite comunicación asíncrona entre clientes Foundry. Esencial para módulos que necesitan sincronizar acciones entre jugadores y GM sin depender de eventos de juego.

## Ejemplos
```javascript
Hooks.once('init', () => {
  const socket = socketlib.registerModule('my-module');
  socket.registerSocket('myAction', (data) => {
    console.log('Recibido:', data);
  });
});

// Enviar a todos
socket.executeForEveryone('myAction', { message: 'Hola' });
```

## Dependencias
- Módulos como `monks-active-tiles`, `monks-little-details`, etc.
