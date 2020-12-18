import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 80;
const configModelPort = 8081;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/connector', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.get('/attributes', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/attributes/properties/" + req.query.type).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /attributes", error.response.status);
        res.send(error);
    });
});

app.get('/resources', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resources", error);
        res.send(error);
    });
});

app.get('/resource', (req, res) => {
    // CURRENTLY NOT WORKING, USING WORKAROUND ...
    // axios.get("http://localhost:" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
    //     res.send(response.data);
    // }).catch(error => {
    //     console.log("Error on GET /resource", error.response.status);
    //     res.send(error);
    // });

    // TODO WORKAROUND!!! REMOVE !!!
    axios.get("http://localhost:" + configModelPort + "/api/ui/connector").then(response => {
        for (var resource of response.data["ids:resourceCatalog"][0]["ids:offeredResource"]) {
            if (resource["@id"] == req.query.resourceId) {
                res.send(resource);
            }
        }

    }).catch(error => {
        console.log("Error on GET /resources", error.response.status);
        res.send(error);
    });
});

app.post('/resource', (req, res) => {
    var params = "?routeId=" + req.query.routeId + "&title=" + req.query.title + "&description=" + req.query.description +
        "&language=" + req.query.language + "&keyword=" + req.query.keyword + "&version=" + req.query.version + "&standardlicense=" +
        req.query.standardlicense + "&publisher=" + req.query.publisher + "&brokerList=";
    axios.post("http://localhost:" + configModelPort + "/api/ui/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/resource', (req, res) => {
    var params = "?routeId=" + req.query.routeId + "&resourceId=" + req.query.resourceId + "&title=" + req.query.title +
        "&description=" + req.query.description + "&language=" + req.query.language + "&keyword=" + req.query.keyword +
        "&version=" + req.query.version + "&standardlicense=" + req.query.standardlicense + "&publisher=" +
        req.query.publisher;
    axios.put("http://localhost:" + configModelPort + "/api/ui/resource" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/resource', (req, res) => {
    axios.delete("http://localhost:" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /resource", error.response.status);
        res.send(error);
    });
});

app.put('/contract', (req, res) => {
    var params = "?resourceId=" + req.query.resourceId;
    axios.put("http://localhost:" + configModelPort + "/api/ui/resource/contract" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /contract", error.response.status);
        res.send(error);
    });
});

app.post('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + req.query.resourceId + "&language=" + req.query.language + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + req.query.sourceType;
    axios.post("http://localhost:" + configModelPort + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /representation", error.response.status);
        res.send(error);
    });
});

app.get('/approutes', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel").then(response => {
        res.send(response.data["ids:appRoute"]);
    }).catch(error => {
        console.log("Error on GET /approutes", error.response.status);
        res.send(error);
    });
});

app.post('/approute', (req, res) => {
    axios.post("http://localhost:" + configModelPort + "/api/ui/approute/endpoint?accessUrl=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/approute', (req, res) => {
    axios.put("http://localhost:" + configModelPort + "/api/ui/approute/endpoint?routeId=" + req.query.routeId + "&endpointId=" +
        req.query.endpointId + "&accessUrl=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/approute', (req, res) => {
    axios.delete("http://localhost:" + configModelPort + "/api/ui/approute/endpoint?routeId=" + req.query.routeId + "&appRouteStartId=" +
        req.query.endpointId + "&appRouteEndId=" +
        req.query.appRouteEndId + "&appRouteOutputId=" +
        req.query.appRouteOutputId).then(() => {
        axios.delete("http://localhost:" + configModelPort + "/api/ui/approute/?routeId=" + req.query.routeId).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on DELETE /approute", error.response.status);
            res.send(error);
        });
    }).catch(error => {
        console.log("Error on DELETE /approute", error.response.status);
        res.send(error);
    });
});

app.get('/test', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel").then(response => {
        let output = "";
        let configmodel = response.data;
        if (configmodel["ids:appRoute"] !== undefined) {
            output += "App Routes: " + configmodel["ids:appRoute"].length + "<br>";
            for (let route of configmodel["ids:appRoute"]) {
                output += "&emsp;Route Starts: " + route["ids:appRouteStart"].length + "<br>";
                for (let start of route["ids:appRouteStart"]) {
                    output += "&emsp;&emsp;Endpoint URL: " + start["ids:accessURL"]["@id"] + "<br>";
                }
            }
        }
        res.send(output);
    }).catch(error => {
        console.log("Error on GET /test", error);
        res.send(error);
    });
});

app.get('/brokers', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/brokers").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /brokers", error.response.status);
        res.send(error);
    });
});

app.post('/broker', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri + "&title=" + req.query.title;
    axios.post("http://localhost:" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker", error.response.status);
        res.send(error);
    });
});

app.post('/broker/register', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri;
    axios.post("http://localhost:" + configModelPort + "/api/ui/broker/register" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/register", error.response.status);
        res.send(error);
    });
});

app.put('/broker', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri + "&title=" + req.query.title;
    axios.put("http://localhost:" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /broker", error.response.status);
        res.send(error);
    });
});

app.delete('/broker', (req, res) => {
    axios.delete("http://localhost:" + configModelPort + "/api/ui/broker?brokerUri=" + req.query.brokerId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /broker", error.response.status);
        res.send(error);
    });
});

app.get('/offeredresourcesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let totalSize = 0;
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:instance"] !== undefined) {
                    totalSize += resource["ids:representation"][0]["ids:instance"][0]["ids:byteSize"];
                }
            }
        }
        res.send({
            totalNumber: resources.length,
            totalSize: totalSize
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/sourcetypesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let sourceTypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:sourceType"];
                    if (sourceTypes[type] === undefined) {
                        sourceTypes[type] = 1;
                    } else {
                        sourceTypes[type] = sourceTypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let sourceType in sourceTypes) {
            labels.push(sourceType);
            series.push(sourceTypes[sourceType]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/filetypesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let filetypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:mediaType"]["ids:filenameExtension"];
                    if (filetypes[type] === undefined) {
                        filetypes[type] = 1;
                    } else {
                        filetypes[type] = filetypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let filetype in filetypes) {
            labels.push(filetype);
            series.push(filetypes[filetype]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/proxy', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel/proxy").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.put('/proxy', (req, res) => {
    let params = "?proxyUri=" + req.query.proxyUri + "&noProxyUri=" + req.query.noProxyUri + "&username=" +
        req.query.username + "&password=" + req.query.password;
    axios.put("http://localhost:" + configModelPort + "/api/ui/configmodel/proxy" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.get('/enum', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/enum/" + req.query.enumName).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /enum", error.response.status);
        res.send(error);
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
