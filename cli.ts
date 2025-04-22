//this is just a test in the cli

import * as readline from 'readline';
import MemoryStore from '.';

type User = {
  user_id: string;
  username: string;
  age: number;
};

// Initialize MemoryStore
const usersStore = new MemoryStore<User>();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nSelect an action:");
  console.log("1. Add User");
  console.log("2. Update User");
  console.log("3. List Users");
  console.log("4. Exit");
}

function promptInput(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function addUser() {
  const user_id = await promptInput("Enter user ID: ");
  const username = await promptInput("Enter username: ");
  const age = parseInt(await promptInput("Enter age: "), 10);

  const user: User = { user_id, username, age };
  usersStore.set(user_id, user);
  console.log("User added.");
}

async function updateUser() {
  const user_id = await promptInput("Enter user ID to update: ");
  const user = usersStore.get(user_id);

  if (user) {
    const newAge = parseInt(await promptInput("Enter new age: "), 10);
    usersStore.update(user_id, (state) => {
      state.age = newAge;
    });
    console.log("User updated.");
  } else {
    console.log("User not found.");
  }
}

async function listUsers() {
  console.log("\nListing Users:");
  usersStore.list();
}

async function runCLIPrompt() {
  const action = await promptInput("Choose an action (1-4): ");

  switch (action) {
    case "1":
      await addUser();
      break;
    case "2":
      await updateUser();
      break;
    case "3":
      await listUsers();
      break;
    case "4":
      console.log("Exiting...");
      rl.close();
      return;
    default:
      console.log("Invalid choice, please try again.");
      showMenu();
      break;
  }
  await runCLI();
}

async function runCLI() {
    showMenu();
    runCLIPrompt();
}

runCLI();