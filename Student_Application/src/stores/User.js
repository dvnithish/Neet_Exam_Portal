import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: '',
        user: null
    }),
    getters: {
        getToken() {
            this.token = localStorage.getItem('token');
            return this.token;
        },
        getUser() {
            this.user = JSON.parse(localStorage.getItem('user'));
            return this.user;
        }
    },
    actions: {
        setToken(newToken) {
            this.token = newToken;
            localStorage.setItem('token', newToken);
        },
        setUser(newUser) {
            this.user = newUser;
            localStorage.setItem('user', JSON.stringify(newUser));
        },
        removeToken() {
            this.token = null;
            localStorage.removeItem('token');
        },
        removeUser() {
            this.user = null;
            localStorage.removeItem("user");
        }
    }
})