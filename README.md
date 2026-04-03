# Mining IME Roleplay

![Mining IME Roleplay Banner](public/ime-banner.png)

## Description

The "Mining IME Roleplay" is an essential web application specifically developed for players of the IME Roleplay server. This tool aims to revolutionize the way players approach in-game economics by providing advanced optimization and calculation capabilities for mining and crafting activities.

In resource-intensive roleplay servers, efficiently managing materials and maximizing profits from crafting can be complex and time-consuming. This calculator addresses these challenges by offering a comprehensive solution to:

*   **Optimize Crafting Paths:** Identify the most profitable crafting sequences given your current inventory.
*   **Accurate Resource Planning:** Precisely determine the materials needed for desired items.
*   **Profit Maximization:** Calculate potential earnings from crafted goods based on current market prices.
*   **Time Management:** Estimate production times to help players plan their in-game activities more effectively.

By leveraging intelligent algorithms and a user-friendly interface, this application empowers IME Roleplay players to make informed decisions, minimize waste, and achieve peak efficiency in their virtual entrepreneurial endeavors.

## Features

### 1. Crafting Optimizer
This core feature uses a sophisticated **greedy algorithm and dependency chain analysis** to ensure you always craft the most valuable items. Instead of manually figuring out what to make, simply input your raw materials (ores, ingots, gems, etc.) into the system. The optimizer will then present you with the most profitable crafting combinations, taking into account the entire production chain from raw material to finished product. This means you'll consistently maximize your profit margins with minimal effort.

### 2. Item Info & Analysis
A meticulously curated **database** provides detailed information on every mining and jewelry item available on the IME RP server. For each item, you can explore:
*   **Requirements:** What materials and quantities are needed to craft it.
*   **Crafting Costs:** The total cost associated with producing the item.
*   **Profit Margins:** The potential profit you can earn by selling the item.
*   **Recommended Crafting Priorities:** Intelligent suggestions on which items are most lucrative to craft at any given time.
This feature is invaluable for strategic planning and understanding the market dynamics.

### 3. Custom Price
Market prices on roleplay servers can fluctuate rapidly. The "Custom Price" feature allows you to **adjust the individual market value of any item** within the calculator. By entering real-time prices from the IME RP server, you ensure that all profit, cost, and optimization calculations are highly accurate and directly relevant to the current in-game economy. This personalization makes the calculator an indispensable tool for dynamic market adaptation.

### 4. Time Estimation
Efficiency is key in any roleplay economy. This feature provides **estimated production times for each step of the crafting process**. Whether it's smelting ores, cutting gems, or assembling complex jewelry, you'll have a clear understanding of the time commitment. This allows for superior planning of your mining sessions and crafting queues, helping you allocate your in-game time more effectively to reach your profit goals faster.

## How to Use 

Achieving maximum profit from your IME Roleplay mining and crafting has never been easier. Follow these four streamlined steps:

1.  **Input Your Inventory:** Navigate to the inventory section of the calculator. Here, you will accurately enter the current quantities of all your raw materials, such as various ores, refined ingots, and other crafting components you possess. The more precise your input, the more accurate the optimization will be.

2.  **Run the Optimizer:** Once your inventory is updated, click the prominent "Hitung Optimasi" button. The application's powerful algorithms will then process your materials against the current item database and market prices (including any custom prices you've set) to determine the absolute best crafting routes for maximum profit.

3.  **Follow the Steps:** The calculator will generate a clear, step-by-step production plan. This plan will detail exactly what items to craft, in what order, and what materials to use for each step. As you complete each stage of crafting in-game, you can mark it as done within the calculator, helping you stay organized and on track.

4.  **Maximize Your Profit:** With the optimized production complete, you will have a collection of high-value crafted items. Proceed to sell these items on the IME Roleplay server's market. By following the calculator's guidance, you are assured of having produced the most profitable goods, thereby maximizing your earnings from every single mining and crafting session.

## Technologies Used

This project is engineered using a robust stack of modern web technologies to ensure performance, scalability, and an excellent user experience:

*   **Next.js 15:** Utilized as the primary React framework, Next.js provides server-side rendering (SSR), static site generation (SSG), and API routes, contributing to a fast, SEO-friendly, and maintainable application. Its `app` directory router simplifies routing and data fetching.
*   **React 19:** The core JavaScript library for building dynamic and interactive user interfaces. React's component-based architecture facilitates modular and reusable UI elements.
*   **TypeScript:** This superset of JavaScript enhances code quality, readability, and maintainability by adding static type definitions. It helps catch errors during development, leading to more robust and reliable code.
*   **Tailwind CSS:** A highly efficient utility-first CSS framework that enables rapid UI development by providing low-level utility classes directly in the markup. It ensures a consistent and customizable design system.
*   **Font Awesome:** Integrated for a comprehensive suite of scalable vector icons, improving the visual appeal and intuitive navigation of the application without sacrificing performance.
*   **HeroUI:** A UI component library that provides pre-built, accessible, and themeable React components, accelerating development and ensuring a polished user interface.
*   **next-themes:** Seamlessly handles dark and light mode switching, offering a comfortable viewing experience for users regardless of their preference.

## Getting Started

To get a copy of this project up and running on your local machine for development and testing purposes, follow these instructions.

### Prerequisites

Ensure you have the following installed:

*   **Node.js** (LTS version recommended)
*   **npm** or **yarn** (npm is included with Node.js; yarn can be installed separately)
*   **Git**

### Installation

1.  **Clone the repository:**
    Open your terminal or command prompt and clone the project:
    ```bash
    git clone https://github.com/ardelagi/mining-ime.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd mining-ime
    ```

3.  **Install dependencies:**
    Choose your preferred package manager:
    Using **npm**:
    ```bash
    npm install
    ```
    Or using **yarn**:
    ```bash
    yarn install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the development server:

Using **npm**:
```bash
npm run dev
```
Or using **yarn**:
```bash
yarn dev
```

The application will typically be accessible at [http://localhost:3000](http://localhost:3000). Open this URL in your web browser to view and interact with the application. The development server includes hot-reloading, so changes you make to the code will automatically reflect in the browser.

### Building for Production

To create an optimized production build of the application:

Using **npm**:
```bash
npm run build
```
Or using **yarn**:
```bash
yarn build
```
This command compiles the application into static assets and server-side code suitable for deployment.

### Running in Production Mode

To run the production build locally:

Using **npm**:
```bash
npm run start
```
Or using **yarn**:
```bash
yarn start
```
This will serve the optimized application.

## Project Structure

The project follows a standard Next.js directory structure, with key additions for modularity and maintainability:

*   `app/`: This directory is central to Next.js 13+ applications. It contains all the route-related files, including pages (`page.tsx`), layouts (`layout.tsx`), error boundaries (`error.tsx`), and API routes (`api/`). Each subfolder within `app/` (e.g., `app/calculator`, `app/info`, `app/custom`, `app/api/optimizecrafting`) represents a distinct route segment or API endpoint.
*   `components/`: Houses all reusable React components (e.g., `navbar.tsx`, `theme-switch.tsx`, `primitives.ts`, `icons.tsx`). This modular approach promotes reusability and easier management of UI elements across the application.
*   `config/`: Stores global configuration files for the application. `site.ts` defines metadata, navigation items, and external links for the entire site, ensuring consistency. `fonts.ts` handles custom font definitions.
*   `data/`: Contains static or mock data used by the application, such as `mining.json`, which likely holds information about mining resources or crafting recipes.
*   `public/`: For static assets that need to be served directly, like `favicon.ico` or other images.
*   `styles/`: Dedicated to global stylesheets, such as `globals.css`, which sets up base styles and integrates Tailwind CSS.
*   `types/`: Contains TypeScript declaration files (`.d.ts`) or interface definitions (`.ts`) for data structures (`game.ts`, `index.ts`), enhancing type safety throughout the project.

## Contributing

We welcome contributions from the community! If you have ideas for new features, bug fixes, or improvements, please feel free to contribute.

To contribute:

1.  **Fork the repository:** Start by forking the `ardelagi/mining-ime` repository to your GitHub account.
2.  **Create a new branch:** Before making any changes, create a new branch from `main` for your feature or fix. Use descriptive names like `feature/add-new-optimizer` or `fix/calculation-error`.
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes:** Implement your feature, fix the bug, or refactor the code. Ensure your code adheres to the project's coding standards (e.g., linting, formatting).
4.  **Commit your changes:** Write clear and concise commit messages that explain the purpose of your changes.
    ```bash
    git commit -m 'feat: Briefly describe your new feature or fix'
    ```
5.  **Push to your branch:**
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request:** Go to the original `ardelagi/mining-ime` repository on GitHub and open a new Pull Request from your forked branch. Provide a detailed description of your changes and why they are valuable.

## License

This project is open-source and available under the terms specified in the `LICENSE` file. Please review the license for details on usage and distribution.

## Links

*   **GitHub Repository:** [https://github.com/ardelagi/mining-ime](https://github.com/ardelagi/mining-ime) - Visit our repository for source code, issues, and pull requests.
*   **Discord Server:** [https://discord.gg/imeroleplay](https://discord.gg/imeroleplay) - Join our community Discord server to discuss the calculator, provide feedback, or get support.
