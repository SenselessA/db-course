import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {Songwriter} from "../songwriter/songwriter.entity";
import {SongAward} from "../songAwards/songAward.entity";
import {Album} from "../albums/album.entity";

@Entity("songs")
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => Album, album => album.songs)
    album: Album;

    @Column()
    appearance_year: Date;

    @Column()
    genre: string

    @Column()
    rating: number

    @ManyToOne(type => Songwriter, songwriter => songwriter.songs)
    songwriter: Songwriter

    @OneToMany(type => SongAward, songAward => songAward.song)
    awards: SongAward[]
}