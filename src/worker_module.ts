import {v4 as uuidv4} from 'uuid'
import _ from "lodash";

class CalculateClass {
    factorial(num: number): number {
        if (num > 1) {
            return this.factorial(num - 1) * num
        } else {
            return num
        }
    }
}

export const MyOwnModule = {
    var: 'variable',
    a: '1',
    b: '2',
    CalculateClass: CalculateClass,
    uuid: uuidv4,
    endWith: _.endsWith
}



