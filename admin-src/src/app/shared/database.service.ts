import {Injectable} from "@angular/core";

declare const alasql: any;

export interface DatabaseWorkerPayload {
    id: string,
    payload: any,
}


/**
 * The browser becomes unresponsive when heavy queries are executed by alasql.
 * thus do that work in a web worker.
 * This class provides a way to communicate with the worker with promises.
 */
export class DatabaseWorker {

    private static instance: DatabaseWorker;

    // keep track of statement IDs for input and output tracking
    private statementId = 0;

    /**
     * Get instance of this worker.
     * must be the same one
     */
    public static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new DatabaseWorker();
            return this.instance;
        }
    }

    private worker: Worker;

    protected constructor() {

        // Get the script from the local index file.
        let blob = new Blob([
            document.querySelector('#databaseWorker').textContent
        ], {type: "text/javascript"});

        // Note: window.webkitURL.createObjectURL() in Chrome 10+.
        // create the worker
        this.worker = new Worker(window.URL.createObjectURL(blob));
        this.worker.onmessage = (e: MessageEvent) => {
            let payload = <DatabaseWorkerPayload>e.data;
            this.responseReceived(payload);
        };
    }

    private queue: {
        [key: string]: {
            resolve: any,
            reject: any,
            time?: any,
        }
    } = {};

    public exec(statement: string | string[]): Promise<any> {
        let id: any = (this.statementId += 1);
        id = id.toString();

        return new Promise((resolve, reject) => {
            this.worker.postMessage(<DatabaseWorkerPayload>{
                id: id,
                payload: statement,
            });

            this.queue[id] = {
                resolve: resolve,
                reject: reject,
                // time: (+new Date())
            }
        })
    }

    private responseReceived(payload: DatabaseWorkerPayload) {
        let queue = this.queue[payload.id];
        // let diff = (+new Date()) - queue.time;
        // console.log(`Q id: ${payload.id} time: ${diff / 1000}s`);
        queue.resolve(payload.payload);
        delete this.queue[payload.id];
    }
}

/**
 * Create a abstract class for using alasql and sqlite in demand
 * by creating an interface
 *
 * alasql also returns the results directly, that may hang the system for large datasets
 */
@Injectable()
export class Database {
    constructor() {

    }

    /**
     * Run multiple statements and get one promise
     * same dude, remove this, same as execute function.
     * @param statements
     */
    batchExecute(statements: string[]) {
        return new Promise((resolve, reject) => {
            let instance = DatabaseWorker.getInstance();
            instance.exec(statements).then(() => {
                resolve();
            });
            // this.batchExecuteDirect(statements);
            // resolve();
        });
    }

    /**
     * @deprecated
     * @param statements
     */
    batchExecuteDirect(statements: string[]) {
        for (let statement of statements) {
            // console.log('SQL: ', statement);
            let af = alasql(statement);
        }
    }

    execute(statement: string | string[]) {
        return new Promise((resolve, reject) => {
            let instance = DatabaseWorker.getInstance();
            instance.exec(statement).then(res => {
                resolve(res);
            }, err => {
                reject(err);
            });
            // resolve(this.executeDirect(statement));
        });
    }

    /**
     * Execute the SQL statement directly without promise
     * @param statement
     * @deprecated
     */
    executeDirect(statement: string): any {
        // console.log('SQL: ', statement);
        return alasql(statement);
    }
}
