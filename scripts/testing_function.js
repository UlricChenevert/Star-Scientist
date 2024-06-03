function function_test() {
    console.log("-----------------> Starting tests...");
    
    function check(a_function, value) {
        console.log(typeof(a_function));

        if (a_function.value != value) {
            console.log(`${a_function.name} does not return ${value}`)
        }
        
        console.log(`${a_function.name} returns ${value} successfully!`);
    }
    let test_star = {spectral_type:"B"};

    check(basic_info(test_star), "10000");

    console.log("-----------------> Tests completed!");
};

function sum(data, key) {
    let total = 0;
    if (data[key] != undefined) {
        return data[key]; // Break condition

    } else if ((typeof data != "object")) {
        return 0;

    } else {
        // Recursive step, gets all the sums of the child object
        for (let child of Object.values(data)) {
            total += sum(child, key); 
        }
        
        return total;
    }
}