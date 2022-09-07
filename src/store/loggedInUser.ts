import { defineStore } from 'pinia';

interface User {
    id?: number,
    vorname: string,
    nachname: string,
    username: string,
    password: string,
    userimage?: string
}

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: (): User => ({
        id: undefined,
        vorname: "",
        nachname: "",
        username: "",
        password: "",
        userimage: ""
    })
})