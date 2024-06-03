// Desc: Estimates the luminosity of a main sequence star
// Pre:  Mass in solar units
// Post: Luminosity in solar units
export function calculate_luminosity(mass) {
    
    // Throws a error if both values are known or not known
    if (!mass) alert("Incorrect calculate_luminosity call!");

    // Solving for luminosity
    let star_luminosity = "Empty Value";

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
        star_luminosity = "Outside mass specs!";
    }
    
    return star_luminosity;
}

// Desc: Estimates the life spent on the main sequence
// Pre: Mass in solar units and luminosity in solar units
// Post: Lifetime in years
export function calculate_lifetime(mass, luminosity) {
    // Throws a error if both values are known or not known
    if (!mass || !luminosity) alert("Incorrect calculate_lifetime call!");

    const SUN_LIFESPAN = 1e10; // in years

    let star_lifetime = SUN_LIFESPAN*(mass/luminosity);

    return star_lifetime;
}

// Desc: Estimates the temperature with the Stefan-Boltzmann Law
// Pre: luminosity in solar units and radius in solar units
// Post: Temperature in Kevin
export function calculate_temperature(luminosity, radius) {
    const SUN_TEMPERATURE = 5.772e3; // in kevin

    let star_temperature = SUN_TEMPERATURE*(luminosity/(radius**2))**(1/4); //(luminosity/)^(1/4);
    return star_temperature;
}

// Desc: Determines spectral classification based on temperature
// Pre: Temperature in Kevin
// Post: A spectral classification (O, B, A, F, G, K, M)
export function determine_spectral_classification(temperature_kevin) {
    if (!temperature_kevin) alert("Incorrect determine_spectral_classification call!");

    const TEMPERATURE_LOWER_BOUND_OF_O_TYPE_STAR = 3.3e4;
    const TEMPERATURE_LOWER_BOUND_OF_B_TYPE_STAR = 9.7e3;
    const TEMPERATURE_LOWER_BOUND_OF_A_TYPE_STAR = 7.2e3;
    const TEMPERATURE_LOWER_BOUND_OF_F_TYPE_STAR = 5.7e3;
    const TEMPERATURE_LOWER_BOUND_OF_G_TYPE_STAR = 4.9e3;
    const TEMPERATURE_LOWER_BOUND_OF_K_TYPE_STAR = 3.4e3;
    const TEMPERATURE_UPPER_BOUND_OF_M_TYPE_STAR = TEMPERATURE_LOWER_BOUND_OF_K_TYPE_STAR;

    if (temperature_kevin > TEMPERATURE_LOWER_BOUND_OF_O_TYPE_STAR) {
        return "O";

    } else if (temperature_kevin >= TEMPERATURE_LOWER_BOUND_OF_B_TYPE_STAR) {
        return "B";

    } else if (temperature_kevin >= TEMPERATURE_LOWER_BOUND_OF_A_TYPE_STAR) {
        return "A";

    } else if (temperature_kevin >= TEMPERATURE_LOWER_BOUND_OF_F_TYPE_STAR) {
        return "F";

    } else if (temperature_kevin >= TEMPERATURE_LOWER_BOUND_OF_G_TYPE_STAR) {
        return "G";

    } else if (temperature_kevin >= TEMPERATURE_LOWER_BOUND_OF_K_TYPE_STAR) {
        return "K";

    } else if (temperature_kevin < TEMPERATURE_UPPER_BOUND_OF_M_TYPE_STAR) {
        return "M";
    
    } else {
        return "Outside kevin specs!";
    } 
}

// Desc: Determines color based on spectral type
// Pre: O, B, A, F, G, K, M
// Post: A hexadecimal color
export function determine_color(spectral_classification) {
    if (!spectral_classification) alert("Incorrect determine_color call!");

    let star_colors = {
        O : "rgb(146, 181, 255)",
        B : "rgb(162, 192, 255)",
        A : "rgb(162, 192, 255)",
        F : "rgb(249, 245, 255)",
        G : "rgb(255, 237, 227)",
        K : "rgb(255, 218, 181)",
        M : "rgb(255, 181, 108)"
    };

    return star_colors[spectral_classification];
}