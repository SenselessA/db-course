import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpService} from "../../api/httpService";
import {useForm} from "react-hook-form";
import {SONGWRITERS} from "../songwriters";

const ALBUMS = 'albums'
const AlbumsByGenre = 'albums/top-by-genre'

const Albums = () => {
    const queryClient = useQueryClient()
    const [current, setCurrent] = useState('')
    const [getByGenre, setGetByGenre] = useState('')

    const {data: dataAlbums} = useQuery([ALBUMS], async () => {
        const { data } = await httpService.get(ALBUMS)
        return data
    })

    const {data: topAlbumByGenre, mutate: getAlbumsByGenre} = useMutation(async () => {
        const { data } = await httpService.post(AlbumsByGenre, {genres: getByGenre.split(' ')})
        return data
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: editRegister, handleSubmit: handleEditSubmit } = useForm();

    const {mutate: editMutation} = useMutation(async (data) => {
        await httpService.put(`${ALBUMS}/${current}`, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([ALBUMS])
        },
    })

    const {mutate: createMutation} = useMutation(async (data) => {
        await httpService.post(ALBUMS, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([ALBUMS])
        },
    })

    const {mutate: removeMutation} = useMutation(async (removeId) => {
        await httpService.delete(`${ALBUMS}/${removeId}`)
    }, {
        onSuccess: () => {
            setCurrent('');
            return queryClient.invalidateQueries([ALBUMS])},
    })

    return (
        <section className={'p-4 my-6 shadow-xl bg-white'}>
            <h2 className={'my-5 text-center text-2xl'}>Список Альбомов</h2>

            <div className={'flex gap-x-5'}>
                <div className={'flex flex-col gap-y-1'}>
                    {dataAlbums?.map(album => {
                        return <div
                            key={album.id}
                            className={'flex gap-x-2'}
                            onClick={() => setCurrent(album.id)}
                        >
                            <button
                                onClick={() => {
                                    removeMutation(album.id)
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

                            <span>{album.title}</span>
                        </div>
                    })}
                </div>

                <form
                    onSubmit={handleEditSubmit(editMutation)}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                        <h3 className={'text-center my-4'}>Редактировать (выберите из списка слева)</h3>
                        {current && <p className={'text-center my-4'}>
                            Вы редактируете id
                            {current} - {dataAlbums?.find(item => item.id === current)?.title}
                        </p>}

                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Название альбома
                                    </label>

                                    <input
                                        {...editRegister("title", {required: true})}
                                        type="text"
                                        id="title"
                                        autoComplete="title"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.title && <span>Поле обязательно для заполнения</span>}
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
                                    <label htmlFor="create-title" className="block text-sm font-medium text-gray-700">
                                        Название альбома
                                    </label>

                                    <input
                                        {...register("title", {required: true})}
                                        type="text"
                                        id="create-title"
                                        autoComplete="create-title"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.title && <span>Поле обязательно для заполнения</span>}
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
                        <h3 className={'text-center my-4'}>Альбом с самыми высокими рейтингами по переданному жанру</h3>
                        <p className={'text-center my-0'}>Можно ввести несколько, через пробел</p>
                        <input
                            value={getByGenre}
                            onChange={(e) => setGetByGenre(e.target.value)}
                            type="text"
                            autoComplete="genre"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />

                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                onClick={() => {
                                    getAlbumsByGenre()
                                }}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Получить
                            </button>
                        </div>
                    </div>

                    <div className={'flex flex-col gap-y-1 items-center'}>
                        {topAlbumByGenre && <p>По переданному жанру лучший альбом по рейтингу: {topAlbumByGenre.title}</p>}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Albums;