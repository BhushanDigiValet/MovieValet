# MovieValet - Movie Reservation System

MovieValet is a comprehensive platform designed to streamline the process of booking movie tickets for both customers and theater administrators.

---

## Features

### For Customers:
- Browse current and upcoming movies.
- View detailed information about movies, including trailers.
- Select preferred showtimes.
- Choose seats through an interactive seating chart.

### For Theater Administrators:
- Manage movie listings.
- Schedule showtimes.
- Oversee seat availability.

The system aims to enhance the movie-going experience by providing a user-friendly interface and efficient management capabilities, ensuring both customers and administrators enjoy a seamless and intuitive booking experience.

---

## Installation

To get started with the project, follow these steps to install and set up the necessary dependencies.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone <repository-url>
```

### Step 2: Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd <project-directory>
npm install
```

Replace `<project-directory>` with the name of the project folder.

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory of the project and add the necessary environment variables. You can use the `.env.sample` file as a template:

```bash
cp .env.sample .env
```

Edit the `.env` file to include your specific configuration values.

### Step 4: Run the Application

After installing the dependencies and configuring the environment variables, you can start the application using one of the following commands:

#### Development Mode:

```bash
npm run dev
```

This command runs the application in development mode with live reloading.

#### Production Mode:

```bash
npm start
```

This command compiles the TypeScript code and starts the application in production mode.

---

## Additional Commands

### Compile TypeScript:

```bash
npm run compile
```

Compiles the TypeScript code into JavaScript.

### Watch for Changes:

```bash
npm run watch
```

Watches for changes in the TypeScript files and automatically recompiles them.

---

## Troubleshooting

If you encounter any issues during installation or runtime, please refer to the following:

- Ensure all dependencies are installed correctly.
- Verify that the `.env` file is properly configured.
- Check the console for any error messages and address them accordingly.

For further assistance, feel free to open an issue on the repository.

---

## License

This project is licensed under the MIT License.


