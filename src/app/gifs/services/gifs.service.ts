import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({ providedIn: 'root' })
export class GifsService {
    private http = inject(HttpClient);
    private _tagsHistory: string[] = [];
    private apiKey: string = '--pega tu api_key--';
    private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

    public gifList: Gif[] = [];

    constructor() {
        this.loadLocalStorage();
    }

    //getters
    get tagsHistory() {
        /*la instrucción return [...this._tagsHistory] se utiliza para devolver 
        una copia inmutable del arreglo _tagsHistory, lo que garantiza que el 
        arreglo original permanezca intacto y no se vea afectado por los cambios
        realizados en la copia devuelta. para poder usarlo
        y ver los cambios sin que se quede estatico hay crear un metodo 
        get(){return arreglo} donde se vaya a usar. Ver sidebar.component.ts*/
        return [...this._tagsHistory];
    }

    private organizeHistory(tag: string) {
        tag = tag.toLowerCase();

        // si hay un tag anterior lo busca y lo borra
        if (this._tagsHistory.includes(tag)) {
            this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
        }

        // e inserta el el mismo pero esta vez en primer lugar
        this._tagsHistory.unshift(tag)

        //No deja colocar mas de 10 elementos y si lo hace borra
        // borra el ultimo e inserta la nueva
        this._tagsHistory = this._tagsHistory.splice(0, 10)
        this.saveLocalStorage()
    }

    private saveLocalStorage(): void {
        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocalStorage(): void {
        if (!localStorage.getItem('history')) return;

        this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

        if (this._tagsHistory.length === 0) return;

        this.searchTag(this._tagsHistory[0]);
    }

    searchTag(tag: string): void {
        if (tag.length === 0) return;
        this.organizeHistory(tag);

        const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit', '10')
            .set('q', tag)

        this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
            .subscribe(resp => {
                this.gifList = resp.data;
                //console.log({gifs: this.gifList});
            });
    }
}