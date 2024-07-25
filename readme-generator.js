const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
const util = require('util');
const rimraf = require('rimraf');

const git = simpleGit();

async function generateReadmeContent(repoUrl, localPath) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const packageJsonPath = path.join(localPath, 'package.json');

  // Detect project type
  let projectType = null;
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    if (packageJson.dependencies) {
      if (packageJson.dependencies.express) {
        projectType = 'nodejs';
      } else if (packageJson.dependencies.react) {
        projectType = 'react';
      } else if (packageJson.dependencies.next) {
        projectType = 'next';
      } else if (packageJson.dependencies['@nestjs/core']) {
        projectType = 'nest';
      } else if (packageJson.dependencies['@angular/core']) {
        projectType = 'angular';
      }
    }
  }

  // Generate directory tree
  const tree = dirTree(localPath);

  // Generate installation instructions
  let installationInstructions = 'Instructions to install the project.';
  if (projectType === 'nodejs') {
    installationInstructions = `\`\`\`bash
# Clone the repository
git clone ${repoUrl}

# Navigate to the project directory
cd ${repoName}

# Install dependencies
npm install

# Start the application
npm start
\`\`\``;
  } else if (projectType === 'react' || projectType === 'next' || projectType === 'angular') {
    installationInstructions = `\`\`\`bash
# Clone the repository
git clone ${repoUrl}

# Navigate to the project directory
cd ${repoName}

# Install dependencies
npm install

# Start the development server
npm start
\`\`\``;
  } else if (projectType === 'nest') {
    installationInstructions = `\`\`\`bash
# Clone the repository
git clone ${repoUrl}

# Navigate to the project directory
cd ${repoName}

# Install dependencies
npm install

# Start the application
npm run start
\`\`\``;
  }

  const readmeTemplate = `# ${repoName}

## Overview
Provide a brief description of your project, what it does, and the main purpose or goal. Include any key details that are important for understanding the project.

## Directory Tree
\`\`\`
${tree}
\`\`\`

## Installation
${installationInstructions}

${projectType === 'nodejs' || projectType === 'nest' ? `
## API
If your project provides an API, document the endpoints here with examples.

### GET /endpoint
Description of the endpoint.

**Request:**

\`\`\`http
GET /endpoint HTTP/1.1
Host: example.com
\`\`\`

**Response:**

\`\`\`json
{
  "key": "value"
}
\`\`\`
` : ''}

## Contributing
Guidelines for contributing to the project. You might include instructions on how to fork the repository, create a branch, submit a pull request, etc.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a pull request

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
Ammar Ameerdeen - [ammar.ofc@gmail.com](mailto:ammar.ofc@gmail.com)

Project Link: [${repoUrl}](https://github.com/your-username/your-project-name)
`;

  return readmeTemplate;
}

// Function to generate a directory tree
function dirTree(filename) {
  const stats = fs.lstatSync(filename);
  const info = {
    path: filename,
    name: path.basename(filename)
  };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function (child) {
      return dirTree(path.join(filename, child));
    });
  } else {
    info.type = "file";
  }

  return info;
}

// Function to initialize and update README.md
async function updateReadme(repoUrl) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const localPath = path.join(__dirname, repoName);

  try {
    // Clone the repository
    await git.clone(repoUrl, localPath);
    console.log('Repository cloned.');

    // Change directory to the local repository path
    process.chdir(localPath);

    // Check if README.md exists
    let readmeContent = '';
    if (fs.existsSync('README.md')) {
      readmeContent = fs.readFileSync('README.md', 'utf8');
      console.log('Existing README.md content read.');
    }

    // Generate new README content based on the template
    const newReadmeContent = await generateReadmeContent(repoUrl, localPath);

    // Combine existing content with the new template
    const combinedReadmeContent = readmeContent
      ? `${readmeContent}\n\n---\n\n${newReadmeContent}`
      : newReadmeContent;

    // Write the combined content to README.md
    fs.writeFileSync('README.md', combinedReadmeContent);
    console.log('README.md created/updated.');

    // Add README.md to staging
    await git.add('README.md');
    console.log('README.md added to staging.');

    // Commit the change
    await git.commit('Add/update README.md');
    console.log('README.md committed.');

    // Push the change to the remote repository
    await git.push('origin', 'main'); // Replace 'main' with the appropriate branch name if needed
    console.log('Changes pushed to remote repository.');

  } catch (error) {
    console.error('Error updating README.md:', error);
  } finally {
    // Change back to the initial directory
    process.chdir(__dirname);

    // Remove the local repository directory
    rimraf.sync(localPath);
    console.log('Local repository directory removed.');
  }
}

// Example usage: Supply the repository URL
const repoUrl = 'https://github.com/ammarisme/inventory-sync-api.git';
updateReadme(repoUrl);
