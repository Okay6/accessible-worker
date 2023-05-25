import {v4 as uuidv4} from 'uuid'

class CalculateClass {
    factorial(num: number): number {
        if (num > 1) {
            return this.factorial(num - 1) * num
        } else {
            return num
        }
    }
}

export const AccessibleWorkerModule = {
    var: 'variable',
    a: '1',
    b: '2',
    CalculateClass: CalculateClass,
    uuid: uuidv4
}



