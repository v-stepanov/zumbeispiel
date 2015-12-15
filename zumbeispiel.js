
function MetricsChart(chartId, valueMask, metricsUrls, config) {

    var createChart = function() {
        self.chartOptions = {
            hAxis: {
                format: 'hh:mm:ss'
            },
            vAxis: {
                title: 'requests'
            },
            legend: {
                position: 'right'
            },
            fontSize: 14,
            width: "100%",
            height: 300,
            chartArea: {  left: "5%", width: "75%", height: "80%"}
        };

        self.chart = new google.visualization.LineChart(document.getElementById(chartId));
    };

    var updateData = function() {
        // todo: make http request to metrics endpoint
        appendData(MetricsChart.utils.newDummyData());
        setTimeout(updateData, config.intervalMs);
    };

    var appendData = function(newData) {
        var currentData = MetricsChart.dataHandler.extractDataFromJson(newData, valueMask);

        for (var key in currentData) {
            var datasetPresent = false;
            for (var i = 1; i < self.dataTable.getNumberOfColumns(); i++) {
                if (key == self.dataTable.getColumnLabel(i)) {
                    datasetPresent = true;
                    break;
                }
            }
            if (!datasetPresent) {
                self.dataTable.addColumn("number", key);
            }
        }

        var newRow = [new Date()];
        for (i = 1; i < self.dataTable.getNumberOfColumns(); i++) {
            var currentLabel = self.dataTable.getColumnLabel(i);
            if (currentData.hasOwnProperty(currentLabel)) {
                newRow.push(currentData[currentLabel]);
            }
            else {
                newRow.push(0);
            }
        }

        self.dataTable.addRow(newRow);
        self.chart.draw(self.dataTable, self.chartOptions);
    };

    config.intervalMs = typeof config.intervalMs === 'undefined' ? 5000 : config.intervalMs;
    var datasetsPositions = [];

    var self = this;

    self.dataTable = new google.visualization.DataTable();
    self.dataTable.addColumn('datetime', 'X');

    createChart();
    updateData();
}

MetricsChart.dataHandler = new MetricsDataHandler();


function MetricsDataHandler() {

    this.extractDataFromJson = function(jsonData, mask) {

        var flattenJson = flattenObject(jsonData);
        console.log("flattened json:");
        console.log(flattenJson);

        var regexp = maskToRegexp(mask);

        var matchingData = {};
        for (var jsonPath in flattenJson) {
            if (regexp.test(jsonPath)) {
                matchingData[jsonPath] = flattenJson[jsonPath];
            }
        }
        console.log("data matching mask:");
        console.log(matchingData);

        return matchingData;
    };

    var maskToRegexp = function(mask) {
        var regexpMask = mask;
        regexpMask = regexpMask.replace(/\./g, "\\.");
        regexpMask = regexpMask.replace(/\*/g, ".+");
        regexpMask = regexpMask.replace(/\?/g, ".?");
        regexpMask = "^" + regexpMask + "$";
        console.log("regexp mask:");
        console.log(regexpMask);

        return new RegExp(regexpMask);
    };
}


MetricsChart.utils = {

    randomColor: function() {
        return "#"+((1<<24)*Math.random()|0).toString(16);
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    newDummyData: function() {
        return {
            "last5min": {
                "endpoints": {
                    "post_events": {
                        "status_codes": {
                            "201": MetricsChart.utils.randomInt(10, 20)
                        }
                    },
                    "get_partitions": {
                        "status_codes": {
                            "200": MetricsChart.utils.randomInt(120, 180)
                        }
                    },
                    "get_metrics": {
                        "status_codes": {
                            "200": MetricsChart.utils.randomInt(3, 12)
                        }
                    },
                    "get_topics": {
                        "status_codes": {
                            "200": MetricsChart.utils.randomInt(80, 120),
                            "404": MetricsChart.utils.randomInt(1, 3)
                        }
                    },
                    "get_events_from_single_partition": {
                        "status_codes": {
                            "200": MetricsChart.utils.randomInt(40, 100)
                        }
                    }
                }
            }
        }
    }
};