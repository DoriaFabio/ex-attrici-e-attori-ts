//! Definizione del tipo base "Person" con proprietà comuni a tutte le persone
type Person = {
    readonly id: number,      // ID univoco (non modificabile)
    readonly name: string,    // Nome della persona (non modificabile)
    birth_year: number,       // Anno di nascita
    death_year?: number,      // Anno di morte (facoltativo)
    biography: string,        // Biografia in formato testo
    image: string             // URL dell'immagine
}

//! Estensione del tipo Person per creare il tipo Actress
type Actress = Person & {
    most_famous_movies: [string, string, string];  // Esattamente 3 film famosi
    awards: string;                                // Premi ricevuti
    nazionality: "American" | "British" | "Australian" | "Israeli-American" |
    "South African" | "French" | "Indian" | "Israeli" | "Spanish" |
    "South Korean" | "Chinese";       // Nazionalità limitata a questi valori
}

//! Type guard per verificare se un oggetto sconosciuto è di tipo Actress
function isActress(dati: unknown): dati is Actress {
    return (
        typeof dati === "object" && dati != null &&                             // Controlla che sia un oggetto
        "id" in dati && typeof dati.id === "number" &&                          // id è un numero
        "name" in dati && typeof dati.name === "string" &&                      // name è una stringa
        "birth_year" in dati && typeof dati.birth_year === "number" &&          // birth_year è un numero
        ("death_year" in dati ? typeof dati.death_year === "number" : true) &&  // death_year è un numero (qui è opzionale, vedi nota sotto)
        "biography" in dati && typeof dati.biography === "string" &&            // biography è una stringa
        "image" in dati && typeof dati.image === "string" &&                    // image è una stringa (URL)
        "most_famous_movies" in dati && dati.most_famous_movies instanceof Array &&  // Deve essere un array
        dati.most_famous_movies.length === 3 && dati.most_famous_movies.every(m => typeof m === "string") && // Deve avere esattamente 3 stringhe
        "awards" in dati && typeof dati.awards === "string" &&                  // awards è una stringa
        "nationality" in dati && typeof dati.nationality === "string"           // nationality è una stringa (verifica del valore non stretta)
    )
}

//! Funzione asincrona per ottenere un'attrice dal server tramite ID
async function getActress(id: number): Promise<Actress | null> {
    try {
        //? Effettua una richiesta GET all'endpoint API locale
        const res = await fetch(`http://localhost:5000/actresses/${id}`)
        //? Parsea il corpo della risposta come JSON
        const dati: unknown = await res.json();
        //? Verifica che i dati ricevuti siano compatibili con il tipo Actress
        if (!isActress(dati)) {
            throw new Error("Formato dei dati non valido")
        }
        return dati;  //? Se tutto è valido, restituisce l'oggetto Actress

    } catch (error) {
        //? Gestione degli errori con stampa a console
        if (error instanceof Error) {
            console.error("Errore durante il recupero dell'attrice:", error);
        } else {
            console.error("Errore sconosciuto:", error);
        }
        //? In caso di errore, restituisce null
        return null;
    }
}

//! Funzione asincrona per ottenere l'elenco delle attrici
async function getAllActresses(): Promise<Actress[]> {
    try {
        //? Effettua una richiesta GET all'endpoint API
        const res = await fetch("http://localhost:5000/actresses")
        //? Parsea il corpo della risposta come JSON
        const dati: unknown = await res.json();
        //? Verifica che i dati ricevuti siano compatibili con il tipo Actress
        if (!(dati instanceof Array)) {
            throw new Error("Formato dei dati non valido");
        }
        //? Creo un array con i dati di isActress
        const attriciValide: Actress[] = dati.filter(isActress)
        return attriciValide;  //? Se tutto è valido, restituisco l'array Actress
    } catch (error) {
        //? Gestione degli errori con stampa a console
        if (error instanceof Error) {
            console.error("Errore durante il recupero delle attrici:", error);
        } else {
            console.error("Errore sconosciuto:", error);
        }
        return [];  //? In caso di errore, restituisce un array vuoto
    }
}

//! Funzione asincrona che riceve un array di ID e restituisce un array di attrici (o null)
//todo Usa la funzione getActress per recuperare ogni attrice singolarmente
async function getActresses(ArrayId: number[]): Promise<(Actress | null)[]> {
    try {
        //? Mappa ogni ID a una promessa restituita da getActress
        const promises = ArrayId.map(id => getActress(id));
        //? Attende che tutte le promesse siano completate in parallelo
        return await Promise.all(promises);  //? Restituisce un array di risultati (ognuno può essere Actress o null)
    } catch (error) {
        //? Gestione degli errori: stampa in console un messaggio specifico
        if (error instanceof Error) {
            console.error("Errore durante il recupero delle attrici:", error);
        } else {
            console.error("Errore sconosciuto:", error);
        }
        return [];  //? In caso di errore, restituisce un array vuoto
    }
}
