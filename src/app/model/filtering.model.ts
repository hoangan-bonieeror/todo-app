export interface FilterButton {
    type : Filter,
    label : string,
    isAction : boolean
}

enum Filter {
    All, 
    Active,
    Completed
}