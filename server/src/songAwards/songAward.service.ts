import {Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from "typeorm";
import {SongAward} from "./songAward.entity";
import {CreateSongAwardDto} from "./songAward.dto";

@Injectable()
export class SongAwardService {
    constructor(
        @InjectRepository(SongAward)
        private songAwardRepository: Repository<SongAward>,
    ) {}

    create(createSongAward: CreateSongAwardDto) {
        return this.songAwardRepository.save(createSongAward);
    }

    findAll(): Promise<SongAward[]> {
        return this.songAwardRepository.find({relations: ['song']});
    }

    findOne(id: number): Promise<SongAward> {
        return this.songAwardRepository.findOneBy({ id });
    }

    update(id: number, updateSongAward: CreateSongAwardDto) {
        return this.songAwardRepository.update(id, updateSongAward)
    }

    remove(id: string) {
        return this.songAwardRepository.delete(id);
    }
}