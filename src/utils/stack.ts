class Stack {
  private arr: any[];

  constructor() {
    this.arr = [];
  }

  push(elem): void {
    this.arr.push(elem);
  }

  pop(): any {
    return this.arr.pop();
  }

  show(): void {
    console.log(this.arr);
  }

  isEmpty(): boolean {
    if (this.arr.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}

export { Stack };
