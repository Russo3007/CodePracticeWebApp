const codeBlocks = [
    {
      title: 'Async case',
      id: 'fb1e3ee093a843d8b3d57cf50cb10bfc',
      code: 'async function fetchData() {\n  // Write your code here \n  console.log(data);\n}',
      solution: 'async function fetchData() {\n  const response = await fetch(\'https://api.example.com/data\');\n  const data = await response.json();\n  console.log(data);\n}'
    },
    {
      title: 'Promise chaining',
      id: '4954713ee4c0479594c96ffbd16b0299',
      code: 'fetch(\'https://api.example.com/data\')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));',
      solution: 'fetch(\'https://api.example.com/data\')\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));'
    },
    {
      title: 'Array Filtering',
      id: '9cfb3cfa609b4c12b7310fdv4cag3554x8e3',
      code: 'const numbers = [1, 2, 3, 4, 5];\nconst evenNumbers = numbers.filter(num => {\n  // Write your code here to filter even numbers\n});\nconsole.log(evenNumbers);',
      solution: 'const numbers = [1, 2, 3, 4, 5];\nconst evenNumbers = numbers.filter(num => {\n  return num % 2 === 0;\n});\nconsole.log(evenNumbers);',
    },
    {
      title: 'For Loop',
      id: '837e69b5d9b44295a7e556882af3c8ab',
      code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
      solution: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}'
    },
    {
      title: 'Array Map',
      id: '9cfb3cfa609b4c12b73107c133f0669f',
      code: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);',
      solution: 'const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled);'
    },
    {
      title: 'Object Literal',
      id: '6d8b7c02d1c44e55abec032bba3dabfa',
      code: 'const person = {\n  firstName: "John",\n  lastName: "Doe",\n  age: 30\n};\nconsole.log(person.firstName, person.age);',
      solution: 'const person = {\n  firstName: "John",\n  lastName: "Doe",\n  age: 30\n};\nconsole.log(person.firstName, person.age);'
    },
    {
      title: 'Object Destructuring',
      id: 'abcdef123fj4if3ddsoe3pspdk30clst95gk',
      code: 'const person = {\n  name: \'Alice\',\n  age: 30,\n  city: \'New York\'\n};\n// Use object destructuring to extract the name\n// Write your code here\nconsole.log(name);',
      solution: 'const person = {\n  name: \'Alice\',\n  age: 30,\n  city: \'New York\'\n};\n// Use object destructuring to extract the name\nconst { name } = person;\nconsole.log(name);',
    },
    // Add more code blocks here
  ];

module.exports = codeBlocks;  