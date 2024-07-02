export class MapStarController{
    async CalculateSomething(mass:number, radius:number):Promise<string>{
        const response =  await fetch(`/mapStar/data?mass=${mass}&radius=${radius}`);
        const data = await response.json();
        return data;
    }
}