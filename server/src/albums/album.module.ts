import {Module} from "@nestjs/common";
import {AlbumController} from "./album.controller";
import {AlbumService} from "./album.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Album} from "./album.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Album])],
    providers: [AlbumService],
    controllers: [AlbumController],
})
export class AlbumModule {}