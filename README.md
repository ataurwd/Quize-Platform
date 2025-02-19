
# Quiz Platform

Welcome to the Quiz Platform project! This dynamic quiz website allows users to test their knowledge through both multiple-choice and free-text questions. With a built-in countdown timer for each question, the app provides immediate, color-coded feedback (green for correct and red for incorrect answers) and saves your quiz history using IndexedDB. A custom Heading component gives the site a polished, professional look.

## Live Demo

Check out the live demo here: [Quiz Platform Live](https://quize-platform-eight.vercel.app/)

## Features

- **Multiple Question Types:** Supports both multiple-choice and free-text answers.
- **Countdown Timer:** Each question comes with a timer, encouraging quick responses.
- **Color-Coded Feedback:** Displays green for correct answers and red for incorrect ones.
- **Persistent Quiz History:** Stores quiz attempts in IndexedDB.
- **Custom Header Component:** A reusable Heading component to display the website title and tagline.
- **Responsive Design:** Optimized for various devices and screen sizes.

## Getting Started

Follow the instructions below to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/quiz-platform.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd quiz-platform
   ```

3. **Install Dependencies:**

   If using npm:

   ```bash
   npm install
   ```

   Or if using Yarn:

   ```bash
   yarn install
   ```

### Running the Application Locally

After installing the dependencies, start the development server:

If using npm:

```bash
npm start
```

Or if using Yarn:

```bash
yarn start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build, run:

If using npm:

```bash
npm run build
```

Or if using Yarn:

```bash
yarn build
```

The optimized production files will be in the `build` folder.

## Deployment

This project is easily deployable. It is currently hosted on Vercel, but you can deploy it on any platform that supports React applications. Simply connect your repository to your chosen hosting provider and follow their deployment instructions.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- [React](https://reactjs.org/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Vercel](https://vercel.com/)
