import fs from 'fs';
import path from 'path'
import { pool } from './db.js'
import { hash,compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv';
dotenv.config();
const { sign } = jwt

const __dirname = path.dirname(import.meta.url)

const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../todo.sql"), "utf8");
    await pool.query(sql)
    console.log("Test database initialized.");
}

const insertTestUser = (email, password) => {
    hash(password,10,(error,hashedPassword) => {
        pool.query('insert into account (email,password) values ($1,$2)',
            [email,hashedPassword])
    })
}

const getToken = (email) => {
    return sign({user: email},process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }