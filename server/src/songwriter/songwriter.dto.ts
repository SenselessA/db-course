export class CreateSongwriterDto {
    name: string;
    appearance_year: Date;
}

export class GetByDropPeriodDto {
    startDate: Date;
    endDate: Date;
}