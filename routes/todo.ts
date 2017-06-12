import {Router, Request, Response, NextFunction} from 'express';
import {IdParamRequest} from "./id_param_request";
import {Todo} from '../models/todo';
import {httpUtil} from "../utils/http";
import {validateUtil} from "../utils/validate";

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
        }).post((req: Request, res: Response, next: NextFunction) => {
            let item = new Todo({
                title: req.body.title,
                done: req.body.done || false
            });
            item.save((err: any, item: any) => {
                if (err !== null) {
                    validateUtil.validationError(err, res);
                    return;
                }
                res.status(201).json(item);
            });
        });

    //middleware that retrieves an item in a route with an id
    router.use('/todo/:id', (req: IdParamRequest, res: Response, next: NextFunction) => {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            httpUtil.notFound(res, "Not Found");
            next();
            return;
        }
        Todo.findById(req.params.id, (err: any, item: any) => {
            if (err) return next(err);
            if (!item) {
                httpUtil.notFound(res, "Not Found");
                next();
                return;
            }
            req.item = item;
            next();
        });
    });

    router.route('/todo/:id')
        .get((req: IdParamRequest, res: Response, next: NextFunction) => {
            let item = req.item;
            res.json(item);
        }).put((req: IdParamRequest, res: Response, next: NextFunction) => {
            let item = req.item;
            item.title = req.body.title;
            item.done = req.body.done;
            item.save((err: any, item: any) => {
                if (err !== null) {
                    validateUtil.validationError(err, res);
                    return;
                }
                res.status(200).json(item);
            });
        }).patch((req: IdParamRequest, res: Response, next: NextFunction) => {
            let item = req.item;
            if (req.body._id)
                delete req.body._id;
            //only properties from body
            for (let p in req.body) {
                item[p] = req.body[p];
            }
            item.save((err: any, item: any) => {
                if (err !== null) {
                    validateUtil.validationError(err, res);
                    return;
                }
                res.status(200).json(item);
            });
        }).delete((req: IdParamRequest, res: Response, next: NextFunction) => {
            let item = req.item;
            item.remove((err: any) => {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(204).json({message: 'Removed'});
            });
        });
}