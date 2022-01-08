# GraphQL-Addon for [Cockpit-XP](https://www.cockpit-xp.de/)

Extending Cockpit-XP by a GraphQL-api.

## project structure

This is a monorepo containing 2 separate applications:
- the addon: `packages/addon`
- the server: `packages/server`

## build

This project uses [task](https://taskfile.dev/#/) to automate it's routines.
It's not required but heavily recommended.

Requirements are
- node v14+
- go v1.16+

To bundle the complete application simply run `task`.

Everything needed is then located in `dist` folder.

## usage

- Copy the contents of the `dist` folder to `<cockpit_dir>/AddOn/MRohmer/GraphQL`.
- Then start the `server.exe` from within this directory. 
- Enable the AddOn within Cockpit-XP.
- Launch up your favourite browser & navigate to [localhost:8080](http://localhost:8080)