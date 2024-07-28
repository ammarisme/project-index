## Overview
The goal of this project is to create an index CSV file of all projects belonging to the user. The project consists of several files and scripts organized in a specific structure. Below is an explanation of each file and its role in the project.

## Directory Tree Structure
```
|-- .gitignore
|-- GitHub_Projects.csv
|-- README.md
|-- Updated_GitHub_Projects.csv
|-- index-generator.js
|-- package-lock.json
|-- package.json
|-- readme-generator.js
```

### File Descriptions

1. **.gitignore**
   - **Purpose:** Specifies which files and directories to ignore in the Git repository. Common entries include `node_modules`, `.env` files, and other temporary files.
   - **Contents:** Typically includes patterns to exclude files that are not needed in version control.

2. **GitHub_Projects.csv**
   - **Purpose:** Contains the initial list of GitHub projects. This file serves as a data source for generating the updated index.
   - **Contents:** CSV formatted list of GitHub projects, including project names and possibly other metadata.

3. **README.md**
   - **Purpose:** Provides an overview and documentation for the project. It explains the project’s purpose, how to set it up, and how to use it.
   - **Contents:** Markdown formatted text that serves as a guide for users of the project.

4. **Updated_GitHub_Projects.csv**
   - **Purpose:** Contains the updated list of GitHub projects after running the `index-generator.js` script. This file is the output of the indexing process.
   - **Contents:** CSV formatted list similar to `GitHub_Projects.csv` but updated with the latest project information.

5. **index-generator.js**
   - **Purpose:** Main script responsible for generating the updated index of GitHub projects.
   - **Contents:** JavaScript code that reads `GitHub_Projects.csv`, processes the data, and writes the updated list to `Updated_GitHub_Projects.csv`.

6. **package-lock.json**
   - **Purpose:** Automatically generated file that locks the versions of dependencies for the project.
   - **Contents:** Detailed tree of dependencies ensuring the project builds with the exact versions of libraries.

7. **package.json**
   - **Purpose:** Contains metadata about the project, including dependencies, scripts, and other configurations.
   - **Contents:** JSON formatted text that includes project name, version, dependencies, and scripts.

8. **readme-generator.js**
   - **Purpose:** Script to generate or update the README file based on the current project state.
   - **Contents:** JavaScript code that automates the creation of the `README.md` file, ensuring it is up-to-date with the latest project information.

### Code Explanations

#### index-generator.js
This script reads from `GitHub_Projects.csv`, processes the project data (such as updating project details or adding new projects), and writes the results to `Updated_GitHub_Projects.csv`.

#### readme-generator.js
This script automates the process of creating or updating the `README.md` file. It ensures that the README accurately reflects the current state of the project, including any new scripts, files, or project details.

### Usage

1. **Setup**
   - Ensure all dependencies are installed by running `npm install`.

2. **Generating Updated Index**
   - Run `node index-generator.js` to generate the updated list of projects.

3. **Updating README**
   - Run `node readme-generator.js` to update the README file with the latest project information.
