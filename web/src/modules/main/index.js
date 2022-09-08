import React from 'react';
import Songwriters from "../songwriters";
import Songs from "../songs";
import Albums from "../albums";
import SongAwards from "../songAwards";

const Main = () => {
    return (
        <>

            <div className={'mx-auto w-fit'}>
                <h1 className={'text-center py-8'}>Плейлист</h1>

                <div className={'flex flex-col gap-y-20'}>
                    <Songwriters />
                    <Songs />
                    <Albums />
                    <SongAwards />
                </div>

            </div>
        </>
    );
};

export default Main;