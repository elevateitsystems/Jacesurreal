const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('/Users/apple/Desktop/projects/Jacesurreal/scratch/schema.json', 'utf8'));

const queryType = schema.data.__schema.types.find(t => t.name === 'Query');
if (queryType && queryType.fields) {
  console.log('Query fields:');
  queryType.fields.forEach(f => console.log(` - ${f.name}`));
} else {
  console.log('Query type or fields not found');
}
