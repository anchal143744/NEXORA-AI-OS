declare module 'passport-microsoft' {
  export class Strategy {
    constructor(options: Record<string, unknown>, verify?: (...args: any[]) => void);
  }
}
