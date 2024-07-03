using Star_Scientist.data.contracts;
using Star_Scientist.data.entities;
using Star_Scientist.api;
using Microsoft.AspNetCore.Mvc;

namespace Star_Scientist.api.controllers;

[ApiController]
[Route("Star")]
public class StarController : ControllerBase
{
    [Route("templates")]
    [HttpGet]
    public ActionResult<List<StarTemplateContract>> Get()
    {
        List<StarTemplateContract> template = [
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

        return template;
    }

    [Route("CalculateMetrics")]
    [HttpGet]
    public ActionResult<StarMetrics> Get(double Mass, double Radius)
    {
        GetStarMetricsContract requestedStar = new (Mass, Radius);
        StarMetrics starMetrics = GenerateStarInfoAsync.CalculateMetrics(requestedStar);
        return starMetrics;
    }

    [Route("DetermineTimeline")]
    [HttpGet]
    public ActionResult<List<Timeline>> Get(char spectralClassification)
    {
        List<Timeline> timeline = GenerateStarInfoAsync.DetermineTimeline(spectralClassification);
        return timeline;
    }

}
