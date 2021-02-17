/***************************
    GLOBAL VARIABLES
****************************/
let thisIndex = null;
let destIndex = null;
let currentLocation = null;
let destination = null;
let connections = [];
let formattedDeparture = null;
let results = []
let results2 = []
let connectionIndex = null;


/***************************
    ON LOAD
****************************/
//populates current location with all station names
for (i in stations) {
    $('#currentLocation').append(`<option class="currentOption" id="${stations[i]["stop"]}currentOpt">${stations[i]["name"]}</option>`);
    
    //push connections into array
    if (stations[i].hasOwnProperty('connections')) connections.push(stations[i]['connections'])
};//end of for

/***************************
    EVENT LISTENERS
****************************/
//Current location
$('#currentLocation').on("change", function () {

    //remove danger border if not blank
    if ($(this).text()) {
        $(this).removeClass('border-danger');
        $(this).next().next().removeClass('border-danger');
    };

    $('#minutes').html('');
    $('#destination').removeAttr('disabled');
    $('#hours').removeAttr('disabled');

    //populates the hours dropdown
    $('#hours').html(`
        <option value="hoursBlank"></option>
        <option value="">01</option>
        <option value="">02</option>
        <option value="">03</option>
        <option value="">04</option>
        <option value="">05</option>
        <option value="">06</option>
        <option value="">07</option>
        <option value="">08</option>
        <option value="">09</option>
        <option value="">10</option>
        <option value="">11</option>
        <option value="">12</option>
    `);

    //populates destination dropdown but does NOT include current location selection, i.e. current loc. and dest. cannot both be Market Street
    $('#destination').html('');

    for (i in stations) {
        if (stations[i]["name"] !== $('.currentOption:selected').text()) $('#destination').append(`<option id="${stations[i]["stop"]}destOpt">${stations[i]["name"]}</option>`);
        
        //i.e. you cannot be at 30th street station and pick airport line as destination
        if (stations[i].hasOwnProperty('connections') && $('#currentLocation>option:selected').text() !== stations[i]["name"]) $('#destination').append(`<option>${stations[i]["connections"]}</option>`); 
    };//end of for
});//end of current location change event


// Destination
//You cannot be going from Market Street/Market line to Market Street/Broad Line
$('#destination').on("focus", function () {
    if ($('#currentLocation>option:selected').text() === "Market Street Station/Market Line") $(`#destination>option:contains('Market Street Station/Broad Line')`).remove();
    else if ($('#currentLocation>option:selected').text() === "Market Street Station/Broad Line") $(`#destination>option:contains('Market Street Station/Market Line')`).remove();
});


// hours
$('#hours').on("change", function () {
    results = []
    //remove danger border if not blank
    if ($(this).text()) $(this).removeClass('border-danger');

    $('#minutes').html(``);

    currentLocation = $('#currentLocation').val();
    destination = $('#destination').val();

    // finds the index # of the object in stations
    for (let i = 0; i < stations.length; i++) {
        if (stations[i]["name"] === currentLocation) thisIndex = i;
        //find the index of the destination in stations
        if (stations[i]["name"] === destination) destIndex = i;
    };

    //sets correct index numbers for connections - correlates them with correct station and index
    if (destination === "Amtrak Line") destIndex = 0;
    else if (destination === "Airport Line") destIndex = 2;
    else if (destination === "NJ Patco Line") destIndex = 7;

    let hours = $('#hours>option:selected').text();
    let regex = new RegExp(hours);

    if (thisIndex < 8 && destIndex > 7) connectionIndex = 3;
    else if (thisIndex > 7 && destIndex < 8) connectionIndex = 11;

    let direction = null;
    let relevantIndex = null;
    
    if (connectionIndex !== null) relevantIndex = connectionIndex;
    else relevantIndex = destIndex

    //IF THE TRAIN IS ORIGINATING FROM A MARKET LINE STOP
    if (thisIndex < 8) {
        //if the train is traveling EAST (compares indexes)
        if (thisIndex > relevantIndex) direction = 'eastbound'
        else direction = 'westbound'
    }
    //IF THE TRAIN IS ORIGINATING FROM A BROAD LINE STOP
    else {
        if (thisIndex > relevantIndex) direction = 'northbound'
        else direction = 'southbound'
    }

    for (i in stations[thisIndex][direction]) {
        if (regex.test(stations[thisIndex][direction][i])) {
            results.push(stations[thisIndex][direction][i].match(regex));
        }
    }

    //splice minutes
    for (i in results) {
        results[i] = results[i].input.split('');
        results[i] = results[i].splice(3, 2);
        results[i] = results[i].join('');
    };

    //remove the duplicates
    results = results.sort();
    for (let i = 0; i < results.length; i++) {
        if (results[i] === results[i + 1]) {
            results.splice(i, 1);
            i--;
        };
    };

    //enable the remaining dropdowns
    $('#minutes').removeAttr('disabled');
    $('#ampm').removeAttr('disabled');

    //populate the minutes dropdown
    $('#minutes').append(`<option class="blank"></option>`);

    for (i in results) $('#minutes').append(`<option>${results[i]}</option>`);
});//END OF #HOURS CHANGE EVENT LISTENER

$('#minutes').on("change", function () {
    results2 = []

    //remove danger border if not blank
    if ($(this).text()) {
        $(this).removeClass('border-danger');
        $(this).next().removeClass('border-danger');
    };

    //Reset the am/pm select-box if minutes are changed
    $('#ampm').html('');

    //this regex combines the entire time string with the exception of am/pm
    let minutes = $('#hours>option:selected').text().concat(":" + $('#minutes>option:selected').text());
    let regex2 = new RegExp(minutes);

    let direction = null;
    let relevantIndex = null;
    if (connectionIndex !== null) relevantIndex = connectionIndex;
    else relevantIndex = destIndex

    //IF THE TRAIN IS ORIGINATING FROM A MARKET LINE STOP
    if (thisIndex < 8) {
        //if the train is traveling EAST (compares indexes)
        if (thisIndex > relevantIndex) direction = 'eastbound'
        else direction = 'westbound'
    }
    //IF THE TRAIN IS ORIGINATING FROM A BROAD LINE STOP
    else {
        if (thisIndex > relevantIndex) direction = 'northbound'
        else direction = 'southbound'
    }

    //look for regex matches and push into results
    for (i in stations[thisIndex][direction]) {
        if (regex2.test(stations[thisIndex][direction][i])) {
            results2.push(stations[thisIndex][direction][i].match(regex2));
        }
    }
    
    //splice am/pm
    for (i in results2) {
        results2[i] = results2[i].input.split('');
        results2[i] = results2[i].splice(5, 2);
        results2[i] = results2[i].join('');
    };

    //populate am/pm drop down
    results2 = results2.sort();
    for (i in results2) $('#ampm').append(`<option>${results2[i]}</option>`);
});//end of minutes listener


//remove danger border if not blank
$('#ampm').on("change", function () {if ($(this).text()) $(this).removeClass('border-danger')})

//Get route button
$('.getRouteBtn').on("click", function () {

    //determine if all fields are valid selections
    let isBlank = false;
    $('.form-control').each(function() {
        if (!$(this).text()) {
            isBlank = true
        }
    })
    //FORM VALIDATION
    if (isBlank) {
        $('.form-control').each(function () {
            if (!$(this).find('option:selected').text()) {
                $(this).addClass('border-danger')
            };
        });

        $('.validationWarning').html(`<small class="text-danger">All fields are required</small>`);
    }
    else {
        //routes connection destinations to market street station
        if (connections.includes(destination)) {
            switch (destination) {
                case 'Amtrak Line':
                    destination = '69th Street Terminal';
                    destIndex = 0;
                    $('.connectionRoute').html(`You can connect to the Amtrak Line at this station.`)
                    break;
                case 'Airport Line':
                    destination = '30th Street Station';
                    destIndex = 2;
                    $('.connectionRoute').html(`You can connect to the Amtrak Line at this station.`)
                    break;
                case 'NJ Patco Line':
                    destination = 'Frankford Transportation Center';
                    destIndex = 7;
                    $('.connectionRoute').html(`You can connect to the Amtrak Line at this station.`)
                    break;
            }//end of switch
        }//end of if

        $('.routePlanner').hide();

        let departureTime = `${$('#hours>option:selected').text()}:${$('#minutes>option:selected').text()}${$('#ampm>option:selected').text()}`;

        //convert ot moment format
        let formattedDeparture = moment(`${departureTime}`, 'hh:mma').format('hh:mma')

        $('.thisStation').text(currentLocation);
        $('.thisTime').text(departureTime);
        $('.destinationName').text(destination);

        $('.destinationTime').text(arrivalTime(thisIndex, destIndex, formattedDeparture, "line"));

        //TRAVEL ON MARKET LINE
        if (thisIndex < 8 && destIndex < 8) {
            $('.routes').show();

            //find direction of trip and next three departure times
            if (thisIndex > destIndex) {
                $('#thisDirection').html('east');
                let indexOfTime = stations[thisIndex]["eastbound"].indexOf(formattedDeparture);
                $('#nextThreeTimes').html(`<div><span><span class="fa fa-clock"></span>${stations[thisIndex]["eastbound"][indexOfTime + 1]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["eastbound"][indexOfTime + 2]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["eastbound"][indexOfTime + 3]}</span></div>`);
            } else {
                $('#thisDirection').html('west');
                let indexOfTime = stations[thisIndex]["westbound"].indexOf(formattedDeparture);
                $('#nextThreeTimes').html(`<div><span><span class="fa fa-clock"></span>${stations[thisIndex]["westbound"][indexOfTime + 1]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["westbound"][indexOfTime + 2]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["westbound"][indexOfTime + 3]}</span></div>`);
            }
        }
        //Travel on Broad Line
        else if (thisIndex > 7 && destIndex > 7) {
            $('.routes').show();

            //find direction of trip and next three departure times
            if (thisIndex > destIndex) {
                $('#thisDirection').html('north');
                let indexOfTime = stations[thisIndex]["northbound"].indexOf(formattedDeparture);
                $('#nextThreeTimes').html(`<div><span><span class="fa fa-clock"></span>${stations[thisIndex]["northbound"][indexOfTime + 1]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["northbound"][indexOfTime + 2]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["northbound"][indexOfTime + 3]}</span></div>`);
            } else {
                $('#thisDirection').html('south');
                let indexOfTime = stations[thisIndex]["southbound"].indexOf(formattedDeparture);
                $('#nextThreeTimes').html(`<div><span><span class="fa fa-clock"></span>${stations[thisIndex]["southbound"][indexOfTime + 1]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["southbound"][indexOfTime + 2]}</span></div><div><span><span class="fa fa-clock"></span>${stations[thisIndex]["southbound"][indexOfTime + 3]}</span></div>`);
            }
        }
        //IF TRAVEL REQUIRES USE OF MORE THAN ONE LINE
        else {
            $('.connectionRoutes').show();

            //Departure location is from Market Line
            if (thisIndex < 8) {
                destIndex = 3;
                $('.lineName').text('Broad Line');
            }
            else {
                destIndex = 11;
                $('.lineName').text('Market Line');
            }

            let destTime = arrivalTime(thisIndex, destIndex, formattedDeparture, "line");
            $('.destinationTime').text(destTime);

            destArr = destTime.split('');
            let min = destArr.splice(3, 2);
            min = min.join('');
            min = parseInt(min);
            destTime = moment(destTime, `hh:mma`);
            let destTimeClone = destTime.clone()
            let difference = 0;

            //connection is Broad Line
            if (thisIndex < 8) {
                //Finds connection train time for broad street line 
                if (min > 40) difference = 60 - min;
                else if (min > 20) difference = 40 - min;
                else difference = 20 - min;
                
                //Reset index to market street Station/Broad Line
                thisIndex = 11;
            }
            //Connection is Market Line
            else {
                //Finds connection train time for market street line
                if (min > 47) difference = 60 - min;
                else if (min > 35) difference = 48 - min;
                else if (min > 23) difference = 36 - min;
                else if (min > 11) difference = 24 - min;
                else difference = 24 - min;
                
                //Reset index to market street Station/Market Line
                thisIndex = 3;
            }
            
            destTimeClone = destTime.add(difference, 'minutes').format('hh:mma');
            
            $('.connectTimeDepart').text(destTimeClone);

            //resets the destination index back to original if it was changed due to connection
            for (let i = 0; i < stations.length; i++) {
                if (stations[i]["name"] === destination) destIndex = i;
            }

            if (thisIndex < 8 && destIndex < 8) {
                if (thisIndex > destIndex) $('#connectDirection').text('east');
                else $('#connectDirection').text('west');
            }
            else {
                if (thisIndex > destIndex) $('#connectDirection').text('north');
                else $('#connectDirection').text('south');
            }

            $('#connectTimeArrive').text(arrivalTime(thisIndex, destIndex, destTimeClone, "line"));
        }
    }
});//END OF GET ROUTE BUTTON EVENT LISTENER


/***************************
    FUNCTIONS
****************************/
function arrivalTime(index1, index2, time, prop) {
    if (stations[index1][prop] === "Market Line" && stations[index2][prop] === "Market Line") {
        if (index1 > index2) {
            let difference = index1 - index2;
            let travelTime = difference * 12;
            let arrivalTime = moment(`${time}`, 'hh:mma').add(travelTime, 'minutes')
            return arrivalTime.format('hh:mma')
        } else {
            let difference = index2 - index1;
            let travelTime = difference * 12;
            let arrivalTime = moment(`${time}`, 'hh:mma').add(travelTime, 'minutes')
            return arrivalTime.format('hh:mma')
        }
    }
    if (stations[index1][prop] === "Broad Line" && stations[index2][prop] === "Broad Line") {
        if (index1 > index2) {
            let difference = index1 - index2;
            let travelTime = difference * 20;
            let arrivalTime = moment(`${time}`, 'hh:mma').add(travelTime, 'minutes')
            return arrivalTime.format('hh:mma')
        } else {
            let difference = index2 - index1;
            let travelTime = difference * 20;
            let arrivalTime = moment(`${time}`, 'hh:mma').add(travelTime, 'minutes')
            return arrivalTime.format('hh:mma')
        }
    }
}