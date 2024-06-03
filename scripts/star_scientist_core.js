//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//

"use strict";

function main() {

    let default_star = {
        mass_solar_units: get_input("mass-input"), // sun masses
        radius_solar_units:	get_input("radius-input"), // sun radiuses 
    };

    let basic_star_data = basic_info(default_star);

    // Display
    round_data(basic_star_data, 3);

    update_canvas('chromosphere-layer', 'clear');
    display_star_info(basic_star_data);
    display_star(basic_star_data);
}

// Desc: Estimates the luminosity of a main sequence star
// Pre:  Mass in solar units
// Post: Luminosity in solar units
function calculate_luminosity(mass) {
    
    // Throws a error if both values are known or not known
    if (!mass) alert("Incorrect function call!");

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
// Pre: Mass in solar units and luminosity in solar units
// Post: Lifetime in years
function calculate_lifetime(mass, luminosity) {
    const SUN_LIFESPAN = 1e10; // in years

    let star_lifetime = SUN_LIFESPAN*(mass/luminosity);

    return star_lifetime;
}

// Desc: Estimates the temperature with the Stefan-Boltzmann Law
// Pre: luminosity in solar units and radius in solar units
// Post: Temperature in Kevin
function calculate_temperature(luminosity, radius) {
    const SUN_TEMPERATURE = 5.772e3; // in kevin

    let star_temperature = SUN_TEMPERATURE*(luminosity/(radius**2))**(1/4); //(luminosity/)^(1/4);
    return star_temperature;
}

// Desc: Determines spectral classification based on temperature
// Pre: Temperature in Kevin
// Post: A spectral classification (O, B, A, F, G, K, M)
function determine_spectral_classification(temperature_kevin) {
    if (temperature_kevin > 3.3e4) {
        return "O";

    } else if (temperature_kevin >= 9.7e3) {
        return "B";

    } else if (temperature_kevin >= 7.2e3) {
        return "A";

    } else if (temperature_kevin >= 5.7e3) {
        return "F";

    } else if (temperature_kevin >= 4.9e3) {
        return "G";

    } else if (temperature_kevin >= 3.4e3) {
        return "K";

    } else if (temperature_kevin < 3.4e3) {
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
// Pre: Object with mass_solar_units and radius_solar_units keys
// Post: Returns a object 
function basic_info(input_star) {
    const SUN_RADIUS = 6.963e5; // in km
    
    const SUN_LUMINOSITY = 3.828e26; // in watts

    if (input_star.mass_solar_units == undefined || input_star.radius_solar_units == undefined) alert("Missing object specifications for basic info!");

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

    let basic_info = {mass_solar_units: input_star.mass_solar_units, radius_solar_units: input_star.radius_solar_units};

    //Calculated values
    basic_info.luminosity_solar_units = calculate_luminosity(basic_info.mass_solar_units); // This estimate really skews the rest of the data
    basic_info.lifetime_years = calculate_lifetime(basic_info.mass_solar_units, basic_info.luminosity_solar_units);
    basic_info.temperature_kevin = calculate_temperature(basic_info.luminosity_solar_units, basic_info.radius_solar_units); 
    basic_info.spectral_classification = determine_spectral_classification(basic_info.temperature_kevin);
    basic_info.color = determine_color(basic_info.spectral_classification);
    
    return basic_info;
}

// Desc: Gets input from input forms and returns the value
function get_input(container_id) {
    return document.getElementById(container_id).value;
}

// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded
function round_data(data, significant_figures) {
    let round_handler = {
        "object": () => {
            // Recursive step
            for (var key in data) {
                if (!data.hasOwnProperty(key)) console.log(`Error! Round handler has unexpected key! ${key}`);
                    
                data[key] = round_data(data[key], significant_figures); 
            }
            return data;
        }, 
        "number": () => {
            var data_size = Math.round(data).toString().length;
            var data_rounded = Math.round(data/10**(data_size-significant_figures))*10**(data_size-significant_figures);
            
            return (data_rounded);
        }, // Recursive break
        "string": () => {return data;}, // Recursive break
        "undefined": () => {return data;}, // Recursive break
    };

    return round_handler[(typeof data)]();
}

// Desc: Slaps on a opacity to a rgb string
// Pre: rgb string
// Post: rgba string with alterable opacity
function alter_opacity(color, amount) {
    return `rgba(${color.slice(4, -1)}, ${amount})`;
}

// Converts hexadecimal color to color array
function hexadecimal_color_to_colors (code) {
    let hexadecimal_to_decimal = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
    };
    
    let decimal_numbers = []

    for (let character of code) {
        if (character == '#') continue;
        decimal_numbers.push(hexadecimal_to_decimal[character]);
    }

    // Converts the color
    let red = decimal_numbers[0] * 16 + decimal_numbers[1];
    let green = decimal_numbers[2] * 16 + decimal_numbers[3];
    let blue = decimal_numbers[4] * 16 + decimal_numbers[5];

    return [red, green, blue];
}

// Desc: returns an object with darker/lighter color variants
// Pre: hexadecimal color
// Post: object with rgb colors
function create_color_palette(color) { 
    let base_color = hexadecimal_color_to_colors(color);
    
    return {
        base: `rgb(${base_color[0]}, ${base_color[1]}, ${base_color[2]})`,
        
        dark: `rgb(${Math.round(base_color[0]*0.9)}, ${Math.round(base_color[1]*0.9)}, ${Math.round(base_color[2]*0.9)})`,
        darker: `rgb(${Math.round(base_color[0]*0.8)}, ${Math.round(base_color[1]*0.8)}, ${Math.round(base_color[2]*0.8)})`,
        
        light: `rgb(${Math.round(base_color[0]*1.1)}, ${Math.round(base_color[1]*1.1)}, ${Math.round(base_color[2]*1.1)})`,
        lighter: `rgb(${Math.round(base_color[0]*1.5)}, ${Math.round(base_color[1]*1.5)}, ${Math.round(base_color[2]*1.5)})`,
    };
}

function update_canvas (canvas_id, type) {
    const star_container = document.getElementById(canvas_id);
    const brush = star_container.getContext("2d");

    let type_handler = {
        clear: () => {
            brush.fillStyle = "black";
            brush.fillRect(0, 0, star_container.getAttribute("width"), star_container.getAttribute("height"), ); 
            brush.stroke();
            return;},
    };

    type_handler[type]();
}

function draw_chromosphere (brush, height, width, radius, color_palette) {
    const shiny_size = radius*0.25;

    // Creating the gradient
    const gradient = brush.createRadialGradient(width/2, height/2, shiny_size, width/2, height/2, radius);
    gradient.addColorStop(0, color_palette.lighter);
    gradient.addColorStop(0.7, color_palette.light);
    gradient.addColorStop(0.9, color_palette.base);
    gradient.addColorStop(1, alter_opacity(color_palette.base, 0.0));

    // Applying the gradient
    brush.fillStyle = gradient;
    brush.fillRect(0, 0, width, height);
}

function draw_prominence (brush, height, width, radius) {

}

function draw_corona (brush, height, width, radius, color_palette) {
    const length = radius*2;

    const gradient = brush.createRadialGradient(width/2, height/2, radius, width/2, height/2, radius+length);
    gradient.addColorStop(0, color_palette.darker);
    gradient.addColorStop(0.5, 'rgb(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgb(0, 0, 0, 0)');
    
    brush.fillStyle = gradient;
    brush.fillRect(0, 0, width, height);

}

function display_star(star_info) {
    const star_container = document.getElementById("chromosphere-layer"); // FIX ME <--- Separate layers
    const brush = star_container.getContext("2d");

    let height = star_container.getAttribute("height");
    let width = star_container.getAttribute("width");
    let radius = star_info.radius_solar_units * 20;
    let color_palette = create_color_palette(star_info.color);

    brush.beginPath();

    draw_corona (brush, height, width, radius, color_palette); // Layer 2
    draw_prominence (brush, height, width, radius); // Layer 2
    draw_chromosphere(brush, height, width, radius, color_palette); // Layer 1
    
    brush.stroke();
}

function display_star_info(star_info) {
    document.getElementById("metrics").innerHTML = `
        <div>Mass: ${star_info.mass_solar_units} M<sub>&#9737</sub></div>
        <div>Radius: ${star_info.radius_solar_units} R<sub>&#9737</sub></div>
        <div>Luminosity: ${star_info.luminosity_solar_units} L<sub>&#9737</sub></span></div>
        <div>Lifetime: ${star_info.lifetime_years} yr</div>
        <div>Temperature: ${star_info.temperature_kevin} K</div>
        <div>Spectral Classification: ${star_info.spectral_classification}</div>
    `;
}
