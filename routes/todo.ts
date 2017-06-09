import {Router, Request, Response, NextFunction} from 'express';
import {Todo} from '../models/todo';

export function TodoRoutes(router: Router) {
    router.route('/todo')
        .get((req: Request, res: Response, next: NextFunction) => {
            Todo.find({}, (err: any, todos: any) => {
                res.send(todos);
            });
        });
}