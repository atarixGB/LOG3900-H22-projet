export class Stack<T> {
    private array: T[];
    private readonly underflow: number = -1;

    constructor() {
        this.array = new Array<T>();
    }

    isEmpty(): boolean {
        return this.array.length === 0;
    }

    delete(toDelete: T): void {
        const index = this.array.indexOf(toDelete);

        if (index !== this.underflow) {
            this.array.splice(index, 1);
        }
    }

    add(toAdd: T): void {
        this.array.push(toAdd);
    }

    pop(): T {
        return this.array.pop() as T;
    }

    getAll(): T[] {
        return this.array;
    }

    clear(): void {
        this.array = [];
    }
}
