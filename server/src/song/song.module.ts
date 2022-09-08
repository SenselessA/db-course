import {Module} from "@nestjs/common";
import {SongController} from "./song.controller";
import {SongService} from "./song.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Song} from "./song.entity";
import {SongAward} from "../songAwards/songAward.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Song, SongAward])],
    providers: [SongService],
    controllers: [SongController],
})
export class SongModule {}