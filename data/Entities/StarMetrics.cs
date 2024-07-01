namespace Star_Scientist.data.entities;

public class StarMetrics {
    public double Mass {get; set;}
    public double Radius {get; set;}
    public double Luminosity {get; set;}
    public double Lifetime {get; set;}
    public double Temperature {get; set;}

    public char SpectralClassification {get; set;}  

    public required string Color {get; set;}
}