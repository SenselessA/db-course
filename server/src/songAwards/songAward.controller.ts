import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateSongAwardDto} from "./songAward.dto";
import {SongAwardService} from "./songAward.service";

@Controller('/song-awards')
export class SongAwardController {
    constructor(private songAwardService: SongAwardService) {}

    @Post()
    async create(@Body() createSongAwardDto: CreateSongAwardDto) {
        return this.songAwardService.create(createSongAwardDto)
    }

    @Get()
    async getAll() {
        return this.songAwardService.findAll()
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.songAwardService.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() createSongAwardDto: CreateSongAwardDto) {
        return this.songAwardService.update(id, createSongAwardDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.songAwardService.remove(id)
    }
}