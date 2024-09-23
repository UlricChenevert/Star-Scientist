using Star_Scientist.data.contracts;
using Star_Scientist.data.entities;

namespace Star_Scientist.api.mapping;

public static class TemplateMapping 
{

    public static StarTemplate ToEntity(this GetStarMetricsContract contract) 
    {
        return new StarTemplate() 
        {
            Radius = contract.Radius,
            Mass = contract.Mass
        };
    }
}