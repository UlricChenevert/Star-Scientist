using Star_Scientist.data.contracts;
using Star_Scientist.data.entities;
using Star_Scientist.api;

namespace Star_Scientist.scripts.controllers;

public static class StarEndpoints
{
    public static WebApplication StarController(this WebApplication app) 
    {
        List<StarTemplateContract> templates = [
            new ("Sun", 1, 1),
            new ("BI 253", 97.6, 13.9 ),
            new ("Phi Orionis", 15.5, 6.3),
            new ("Epsilon Eridani", 0.82, 0.735),
            new ("Alpha Coronae Borealis", 2.58, 2.89),
            new ("Eta Arietis", 1.21, 0.98),
            new ("70 Ophiuchi", 0.90, 0.91),
            new ("Lacaille 8760", 0.60, 0.51),
            new ("VB 10", 0.0881, 0.1183)
        ];
        
        app.MapGet("/templates", () => templates);


        app.MapGet("/metrics", (double Mass, double Radius) => 
        {
            GetStarMetricsContract requestedStar = new (Mass, Radius);
            StarMetrics starMetrics = GenerateStarInfoAsync.CalculateMetrics(requestedStar);
            return starMetrics;
        });

        app.MapGet("/timeline", (char spectralClassification) =>  {
            List<Timeline> timeline = GenerateStarInfoAsync.DetermineTimeline(spectralClassification);
            return timeline;
        });

        return app;
    }
}
