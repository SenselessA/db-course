import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpService} from "../../api/httpService";
import {useForm} from "react-hook-form";
import {SONGWRITERS} from "../songwriters";

const SONGS = 'songs'
const SONGS_BY_YEAR = 'songs/count-by-genre-from-year/'

const Songs = () => {
    const queryClient = useQueryClient()
    const [current, setCurrent] = useState('')
    const [getByYear, setGetByYear] = useState('')

    const {data} = useQuery([SONGS], async () => {
        const { data } = await httpService.get(SONGS)
        return data
    })

    const {data: dataAlbums} = useQuery(['albums'], async () => {
        const { data } = await httpService.get('albums')
        return data
    })

    const {data: dataSongwriters} = useQuery([SONGWRITERS], async () => {
        const { data } = await httpService.get(SONGWRITERS)
        return data
    })

    const {data: dataSongAwards} = useQuery(['awards'], async () => {
        const { data } = await httpService.get('song-awards')
        return data
    })

    const {data: songsGenreYearData, refetch: refetchByYear, } = useQuery([SONGS_BY_YEAR], async () => {
        const { data } = await httpService.get(SONGS_BY_YEAR + new Date(getByYear).getFullYear())
        return data
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: editRegister, handleSubmit: handleEditSubmit, reset: resetEditState } = useForm();

    const {mutate: editMutation} = useMutation(async (data) => {
        await httpService.put(`${SONGS}/${current}`, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([SONGS])
        },
    })

    const {mutate: createMutation} = useMutation(async (data) => {
        await httpService.post(SONGS, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([SONGS])
        },
    })

    const {mutate: removeMutation} = useMutation(async (removeId) => {
        await httpService.delete(`${SONGS}/${removeId}`)
    }, {
        onSuccess: () => {
            setCurrent('');
            return queryClient.invalidateQueries([SONGS])},
    })

    return (
        <section className={'p-4 my-6 shadow-xl bg-white'}>
            <h2 className={'my-5 text-center text-2xl'}>Список треков</h2>

            <div className={'flex gap-x-5'}>
                <div className={'flex flex-col gap-y-1'}>
                    {data?.map(song => {
                        return <div
                            key={song.id}
                            className={'flex gap-x-2'}
                            onClick={() => setCurrent(song.id)}
                        >
                            <button
                                onClick={() => {
                                    removeMutation(song.id)
                                }}
                                type="button"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close panel</span>
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>

                            <span>{song.name}</span>
                            |
                            <span>Год появления: {new Date(song.appearance_year).getFullYear()}</span>
                        </div>
                    })}
                </div>

                <form
                    onSubmit={handleEditSubmit(editMutation)}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                        <h3 className={'text-center my-4'}>Редактировать (выберите из списка слева)</h3>
                        {current && <p className={'text-center my-4'}>
                            Вы редактируете id
                            {current} - {data?.find(item => item.id === current)?.name}
                        </p>}

                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        Название песни
                                    </label>

                                    <input
                                        {...editRegister("name", {required: true})}
                                        type="text"
                                        id="name"
                                        autoComplete="given-name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.name && <span>Поле обязательно для заполнения</span>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="appearance_year" className="block text-sm font-medium text-gray-700">
                                        Год появления песни
                                    </label>
                                    <input
                                        {...editRegister("appearance_year")}
                                        type="date"
                                        autoComplete="appearance_year"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="album" className="block text-sm font-medium text-gray-700">
                                        Альбом
                                    </label>

                                    <select {...editRegister("album")}>
                                        <option key={'null'} value={null} selected={true}>
                                            без альбома
                                        </option >
                                        {dataAlbums?.map(album => {
                                            return <option key={album.id} value={album.id}>
                                                {album.title}
                                            </option >
                                        })}
                                    </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="songwriter" className="block text-sm font-medium text-gray-700">
                                        Исполнитель
                                    </label>

                                    <select {...editRegister("songwriter")}>
                                        <option key={'null'} value={null} selected={true}>
                                            без исполнителя
                                        </option>
                                        {dataSongwriters?.map(songwriter => {
                                            return <option key={songwriter.id} value={songwriter.id}>
                                                {songwriter.name}
                                            </option >
                                        })}
                                    </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                        Жанр
                                    </label>

                                    <input
                                        {...editRegister("genre")}
                                        type="text"
                                        id="genre"
                                        autoComplete="genre"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                        Рейтинг
                                    </label>

                                    <input
                                        {...editRegister("rating", {min: 0, max: 10})}
                                        type="number"
                                        id="rating"
                                        autoComplete="rating"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </form>

                <form
                    onSubmit={handleSubmit(createMutation)}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                        <h3 className={'text-center my-4'}>Создать</h3>

                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        Название песни
                                    </label>

                                    <input
                                        {...register("name", {required: true})}
                                        type="text"
                                        id="name"
                                        autoComplete="given-name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.name && <span>Поле обязательно для заполнения</span>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="appearance_year" className="block text-sm font-medium text-gray-700">
                                        Год появления песни
                                    </label>
                                    <input
                                        {...register("appearance_year")}
                                        type="date"
                                        autoComplete="appearance_year"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="album" className="block text-sm font-medium text-gray-700">
                                        Альбом
                                    </label>

                                    <select {...register("album")}>
                                        <option key={'null'} value={null} selected={true}>
                                            без альбома
                                        </option >
                                        {dataAlbums?.map(album => {
                                            return <option key={album.id} value={album.id}>
                                                {album.title}
                                            </option >
                                        })}
                                    </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="songwriter" className="block text-sm font-medium text-gray-700">
                                        Исполнитель
                                    </label>

                                    <select {...register("songwriter")}>
                                        <option key={'null'} value={null} selected={true}>
                                            без исполнителя
                                        </option>
                                        {dataSongwriters?.map(songwriter => {
                                            return <option key={songwriter.id} value={songwriter.id}>
                                                {songwriter.name}
                                            </option >
                                        })}
                                    </select>
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                                        Жанр
                                    </label>

                                    <input
                                        {...register("genre")}
                                        type="text"
                                        id="genre"
                                        autoComplete="genre"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                        Рейтинг
                                    </label>

                                    <input
                                        {...register("rating", {min: 0, max: 10})}
                                        type="number"
                                        id="rating"
                                        autoComplete="rating"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div>

                <div className={'my-20'}>

                    <div className={'flex flex-col gap-y-1 items-center mb-5 w-3/12 ml-auto mr-auto'}>
                        <h3 className={'text-center my-4'}>Количество песен, которые были выпущены в заданном году</h3>
                        <input
                            value={getByYear}
                            onChange={(e) => setGetByYear(e.target.value)}
                            type="month"
                            autoComplete="year"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />

                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                onClick={() => {
                                    refetchByYear()
                                }}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Получить
                            </button>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-y-1 items-center'}>
                        {songsGenreYearData && songsGenreYearData[0] ? songsGenreYearData.map(song => {
                            return <div key={song.genre} className={'flex gap-x-2'}>
                                <span>Жанр: {song.genre}</span>
                                |
                                <span>Количество: {song.count}</span>
                            </div>
                        }) : <h3>Нет песен по заданному году</h3>}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Songs;