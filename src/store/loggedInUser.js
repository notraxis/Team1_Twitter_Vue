import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'loggedInUser',
    state: () => ({
        id: undefined,
        vorname: "",
        nachname: "",
        username: "",
        password: "",
        userimage: ""
    })
})