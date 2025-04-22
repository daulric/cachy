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

users.add("git", {
    user_id: "hm",
    username: "git",
    age: 89,
});

users.list();
users.remove("ulric");
users.list();
users.clearCache();
users.list();