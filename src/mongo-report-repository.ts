import { BaseRepository, RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import { ReportModel } from "./report-model";
import { ReportValidator, Report, ReportRepository } from "@ournet/horoscopes-domain";

export class MongoReportRepository extends BaseRepository<Report> implements ReportRepository {
    constructor(private model: ReportModel) {
        super(new ReportValidator());
    }

    innerCreate(data: Report): Promise<Report> {
        return this.model.create(data);
    }
    innerUpdate(data: RepositoryUpdateData<Report>): Promise<Report> {
        return this.model.update(data);
    }
    delete(id: string): Promise<boolean> {
        return this.model.delete(id);
    }
    getById(id: string, options?: RepositoryAccessOptions<Report>): Promise<Report | null> {
        return this.model.getById(id, options);
    }
    getByIds(ids: string[], options?: RepositoryAccessOptions<Report>): Promise<Report[]> {
        return this.model.getByIds(ids, options);
    }
    exists(id: string): Promise<boolean> {
        return this.model.exists(id);
    }
    deleteStorage(): Promise<void> {
        return this.model.deleteStorage();
    }
    createStorage(): Promise<void> {
        return this.model.createStorage();
    }
}
