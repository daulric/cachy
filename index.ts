import { EventEmitter } from "stream";

type EmitType = "a" | "o";

type Callback<T, E extends EmitType> = E extends "o"
  ? (name: string, state: T) => void
  : (name: string, state: Record<string, T>) => void;

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
    return in_memory ?? null;
  }

  set(name: string, item: T) {
    if (!this.returnData(name)) {
      this.#store[name] = item;
      this.emit_data("o", this.#store[name], name);
      this.emit_data("a", this.#store);
    }
  }

  update(name: string, state: (state: T) => void) {
    const in_memory = this.returnData(name);
    if (in_memory) {
      state(in_memory);
      this.emit_data("o", in_memory, name);
      this.emit_data("a", this.#store);
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