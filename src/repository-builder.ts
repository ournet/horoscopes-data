import { Db } from "mongodb";
import { PhraseModel } from "./phrase-model";
import { MongoPhraseRepository } from "./mongo-phrase-repository";
import { PhraseRepository, ReportRepository } from "@ournet/horoscopes-domain";
import { ReportModel } from "./report-model";
import { MongoReportRepository } from "./mongo-report-repository";



export class PhraseRepositoryBuilder {
    static build(db: Db, tableSuffix: string = 'v0'): PhraseRepository {
        return new MongoPhraseRepository(new PhraseModel(db, tableSuffix));
    }
}

export class ReportRepositoryBuilder {
    static build(db: Db, tableSuffix: string = 'v0'): ReportRepository {
        return new MongoReportRepository(new ReportModel(db, tableSuffix));
    }
}
