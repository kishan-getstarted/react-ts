# Log Viewer Dashboard

A log viewing and filtering dashboard built with React and TypeScript.

## Features

- Log entry viewing with table format
- Column customization
- Filtering logs by various parameters
- Pagination
- Search functionality

## Prerequisites

- Node.js (v14.x or higher recommended)
- Yarn or npm

## Installation

Clone the repository, then run:

```bash
# Using yarn
yarn install

# OR using npm
npm install
```

## Running the Application

To start the development server:

```bash
# Using yarn
yarn start

# OR using npm
npm start
```

This will launch the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To build the application for production:

```bash
# Using yarn
yarn build

# OR using npm
npm run build
```

This will create optimized production files in the `dist` directory.

## Available Scripts

In the project directory, you can run:

- `yarn start` or `npm start` - Runs the app in development mode
- `yarn build` or `npm run build` - Builds the app for production
- `yarn lint` or `npm run lint` - Runs ESLint to check code quality
- `yarn format` or `npm run format` - Formats code using Prettier

## Tech Stack

- React
- TypeScript
- Webpack
- SCSS for styling

## Design Choices & Assumptions

- Uses mock data for log entries instead of API calls
- Component-based architecture for better maintainability
- Custom hooks for separating business logic from UI components
- Responsive design with SCSS for styling
- Filter sidebar and column customization for flexible log viewing experience
- Client-side filtering and pagination for simplicity

## Development Notes

- Used TypeScript for type safety and better developer experience
- Implemented custom hooks for reusable log filtering logic
- Focused on component separation with clear responsibilities
- Used SCSS modules for component-scoped styling
- Mock data generation utility to simulate real-world log entries