import { MongoModel } from "./mongo-model";
import { RepositoryUpdateData, RepositoryAccessOptions } from "@ournet/domain";
import {
  Phrase,
  PhraseRepository,
  RandomPhrasesQueryParams
} from "@ournet/horoscopes-domain";
import { PhraseQueryParams } from "@ournet/horoscopes-domain/lib/phrase-repository";
import { Db } from "mongodb";

const RAND_KEY = "rand";

export class PhraseModel
  extends MongoModel<Phrase>
  implements PhraseRepository
{
  constructor(db: Db, tableSuffix: string) {
    super(db, `ournet_horo_phrases_${tableSuffix}`);
  }
  async list({ lang, limit, offset }: PhraseQueryParams): Promise<Phrase[]> {
    const result = await this.collection
      .find({ lang })
      .sort("id")
      .limit(limit)
      .skip(offset || 0)
      .toArray();

    return result.map((item) => this.convertFromMongoDoc(item));
  }

  async random(
    params: RandomPhrasesQueryParams,
    _options?: RepositoryAccessOptions<Phrase>
  ): Promise<Phrase[]> {
    const result = await this.collection
      .aggregate([
        {
          $match: {
            lang: params.lang,
            sign: params.sign,
            period: params.period
          }
        },
        { $sample: { size: params.limit } }
      ])
      .toArray();

    return result.map((item) => this.convertFromMongoDoc(item));
  }

  async createStorage() {
    await super.createStorage();
    await this.collection.createIndex({ lang: 1, period: 1, sign: 1 });
  }

  protected beforeCreate(data: Phrase) {
    // (<any>data)[RAND_KEY] = formatRandKey();

    return super.beforeCreate(data);
  }

  protected beforeUpdate(data: RepositoryUpdateData<Phrase>) {
    // if (data.set) {
    //     (<any>data.set)[RAND_KEY] = formatRandKey();
    // }

    return super.beforeUpdate(data);
  }

  protected convertFromMongoDoc(doc: any): Phrase {
    delete doc[RAND_KEY];

    return super.convertFromMongoDoc(doc);
  }
}

// function formatRandKey() {
//     return getRandomInt(9, 999999);
// }
