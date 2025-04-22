class MemoryStore<T> {
    #store: Record<string, T>;

    constructor () {
        this.#store = {}
    }

    private returnData(name: string) : T | null | undefined {
        const in_memory = this.#store;
        const data = in_memory[name];
        return data;
    }

    get(name: string) {
        const in_memory = this.returnData(name);

        if (in_memory) return in_memory;
        return null;
    }

    set(name: string, item: T) {
        const in_memory = this.returnData(name);

        if (!in_memory) {
            this.#store[name] = item;
        }
    }

    update(name: string, state: (state: T) => void) {
        const in_memory = this.returnData(name);

        if (in_memory) {
            state(in_memory);
        }
    }

    remove(name: string) {
        if (this.returnData(name)) {
            delete this.#store[name];
        }        
    }

    clearCache() {
        for (const key in this.#store) {
            if (Object.prototype.hasOwnProperty.call(this.#store, key)) {
                delete this.#store[key];
            }
        }
    }

    list() {
        console.log(this.#store);
    }
}

export default MemoryStore;