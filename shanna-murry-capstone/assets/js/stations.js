/***************************
    DATA
****************************/
let stations = [
    {
        name: "69th Street Terminal",
        line: "Market Line",
        stop: 0,
        westbound: mlTimes("06:00"),
        connections: "Amtrak Line"
    },

    {
        name: "40th Street Station",
        line: "Market Line",
        stop: 1,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
    },

    {
        name: "30th Street Station",
        line: "Market Line",
        stop: 2,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
        connections: "Airport Line"
    },

    {
        name: "Market Street Station/Market Line",
        line: "Market Line",
        stop: 3,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
    },

    {
        name: "2nd Street Station",
        line: "Market Line",
        stop: 4,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
    },

    {
        name: "Huntingdon Station",
        line: "Market Line",
        stop: 5,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
    },

    {
        name: "Tioga Station",
        line: "Market Line",
        stop: 6,
        eastbound: mlTimes("06:00"),
        westbound: mlTimes("06:00"),
    },

    {
        name: "Frankford Transportation Center",
        line: "Market Line",
        stop: 7,
        eastbound: mlTimes("06:00"),
        connections: "NJ Patco Line"
    },

    {
        name: "Broad Street",
        line: "Broad Line",
        stop: 0,
        southbound: blTimes("06:00"),
    },

    {
        name: "Chestnut Station",
        line: "Broad Line",
        stop: 1,
        northbound: blTimes("06:00"),
        southbound: blTimes("06:00"),
    },

    {
        name: "Walnut Station",
        line: "Broad Line",
        stop: 2,
        northbound: blTimes("06:00"),
        southbound: blTimes("06:00"),
    },

    {
        name: "Market Street Station/Broad Line",
        line: "Broad Line",
        stop: 3,
        northbound: blTimes("06:00"),
        southbound: blTimes("06:00"),
    },

    {
        name: "Girard Station",
        line: "Broad Line",
        stop: 4,
        northbound: blTimes("06:00"),
        southbound: blTimes("06:00"),
    },

    {
        name: "Jackson Station",
        line: "Broad Line",
        stop: 5,
        northbound: blTimes("06:00"),
        southbound: blTimes("06:00"),
    },

    {
        name: "South Street Station",
        line: "Broad Line",
        stop: 6,
        northbound: blTimes("06:00"),
    }
]

function mlTimes(start) {
    start = moment(`2020-01-01 ${start}:00`, moment.ISO_8601);
    let times = [];
    let min = 0;

    if (start)
        for (let i = 0; i <= 89; i++) {
            times.push(start.clone().add(min, 'minutes').format('hh:mma'));
            min = min + 12;
        };

    return times;
};

function blTimes(start) {
    start = moment(`2020-01-01 ${start}:00`, moment.ISO_8601);
    let times = [];
    let min = 0;

    if (start)
        for (let i = 0; i <= 53; i++) {
            times.push(start.clone().add(min, 'minutes').format('hh:mma'));
            min = min + 20;
        };

    return times;
};