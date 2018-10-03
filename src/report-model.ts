import { MongoModel } from "./mongo-model";
import { RepositoryUpdateData } from "@ournet/domain";
import { Report, ReportRepository } from '@ournet/horoscopes-domain';
import { Db } from "mongodb";

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
}
