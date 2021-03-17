export class User {
    public constructor(
        public userName: string,
        public password: string,
        public type: string,
        public firstName?: string,
        public lastName?: string,
        public id?: number
    ) { }
}