import client from "prom-client";

const requestCounter = new client.Counter({
    help: "Total number of HTTP requests",
    name: "http_requests_total",
    labelNames: ['method', 'route', 'status_code']
})

export default requestCounter;