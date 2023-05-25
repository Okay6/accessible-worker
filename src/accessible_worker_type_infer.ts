import {EventsMap} from "./accessible_worker_types";


export type InferParameterType<E extends EventsMap, K extends keyof EventsMap> =
    Parameters<E[K]> extends Array<any> ? Parameters<E[K]>[0] : never

