//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//

"use strict";
import {UI} from './star_scientist_display.js';
import {calculate_luminosity, calculate_lifetime, calculate_temperature, determine_spectral_classification, determine_color} from './star_scientist_math.js';

function main() {
    let star = {
            'Custom': new Star(get_input("mass-input"), get_input("radius-input")),
            'Sun': new Star(1, 1),
            'BI 253': new Star(97.6, 13.9),
            'Phi Orionis': new Star(15.5, 6.3),
            'Epsilon Eridani': new Star(0.82, 0.735),
            'Alpha Coronae Borealis': new Star(2.58, 2.89),
            'Eta Arietis': new Star(1.21, 0.98),
            '70 Ophiuchi': new Star(0.90, 0.91),
            'Lacaille 8760': new Star(0.60, 0.51),
            'VB 10': new Star(0.0881, 0.1183),
    }[get_input('templates-input')];

    if (get_input('templates-input') != 'Custom') {
        document.getElementById('mass-input').setAttribute('disabled', 'true');
        document.getElementById('radius-input').setAttribute('disabled', 'true');
    } else {
        document.getElementById('mass-input').removeAttribute('disabled');
        document.getElementById('radius-input').removeAttribute('disabled');
    }
    

    round_data(star, 3);

    // Display
    let ui = new UI();
    ui.display_handler('star_info')(star.toObject());
    ui.display_handler('star_graphic')(star.toObject());

}

class Measurement {
    constructor (value, type, unit='', symbol='') {
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.symbol = symbol;
    }
}

class Star {
    constructor(mass_solar_units, radius_solar_units) {
        this.mass = new Measurement(mass_solar_units, 'Mass', 'M', '&#9737'); 
        this.radius = new Measurement(radius_solar_units, 'Radius', 'R', '&#9737');
        this.luminosity = new Measurement(calculate_luminosity(this.mass.value), 'Luminosity', 'L', '&#9737');
        this.lifetime = new Measurement(calculate_lifetime(this.mass.value, this.luminosity.value), 'Lifetime', 'yr');
        this.temperature = new Measurement(calculate_temperature(this.luminosity.value, this.radius.value), 'Temperature', 'K');
        this.spectral_classification = determine_spectral_classification(this.temperature.value);
        this.color = determine_color(this.spectral_classification);
    }

    toObject() {
        return {mass: this.mass, radius: this.radius, luminosity: this.luminosity, lifetime: this.lifetime, temperature: this.temperature, spectral_classification: this.spectral_classification, color: this.color};
    }
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
            // Ex 1: 1223.446557
            // Ex 2: 1.446557

            // Ex 1: 1223.446557 => size of 4
            // Ex 2: 1.446557 => size of 1
            // Gets the length of the integer digits
            var data_size = Math.round(data).toString().length;

            // Ex 1: 1220
            // Ex 2: 1.45
            // Rounds to that integer digit - significant_figures
            var data_rounded = Math.round(data/10**(data_size-significant_figures))*10**(data_size-significant_figures);
            
            return data_rounded;
        }, // Recursive break
        "string": () => {return data;}, // Recursive break
        "undefined": () => {return data;}, // Recursive break
    };

    return round_handler[(typeof data)]();
}

export default main();
window.main = main; // Special little tool I will save for later