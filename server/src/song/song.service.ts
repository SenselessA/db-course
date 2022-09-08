import {Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from "typeorm";
import {Song} from "./song.entity";
import {CreateSongDto} from "./song.dto";
import {SongAward} from "../songAwards/songAward.entity";

@Injectable()
export class SongService {
    constructor(
        @InjectRepository(Song)
        private songRepository: Repository<Song>,
        @InjectRepository(SongAward)
        private songAwardRepository: Repository<SongAward>,
    ) {}

    async create(createSongData: CreateSongDto) {
        const data = createSongData;
        data.appearance_year = new Date(data.appearance_year);

        return this.songRepository.insert(data);
    }

    findAll(): Promise<Song[]> {
        return this.songRepository.find({relations: ['songwriter', 'album', 'awards']});
    }

    findOne(id: number): Promise<Song> {
        return this.songRepository.findOneBy({ id });
    }

    update(id: number, createSong: CreateSongDto) {
        const data = createSong;
        data.appearance_year = data.appearance_year && new Date(data.appearance_year);
        return this.songRepository.update(id, data)
    }

    remove(id: string) {
        return this.songRepository.delete(id);
    }

    getCountByGenre(year: number) {
        return this.songRepository.createQueryBuilder().select('genre')
            .addSelect('count(id)')
            .where(`date_part('year', "appearance_year") = :year`, {year: Number(year)})
            .groupBy('genre').execute()
    }
}