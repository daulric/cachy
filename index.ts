import { EventEmitter } from "stream";

type EmitType = "a" | "o";

class MemoryStore<T> {
  #store: Record<string, T>;
  #emitter: EventEmitter;

  constructor() {
    this.#store = {};
    this.#emitter = new EventEmitter();
  }

  private returnData(name: string): T | null | undefined {
    return this.#store[name];
  }

  private emit_data(emitType: EmitType, args: T | Record<string, T>, name?: string) {
    if (emitType === "a") {
      this.#emitter.emit(emitType, "all", args);
    } else if (emitType === "o" && name) {
      if (args !== null) {
        const item = args as T;
        this.#emitter.emit(emitType, name, item);
      }
    }
  }

  get(name: string): T | null {
    const in_memory = this.returnData(name);
    const draft_up = typeof(in_memory) === "object" ? {...(in_memory) as T} : in_memory;
    return draft_up ?? null;
  }

  set(name: string, item: T, force: boolean = false) {
    if (force || !this.returnData(name)) {
      this.#store[name] = item;
      this.emit_data("o", this.#store[name], name);
      this.emit_data("a", this.#store);
    }
  }

  // Modify your update method in MemoryStore
  update(name: string, updater: (state: T) => T): void {
    const in_memory = this.returnData(name);
    
    if (in_memory === null) {
      throw new Error(`'set' function must be called first because there's no data for ${name}`);
    }

    let draft_up: T;

    if (typeof(in_memory) === "object" && in_memory !== null) {
      draft_up = {...(in_memory as T)};
    } else {
      draft_up = in_memory as T;
    }

    const new_state = updater(draft_up);

    if (new_state !== undefined) {
      this.#store[name] = new_state;
      this.emit_data("o", new_state, name);
      this.emit_data("a", this.#store);
    } else {
      throw new Error(`no state was returned when updating value for ${name}`);
    }
  }

  remove(name: string) {
    if (this.returnData(name)) {
      delete this.#store[name];
      this.emit_data("a", this.#store);
    }
  }

  clearCache() {
    for (const key in this.#store) {
      if (Object.prototype.hasOwnProperty.call(this.#store, key)) {
        delete this.#store[key];
      }
    }
  }

  onChange<E extends EmitType>(
    emitType: E, callback: E extends "o" 
        ? (name: string, state: T) => void
        : (name: string, state: Record<string, T>) => void 
    ) {
    if (emitType === "o") {
        this.#emitter.addListener("o", callback as (name: string, state: T) => void);
    } else {
        this.#emitter.addListener("a", callback as (name: string, state: Record<string, T>) => void);
    }
  }
  

  list() {
    console.log(this.#store);
  }
}

export default MemoryStore;