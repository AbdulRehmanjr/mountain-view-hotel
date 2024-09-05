

export default function LoadingPage() {

    return (
        <main className="col-span-12 flex flex-col items-center justify-center min-h-[calc(100vh_-_180px)]">
            <section className="flex gap-2">
                <div className="ease-linear rounded-full border-8 border-t-8 border-primary-foreground h-[4.5rem] md:h-32 w-[4.5rem] md:w-32 relative">
                    <div className="w-full h-full border-8 border-t-8 border-r-8 border-r-primary border-l-primary-foreground border-primary rounded-full animate-spin"></div>
                </div>
            </section>
        </main>
    )
}