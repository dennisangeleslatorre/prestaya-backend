export interface User {
    id?: number,
    user_name: string,
    password?: string,
    full_name: string
    id_role: number
    created_at: Date,
    updated_at?: Date,
    status: boolean
}