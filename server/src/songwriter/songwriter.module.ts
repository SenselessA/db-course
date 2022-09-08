import {Module} from "@nestjs/common";
import {SongwriterController} from "./songwriter.controller";
import {SongwriterService} from "./songwriter.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Songwriter} from "./songwriter.entity";
import {Song} from "../song/song.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Songwriter, Song])],
    providers: [SongwriterService],
    controllers: [SongwriterController],
})
export class SongwriterModule {}