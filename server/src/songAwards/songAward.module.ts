import {Module} from "@nestjs/common";
import {SongAwardController} from "./songAward.controller";
import {SongAwardService} from "./songAward.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SongAward} from "./songAward.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SongAward])],
    providers: [SongAwardService],
    controllers: [SongAwardController],
})
export class SongAwardModule {}