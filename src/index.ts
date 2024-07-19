import express from "express";
import { NextFunction, Request, Response } from "express";
import { requestCountMiddleware } from "./metrics";
import client from "prom-client"

const app = express();


export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    next();
    const endTime = Date.now();
    console.log(`Request took ${endTime - startTime}ms`);
}

app.use(express.json());
app.use(middleware)
app.use(requestCountMiddleware)

app.get("/user", (req, res) => {
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.send({
        ...user,
        id: 1,
    });
});

app.get('/metrics', async (req, res) => {
    const result = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(result)
})

app.listen(3000);