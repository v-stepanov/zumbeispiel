
function MetricsChart(chartId, valueMask, metricsUrls, config) {

    var createLegend = function() {
        if (!(config.legendId === undefined)) {
            legend($("#" + config.legendId).get(0), self.chartData);
        }
    };

    var createChart = function() {
        self.chartData = {
            labels: self.timeLabels,
            datasets: self.metricsData
        };
        console.log(self.chartData);

        var context = $("#" + chartId).get(0).getContext("2d");
        self.chart = new Chart(context).Line(self.chartData, defaultChartProperties);
    };

    var updateData = function() {
        // todo: make http request to metrics endpoint
        appendData(MetricsChart.utils.newDummyData());
        setTimeout(updateData, config.intervalMs);
    };

    var appendData = function(newData) {

        if (self.timeLabels.length >= config.iterations) {
            self.timeLabels.splice(0, 1);
            for (var j = 0; j < self.metricsData.length; j++) {
                self.metricsData[j].data.splice(0, 1);
            }
        }

        self.timeLabels.push((new Date()).toLocaleTimeString());

        var currentData = MetricsChart.dataHandler.extractDataFromJson(newData, valueMask);
        for (var key in currentData) {

            var foundMatchingMetrics = false;

            for (var i = 0; i < self.metricsData.length; i++) {
                var currentMetricData = self.metricsData[i];
                if (key == currentMetricData.label) {
                    currentMetricData.data.push(currentData[key]);
                    foundMatchingMetrics = true;
                    break;
                }
            }

            if (!foundMatchingMetrics) {
                var data = [];
                for (var j = 0; j < self.timeLabels.length - 1; j++) {
                    data.push(0)
                }
                data.push(currentData[key]);
                self.metricsData.push({
                    label: key,
                    strokeColor: MetricsChart.utils.randomColor(),
                    data: [currentData[key]]
                })
            }
        }
        createChart();
        createLegend();
    };

    var defaultChartProperties = {
        animationSteps: 1,
        datasetFill : false,
        pointDotRadius : 2,
        datasetStrokeWidth : 3,
        bezierCurve : false
    };

    config.intervalMs = typeof config.intervalMs === 'undefined' ? 5000 : config.intervalMs;

    var self = this;
    self.timeLabels = [];
    self.metricsData = [];

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