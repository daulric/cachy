import MemoryStore from ".";

type user = {
    user_id: string,
    username: string,
    age: number,
}

const users = new MemoryStore<user>();

users.onChange("a", (_, state) => {
    console.log("all data", state);
})

users.onChange("o", (name, state) => {
    console.log(name, state);
})

users.set("hello", {
    user_id: "lk",
    username: "sjsjs",
    age: 90,
});

setTimeout(()=> {
    users.update("hello", (state) => {
        state.age++;
    });
}, 3000);