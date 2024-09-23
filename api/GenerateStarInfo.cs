using System.Text.Json;
using Star_Scientist.data.contracts;
using Star_Scientist.data.entities;

namespace Star_Scientist.api;

public class GenerateStarInfoAsync {
    public static StarMetrics CalculateMetrics(GetStarMetricsContract starMetrics) {
        // Get JSON Fle
        var jsonFile = "data/star_constants.json";
        var jsonString = File.ReadAllText(jsonFile);
        
        // Read JSON file
        StarMathConstants? starConstants = JsonSerializer.Deserialize<StarMathConstants>(jsonString)!;

        // Call all calculation functions, assigning it to it's own file
        double mass = starMetrics.Mass;
        double radius = starMetrics.Radius;
        double luminosity = CalculateLuminosity(mass);
        double lifetime = CalculateLifetime(mass, luminosity, starConstants);
        double temperature = CalculateTemperature(luminosity, radius, starConstants);
        char spectralClassification = DetermineSpectralClassification(temperature, starConstants);
        string color = DetermineColor(spectralClassification, starConstants);

        // Return file
        return new StarMetrics () {
            Mass = mass,
            Radius = radius,
            Luminosity = luminosity,
            Lifetime = lifetime,
            Temperature = temperature,
            SpectralClassification = spectralClassification,
            Color = color,
        };

    } 
    
    public static List<Timeline> DetermineTimeline(char SpectralType) {
        // Get JSON Fle
        var jsonFile = "data/star_constants.json";
        var jsonString = File.ReadAllText(jsonFile);
        
        // Read JSON file
        StarMathConstants? starConstants = JsonSerializer.Deserialize<StarMathConstants>(jsonString)!;
        
        return SpectralType switch
        {
            'O' => starConstants.Stars.O.Timeline,
            'B' => starConstants.Stars.B.Timeline,
            'A' => starConstants.Stars.A.Timeline,
            'F' => starConstants.Stars.F.Timeline,
            'G' => starConstants.Stars.G.Timeline,
            'K' => starConstants.Stars.K.Timeline,
            'M' => starConstants.Stars.M.Timeline,
            _ => throw new Exception("Outside Color Specs!"),
        };
    }

    // Desc: Estimates the luminosity of a main sequence star
    // Pre:  Mass in solar units
    // Post: Luminosity in solar units
    static public double CalculateLuminosity(double Mass) {
        double star_luminosity;
        
        if (Mass <= 0.43) {
            star_luminosity = 0.23*Math.Pow(Mass, 2.3);

        } else if (Mass <= 2) {
            star_luminosity = Math.Pow(Mass, 4);

        } else if (Mass <= 55) {
            star_luminosity = 1.4*Math.Pow(Mass, 3.5);

        } else if (Mass > 55) {
            star_luminosity = 3.2e4*Mass;

        } else {
            throw new Exception("CalculateLuminosity outside of Mass specs!");
        }
        
        return star_luminosity;
    }

    // Desc: Estimates the life spent on the main sequence
    // Pre: Mass in solar units and luminosity in solar units
    // Post: Lifetime in years
    static public double CalculateLifetime(double Mass, double Luminosity, StarMathConstants starConstants) {
        return starConstants.Sun.Lifespan.Value*(Mass/Luminosity);
    }

    // Desc: Estimates the temperature with the Stefan-Boltzmann Law
    // Pre: luminosity in solar units and radius in solar units
    // Post: Temperature in Kevin
   static public double CalculateTemperature(double Luminosity, double Radius, StarMathConstants starConstants) {
        return starConstants.Sun.Temperature.Value* Math.Pow(Luminosity/Math.Pow(Radius, 2), 0.25);
    }

    // Desc: Determines spectral classification based on temperature
    // Pre: Temperature in Kevin
    // Post: A spectral classification (O, B, A, F, G, K, M)
    static public char DetermineSpectralClassification (double Temperature, StarMathConstants starConstants) {
        if (Temperature > starConstants.Stars.O.Temperature.Low) {
            return 'O';

        } else if (Temperature >= starConstants.Stars.B.Temperature.Low) {
            return 'B';

        } else if (Temperature >= starConstants.Stars.A.Temperature.Low) {
            return 'A';

        } else if (Temperature >= starConstants.Stars.F.Temperature.Low) {
            return 'F';

        } else if (Temperature >= starConstants.Stars.G.Temperature.Low) {
            return 'G';

        } else if (Temperature >= starConstants.Stars.K.Temperature.Low) {
            return 'K';

        } else if (Temperature < starConstants.Stars.M.Temperature.High) {
            return 'M';
        
        } else {
            throw new Exception("Outside Kevin Specs!");;
        } 
    }
    // Desc: Determines color based on spectral type
    // Pre: O, B, A, F, G, K, M
    // Post: A hexadecimal color
    static public string DetermineColor (char SpectralType, StarMathConstants starConstants) {
        return SpectralType switch
        {
            'O' => starConstants.Stars.O.Color,
            'B' => starConstants.Stars.B.Color,
            'A' => starConstants.Stars.A.Color,
            'F' => starConstants.Stars.F.Color,
            'G' => starConstants.Stars.G.Color,
            'K' => starConstants.Stars.K.Color,
            'M' => starConstants.Stars.M.Color,
            _ => throw new Exception("Outside Color Specs!"),
        };
    }

}