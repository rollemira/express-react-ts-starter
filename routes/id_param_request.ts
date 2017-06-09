import {Request} from 'express';

export interface IdParamRequest extends Request {
    item?: any;
}