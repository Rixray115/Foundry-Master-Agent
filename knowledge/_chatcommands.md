# Chat Commander v2.0.6 — Framework de Comandos

## API

```js
_chatcommands   // global (window._chatcommands) — API de comandos de chat
```

## Hooks

- `chatCommandsReady`, `init`, `ready`, `setup`

## Uso

- Library: Chat Commands — framework de comandos slash en el chat. Dispara `chatCommandsReady` para que otros módulos registren comandos (p.ej. `/timer` usado por Monk's Chat Timer). Base para módulos que añaden comandos.

## Dependencias

- Ninguna (standalone; lo usan otros módulos como monks-chat-timer).
