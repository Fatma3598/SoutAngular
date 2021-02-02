import { IComment } from "./icomment";

export class Post {
    constructor(
        public id: string = "",
        public owner: string = "",
        public audio: string = "",
        public video: string = "",
        public date: Date = new Date(),
        public description: string = "",
        public image: string[] = [],
        public talent: string = "",
    ) { }

}
