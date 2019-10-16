
/*** COMPONENT GENERATOR ***/

const generateComponent = (request, target, type) => {
    let components = {
        header: (request, target) => {
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText);

                    data.queryResponseData.rows[0][3] = Math.round(
                        data.queryResponseData.rows[0][3]
                    );
                    data.queryResponseData.rows[0][4] =
                        (data.queryResponseData.rows[0][4] * 100).toFixed(2) + "%";

                    let htmlElements = "";

                    for (let i = 0; i < data.queryResponseData.headers.length; i++) {
                        htmlElements +=
                            '<div class="col-sm px-1 my-3">' +
                                '<div class="card p-2">' +
                                    "<h1 class='mb-0 display-4 display-5'>" + data.queryResponseData.headers[i] + "</h1>" +
                                    "<hr class='my-1'>" +
                                    "<h2 class='my-3 text-center'>" + data.queryResponseData.rows[0][i] + "</h2>" +
                                "</div>" +
                            "</div>";
                    }
                    document.getElementById(target).innerHTML = htmlElements;
                }
            }
            return request;
        },

        pieChart: (request, target) => {
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    let response = JSON.parse(this.responseText);

                    let data = {
                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: response.queryResponseData.rows.map(source => source[0]),
                        datasets: [{
                            data: response.queryResponseData.rows.map(val => val[1]),
                            backgroundColor: ["#f1c40f", "#e67e22", "#16a085", "#2980b9"],
                            borderColor: "#fff"
                        }]
                    };

                    let options = {
                        cutoutPercentage: 50,
                        rotation: Math.PI,
                        animation: {
                            animateScale: true
                        }
                    };

                    let ctx = document.getElementById(target);

                    // And for a doughnut chart
                    let myDoughnutChart = new Chart(ctx, {
                        type: "doughnut",
                        data: data,
                        options: options
                    });
                }
            }
            return request;
        },

        table: (request, target) => {
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText);

                    for (timeAvg of data.queryResponseData.rows) {
                        timeAvg[4] = Math.round(timeAvg[4]);
                        timeAvg[5] = (timeAvg[5] * 100).toFixed(2) + "%";
                    }

                    let htmlElements = "";

                    for (let i = 0; i < data.queryResponseData.headers.length; i++) {
                        htmlElements +=
                            '<div class="col-sm px-1 my-3">' +
                                '<div class="card p-2">' +
                                    "<h1 class='mb-0 display-4 display-6'>" + data.queryResponseData.headers[i] + "</h1>" +
                                    "<hr class='my-1'>" +
                                    "<p class='mb-0'>" + data.queryResponseData.rows[0][i] + "</p>" +
                                    "<p class='mb-0'>" + data.queryResponseData.rows[1][i] + "</p>" +
                                    "<p class='mb-0'>" + data.queryResponseData.rows[2][i] + "</p>" +
                                "</div>" +
                            "</div>";
                    }

                    document.getElementById(target).innerHTML = htmlElements;
                }
            }
            return request;
        },

        mixedBarGraph: (request, target) => {
            request.onreadystatechange = function() {
                if (this.readyState === 4) {
                    let data = JSON.parse(this.responseText).queryResponseData;
                    let sortedData = sortData(data);
                    let options = {
                        responsive: true,
                        tooltips: {
                            mode: 'index',
                            intersect: true
                        }
                    };

                    let ctx = document.getElementById(target);

                    let mixedChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            datasets: [
                                {
                                    label: 'Visitor Bounce Rate',
                                    data: sortedData['Visitor Bounce Rate'],
                                    type: 'line',
                                    borderColor: "#4B64A4",
                                    fill: false
                                },
                                {
                                    label: 'Time On Site Avg.',
                                    data: sortedData['Time On Site Avg.'],
                                    type: 'line',
                                    borderColor: "green",
                                    fill: false
                                },
                                {
                                    label: 'Page Views',
                                    data: sortedData['Page Views'],
                                    backgroundColor: "#FFD681",
                                },
                                {
                                    label: 'Visits',
                                    data: sortedData['Page Exits'],
                                    type: 'line',
                                    backgroundColor: "#E5DAF5"
                                }
                            ],
                            labels: sortedData['Divisions']
                        },
                        options: options
                    });
                }
            }
            return request;
        }

    }

    return components[type](request, target);
}

/*** POST BODY ***/

let body = {
    workspaceId: "49706",
    dateRange: "CUSTOM",
    startDate: "2019-01-01",
    endDate: "2019-12-31",
    dimensions: [],
    groupDimensionFilters: [],
    stringDimensionFilters: [],
    stringDimensionFiltersOperator: "AND",
    numberDimensionFiltersOperator: "AND",
    numberMeasurementFilter: [],
    sortOrder: "DESC",
    topResults: "100",
    groupOthers: true,
    topPerDimension: false,
    totalDimensions: []
};

const genRequest = (target, body, type) => {
  let request = new XMLHttpRequest();
  request.open("POST", "/api");
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  request = generateComponent(request, target, type);
  request.send(JSON.stringify(body));
}

/*** Header Data ***/

body['measurements'] = [
    { name: "Page Views" },
    { name: "Page Exits" },
    { name: "New Visits" },
    { name: "Time On Site Avg." },
    { name: "Visitor Bounce Rate" },
    { name: "Daily Visitors" }]

genRequest('header', body, 'header');


/***  Pie Chart  ***/

body['measurements'] = [{ name: "Page Views" }];
body['dimensions'] = ["Web Analytics Site Medium"]

genRequest('pageViews', body, 'pieChart');


/*** Table Data ***/

body['measurements'] = [
    { name: 'Page Views' },
    { name: 'Page Exits' },
    { name: 'New Visits' },
    { name: 'Time On Site Avg.' },
    { name: 'Visitor Bounce Rate' },
    { name: 'Daily Visitors' }
]
body['dimensions'] = ['Web Analytics Site Medium'];

genRequest('table', body, 'table');


/*** Top 10 Traffic Sources ***/

body['measurements'] = [
    { name: 'Page Views' },
    { name: 'Page Exits' },
    { name: 'Time On Site Avg.' },
    { name: 'Visitor Bounce Rate' },
]
body['dimensions'] = ["Web Analytics Site Medium"]
body['sortBy'] = ["Web Analytics Site Medium"]

genRequest('topSources', body, 'mixedBarGraph');


/*** Traffic by Day ***/

body['dimensions'] = ['Day'];
body['sortBy'] = 'Day';
body['sortOrder'] = 'ASC';

genRequest('trafficDay', body, 'mixedBarGraph');


/*** Traffic by Week ***/

body['dimensions'] = ['Week'];
body['sortBy'] = 'Week';

genRequest('trafficWeek', body, 'mixedBarGraph');


/*** Traffic by Day of Week ***/

body['dimensions'] = ['Weekday'];
body['sortBy'] = 'Weekday';

genRequest('trafficWeekday', body, 'mixedBarGraph');



/*** HELPER METHODS ***/

const sortData = (data) => {
    let sortedData = {};
    let max = findMax(data, 'Page Views');

    for (let row of data.rows) {
        for (let idx in row) {
            let key = data.headers[idx];
            let val = row[idx];

            if (key === 'Visitor Bounce Rate')
                val *= max;

            if (key === 'Page Exits')
                val *= 1.3;

            if (key === 'Time On Site Avg.') {
                while (val > max) {
                    val = val/2;
                }
            }

            if (key === 'Day' || key === 'Week' || key === 'Weekday' || key === 'Web Analytics Site Medium') {
                if (key !== 'Weekday' && key !== 'Web Analytics Site Medium') {
                    val = dateFormat(val);
                }
                key = 'Divisions';
            }

            if (sortedData.hasOwnProperty(key)) {
                sortedData[key].push(val);
            } else {
                sortedData[key] = [val];
            }
        }
    }

    return sortedData;
}

const findMax = (data, target) => {
    let max = 0;

    for (let row of data.rows) {
        for (let idx in row) {
            let key = data.headers[idx];
            let val = row[idx];

            if (key === target && val > max) {
                max = val;
            }
        }
    }

    return max;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dateFormat = (date) => {
    let d = new Date(date);
    let month = monthNames[d.getMonth()];
    let day = d.getDate();
    let year = d.getFullYear();

    if (day.length < 2) day = '0' + day;

    return `${day} ${month} ${year}`;
}
