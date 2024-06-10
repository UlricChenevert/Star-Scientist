//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//
"use strict";
import UI from './star_scientist_display.js';
import { calculate_luminosity, calculate_lifetime, calculate_temperature, determine_spectral_classification, determine_color } from './star_scientist_math.js';
function page_update(ui) {
    let mass = get_input('mass-input');
    let radius = get_input('radius-input');
    let template = get_input('templates-input');
    let star = template_to_star(template.value, [parseFloat(mass.value), parseFloat(radius.value)]);
    round_data(star, 3);
    sync_input({ container: mass, value: star.mass.value }, { container: radius, value: star.radius.value });
    lock_input(template.value != 'Custom', [mass, radius]);
    ui.display_handler('star_info')(star.toObject());
    ui.display_handler('star_graphic')(star.toObject());
}
class Measurement {
    constructor(value, type, unit = '', symbol = '') {
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
        return { mass: this.mass, radius: this.radius, luminosity: this.luminosity, lifetime: this.lifetime, temperature: this.temperature, spectral_classification: this.spectral_classification, color: this.color };
    }
}
// Desc: Gets input from input forms and returns the value
function get_input(container_id) {
    return document.getElementById(container_id);
}
function set_input(container, value) {
    container.setAttribute('value', value);
    console.log(document.cookie);
}
function sync_input(...args) {
    for (let arg of args) {
        set_input(arg.container, arg.value);
    }
}
function sync_cookies(container_ids) {
    for (let index = 0; index < container_ids.length; index++)
        if (get_cookie(container_ids[index]))
            document.getElementById(container_ids[index]).value = get_cookie(container_ids[index]);
}
// Desc: creates new star objects based on template or inputs
function template_to_star(template_input, measurement_inputs) {
    let star = {
        'Custom': new Star(measurement_inputs[0], measurement_inputs[1]),
        'Sun': new Star(1, 1),
        'BI 253': new Star(97.6, 13.9),
        'Phi Orionis': new Star(15.5, 6.3),
        'Epsilon Eridani': new Star(0.82, 0.735),
        'Alpha Coronae Borealis': new Star(2.58, 2.89),
        'Eta Arietis': new Star(1.21, 0.98),
        '70 Ophiuchi': new Star(0.90, 0.91),
        'Lacaille 8760': new Star(0.60, 0.51),
        'VB 10': new Star(0.0881, 0.1183),
    }[template_input];
    return star;
}
// Locks input when the user uses a template
function lock_input(lock_condition, inputs_to_lock) {
    if (lock_condition) {
        for (let index in inputs_to_lock) {
            inputs_to_lock[index].setAttribute('disabled', 'true');
        }
    }
    else {
        for (let index in inputs_to_lock) {
            inputs_to_lock[index].removeAttribute('disabled');
        }
    }
}
// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded
function round_data(data, significant_figures) {
    let round_handler = {
        "object": () => {
            // Recursive step
            for (var key in data) {
                if (!data.hasOwnProperty(key))
                    console.log(`Error! Round handler has unexpected key! ${key}`);
                data[key] = round_data(data[key], significant_figures);
            }
            return data;
        },
        "number": () => {
            return data.toPrecision(significant_figures);
        }, // Recursive break
        "string": () => { return data; }, // Recursive break
        "undefined": () => { return data; }, // Recursive break
    };
    return round_handler[(typeof data)]();
}
function set_cookie(key, value, age = 86400) {
    document.cookie = `${key}=${value}; max-age=${age}`;
}
function get_cookie(key, only_value = true) {
    const key_length = key.length;
    const cookie_jar = document.cookie;
    const base_index = cookie_jar.indexOf(' ' + key);
    const end_index = cookie_jar.indexOf('; ', base_index);
    const values = cookie_jar.slice(base_index + key_length + 2, end_index);
    return only_value ? values.split(' ')[0] : values;
}
window.onload = (e) => {
    let el = document.getElementById("options");
    let ui = new UI();
    page_update(ui);
    //sync_cookies(['mass-input', 'radius-input', 'templates-input'])
    el.addEventListener('input', () => {
        page_update(ui);
    });
};
