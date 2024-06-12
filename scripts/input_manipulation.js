import { data_layer, Star } from './core.js';
// Desc: Gets input from input forms and returns the value
export function get_input(container_id) {
    return document.getElementById(container_id);
}
function set_input(container, value) {
    if (container.getAttribute('disabled'))
        container.removeAttribute('disabled');
    container.value = value;
}
export function sync_input(...args) {
    for (let arg of args) {
        set_input(arg.container, arg.value);
    }
}
export function sync_local_storage_to_container(...container_ids) {
    for (let container_id of container_ids) {
        const key = container_id;
        const value = localStorage.getItem(key);
        if (value)
            get_input(key).value = value;
    }
}
export function sync_container_to_local_storage(...container_ids) {
    for (let container_id of container_ids) {
        const key = container_id;
        const value = get_input(container_id).value;
        localStorage.setItem(key, value);
    }
}
// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name, measurement_inputs) {
    const star_template_raw = data_layer["star-templates"];
    let templates = {};
    for (let index in star_template_raw) {
        templates[star_template_raw[index]['name']] = new Star(parseFloat(star_template_raw[index]['mass']), parseFloat(star_template_raw[index]['radius']));
    }
    return templates[star_name];
}
// Locks input when the user uses a template
export function lock_input(lock_condition, inputs_to_lock) {
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
