import { injectable } from 'inversify'
import { prisma } from '@/shared/lib/database/prisma'
import { IUserRepository } from '../interfaces/user-repository.interface'
import { User, CreateUserInput, UpdateUserInput } from '../../../model/types'

/**
 * Prisma implementation of the user repository
 * Note: User creation is now handled by Better Auth
 * This repository is primarily for querying users
 */
@injectable()
export class PrismaUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id },
        })

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        return user
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        void googleId
        // Better Auth stores OAuth info in the account table
        // This method is kept for backward compatibility but may not be used
        throw new Error(
            'findByGoogleId is deprecated. Use Better Auth session to get user info.',
        )
    }

    async create(input: CreateUserInput): Promise<User> {
        // User creation should be done through Better Auth, not directly
        // This is kept for testing purposes only
        const user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                email: input.email,
                name: input.name,
                image: input.image || null,
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        return user
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        const user = await prisma.user.update({
            where: { id },
            data: {
                ...input,
                updatedAt: new Date(),
            },
        })

        return user
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        })
    }
}
