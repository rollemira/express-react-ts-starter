import {Router, Request, Response, NextFunction} from 'express';
import {IdParamRequest} from "./id_param_request";
import {Todo} from '../models/todo';

export function TodoRoutes(router: Router) {
    router.route('/todo')
        .get((req: Request, res: Response, next: NextFunction) => {
            let query = {};
            if (req.query.done === "true") {
                query = {
                    done: true
                };
            }
            Todo.find(query, (err: any, items: any) => {
                res.json(items);
            });
        });

    //middleware that retrieves an item in a route with an id
    router.use('/todo/:id', (req: IdParamRequest, res: Response, next: NextFunction) => {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(404);
            next();
            return;
        }
        Todo.findById(req.params.id, (err: any, item: any) => {
            if (err) return next(err);
            if (!item) {
                res.status(404);
                next();
                return;
            }
            req.item = item;
            next();
        });
    });

    router.route('/todo/:id')
        .get((req: IdParamRequest, res: Response, next: NextFunction) => {
            res.json(req.item);
        });
}