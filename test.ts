import MemoryStore from ".";

type user = {
    user_id: string,
    username: string,
    age: number,
}

const users = new MemoryStore<user>();

users.set("ulric", {
    user_id: "ur",
    username: "daulric",
    age: 89
});

users.list();

users.update("ulric", (state) => {
    state.age += 1;
});

console.log("updated")
users.list();