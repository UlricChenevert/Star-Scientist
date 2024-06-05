function function_test() {
    console.log("-----------------> Starting tests...");
    
    function check(a_function, value) {
        console.log(typeof(a_function));

        if (a_function.value != value) {
            console.log(`${a_function.name} does not return ${value}`)
        }
        
        console.log(`${a_function.name} returns ${value} successfully!`);
    }

    console.log("-----------------> Tests completed!");
};
