
function MetricsChart(id, valueMask, metricsUrl) {

    var extractDataFromJson = function (jsonData, mask) {
        var maskParts = mask.split(".");
        var currentPaths = {"value": jsonData};

        for (var i = 0; i < maskParts.length; i++) {
            var maskPart = maskParts[i];
            var nextPaths = {};
            for (var pathName in currentPaths) {
                var json = currentPaths[pathName];
                if (maskPart.indexOf("*") != -1) {
                    if (maskPart == "*") {
                        for (var key in json) {
                            nextPaths[pathName + "." + key] = json[key];
                        }
                    }
                }
                else {
                    if (json.hasOwnProperty(maskPart)) {
                        nextPaths[pathName + "." + maskPart] = json[maskPart];
                    }
                }
            }
            currentPaths = nextPaths;
        }

        console.log(currentPaths);
        return currentPaths;
    };

    valueMask = "last5min.endpoints.*.status_codes.*";
    var plainData = extractDataFromJson(metrics_data_1, valueMask);
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
                    "200": 96
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