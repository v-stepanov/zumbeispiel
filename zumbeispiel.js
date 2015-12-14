
function MetricsChart(chartId, valueMask, metricsUrls) {

    var self = this;
    var data = MetricsChart.dataHandler.extractDataFromJson(metrics_data_1, valueMask);

    var datasets = [];
    for (var key in data) {
        datasets.push({
            label: key,
            strokeColor: "#"+((1<<24)*Math.random()|0).toString(16)/*"rgba(50,200,50,0.9)"*/,
            data: [data[key]]
        });
    }

    startingData = {
        labels: ["10:31:19"],
        datasets: datasets
    };

    var context = $("#" + chartId).get(0).getContext("2d");
    var chart = new Chart(context).Line(startingData,
        {
            animationSteps: 15,
            datasetFill : false,
            pointDotRadius : 2,
            datasetStrokeWidth : 3,
            bezierCurve : false
    });

    legend($("#legend").get(0), startingData);
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

metrics_data_1 = {
    "last5min": {
        "endpoints": {
            "post_events": {
                "status_codes": {
                    "201": 5
                },
                "calls_per_second": 0.016666666666666666,
                "count": 5
            },
            "get_partitions": {
                "status_codes": {
                    "200": 154
                },
                "calls_per_second": 0.5133333333333333,
                "count": 154
            },
            "get_metrics": {
                "status_codes": {
                    "200": 5
                },
                "calls_per_second": 0.016666666666666666,
                "count": 5
            },
            "get_topics": {
                "status_codes": {
                    "200": 95,
                    "404": 1
                },
                "calls_per_second": 0.32,
                "count": 96
            },
            "get_events_from_single_partition": {
                "status_codes": {
                    "200": 47
                },
                "calls_per_second": 0.15666666666666668,
                "count": 47
            }
        },
        "events": {
            "eventstore.article.411": {
                "pushed": {
                    "stups_shop-updater-hack": 68
                },
                "consumed": {
                    "stups_event-pipeline-stg": 48,
                    "stups_event-pipeline": 50,
                    "stups_event-pipeline-prd": 58
                }
            },
            "eventstore.article.401": {
                "pushed": {
                    "stups_shop-updater-hack": 50
                },
                "consumed": {
                    "stups_event-pipeline-stg": 41,
                    "stups_event-pipeline": 48,
                    "stups_event-pipeline-prd": 53
                }
            },
            "eventstore.price-stock.1": {
                "pushed": {
                    "stups_shop-updater-hack": 420
                },
                "consumed": {}
            }
        }
    },
    "last1min": {
        "endpoints": {
            "post_events": {
                "status_codes": {
                    "201": 1
                },
                "calls_per_second": 0.016666666666666666,
                "count": 1
            },
            "get_partitions": {
                "status_codes": {
                    "200": 30
                },
                "calls_per_second": 0.5,
                "count": 30
            },
            "get_metrics": {
                "status_codes": {
                    "200": 1
                },
                "calls_per_second": 0.016666666666666666,
                "count": 1
            },
            "get_topics": {
                "status_codes": {
                    "200": 14
                },
                "calls_per_second": 0.23333333333333334,
                "count": 14
            },
            "get_events_from_single_partition": {
                "status_codes": {
                    "200": 11
                },
                "calls_per_second": 0.18333333333333332,
                "count": 11
            }
        },
        "events": {
            "eventstore.article.411": {
                "pushed": {
                    "stups_shop-updater-hack": 29
                },
                "consumed": {
                    "stups_event-pipeline-stg": 14,
                    "stups_event-pipeline": 14,
                    "stups_event-pipeline-prd": 20
                }
            }
        }
    },
    "last15min": {
        "endpoints": {
            "post_events": {
                "status_codes": {
                    "201": 34
                },
                "calls_per_second": 0.03777777777777778,
                "count": 34
            },
            "get_partitions": {
                "status_codes": {
                    "200": 465
                },
                "calls_per_second": 0.5166666666666667,
                "count": 465
            },
            "get_metrics": {
                "status_codes": {
                    "200": 15
                },
                "calls_per_second": 0.016666666666666666,
                "count": 15
            },
            "get_topics": {
                "status_codes": {
                    "200": 272
                },
                "calls_per_second": 0.3022222222222222,
                "count": 272
            },
            "get_events_from_single_partition": {
                "status_codes": {
                    "200": 168
                },
                "calls_per_second": 0.18666666666666668,
                "count": 168
            }
        },
        "events": {
            "eventstore.article.411": {
                "pushed": {
                    "stups_shop-updater-hack": 315
                },
                "consumed": {
                    "stups_event-pipeline-stg": 132,
                    "stups_event-pipeline": 157,
                    "stups_event-pipeline-prd": 142
                }
            },
            "eventstore.article.401": {
                "pushed": {
                    "stups_shop-updater-hack": 135
                },
                "consumed": {
                    "stups_event-pipeline-stg": 181,
                    "stups_event-pipeline": 166,
                    "stups_event-pipeline-prd": 169
                }
            },
            "eventstore.price-stock.1": {
                "pushed": {
                    "stups_shop-updater-hack": 2141
                },
                "consumed": {}
            },
            "eventstore.article.1": {
                "pushed": {
                    "stups_shop-updater-hack": 5442
                },
                "consumed": {}
            }
        }
    }
};