export interface LoginOk {
    ok: true;
    userId: string;
    accessToken: string;
    refreshToken: string;
}

export interface LoginFailed {
    ok: false;
    error: string;
}

export type LoginResult = LoginOk | LoginFailed;
