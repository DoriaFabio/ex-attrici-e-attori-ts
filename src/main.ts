type Person = {
    readonly id: number,
    readonly name: string,
    birth_year: number,
    death_year?: number,
    biography: string,
    image: string
}

type Actress = {
    most_famous_movies: [string, string, string];
    awards: string;
    nazionality: "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese"
}

//! 📌 Milestone 2
//* Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
//?     most_famous_movies: una tuple di 3 stringhe
//?     awards: una stringa
//?     nationality: una stringa tra un insieme definito di valori.
//?         Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

