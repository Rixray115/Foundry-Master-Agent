# socketlib (socketlib) — vv1.1.4

> Generado automáticamente por `analyze-modules.mjs`

ℹ️ **Módulo no encontrado en conocimiento curado** — conocimiento auto-generado únicamente

**Compatibilidad**: Foundry 11–∞ (verificado: 14)

## API Surface
### Globals
- `globalThis.socketlib` / `game.socketlib`

## Hooks (3 encontrados)
- `init`
- `socketlib.ready`
- `userConnected`

## Classes (2 encontradas)
- `Socketlib`
- `SocketlibSocket`

## README (excerpt)
```markdown
[![ko-fi](https://img.shields.io/badge/Ko--Fi-farling-success)](https://ko-fi.com/farling)
[![patreon](https://img.shields.io/badge/Patreon-amusingtime-success)](https://patreon.com/amusingtime)
![GitHub License](https://img.shields.io/github/license/farling42/foundryvtt-socketlib)
![Latest Release Download Count](https://img.shields.io/github/downloads/farling42/foundryvtt-socketlib/latest/module.zip)
![Forge installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundryvtt-socketlib)

# socketlib
A library for simplifying working with foundries sockets. This module does not have any user facing features. You only need to install it if one of the modules you use lists it as a dependency.

This library makes it easy to execute functions in the clients of other connected users. Parameters can be passed to the remote functions as easy as they can be passed to regular functions and it's possible to retrieve the return value of the remote function via `await`. The features of socketlib are:
- **Execute a function as GM**: socketlib allows you to execute a function as a gm user. If a GM client is connected, that client will execute that function. The original client can wait for the GM to finish the execution of the function and retrieve the return value of the function via `await`. If multiple GMs are connected, socketlib will make sure only one of the GMs will execute the function.
- **Execute a function as another user**: socketlib allows you to execute a function in the client of another user. The original client can wait for the other user to finish execution of the function and retrieve the return value the function via `await`.
- **Execute a function for all users**: socketlib will execute a function in the clients of all other connected users.
- **Execute a function for all GMs**: socketlib will execute a function in the clients of all connected GMs.
- **Execute a function for a specified list of players**: socketlib will execute a function in the clients of several players that can be identified by their id.

## API
Below is a small example code that demonstrates the usage of socketlib. All of socketlibs functions are accessible via `socketlib.`. Documentation for each of the available functions can be found blow the example code.

### Example Code

```javascript
let socket;

Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("my-module");
	socket.register("hello", showHelloMessage);
	socket.register("add", add);
});

Hooks.once("ready", async () => {
	// Let's send a greeting to all other connected users.
	// Functions can either be called by their given name...
	socket.executeForEveryone("hello", game.user.name);
	// ...or by passing in the function that you'd like to call.
	socket.executeForEveryone(showHelloMessage, game.user.name);
	// The following function will be executed on a GM client.
	// The return
```
