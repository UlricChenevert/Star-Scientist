//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//

"use strict";

function main() {

    let test_star = {
        mass_kilograms: 1.8079442e30, // kg
        radius_solar_units: 0.8591 // km
    };

    console.log(test_star);

    console.log(basic_info(test_star));
}

// Desc: Estimates the luminosity of a main sequence star
// Pre:  Mass in kg
// Post: Luminosity in watts
function calculate_luminosity(mass) {
    const SUN_MASS = 1.9885e30; // in kilograms
    const SUN_LUMINOSITY = 3.828e26; // in watts
    
    // Throws a error if both values are known or not known
    if (!mass) alert("Incorrect function call!");

    // Solving for luminosity
    let star_luminosity = "Empty Value";

    // Approximated relationship
    if (mass <= 0.43 * SUN_MASS) {
        star_luminosity = ((mass/SUN_MASS)**2.3)*0.23*SUN_LUMINOSITY;

    } else if (mass <= 2 * SUN_MASS) {
        star_luminosity = ((mass/SUN_MASS)**4)*SUN_LUMINOSITY;

    } else if (mass <= 55 * SUN_MASS) {
        star_luminosity = ((mass/SUN_MASS)**3.5)*1.4*SUN_LUMINOSITY;

    } else if (mass > 55 * SUN_MASS) {
        star_luminosity = ((mass/SUN_MASS)*3.2e4);

    } else {
        star_luminosity = "Outside mass specs!";
    }
    
    return star_luminosity;
}

// Desc: Estimates the mass of a main sequence star
// Pre:  Luminosity in watts
// Post: Mass in kg 
function calculate_mass(luminosity) {
    const SUN_MASS = 1.9885e30; // in kilograms
    const SUN_LUMINOSITY = 3.828e26; // in watts
    const n = 3.5; // Referenced as "exponent" has to do with the relationship between star mass and star mass consumption rate (only for main sequence stars)

    // Throws a error if both values are known or not known
    if (!luminosity) alert("Incorrect function call!");

    // Solving for mass
    let star_mass = (luminosity/SUN_LUMINOSITY)**(1/n)*SUN_MASS;
    return star_mass;
}

// Desc: Estimates the life spent on the main sequence
// Pre: Mass in kg and luminosity in watts
// Post: Lifetime in years
function calculate_lifetime(mass, luminosity) {
    const SUN_MASS = 1.9885e30; // in kilograms
    const SUN_LUMINOSITY = 3.828e26; // in watts
    const SUN_LIFESPAN = 1e10; // in years

    // Convert into solar units
    mass = mass/SUN_MASS;
    luminosity = luminosity/SUN_LUMINOSITY;

    let star_lifetime = SUN_LIFESPAN*(mass/luminosity);

    return star_lifetime;
}

// Desc: Estimates the temperature with the Stefan-Boltzmann Law
// Pre: luminosity in watts and radius in km
// Post: Temperature in Kevin
function calculate_temperature(luminosity, radius) {
    const SUN_TEMPERATURE = 5.772e3; // in kevin
    const SUN_LUMINOSITY = 3.828e26; // in watts

    console.log(luminosity/SUN_LUMINOSITY);
    console.log(radius);

    let star_temperature = SUN_TEMPERATURE*((luminosity)/(radius**2*SUN_LUMINOSITY))**(0.25); //(luminosity/)^(1/4);
    return star_temperature;
}

// Desc: Determines spectral classification based on temperature
// Pre: Temperature in Kevin
// Post: A spectral classification (O, B, A, F, G, K, M)
function determine_spectral_classification(temperature_kevin) {
    if (temperature_kevin >= 3.3e4) {
        return "O";

    } else if (temperature_kevin >= 1e4) {
        return "B";

    } else if (temperature_kevin >= 7.3e3) {
        return "A";

    } else if (temperature_kevin >= 6e4) {
        return "F";

    } else if (temperature_kevin >= 5.3e4) {
        return "G";

    } else if (temperature_kevin >= 3.9e3) {
        return "K";

    } else if (temperature_kevin < 2.3e3) {
        return "M";
    
    } else {
        return "Outside kevin specs!";
    } 
}

// Desc: Determines color based on spectral type
// Pre: O, B, A, F, G, K, M
// Post: A hexadecimal color
function determine_color(spectral_classification) {
    let star_colors = {
        O : "#92B5FF",
        B : "#A2C0FF",
        A : "#D5E0FF",
        F : "#F9F5FF",
        G : "#FFEDE3",
        K : "#FFDAB5",
        M : "#FFB56C"
    };

    return star_colors[spectral_classification];
}

// Desc: Takes the mass and radius of the star and estimates the basic info about the star
// Pre: Object with mass_kilograms and radius_solar_units keys
// Post: Returns a object 
function basic_info(input_star) {
    const SUN_RADIUS = 6.963e5; // in km

    if (input_star.mass_kilograms == undefined || input_star.radius_solar_units == undefined) alert("Missing object specifications for basic info!");

    // Units are in Kevin
    let spectral_classification = {
        O : {low: 3.3e4, high: 1e5},
        B : {low: 1e4, high: 3.3e4},
        A : {low: 7.3e3, high: 1e4},
        F : {low: 6e4, high: 7.3e3},
        G : {low: 5.3e4, high: 6e4},
        K : {low: 3.9e3, high: 5.3e4},
        M : {low: 2.3e3, high: 3.9e3}
    };

    let basic_info = {mass_kilograms: input_star.mass_kilograms, radius_solar_units: input_star.radius_solar_units};

    //Calculated values
    basic_info.luminosity_watts = calculate_luminosity(input_star.mass_kilograms);
    basic_info.lifetime_years = calculate_lifetime(basic_info.mass_kilograms, basic_info.luminosity_watts);
    basic_info.temperature_kevin = calculate_temperature(basic_info.luminosity_watts, basic_info.radius_solar_units); 
    basic_info.spectral_classification = determine_spectral_classification(basic_info.temperature_kevin);
    basic_info.color = determine_color(basic_info.spectral_classification);
    
    return basic_info;
}