import MemoryStore from ".";

type user = {
    user_id: string,
    username: string,
    age: number,
}

const users = new MemoryStore<user>();
const test_string = new MemoryStore<string>();

users.onChange("a", (_, state) => {
    console.log("all data", state);
})

users.onChange("o", (name, state) => {
    console.log(name, state);
})

test_string.onChange("o", (name, state) => {
    console.log(name, "updated to", `'${state}'`, "in string memory store");
});

test_string.set("hmm", "get away");

try {
    users.update("hello", (state) => {
        if (state === null) {
            return {
                age: 9,
                user_id: "90k",
                username: "890k"
            }
        }

        return state;
    });
} catch(e) {
    users.set("hello", { user_id: "jk", age: 90, username: "906k" })
}

setTimeout(()=> {
    users.update("hello", (state) => {
        state.age++;
        return state;
    });

    setTimeout(() => {
        console.log(users.get("hello"));
        test_string.update("hmm", (state) => {
            state += " u netro";
            return state;
        });
    }, 3000);
}, 3000);