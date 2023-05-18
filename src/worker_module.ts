import {v4 as uuidv4} from "uuid";

class MyOwnClass {
    say(s: string) {
        console.log('say', s)
    }
}

export const AccessibleWorkerModule = {
    uuidv4: uuidv4,
    var: 'variable',
    a: '1',
    b: '2',
    MyOwnClass: MyOwnClass
}



