import * as mongoose from 'mongoose';
import {IPersistedModel} from "./presisted-model";

const Schema = mongoose.Schema;
const TodoSchema = new Schema({
    title: {type: String, required: true},
    done: {type: Boolean, default: false}
});

export interface ITodo extends IPersistedModel {
    title: string;
    done: boolean;
}

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);