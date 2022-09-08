import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Song} from "../song/song.entity";

@Entity("songwriters")
export class Songwriter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    appearance_year: Date;

    @OneToMany(type => Song, song => song.songwriter)
    songs: Song[]
}