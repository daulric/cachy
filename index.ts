import { EventEmitter } from "stream";

class MemoryStore<T> {
    #store: Record<string, T>;
    #emitter: EventEmitter

    constructor () {
        this.#store = {}
        this.#emitter = new EventEmitter();
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
            this.#emitter.emit("all_record", this.#store);
        }
    }

    update(name: string, state: (state: T) => void) {
        const in_memory = this.returnData(name);

        if (in_memory) {
            state(in_memory);
            this.#emitter.emit(name, in_memory);
            this.#emitter.emit("all_record", this.#store);
        }
    }

    remove(name: string) {
        if (this.returnData(name)) {
            delete this.#store[name];
            this.#emitter.emit("all_record", this.#store);
        }        
    }

    clearCache() {
        for (const key in this.#store) {
            if (Object.prototype.hasOwnProperty.call(this.#store, key)) {
                delete this.#store[key];
            }
        }
    }

    onChange(record: string, callback: (state: T) => void) {
        if (record === "all") {
            this.#emitter.addListener("all_record", callback);
        } else {
            this.#emitter.addListener(record, callback);
        }
    }

    list() {
        console.log(this.#store);
    }
}

export default MemoryStore;