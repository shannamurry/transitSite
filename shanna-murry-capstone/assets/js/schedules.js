//picks first station and prints all departure times.  Station index does not matter as all times are the same.
for (i in stations[0]["westbound"]) {
    $('#marketTimes').append(`<span class="mx-md-4" style="display: inline-block; width: 5em">${stations[0]["westbound"][i]}</span>`)
}

for (let i = 4; i < $('#marketTimes>span').length; i++) {
    $(`#marketTimes>span:eq(${i})`).after(`<hr>`);
    i = i + 4;
}

//random broad line stations (all times are the same so index does not matter)
for (i in stations[9]["northbound"]) {
    $('#broadTimes').append(`<span class="mx-md-4" style="display: inline-block; width: 5em">${stations[9]["northbound"][i]}</span>`)
}

for (let i = 2; i < $('#broadTimes>span').length; i++) {
    $(`#broadTimes>span:eq(${i})`).after(`<hr>`);
    i = i + 2;
}

//turn top of the hour text blue
let regex = /\d{2}\:00\w{2}/

for (let i = 0; i < $('#marketTimes>span').length; i++) {
    if (regex.test($(`#marketTimes>span:eq(${i})`).text()) === true) {
        $(`#marketTimes>span:eq(${i})`).addClass('text-primary')
    } 
}

for (let i = 0; i < $('#broadTimes>span').length; i++) {
    if (regex.test($(`#broadTimes>span:eq(${i})`).text()) === true) {
        $(`#broadTimes>span:eq(${i})`).addClass('text-primary')
    }
}