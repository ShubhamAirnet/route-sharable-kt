import { City } from "./city.model";

export class Trip {
    continent?: string;
    month?: string;
    departureDate?: Date;
    fromCity?: string;
    duration?: string;
    numberOfPeople?: string;
    city: City[] = [];
}