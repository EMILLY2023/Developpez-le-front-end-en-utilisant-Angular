// TODO: create here a typescript interface for an olympic country

/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/
import { participation } from "./Participation";

export interface olympic{
    id:number;
    country: string;
    participations: participation[]
}
