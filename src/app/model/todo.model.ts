export class Todo {
    constructor(
        private _id : number,
        private _content : string,
        private _isCompleted : boolean = false
    ) {}

    get id() {
        return this._id;
    }
    get content() {
        return this._content;
    }
    get isCompleted() {
        return this._isCompleted;
    }
}