export class MapStarController {
    static async CalculateMetrics(context){
        const response =  await fetch(`/Star/CalculateMetrics?Mass=${context.mass()}&Radius=${context.radius()}`);
        const metrics = await response.json();

        context.luminosity(metrics.luminosity.toPrecision(3));
        context.lifetime(metrics.lifetime.toPrecision(3));
        context.temperature(metrics.temperature.toPrecision(3));
        context.spectral_classification(metrics.spectralClassification);
    }
}