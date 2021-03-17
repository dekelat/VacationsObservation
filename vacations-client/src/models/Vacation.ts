export class Vacation {
    public constructor(
        public id: number,
        public destination: string,
        public description: string,
        public imageUrl: string,
        public startDate: Date,
        public endDate: Date,
        public price: number,
        public numOfFollowers: number = 0,
        public isFollowing: boolean = false
    ) { }
}