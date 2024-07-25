const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const projects = [];

async function main() {
  // Read the CSV file
  fs.createReadStream('GitHub_Projects.csv')
    .pipe(csv())
    .on('data', (row) => {
      projects.push(row);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');
      await updateTechnologies();
    });
}

// Function to update technologies
async function updateTechnologies() {
  var i = 1;
  for (let project of projects) {
    const url = project['Project Link'];
    if (url) {
      try {
        console.clear();
        console.log((i++) + " / " + projects.length);
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        let topics = $('.color-fg-default.text-bold.mr-1').map((i, el) => $(el).text()).get().join(' / ');

        // Check for package.json file
        const repoPath = url.replace('https://github.com/', '');
        const packageJsonUrl = `https://raw.githubusercontent.com/${repoPath}/main/package.json`;

        try {
          const packageJsonResponse = await axios.get(packageJsonUrl);
          const packageJson = packageJsonResponse.data;

          const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
          
          // Check for core JavaScript-based technologies
          const techMap = {
            'React': 'react',
            'Angular': '@angular/core',
            'Vue.js': 'vue',
            'Svelte': 'svelte',
            'Preact': 'preact',
            'Express': 'express',
            'Koa': 'koa',
            'NestJS': '@nestjs/core',
            'Hapi': '@hapi/hapi',
            'Sails': 'sails',
            'Redux': 'redux',
            'MobX': 'mobx',
            'Vuex': 'vuex',
            'Jest': 'jest',
            'Mocha': 'mocha',
            'Jasmine': 'jasmine',
            'Cypress': 'cypress',
            'Chai': 'chai',
            'Webpack': 'webpack',
            'Rollup': 'rollup',
            'Parcel': 'parcel-bundler',
            'Gulp': 'gulp',
            'Grunt': 'grunt',
            'Babel': '@babel/core',
            'TypeScript': 'typescript',
            'Styled Components': 'styled-components',
            'Emotion': '@emotion/react',
            'ESLint': 'eslint',
            'Prettier': 'prettier',
            'Apollo Client': '@apollo/client',
            'Relay': 'relay-runtime',
            'Sequelize': 'sequelize',
            'TypeORM': 'typeorm',
            'Mongoose': 'mongoose',
            'Testing Library': '@testing-library/react'
          };

          Object.entries(techMap).forEach(([tech, dependency]) => {
            if (dependencies[dependency]) {
              topics = topics ? `${topics} / ${tech}` : tech;
            }
          });

        } catch (packageJsonError) {
          console.log(`No package.json found or error fetching package.json for ${url}`);
        }

        project['Technology'] = topics || project['Technology'];
      } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
      }
    }
  }

  // Write the updated data back to the CSV file
  const csvWriter = fs.createWriteStream('Updated_GitHub_Projects.csv');
  csvWriter.write('Project Name;Description;Project Link;Technology;Last Updated\n');
  projects.forEach(project => {
    csvWriter.write(`${project['Project Name']};${project['Description']};${project['Project Link']};${project['Technology']};${project['Last Updated']}\n`);
  });
  csvWriter.end();
}

main();
