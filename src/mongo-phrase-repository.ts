import { BaseRepository, RepositoryAccessOptions, RepositoryUpdateData } from "@ournet/domain";
import { PhraseModel } from "./phrase-model";
import { PhraseValidator, Phrase, PhraseRepository, RandomPhrasesQueryParams } from "@ournet/horoscopes-domain";

export class MongoPhraseRepository extends BaseRepository<Phrase> implements PhraseRepository {
    constructor(private model: PhraseModel) {
        super(new PhraseValidator());
    }

    innerCreate(data: Phrase): Promise<Phrase> {
        return this.model.create(data);
    }
    innerUpdate(data: RepositoryUpdateData<Phrase>): Promise<Phrase> {
        return this.model.update(data);
    }
    delete(id: string): Promise<boolean> {
        return this.model.delete(id);
    }
    getById(id: string, options?: RepositoryAccessOptions<Phrase>): Promise<Phrase | null> {
        return this.model.getById(id, options);
    }
    getByIds(ids: string[], options?: RepositoryAccessOptions<Phrase>): Promise<Phrase[]> {
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
    random(params: RandomPhrasesQueryParams, options?: RepositoryAccessOptions<Phrase>): Promise<Phrase[]> {
        return this.model.random(params, options);
    }
}
