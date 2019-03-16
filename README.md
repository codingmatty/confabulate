# Confabulate

```
| verb | kənˈfabyəˌlāt | engage in conversation; talk
```

---

TK TK TK

---

## Development

To get up and running, follow these steps:

1. Clone this repo

```
git clone git@github.com:codingmatty/confabulate.git
```

2. Install dependencies

```
npm install
```

3. Start development server

```
npm run dev
```

### Stack

This app is built primarily with the following libraries:

Server:

- [`express`](https://expressjs.com/) - Route handling
- [`next.js`](https://nextjs.org/) - Server side client rendering, and client-side routing
- [`passport`](http://www.passportjs.org/) - Authentication handling
- [`apollo-server`](https://www.apollographql.com/docs/apollo-server/) - GraphQL server

Client:

- [`react`](https://reactjs.org/) - Frontend UI rendering
- [`styled-components`](https://www.styled-components.com/) - Frontend CSS-in-JS library for styling React components
- [`apollo-client`](https://www.apollographql.com/docs/react/) - GraphQL client

Testing:

- [`jest`](https://jestjs.io/) - Test runner
- [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) - React renderer for testing

### Git

Every `git commit` runs [eslint](https://eslint.org/) with [prettier](https://prettier.io) to normalize code and check for inconsistencies.
