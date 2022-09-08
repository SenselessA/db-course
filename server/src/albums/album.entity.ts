import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Song} from "../song/song.entity";

@Entity("albums")
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(type => Song, song => song.album)
    songs: Song[]
}