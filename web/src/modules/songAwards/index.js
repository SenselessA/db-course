import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpService} from "../../api/httpService";
import {useForm} from "react-hook-form";
import {SONGWRITERS} from "../songwriters";

const SONG_AWARDS = 'song-awards'

const SongAwards = () => {
    const queryClient = useQueryClient()
    const [current, setCurrent] = useState('')

    const {data: dataAwards} = useQuery([SONG_AWARDS], async () => {
        const { data } = await httpService.get(SONG_AWARDS)
        return data
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: editRegister, handleSubmit: handleEditSubmit } = useForm();

    const {mutate: editMutation} = useMutation(async (data) => {

        await httpService.put(`${SONG_AWARDS}/${current}`, {...data, song: {id: Number(data.song)}})
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([SONG_AWARDS])
        },
    })

    const {mutate: createMutation} = useMutation(async (data) => {
        await httpService.post(SONG_AWARDS, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([SONG_AWARDS])
        },
    })

    const {mutate: removeMutation} = useMutation(async (removeId) => {
        await httpService.delete(`${SONG_AWARDS}/${removeId}`)
    }, {
        onSuccess: () => {
            setCurrent('');
            return queryClient.invalidateQueries([SONG_AWARDS])},
    })

    return (
        <section className={'p-4 my-6 shadow-xl bg-white'}>
            <h2 className={'my-5 text-center text-2xl'}>Список Наград</h2>

            <div className={'flex gap-x-5'}>
                <div className={'flex flex-col gap-y-1'}>
                    {dataAwards?.map(award => {
                        return <div
                            key={award.id}
                            className={'flex gap-x-2'}
                            onClick={() => setCurrent(award.id)}
                        >
                            <button
                                onClick={() => {
                                    removeMutation(award.id)
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

                            <div className={'flex flex-col my-3'}>
                                <div>{award.title}</div>
                                {award.song ? <div className={'mt-1 text-lime-700'}>id: {award.song.id}<div>{award.song.name}</div></div> :
                                    <div className={'text-yellow-700'}>нет трека</div>}
                            </div>
                        </div>
                    })}
                </div>

                <form
                    onSubmit={handleEditSubmit(editMutation)}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                        <h3 className={'text-center my-4'}>Редактировать (выберите из списка слева)</h3>
                        {current && <p className={'text-center my-4'}>
                            Вы редактируете id
                            {current} - {dataAwards?.find(item => item.id === current)?.title}
                        </p>}

                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="award-title" className="block text-sm font-medium text-gray-700">
                                        Название награды
                                    </label>

                                    <input
                                        {...editRegister("title", {required: true})}
                                        type="text"
                                        id="award-title"
                                        autoComplete="award-title"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.title && <span>Поле обязательно для заполнения</span>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="award-title" className="block text-sm font-medium text-gray-700">
                                        Введите id песни, к которой хотите прикрепить награду
                                    </label>

                                    <input
                                        {...editRegister("song", {required: true})}
                                        type="text"
                                        id="award-song-id"
                                        autoComplete="award-song-id"
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
                                    <label htmlFor="create-award-title" className="block text-sm font-medium text-gray-700">
                                        Название альбома
                                    </label>

                                    <input
                                        {...register("title", {required: true})}
                                        type="text"
                                        id="create-award-title"
                                        autoComplete="create-award-title"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    {errors.title && <span>Поле обязательно для заполнения</span>}
                                </div>

                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="award-title" className="block text-sm font-medium text-gray-700">
                                        Введите id песни, к которой хотите прикрепить награду
                                    </label>

                                    <input
                                        {...register("song", {required: true})}
                                        type="text"
                                        id="award-song-id"
                                        autoComplete="award-song-id"
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
        </section>
    );
};

export default SongAwards;