# Auth API
This service is responsible for authenticating users and providing them with a JWT token.

## Tech Stack
- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [GRPC](https://grpc.io/)
- [PNPM](https://pnpm.io/)

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PNPM](https://pnpm.io/)

### Installation
1. Clone the repo
   ```sh
   git clone
    ```
2. Use the correct version of Node.js
    ```sh
    nvm use
    ```
3. Install NPM packages
    ```sh
    pnpm install
    ```
4. Start the development environment from the root directory.
    - If you don't have docker-compose installed, you can install mongodb to your system.
    ```sh
    docker-compose up -d
    ```
5. copy the `.env.template` file to `.env` and fill in the missing values
    ```sh
    cp .env.template .env
    ```
5. Start the development server
    ```sh
    pnpm start:dev
    ```
6. Service should be running on `http://localhost:3010`

### GRPC
The service uses GRPC to communicate with other services. The proto files are located in the `rpc` directory. To generate the GRPC typescript files, run the following command:
```sh
pnpm build:proto
```
This service needs the `main-api` server to run before the `auth-api` service to run. The `main-api` service is responsible for responding to the grpc requests.

## Testing
### Unit Tests
Unit tests are not yet available for this service. They will be added in the future.

### End-to-End Tests
End-to-end tests can be run using the following command:
```sh
pnpm test:e2e
```
To watch the e2e tests, run the following command:
```sh
pnpm test:e2e:watch
```

