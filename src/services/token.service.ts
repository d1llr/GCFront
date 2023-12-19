import IUser from "../features/user/User.type";

class TokenService {
    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        return user?.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        return user?.accessToken;
    }
    setWallet(wallet: string | null) {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        user.wallet = wallet;
        localStorage.setItem("user", JSON.stringify(user));
    }

    getWallet() {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        return user?.wallet;
    }


    getBalance() {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        return user?.balance;
    }

    setBalance(balance: number | null) {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        user.balance = balance;
        localStorage.setItem("user", JSON.stringify(user));
    }

    updateLocalAccessToken(token: string) {
        let user = JSON.parse(localStorage.getItem("user") ?? '');
        user.accessToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }
    updateLocalRefreshToken(token: string) {
        let user = JSON.parse(localStorage.getItem("user") ?? '');
        user.refreshToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }


    getUser() {
        return JSON.parse(localStorage.getItem("user") ?? '');
    }

    setUser(user: IUser) {
        console.log(JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem("user");
    }
}

export default new TokenService();