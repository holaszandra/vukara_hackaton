import { CreditCardIcon, LaptopIcon, UsersIcon } from "../../Icons";

export default function Challenge() {
    return (

        <section className="bg-[#800020] py-24 px-6 sm:px-16 text-center">
            <h2 className="text-3xl font-semibold text-black dark:text-zinc-50">
                The Challenge
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Many talented women entrepreneurs face:
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-12 max-w-7xl mx-auto">
                <div
                    className="flex flex-col items-center gap-4 max-w-xs p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition">
                    <CreditCardIcon />
                    <h3 className="text-xl font-medium text-black dark:text-zinc-50">
                        Lack of funding
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-center">
                        Access to capital remains one of the biggest barriers for women-led businesses.
                    </p>
                </div>

                <div
                    className="flex flex-col items-center gap-4 max-w-xs p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition">
                    <LaptopIcon />
                    <h3 className="text-xl font-medium text-black dark:text-zinc-50">
                        Limited skill-based support
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-center">
                        Founders often lack access to mentors, experts, and operational guidance.
                    </p>
                </div>

                <div
                    className="flex flex-col items-center gap-4 max-w-xs p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition">
                    <UsersIcon />
                    <h3 className="text-xl font-medium text-black dark:text-zinc-50">
                        Few meaningful connections
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-center">
                        Building strong peer networks and global visibility remains challenging.
                    </p>
                </div>
            </div>
        </section>
    );
}