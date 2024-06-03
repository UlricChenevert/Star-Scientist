//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//

"use strict";
import {display_star, display_star_info, UI} from './star_scientist_display.js';
import {calculate_luminosity, calculate_lifetime, calculate_temperature, determine_spectral_classification, determine_color} from './star_scientist_math.js';

function main() {

    let default_star = {
        mass_solar_units: get_input("mass-input"), // sun masses
        radius_solar_units:	get_input("radius-input"), // sun radiuses 
    };

    let basic_star_data = basic_info(default_star);

    round_data(basic_star_data, 3);

    // Display
    let ui = new UI();
    
    display_star_info(basic_star_data);
    //display_star(basic_star_data);
}

// Desc: Takes the mass and radius of the star and estimates the basic info about the star
// Pre: Object with mass_solar_units and radius_solar_units keys
// Post: Returns a object 
function basic_info(input_star) {
    if (input_star.mass_solar_units == undefined || input_star.radius_solar_units == undefined) alert("Missing object specifications for basic info!");

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

export default main();
window.main = main; // Special little tool I will save for later