// Desc: Takes a object and rounds it to significant_figures-th digit
// Pre: an object data with objects, strings, and numbers and an int significant_figures
// Post: All integer data is rounded
export function round_data(data, significant_figures) {
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
