# ptz-user-app

[![Build Status](https://travis-ci.org/polutz/ptz-user-app.svg)](https://travis-ci.org/polutz/ptz-user-app)
[![codecov.io](http://codecov.io/github/polutz/ptz-user-app/coverage.svg)](http://codecov.io/github/polutz/ptz-user-app)
[![Dependency Status](https://gemnasium.com/polutz/ptz-user-app.svg)](https://gemnasium.com/polutz/ptz-user-app)
[![bitHound Score](https://www.bithound.io/github/gotwarlost/istanbul/badges/score.svg)](https://www.bithound.io/github/polutz/ptz-user-app)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)


## Polutz modules

### Core
Core Domain: https://github.com/polutz/ptz-core-domain

Core Graphql: https://github.com/polutz/ptz-core-graphql

### User
User Domain: https://github.com/polutz/ptz-user-app

User Repository: https://github.com/polutz/ptz-user-repository

User App: https://github.com/polutz/ptz-user-app

### Projects
Projeto que utiliza os modulos acima: https://github.com/angeloocana/freecomclub


Tarefas: https://trello.com/b/w9BqiPdz/frecom-club

Stack: react, redux, relay, graphql, nodejs e mongodb.

Metodologias: TDD (Test Driven Development), DDD (Domain Driven Design).

Tools: Docker, Typescript, babel, webpack, mocha, gulp.

## How to use in your project

```
    npm install ptz-user-app --save
```

To enable Typescript support, add to your typings/index.d.ts
```
    /// <reference path="../node_modules/ptz-user-app/src/typings/index.d.ts" />
```


## Prerequisites

1. Latest version of Node to be installed.

## NPM Global packages
```
    npm install ts-node -g
    npm install typescript-node -g
    npm install babel-cli -g
```

## Typings Global Packages 
```
    typings install dt~mocha --global --save
```

## Setup
```
    npm install   
    node gensalt.js
```

## Test
```
    npm test
```