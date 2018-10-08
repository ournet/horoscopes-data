import { MongoModel } from "./mongo-model";
import { RepositoryUpdateData, RepositoryAccessOptions } from "@ournet/domain";
import { Report, ReportRepository } from '@ournet/horoscopes-domain';
import { Db, FindOneOptions } from "mongodb";

const EXPIRES_AT_FIELD = 'expiresAt';

export class ReportModel extends MongoModel<Report> implements ReportRepository {
    constructor(db: Db, tableSuffix: string) {
        super(db, `ournet_horo_reports_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
        await this.collection.createIndex({ textHash: 1 });
    }

    protected beforeCreate(data: Report) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<Report>) {
        if (data.set && data.set.expiresAt) {
            (<any>data.set)[EXPIRES_AT_FIELD] = new Date(data.set.expiresAt * 1000);
        }

        return super.beforeUpdate(data);
    }

    protected convertFromMongoDoc(doc: any): Report {
        const item = super.convertFromMongoDoc(doc);

        if (item.expiresAt) {
            item.expiresAt = Math.floor(new Date(item.expiresAt).getTime() / 1000);
        }

        return item;
    }

    async getByTextHash(hash: string, options?: RepositoryAccessOptions<Report>): Promise<Report | null> {
        const mongoOptions: FindOneOptions = {};
        if (options && options.fields && options.fields.length) {
            mongoOptions.projection = this.fillObjectFields(options.fields as string[], 1, true);
        }
        const result = await this.collection.findOne({ textHash: hash }, mongoOptions);
        if (result) {
            return this.convertFromMongoDoc(result);
        }
        return null;
    }
}
