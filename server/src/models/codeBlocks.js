const codeBlocks = [
    {
      title: 'Async case',
      id: 'fb1e3ee093a843d8b3d57cf50cb10bfc',
      code: 'async function fetchData() {\n  const response = await fetch(\'https://api.example.com/data\');\n  const data = await response.json();\n  console.log(data);\n}',
      solution: 'async function fetchData() {\n  const response = await fetch(\'https://api.example.com/data\');\n  const data = await response.json();\n  console.log(data);\n}'
    },
    {
      title: 'Promise chaining',
      id: '4954713ee4c0479594c96ffbd16b0299',
      code: 'fetch(\'https://api.example.com/data\')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));',
      solution: 'fetch(\'https://api.example.com/data\')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));'
    },
    // Add more code blocks here
  ];

module.exports = codeBlocks;  