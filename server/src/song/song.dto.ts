import {Songwriter} from "../songwriter/songwriter.entity";
import {SongAward} from "../songAwards/songAward.entity";
import {Album} from "../albums/album.entity";

export class CreateSongDto {
    name: string;
    album: Album | null;
    appearance_year: Date;
    genre: string
    rating: number
    songwriter: Songwriter
    awards: SongAward[]
}