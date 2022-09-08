import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpService} from "../../api/httpService";
import {useForm} from "react-hook-form";

export const SONGWRITERS = 'songwriters'
const SONGWRITERS_TOP_10 = 'songwriters/top10'

const Songwriters = () => {
    const queryClient = useQueryClient()
    const [current, setCurrent] = useState('')

    const {data} = useQuery([SONGWRITERS], async () => {
        const { data } = await httpService.get(SONGWRITERS)
        return data
    })

    const {data: top10data} = useQuery([SONGWRITERS_TOP_10], async () => {
        const { data } = await httpService.get(SONGWRITERS_TOP_10)
        return data
    })

    const {data: getByPeriodData, mutate: getDropPeriod} = useMutation(
        [`${SONGWRITERS}/with-drop-period`],
        async (reqData) => {
            console.log(reqData)

            const getData = {
                endDate: new Date(reqData.endDate),
                startDate: new Date (reqData.startDate)
            }

            const { data } = await httpService.post(`${SONGWRITERS}/with-drop-period`, getData)
            return data
        }
    )

    const {
        register: getByPeriodRegister,
        handleSubmit: handleSubmitGetByPeriod,
    } = useForm();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { register: editRegister, handleSubmit: handleEditSubmit, reset: resetEditState } = useForm();

    const {mutate: editMutation} = useMutation(async (data) => {
        await httpService.put(`${SONGWRITERS}/${current}`, data)
    }, {
        onSuccess: () => {
            reset()
            queryClient.invalidateQueries([SONGWRITERS_TOP_10])
            return queryClient.invalidateQueries([SONGWRITERS])
        },
    })

    const {mutate: createMutation} = useMutation(async (data) => {
        await httpService.post(SONGWRITERS, data)
    }, {
        onSuccess: () => {
            reset()
            return queryClient.invalidateQueries([SONGWRITERS])
        },
    })

    const {mutate: removeMutation} = useMutation(async (removeId) => {
        await httpService.delete(`${SONGWRITERS}/${removeId}`)
    }, {
        onSuccess: () => {
            setCurrent('');
            return queryClient.invalidateQueries([SONGWRITERS])},
    })

    return (
        <section className={'p-4 my-6 shadow-xl bg-white'}>
            <h2 className={'my-5 text-center text-2xl'}>Исполнители</h2>

            <div className={'flex gap-x-5'}>
                <div className={'flex flex-col gap-y-1'}>
                    {data?.map(songwriter => {
                        return <div
                            key={songwriter.id}
                            className={'flex gap-x-2'}
                            onClick={() => setCurrent(songwriter.id)}
                        >
                            <button
                                onClick={() => {
                                    removeMutation(songwriter.id)
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

                            <span>{songwriter.name}</span>
                            |
                            <span>Год появления: {new Date(songwriter.appearance_year).getFullYear()}</span>
                        </div>
                    })}
                </div>

                <form
                    onSubmit={handleEditSubmit(editMutation)}>
                    <div className="overflow-hidden shadow sm:rounded-md">
                        <h3 className={'text-center my-4'}>Редактировать (выберите из списка слева)</h3>
                        {current && <p className={'text-center my-4'}>
                            Вы редактируете id
                            {current} - {data?.find(item => item.id === current).name} - {new Date(data?.find(item => item.id === current).appearance_year).getFullYear()}
                        </p>}

                        <div className="bg-white px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                        Имя исполнителя
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
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Год появления исполнителя
                                    </label>
                                    <input
                                        {...editRegister("appearance_year")}
                                        type="date"
                                        autoComplete="appearance_year"
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
                                        Имя исполнителя
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
                                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                        Год появления исполнителя
                                    </label>
                                    <input
                                        {...register("appearance_year")}
                                        type="date"
                                        autoComplete="appearance_year"
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

                    <div className={'flex flex-col gap-y-1 items-center mb-5'}>
                        <h3 className={'text-center my-4'}>Исполнителей, которые выпустили хотя бы один альбом за период</h3>

                        <form className={'w-3/12'} onSubmit={handleSubmitGetByPeriod(getDropPeriod)}>
                            <input
                                {...getByPeriodRegister("startDate")}
                                type="date"
                                autoComplete="startDate"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <input
                                {...getByPeriodRegister("endDate")}
                                type="date"
                                autoComplete="endDate"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />

                            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Получить
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className={'flex flex-col gap-y-1 items-center'}>
                        {getByPeriodData?.map(songwriter => {
                            return <div key={songwriter.id} className={'flex gap-x-2'}>
                                <span>{songwriter.name}</span>
                                |
                                <span>Год появления: {new Date(songwriter.appearance_year).getFullYear()}</span>
                            </div>
                        })}
                    </div>
                </div>

                <div>
                    <h3 className={'text-center my-4'}>Топ 10 исполнителей по количеству наград</h3>

                    <div className={'flex flex-col gap-y-1 items-center'}>
                        {top10data?.map(songwriter => {
                            return <div key={songwriter.id} className={'flex gap-x-2'}>
                                <span>{songwriter.name}</span>
                                |
                                <span>Год появления: {new Date(songwriter.appearance_year).getFullYear()}</span>
                            </div>
                        })}
                    </div>
                </div>

            </div>

        </section>
    );
};

export default Songwriters;