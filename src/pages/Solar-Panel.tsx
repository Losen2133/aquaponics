import TitleSetter from "@/components/utilities/titlesetter"

const Solar = () => {
    return (
        <div className="min-h-screen font-sans antialiased">
            <TitleSetter title="Solar Panel" />
            <main className="container mx-auto p-5 text-center">
                <p>This is the Solar Panel</p>
                <center>
                    {/* measuring solarpanel outputs */}
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/SRSBpCSN5Yg?si=IEaluGNugJ0ADbsd" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    {/* possible for measuring power draw to battery */}
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/ybALaMkfFOA?si=K27e96J3zApeENM1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                {/* add voltage, voltage over time, */}
                </center>
            </main>
        </div>
    );
}

export default Solar