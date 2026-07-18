import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { generateToken } from "../../utils/generateToken.js";

const SALT_ROUND = 10;

export const registerUser = async (userData) => {
    const { email, password, firstName, lastName, first_name, last_name } = userData;

    const existinguser = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (existinguser) {
        const error = new Error("user already exist");
        error.statusCode = 409;
        throw error;
    }

    const hashedPass = await bcrypt.hash(password, SALT_ROUND);

    const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role: "USER",
        },
    });

    await tx.wallet.create({
        data: {
            userId: user.id,
        },
    });

    return user;
});
}

export const loginUser = async ({ email, password }) => {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            password: true,
            role: true,
            firstName: true,
            lastName: true,
        },
    });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    const { password: hashedPassword, ...safeUser } = user;

    return {
        user: safeUser,
        token,
    };
};