using Star_Scientist.data.contracts;
using Star_Scientist.data.entities;
using Star_Scientist.api;
using Microsoft.AspNetCore.Mvc;

namespace Star_Scientist.api.controllers;

[ApiController]
[Route("Star")]
public class StarController : ControllerBase
{
    [Route("getTemplates")]
    [HttpGet]
    public ActionResult< Dictionary<string, StarTemplateContract> > Get()
    {
        Dictionary<string, StarTemplateContract> templates = new()
        {
            { "Sun", new(1, 1) },
            { "BI 253", new(97.6, 13.9) },
            { "Phi Orionis", new(15.5, 6.3) },
            { "Epsilon Eridani", new(0.82, 0.735) },
            { "Alpha Coronae Borealis", new(2.58, 2.89) },
            { "Eta Arietis", new(1.21, 0.98) },
            { "70 Ophiuchi", new(0.90, 0.91) },
            { "Lacaille 8760", new(0.60, 0.51) },
            { "VB 10", new(0.0881, 0.1183) },
            
        };

        return templates;
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
