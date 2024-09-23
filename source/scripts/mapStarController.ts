export class MapStarController {
    static async getTemplates(templates_observable : KnockoutObservable<object>) {
        const response =  await fetch(`/Star/getTemplates`);
        const presents = await response.json();

        // Get copy of current observable state
        const working_templates = templates_observable();

        // Append copy of current state with new values from server
        for (let key of Object.keys(presents)) {
            working_templates[key] = presents[key];
        }
        
        // Replace templates with newly modified observable
        templates_observable(working_templates);
    } 
    
    static async CalculateMetrics(context){
        const response =  await fetch(`/Star/CalculateMetrics?Mass=${context.mass()}&Radius=${context.radius()}`);
        const metrics = await response.json();

        context.luminosity(metrics.luminosity.toPrecision(3));
        context.lifetime(metrics.lifetime.toPrecision(3));
        context.temperature(metrics.temperature.toPrecision(3));
        context.spectral_classification(metrics.spectralClassification);
    }
}