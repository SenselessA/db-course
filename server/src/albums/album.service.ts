import {Injectable} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {Album} from "./album.entity";
import {Repository} from "typeorm";
import {CreateAlbumDto, RatingGenresDto} from "./album.dto";
import {Song} from "../song/song.entity";

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
    ) {}

    create({title}: CreateAlbumDto) {
        return this.albumRepository.save({title});
    }

    findAll(): Promise<Album[]> {
        return this.albumRepository.find({relations: ['songs']});
    }

    findTopByGenre(ratingGenresDto: RatingGenresDto): Promise<Album> {
        return this.albumRepository.createQueryBuilder('al')
            .leftJoin(Song, 's', 's.album = al.id')
            .where('s.genre IN (:...genres)', {genres: ratingGenresDto.genres})
            .orderBy('AVG (s.rating)', 'DESC')
            .groupBy('al.id').getOne();

       /* return this.albumRepository.createQueryBuilder('al')
            .leftJoin(Song, 's', 's.album = al.id')
            .orderBy("avg(s.rating) filter (where s.genre IN (:...genres))", 'DESC', 'NULLS LAST')
            .setParameter('genres', ratingGenresDto.genres)
            .groupBy('al.id').execute();*/
    }


    findOne(id: number): Promise<Album> {
        return this.albumRepository.findOneBy({ id });
    }

    update(id: number, {title}: CreateAlbumDto) {
        return this.albumRepository.update(id, {title})
    }

    remove(id: string) {
        return this.albumRepository.delete(id);
    }
}