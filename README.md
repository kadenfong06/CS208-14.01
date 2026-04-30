# CS208 Full Stack Final Project - Downtown Donuts Application

- Name: Kaden Fong
- GitHub: https://github.com/kadenfong06
- Term: Spring 2026

## Project Description
This is my full-stack application for CS208, built with Node.js. I created a web application for a small donut shop called Downtown Donuts that allows users to view the menu, learn about the business, and leave comments.

The application uses Express for the backend and MariaDB (MySQL) for the database. The goal of this project was to design a clean, modern, and user-friendly interface while implementing full-stack functionality.

## Install the Database

To set up the database, run the `install_db.sh` script in the `setup_scripts` directory. This script installs MariaDB and starts the server. You only need to run this once per Codespace.

```bash
./setup_scripts/install_db.sh
```

## Setup the Database
Use the following for questions that the script asks:

- Switch to unix_socket authentication [Y/n] n
- Change the root password? [Y/n] Y
  - Set the password to 12345
- Remove anonymous users? [Y/n] Y
- Disallow root login remotely? [Y/n] Y
- Remove test database and access to it? [Y/n] Y
- Reload privilege tables now? [Y/n] Y

Test to make sure the db is running:

```bash
sudo service mariadb status
```

There should be an approximated uptime or something similar.

## Create the Database Tables

Create the initial tables by running:

```bash
sudo mysql -u root -p < ./setup_scripts/create_demo_table.sql
```

## Install Dependencies

Install the required dependencies:

```bash
npm install
```

## Run the Application
Start the application:

```bash
npm start
```

## Access the Application

On Codespaces, forward port 3000 and open it in your browser: http://localhost:3000

## Design Decisions
- Used a dark green and saffron color palette to create a warm and cozy feel.
- Recreated the menu using custom HTML/CSS instead of embedding the PDF for better control and readability.
- Designed a simple and clean layout to keep the user experience intuitive.

## Edge Cases
- Empty Input: Users cannot submit blank or whitespace-only comments.
- Long Input: Name and comment length are limited to prevent excessively long submissions.
- Server Errors: If the database fails, the page displays a friendly error message instead of crashing.
- Form Persistence: User input is preserved after validation errors.

## Challenges & Learnings
- Implementing pagination while maintaining correct backend logic and UI updates.
- Handling errors without breaking the user experience by using redirects and UI messaging.
- Preserving form input after validation errors using query parameters.

## Accessibility
- All inputs have labels for better usability.
- Semantic HTML structure is used (nav, main, etc.).
- ARIA roles are used for error messages and pagination.

## Notes
If the database is not running, the comments page will still load but display an error message instead of crashing.

## Citations
- CS208 Full Stack Starter Code
- Express.js Documentation
- MDN Web Docs
- StackOverflow (debugging and syntax help)