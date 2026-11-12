# RhythmRoyale

Angular 22 app (standalone components, signals, OnPush, zoneless change detection) with a Node/Express + Socket.IO game server in `src/server`.
Types shared by the client and the server live in `src/shared/models.ts`.

Requires Node.js `^22.22.3 || ^24.15.0 || >=26`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Vitest](https://vitest.dev).

## Game server

Run `npm run dev` to start the game server locally on port 3000 (serves `dist/rhythm-royale/browser`). `npm run build-server` compiles it to `dist/server`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/cli) page.
