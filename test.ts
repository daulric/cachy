import MemoryStore from ".";

type user = {
    user_id: string,
    username: string,
    age: number,
}

const users = new MemoryStore<user>();

users.add("ulric", {
    user_id: "ur",
    username: "daulric",
    age: 89
});

console.log(users.get("ulric"), users.get("teman"));