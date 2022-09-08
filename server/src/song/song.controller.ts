import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateSongDto} from "./song.dto";
import {SongService} from "./song.service";

@Controller('/songs')
export class SongController {
    constructor(private songService: SongService) {}

    @Post()
    async create(@Body() createSongDto: CreateSongDto) {
        console.log('createSongDto', createSongDto);
        return this.songService.create(createSongDto)
    }

    @Get()
    async getAll() {
        return this.songService.findAll()
    }

    // По каждому жанру вывести количество песен, которые были выпущены в году, заданном пользователем
    @Get('count-by-genre-from-year/:year')
    getCountByGenre(@Param('year') year: number) {
        return this.songService.getCountByGenre(year)
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.songService.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() createSongDto: CreateSongDto) {
        return this.songService.update(id, createSongDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.songService.remove(id)
    }
}