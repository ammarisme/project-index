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
        console.clear()
        console.log((i++) + " / " + projects.length);
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const topics = $('.color-fg-default.text-bold.mr-1').map((i, el) => $(el).text()).get().join(' / ');
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