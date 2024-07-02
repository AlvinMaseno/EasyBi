
# EasyBi: Online Classified Platform designed for connecting Service Providers with Potential Clients
[Introduction](#introduction) | [Installation](#installation) |  [Usage](#usage) | [Features](#features) | [Dependencies](#dependencies) | [Project Structure](#project-structure)
## Introduction

EasyBi aims to enhance access to services by enabling users to search indiscriminately online and seamlessly connect with businesses across various domains.EasyBi facilitates communication and transactions between users and service providers, enhancing the overall user experience. This project signifies a significant advancement in the accessibility and inclusivity of online services, addressing the needs of a diverse user base. The results have the potential to revolutionize how individuals access and interact with services in the digital era, fostering greater connectivity and convenience in everyday life.

## Installation

### Project Setup Instructions

To set up the project, follow these steps:

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   ```

2. **Open the project folder:**
   Open the cloned folder in a text editor like Visual Studio Code.

3. **Navigate to the project folder in the command line:**
   ```bash
   cd <project-folder>
   ```

4. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

5. **Exit the server folder:**
   ```bash
   cd ..
   ```

6. **Install client dependencies:**
   ```bash
   cd client/easybiwebsite
   npm install
   ```

7. **Start the project:**
   Open two terminals (split the terminal) in Visual Studio Code. 

   - In the first terminal, navigate to the server folder and start the server:
     ```bash
     cd server
     npm start
     ```

   - In the second terminal, navigate to the client/easybiwebsite folder and start the client:
     ```bash
     cd client/easybiwebsite
     npm start
     ```

The client will run on port 3006 and will automatically open a new tab in your browser with the project.


## Usage
To use the EasyBi platform, follow these basic steps:

- Access the Platform:
Open your web browser and navigate to the URL where the EasyBi platform is hosted (e.g., http://localhost:3006 if running locally).

- Search for Services:
Use the search bar to enter keywords related to the service you are looking for. The platform uses proximity algorithms and keyword matching to provide relevant results.

- View Service Listings:
Browse through the list of service providers that match your search criteria. You can view details about each service provider, including their contact information and reviews.

- Contact Service Providers:
Use the platform's communication tools to reach out to service providers directly for inquiries or to arrange services.


## Features

- Intelligent search mechanisms using proximity algorithms and keyword matching.
- Aggregated data from diverse business categories.
- Seamless communication between users and service providers.
- User-friendly interface for easy navigation and service discovery.

## Dependencies

- Node.js
  
## Project Structure

The project structure is organized as follows:

```
EASYBI
├── .vscode
├── client
│   └── easybiwebsite
│       ├── node_modules
│       ├── public
│       ├── src
│       ├── .gitignore
│       ├── install.js
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       └── tailwind.config.js
└── server
    ├── Models
    ├── node_modules
    ├── .env
    ├── .gitignore
    ├── connection.js
    ├── index.js
    ├── package-lock.json
    └── package.json
```

This structure separates the client and server components, making it easier to manage dependencies and project files.

