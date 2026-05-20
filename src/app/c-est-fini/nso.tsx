import type { Metadata } from "next"
import { Instrument_Serif } from "next/font/google"

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
})

export const metadata: Metadata = {
    title: "C'est fini.",
}

export default function nso() {
    return (
        <main
            className={`${instrumentSerif.className} flex min-h-screen items-center justify-center bg-background px-6 text-center text-2xl leading-relaxed tracking-tight text-foreground sm:text-3xl`}
        >
            <div className="max-w-3xl space-y-6">
                <p>
                    Elle est retrouvée.<br />
                    Quoi ? – L’Eternité.<br />
                    C’est la mer allée<br />
                    Avec le soleil.
                </p>
                <p>
                    Ame sentinelle,<br />
                    Murmurons l’aveu<br />
                    De la nuit si nulle<br />
                    Et du jour en feu.
                </p>
                <p>
                    Des humains suffrages,<br />
                    Des communs élans<br />
                    Là tu te dégages<br />
                    Et voles selon.
                </p>
                <p>
                    Puisque de vous seules,<br />
                    Braises de satin,<br />
                    Le Devoir s’exhale<br />
                    Sans qu’on dise : enfin.
                </p>
                <p>
                    Là pas d’espérance,<br />
                    Nul orietur.<br />
                    Science avec patience,<br />
                    Le supplice est sûr.
                </p>
                <p>
                    Elle est retrouvée.<br />
                    Quoi ? – L’Eternité.<br />
                    C’est la mer allée<br />
                    Avec le soleil.
                </p>
                <p className="pt-2 text-lg sm:text-xl">
                    Arthur Rimbaud, <em>Derniers vers</em>
                </p>
            </div>
        </main>
    )
}
