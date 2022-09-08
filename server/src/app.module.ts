import 'dotenv/config';
import { Module } from '@nestjs/common';
import {SongwriterModule} from "./songwriter/songwriter.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import {Songwriter} from "./songwriter/songwriter.entity";
import {SongAward} from "./songAwards/songAward.entity";
import {Song} from "./song/song.entity";
import {SongAwardModule} from "./songAwards/songAward.module";
import {SongModule} from "./song/song.module";
import {AlbumModule} from "./albums/album.module";
import {Album} from "./albums/album.entity";

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: Number(process.env["DB_PORT"]),
        username: 'postgres',
        password: String(process.env["DB_PASSWORD"]),
        database: 'playlist',
        entities: [Songwriter, SongAward, Song, Album],
        synchronize: true,
      }),
      SongwriterModule,
      SongAwardModule,
      SongModule,
      AlbumModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
