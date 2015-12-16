
function MetricsChart(chartId, valueMask, config) {

    var createChart = function() {
        self.chartOptions = {
            title: config.title,
            hAxis: {
                format: "hh:mm:ss"
            },
            vAxis: {
                title: "requests"
            },
            legend: {
                position: "right"
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
            url: "/metrics",
            type: "GET",
            success: function(data) {
                appendData(data);
            },
            complete: function() {
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

        if (config.summarize) {
            var summarizedData = {};
            summarizedData[valueMask] = 0;
            for (var key in currentData) {
                summarizedData[valueMask] += currentData[key];
            }
            currentData = summarizedData;
        }
        else {
            if (config.seriesNames == "diff") {
                var allParts = [];
                var maxParts = 0;
                for (key in currentData) {
                    var parts = key.split(".");
                    allParts.push(parts);
                    if (parts.length > maxParts) {
                        maxParts = parts.length;
                    }
                }
                var matchingIndexes = [];
                for (var j = 0; j < maxParts; j++) {
                    var matches = true;
                    var compareName = allParts[0][j];
                    for (var i = 1; i < allParts.length; i++) {
                        if (allParts[i].length <= j || compareName != allParts[i][j]) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        matchingIndexes.push(j);
                    }
                }
                var renamedData = {};
                for (key in currentData) {
                    var newKey = "";
                    var key_parts = key.split(".");
                    for (var i = 0; i < key_parts.length; i++) {
                        if (matchingIndexes.indexOf(i) == -1) {
                            newKey = newKey + key_parts[i] + ".";
                        }
                    }
                    newKey = newKey.slice(0, -1);
                    renamedData[newKey] = currentData[key];
                }
                currentData = renamedData;
            }
            else if (config.seriesNames != "full") {
                var renamedData = {};
                var namePartsIndexes = config.seriesNames.split(".");
                for (key in currentData) {
                    var newKey = "";
                    var key_parts = key.split(".");
                    for (var i = 0; i < namePartsIndexes.length; i++) {
                        var currentIndex = namePartsIndexes[i];
                        newKey = newKey + key_parts[currentIndex] + ".";
                    }
                    newKey = newKey.slice(0, -1);
                    renamedData[newKey] = currentData[key];
                }
                currentData = renamedData;
            }
        }

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

    var self = this;
    var utils = MetricsChart.utils;

    self.dataAge = {};

    self.dataTable = new google.visualization.DataTable();
    self.dataTable.addColumn("datetime", "X");

    config.intervalMs = utils.valueOrDefault(config.intervalMs, 60000);
    config.iterations = utils.valueOrDefault(config.iterations, 60);
    config.summarize = utils.valueOrDefault(config.summarize, false);
    config.title = utils.valueOrDefault(config.title, "");
    config.seriesNames = utils.valueOrDefault(config.seriesNames, "full");

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
        return matchingData;
    };

    var maskToRegexp = function(mask) {
        var regexpMask = mask;
        regexpMask = regexpMask.replace(/\./g, "\\.");
        regexpMask = regexpMask.replace(/\*/g, ".+");
        regexpMask = regexpMask.replace(/\?/g, ".?");
        regexpMask = "^" + regexpMask + "$";
        return new RegExp(regexpMask);
    };
}

MetricsChart.utils = {

    valueOrDefault: function(val, defaultVal) {
        return typeof val !== 'undefined' ? val : defaultVal;
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
        };
    }
};