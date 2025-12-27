# Desafio Order Final

This project is a REST API for managing orders.

## Prerequisites

- Node.js (v18 or higher)
- npm

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd nome_diretorio
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root of the project and add the following variables:

   ```
   PORT=
   NODE_ENV
   MONGO_CONNECTION_URI=
   JWT_SECRET=
   ```

   You can use the `.env.example` file as a template.

## Available Scripts

- **`npm run dev`**: Starts the development server with live reloading.
- **`npm test`**: Runs the test suite.
- **`npm run test:run`**: Runs the test suite once.
- **`npm run test:coverage`**: Runs the test suite and generates a coverage report.

## API Endpoints

The available API endpoints are:

- `POST /auth/login`: Authenticates a user and returns a JWT token.
- `POST /auth/register`: Registers a new user.
- `GET /orders`: Returns a list of all orders.
- `POST /orders`: Creates a new order.
- `PATCH /orders/:id/advance`: Updates state of an existing order.
