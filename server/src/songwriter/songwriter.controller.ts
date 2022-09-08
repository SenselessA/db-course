import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateSongwriterDto, GetByDropPeriodDto} from "./songwriter.dto";
import {SongwriterService} from "./songwriter.service";

@Controller('/songwriters')
export class SongwriterController {
    constructor(private songwriterService: SongwriterService) {}

    @Post()
    async create(@Body() createSongwriterDto: CreateSongwriterDto) {
        return this.songwriterService.create(createSongwriterDto)
    }

    @Get()
    async getAll() {
        return this.songwriterService.findAll()
    }

    @Post('with-drop-period')
    getByDropPeriod(@Body() getByDropPeriod: GetByDropPeriodDto) {
        return this.songwriterService.getByDropPeriod(getByDropPeriod)
    }

    @Get('top10')
    getTop10ByAwards() {
        return this.songwriterService.getTop10ByAwards()
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.songwriterService.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() createSongwriterDto: CreateSongwriterDto) {
        return this.songwriterService.update(id, createSongwriterDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.songwriterService.remove(id)
    }
}