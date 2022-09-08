import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateAlbumDto, RatingGenresDto} from "./album.dto";
import {AlbumService} from "./album.service";

@Controller('/albums')
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Post()
    async create(@Body() createSongwriterDto: CreateAlbumDto) {
        return this.albumService.create(createSongwriterDto)
    }

    @Get()
    async getAll() {
        return this.albumService.findAll()
    }

    @Post('top-by-genre')
    async getTopByGenre(@Body() genres: RatingGenresDto) {
        return this.albumService.findTopByGenre(genres)
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.albumService.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() createSongwriterDto: CreateAlbumDto) {
        return this.albumService.update(id, createSongwriterDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.albumService.remove(id)
    }
}