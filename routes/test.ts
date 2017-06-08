import {Router, Request, Response, NextFunction} from "express";

export function TestRoutes(router: Router) {
    router.route("/test")
        .get((req: Request, res: Response, next: NextFunction) => {
            res.json({
                title: "test route",
                data: [
                    "test1",
                    "test2",
                    "test3"
                ]
            });
        });
}