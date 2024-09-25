# Library Management System

This is a Library Management System built using the MERN stack (MongoDB, Express.js, React, Node.js). The system supports multiple user logins, authentication, adding books to a cart, and requesting books.

## Features

- **User Authentication**: Secure login and registration for multiple users.
- **Book Management**: Add, update, delete, and view books.
- **Cart Functionality**: Add books to a cart for borrowing.
- **Book Requests**: Request books that are not currently available in the library.
- **User Roles**: Different roles for users (e.g., Admin, Member).

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/library-management-system.git
    cd library-management-system
    ```

2. Install dependencies for both frontend and backend:
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```

3. Create a `.env` file in the backend directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the development servers:
    ```bash
    cd backend
    npm run dev
    cd ../frontend
    npm start
    ```

## Usage

- Register a new user or login with existing credentials.
- Browse the available books and add them to your cart.
- Request books that are not available.
- Admin users can manage the book inventory.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, please contact [your-email@example.com](mailto:your-email@example.com).
