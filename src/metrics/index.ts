import { Request, Response, NextFunction } from "express";
import requestCounter from "./requestCounter";
import { activeRequestGauge } from "./activeUserGauge";
import { requestDuration } from "./requestDurationBucket";

export function requestCountMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    activeRequestGauge.inc();
    res.on("finish", () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        })
        activeRequestGauge.dec()
        requestDuration.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration)
    })
    next()
}

// export function activeRequestMiddleware(req: Request, res: Response, next: NextFunction) {
//     activeRequestGauge.inc();
//     res.on("finish", () => {
//         activeRequestGauge.dec()
//     })
//     next()
// }