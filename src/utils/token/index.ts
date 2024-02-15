import { sign, verify } from 'jsonwebtoken'
export const token = {
    createToken: (data: any, time: string = String(5 * 60 * 1000)) => {
        let token = sign({ ...data }, process.env.PRIVATE_KEY, { expiresIn: time });
        return token;
    },
    decodeToken: (tokenCode: string) => {
        let data = verify(tokenCode, process.env.PRIVATE_KEY)
        if (data) {
            return data
        }
        return false
    }
}