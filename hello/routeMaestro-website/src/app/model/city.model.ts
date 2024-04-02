export class City {
    
    name?: string;
    description?: string;
    cost?: string;
    tags?: string[];
    imageUrl?: string;
  
    constructor(
        public cityName: string,
        public cityDescription: string,
        public cityCost: string,
        public cityTags: string[],
        public cityImageUrl: string,
      ) {
        this.cityName = cityName;
        this.cityDescription = cityDescription;
        this.cityCost = cityCost;
        this.cityTags = cityTags;
        this.cityImageUrl = cityImageUrl;
        }
  }