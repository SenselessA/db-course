import {Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {Songwriter} from "./songwriter.entity";
import {Repository} from "typeorm";
import {CreateSongwriterDto, GetByDropPeriodDto} from "./songwriter.dto";
import {Song} from "../song/song.entity";
import {SongAward} from "../songAwards/songAward.entity";
import {Album} from "../albums/album.entity";

@Injectable()
export class SongwriterService {
    constructor(
        @InjectRepository(Songwriter)
        private songwriterRepository: Repository<Songwriter>,
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
    ) {}

    create({name, appearance_year}: CreateSongwriterDto) {
        return this.songwriterRepository.save({name, appearance_year: new Date(appearance_year)});
    }

    findAll(): Promise<Songwriter[]> {
        return this.songwriterRepository.find({
            relations: {
                songs: {
                    awards: true,
                    album: true
                }
            },
        });
    }

    getTop10ByAwards() {
        return this.songwriterRepository.createQueryBuilder('sw')
            .select(['sw.id AS id', 'sw.name AS name', 'sw.appearance_year AS appearance_year'])
            .leftJoin(Song, 's', 's.songwriter = sw.id')
            .leftJoin(SongAward, 'sa', 'sa.song = s.id').groupBy('sw.id')
            .orderBy('count(sa.id)', "DESC").addOrderBy("sw.id").limit(10).execute()
    }

    getByDropPeriod({startDate, endDate}: GetByDropPeriodDto) {
        const dates = {
            start: new Date(startDate),
            end: new Date(endDate)
        }

        return this.songwriterRepository.createQueryBuilder('sw')
            .select(['sw.id AS id', 'sw.name AS name', 'sw.appearance_year AS appearance_year'])
            .leftJoin(Song, 's', 's.songwriter = sw.id')
            .leftJoin(Album, 'al', 's.album = al.id')
            .where('s.appearance_year BETWEEN :start and :end', {start: dates.start, end: dates.end})
            .groupBy('sw.id').orderBy('sw.name').execute()
    }

    findOne(id: number): Promise<Songwriter> {
        return this.songwriterRepository.findOneBy({ id });
    }

    update(id: number, data: CreateSongwriterDto) {
        return this.songwriterRepository.update(id, {name: data.name, appearance_year: new Date(data.appearance_year)})
    }

    remove(id: string) {
        return this.songwriterRepository.delete(id);
    }
}