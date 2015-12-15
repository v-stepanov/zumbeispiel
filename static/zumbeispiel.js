
function MetricsChart(chartId, valueMask, metricsUrls, config) {

    var createChart = function() {
        self.chartOptions = {
            title: "Amount of successful requests",
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
            chartArea: {
                left: "5%",
                width: "75%",
                height: "80%"
            }
        };

        self.chart = new google.visualization.LineChart(document.getElementById(chartId));
    };

    var updateData = function() {
        $.ajax({
            url: metricsUrls,
            type: "GET",
            success: function(data) {
                appendData(data);
            },
            complete: function() {
                console.log("complete");
                setTimeout(updateData, config.intervalMs);
            }
        });
        // using dummy data:
        /*
        appendData(MetricsChart.utils.newDummyData());
        setTimeout(updateData, config.intervalMs);
        */
    };

    var appendData = function(newData) {
        var currentData = MetricsChart.dataHandler.extractDataFromJson(newData, valueMask);

        trackColumnsAge(currentData);
        addNewColumnsIfNecessary(currentData);
        addNewDataRow(currentData);
        removeOldData();

        self.chart.draw(self.dataTable, self.chartOptions);
    };

    function removeOldData() {
        if (self.dataTable.getNumberOfRows() > config.iterations) {
            self.dataTable.removeRow(0);
        }
    }

    function addNewDataRow(currentData) {
        var newRow = [new Date()];
        for (var i = 1; i < self.dataTable.getNumberOfColumns(); i++) {
            var currentLabel = self.dataTable.getColumnLabel(i);
            if (currentData.hasOwnProperty(currentLabel)) {
                newRow.push(currentData[currentLabel]);
            }
            else {
                newRow.push(0);
            }
        }
        self.dataTable.addRow(newRow);
    }

    var addNewColumnsIfNecessary = function(currentData) {
        for (var key in currentData) {
            var datasetPresent = getColumnIndexByLabel(key) != -1;
            if (!datasetPresent) {
                var newColumnIndex = self.dataTable.addColumn("number", key);
                for (i = 0; i < self.dataTable.getNumberOfRows(); i++) {
                    self.dataTable.setValue(i, newColumnIndex, 0)
                }
            }
        }
    };

    var trackColumnsAge = function(currentData) {
        for (var key in currentData) {
            self.dataAge[key] = 0;
        }
        for (key in self.dataAge) {
            if (self.dataAge[key] > config.iterations) {
                var columnIndex = getColumnIndexByLabel(key);
                self.dataTable.removeColumn(columnIndex);
                delete self.dataAge[key];
            } else {
                self.dataAge[key]++;
            }
        }
    };

    var getColumnIndexByLabel = function(columnLabel) {
        for (var i = 1; i < self.dataTable.getNumberOfColumns(); i++) {
            if (columnLabel == self.dataTable.getColumnLabel(i)) {
                return i;
            }
        }
        return -1;
    };

    config.intervalMs = typeof config.intervalMs === 'undefined' ? 5000 : config.intervalMs;

    var self = this;

    self.dataAge = {};

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

blah = 0;

MetricsChart.utils = {

    randomColor: function() {
        return "#"+((1<<24)*Math.random()|0).toString(16);
    },

    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    newDummyData: function() {
        blah++;
        var json= {
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
        };
        if (blah < 3) {
            json["last5min"]["endpoints"]["blah"] = {
                "status_codes": {
                    "201": MetricsChart.utils.randomInt(100, 200)
                }
            }
        }
        return json;
    }
};