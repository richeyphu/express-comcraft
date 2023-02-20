# express-comcraft

RESTful API server for a computer store, built with [Express](https://expressjs.com) and [MongoDB](https://www.mongodb.com).

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

- Test, bundle & build Docker image

```sh
$ pnpm build:docker
```

## License

Licensed under the [MIT License](LICENSE).
