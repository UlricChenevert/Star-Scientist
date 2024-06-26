import { constants, Stars, Utility } from './dependencies.js';

// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name: string) : Star {
    const star_template_raw = constants.templates;
    
    // Creates a template based on the template constants json file
    let template_build : template_build = {};

    for (let template of star_template_raw) {
        template_build[template['name']] = new Stars.Star(template['mass'], template['radius']);
    }

    return template_build[star_name];
}

export function sync_latest_input() {
    const old_input = JSON.parse(Utility.empty_value_checker("Getting item local storage", localStorage.getItem("input")));

    if (old_input) {
        constants.templates.unshift(old_input);
    }
}