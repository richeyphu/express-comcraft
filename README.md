# express-comcraft

![cover](public/images/cover.png)

<p align="center">
RESTful API server for a computer store, built with <a href="https://expressjs.com">Express.js</a>, <a href="https://www.mongodb.com">MongoDB</a> and ❤️
</p>

> _The final project of `Build RESTful API with MongoDB, Node.js and Express` (ITE-497) course._

## Usage

### Setup

- Install dependencies

```sh
$ pnpm i
```

- Config environment variables (`.env`)

  - Example:

```env
PORT=3000
MONGODB_URI=Your_MongoDB_URI_for_dev
MONGODB_URI_TEST=Your_MongoDB_URI_for_test
DOMAIN=http://localhost:3000
JWT_SECRET=Your_JWT_Secret
```

### Run

- Start development server

```sh
$ pnpm dev
```

- Start the server

```sh
$ pnpm start
```

- Test, bundle, and build a Docker Image, respectively

```sh
$ pnpm build:docker
```

## Documentation

[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)](https://documenter.getpostman.com/view/8888210/2s93CPprQ5)

## License

Licensed under the [MIT License](LICENSE).
