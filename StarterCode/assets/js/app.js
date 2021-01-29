// @TODO: YOUR CODE HERE!
d3.csv("/assets/data/data.csv").then(function(stateData) {
    // Format the data
        stateData.forEach(function(data) {

            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });
