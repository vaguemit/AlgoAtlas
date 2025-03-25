import { CompilerRequest } from '@/app/types/compiler';

const API_URL = '/api/execute-code';

async function testCompiler(language: string, code: string, input: string = '') {
  console.log(`\nTesting ${language}...`);
  console.log('Code:', code);
  console.log('Input:', input);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        code,
        input,
      } as CompilerRequest),
    });

    const result = await response.json();
    console.log('Response:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function runTests() {
  console.log('Starting API tests...\n');

  // Test Python
  await testCompiler(
    'python',
    'print("Hello, World!")'
  );

  // Test Python with input
  await testCompiler(
    'python',
    'name = input("Enter your name: ")\nprint(f"Hello, {name}!")',
    'John'
  );

  // Test C++
  await testCompiler(
    'cpp',
    `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  );

  // Test C++ with input
  await testCompiler(
    'cpp',
    `#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`,
    'John'
  );

  // Test Java
  await testCompiler(
    'java',
    `System.out.println("Hello, World!");`
  );

  // Test Java with input
  await testCompiler(
    'java',
    `Scanner scanner = new Scanner(System.in);
System.out.print("Enter your name: ");
String name = scanner.nextLine();
System.out.println("Hello, " + name + "!");`,
    'John'
  );

  // Test error handling
  await testCompiler(
    'python',
    'print("Missing closing quote)'
  );

  console.log('\nAll tests completed!');
}

// Run the tests
runTests(); 