import React from "react";
import {Grid, Dna, Audio, MagnifyingGlass, MutatingDots, RotatingTriangles, Vortex} from 'react-loader-spinner';

export default function Loading() {

    return (
        <div style={{width:"100%",height:"75vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
            <MutatingDots
                height="100"
                width="100"
                color="navy"
                secondaryColor= 'orange'
                radius='12.5'
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );

}
