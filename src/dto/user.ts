import J from "joi"

export type TuserDto = {
    username : string,
    email : string,
    password : string
}

export const singupScheamJoi = J.object({
    username : J.string().required(),
    email : J.string().email().required(),
    password :  J.string().required()
})

export type TloginUserDto = {
    email : string,
    password : string
}

export const loginUserSchemaJoi = J.object({
    password : J.string().required(),
    email : J.string().email().required()
})