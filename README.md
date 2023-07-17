# InCode Group backend

The current version of the backend utilizes Docker for accelerated development, eliminating the need to manage database versions every time you switch projects. Additionally, it provides easier migration generation with built-in scripts.

## Preparing

### Install Dependencies

```bash
$ npm ci
```

### Install Docker

Please refer to the official Docker documentation for installation instructions: [Docker Installation](https://docs.docker.com/compose/install)

### Configure Environments

1. Copy the example environment file by executing the following command:

```sh
cp environments/example.env environments/.env
```

2. Fill in the required environment variables.

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Database Migration

The `docker-compose.yml` file includes configurations for local, migration, and CI databases.

```bash
# Generate a migration based on your changes
$ npm run migration:generate

# Create an empty migration
$ npm run migration:create

# Run migrations for the local and migration databases
$ npm run migration:run
```

## Testing

```bash
# Run unit tests
$ npm run test

# Run end-to-end (e2e) tests
$ npm run test:e2e

# Generate test coverage
$ npm run test:cov
```

## Documentation

The API documentation is available via Swagger and can be accessed at http://localhost:3000/docs.
Feel free to explore the various endpoints and their functionality.
