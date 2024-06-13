//=========================================================================//
//                         Star Scientist Math                             //
//=========================================================================//

import {math_constants} from './core.js'

// Desc: Estimates the luminosity of a main sequence star
// Pre:  Mass in solar units
// Post: Luminosity in solar units
export function calculate_luminosity(mass) {
    
    // Throws a error if both values are known or not known
    if (!mass) throw new Error("Incorrect calculate_luminosity call!");

    // Solving for luminosity
    let star_luminosity = -1;

    // Approximated relationship
    // Comparisons in solar units

    //console.log(`Estimate ${mass**3.5}`) // General equation

    if (mass <= 0.43) {
        star_luminosity = 0.23*(mass**2.3);

    } else if (mass <= 2) {
        star_luminosity = mass**4;

    } else if (mass <= 55) {
        star_luminosity = 1.4*(mass**3.5);

    } else if (mass > 55) {
        star_luminosity = 3.2e4*mass;

    } else {
        throw new Error("calculate_luminosity outside of mass specs!");
    }
    
    return star_luminosity;
}

// Desc: Estimates the life spent on the main sequence
// Pre: Mass in solar units and luminosity in solar units
// Post: Lifetime in years
export function calculate_lifetime(mass, luminosity) {
    // Throws a error if both values are known or not known
    if (!mass || !luminosity) throw new Error("Incorrect calculate_lifetime call!");

    let star_lifetime = math_constants.sun.lifespan.value*(mass/luminosity);

    return star_lifetime;
}

// Desc: Estimates the temperature with the Stefan-Boltzmann Law
// Pre: luminosity in solar units and radius in solar units
// Post: Temperature in Kevin
export function calculate_temperature(luminosity, radius) {

    let star_temperature = math_constants.sun.temperature.value*(luminosity/(radius**2))**(1/4); //(luminosity/)^(1/4);
    return star_temperature;
}

// Desc: Determines spectral classification based on temperature
// Pre: Temperature in Kevin
// Post: A spectral classification (O, B, A, F, G, K, M)
export function determine_spectral_classification(temperature_kevin) {
    if (!temperature_kevin) throw new Error("Incorrect determine_spectral_classification call!");

    if (temperature_kevin > math_constants.stars.O.temperature.low) {
        return "O";

    } else if (temperature_kevin >= math_constants.stars.B.temperature.low) {
        return "B";

    } else if (temperature_kevin >= math_constants.stars.A.temperature.low) {
        return "A";

    } else if (temperature_kevin >= math_constants.stars.F.temperature.low) {
        return "F";

    } else if (temperature_kevin >= math_constants.stars.G.temperature.low) {
        return "G";

    } else if (temperature_kevin >= math_constants.stars.K.temperature.low) {
        return "K";

    } else if (temperature_kevin < math_constants.stars.M.temperature.high) {
        return "M";
    
    } else {
        return "Outside kevin specs!";
    } 
}

// Desc: Determines color based on spectral type
// Pre: O, B, A, F, G, K, M
// Post: A hexadecimal color
export function determine_color(spectral_classification) {
    if (!spectral_classification) throw new Error("Incorrect determine_color call!");

    return math_constants.stars[spectral_classification].color;
}
