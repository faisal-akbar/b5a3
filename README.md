## Library Management API with Express, TypeScript & MongoDB
This project is a simple library management API built using Express, TypeScript, and MongoDB. It provides endpoints for managing books, and borrow records.

### How to Run the Project Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/faisal-akbar/b5a3.git
   ```
2. Navigate to the project directory:
   ```bash
    cd b5a3
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your MongoDB connection string:
    ```plaintext
    DATABASE_URL=mongodb://localhost:27017/library

    OR

    DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/library?retryWrites=true&w=majority
    ```
5. Start the development server:
    ```bash
    npm run dev
    ```
6. The API will be running on `http://localhost:5000`.

### API Endpoints
- **Books**
  - `GET /api/books`: Get all books, default limit is 10, and can be adjusted with query parameters.
    - Example: `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`
  - `POST /api/books`: Create a new book
  - `GET /api/books/:bookId`: Get a book by ID
  - `PUT /api/books/:bookId`: Update a book by ID
  - `DELETE /api/books/:bookId`: Delete a book by ID
- **Borrow Records**
  - `POST /api/borrow`: Create a new borrow record
  - `GET GET /api/borrow`: Get Borrowed Books Summary (Using Aggregation)
 
### Technologies Used
- Node.js
- Express.js
- TypeScript
- zod
- MongoDB
- Mongoose
- dotenv

### Project Structure
b5a3/
    ├── README.md
    ├── package.json
    ├── tsconfig.json
    ├── vercel.json
    ├── .env.example
    └── src/
        ├── app.ts
        ├── server.ts
        └── app/
            ├── config/
            │   └── index.ts
            ├── controllers/
            │   ├── books.controller.ts
            │   └── borrow.controller.ts
            ├── interfaces/
            │   ├── books.interface.ts
            │   └── borrow.interface.ts
            ├── models/
            │   ├── books.models.ts
            │   └── borrow.models.ts
            ├── schemas/
            │   ├── books.schema.ts
            │   └── borrow.schema.ts
            └── utils/
                └── formatZodError.ts
