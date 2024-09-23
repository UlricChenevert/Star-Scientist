using System.Diagnostics.Metrics;

namespace Star_Scientist.data.entities;

public class StarMathConstants {
    public required SpectralClassificationTypes Stars { get; set; }
    public required SunConstants Sun { get; set; }
    public required List<StarTemplate> Templates {get; set;}
}

public class SpectralClassificationTypes {
    public required SpectralClassification O {get; set;}
    public required SpectralClassification B {get; set;}
    public required SpectralClassification A {get; set;}
    public required SpectralClassification F {get; set;}
    public required SpectralClassification G {get; set;}
    public required SpectralClassification K {get; set;}
    public required SpectralClassification M {get; set;}

}

public class SpectralClassification {
    public required string Color { get; set; }

    public required TemperatureRange Temperature { get; set; }

    public required List<Timeline> Timeline { get; set; }
}

public class TemperatureRange {
    public double High {get; set;}
    public double Low {get; set;}
}

public class Timeline {
    public required string Type { get; set;}
    public required string Desc { get; set;}
}

public class SunConstants {
    public required StarMeasurement Lifespan {get; set;}  
    public required StarMeasurement Temperature {get; set;}  
    public required StarMeasurement Radius {get; set;}  
    public required StarMeasurement Mass {get; set;}    
}

public class StarMeasurement {
    public double Value {get; set;}
    public string? Unit {get; set;}
}