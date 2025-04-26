import MemoryStore from ".";

type user = {
    user_id: string,
    username: string,
    age: number,
}

const users = new MemoryStore<user>();

users.onChange("ulric", (state) => {
    console.log("state updated:",state);
})

users.onChange("all", (state) => console.log("all states:", state));

new Promise((resolve) => {
    setTimeout(() => {
        users.set("ulric", {
            user_id: "ur",
            username: "daulric",
            age: 89
        });

        users.set("git", {
            user_id: "git",
            username: "gittab",
            age: 19,
        });
        resolve("success");
    }, 3000);
}).then(() => {
    setTimeout(() => {
        users.update("ulric", (state) => {
            state.age += 1;
        });
    })
}).then(() => {
    setTimeout(() => {
        users.update("ulric", (state) => {
            state.age++;
        });
    }, 3000)
});