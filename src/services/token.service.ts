import IUser from "../features/user/User.type";

class TokenService {
    getLocalRefreshToken() {
        try {
            const user = JSON.parse(localStorage.getItem("user") ?? '');
            return user?.refreshToken;
        }
        catch {
            return null
        }
    }

    getLocalAccessToken() {
        try {
            const user = JSON.parse(localStorage.getItem("user") ?? '');
            return user?.accessToken;
        }
        catch {
            return null
        }
    }
    setWallet(wallet: string | null) {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        user.wallet = wallet;
        localStorage.setItem("user", JSON.stringify(user));
    }

    setEmail(email: string | undefined) {
        const user = JSON.parse(localStorage.getItem("user") ?? '');
        user.email = email;
        localStorage.setItem("user", JSON.stringify(user));
    }

    getWallet() {
        try {
            const user = JSON.parse(localStorage.getItem("user") ?? '');
            return user?.wallet;
        }
        catch {
            return null
        }
    }


    getBalance() {
        try {
            const user = JSON.parse(localStorage.getItem("user") ?? '');
            return user?.balance;
        }
        catch {
            return null
        }
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
        try {
            let user = JSON.parse(localStorage.getItem("user") ?? '');
            return user
        }
        catch {
            return null
        }
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