import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Song} from "../song/song.entity";

@Entity("song_awards")
export class SongAward {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(type => Song, song => song.id)
    song: Song
}