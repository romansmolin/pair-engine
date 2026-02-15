import 'server-only'

import { injectable } from 'inversify'
import type { Prisma } from '@prisma/client'
import { AppError } from '@/shared/errors/app-error'
import { prisma } from '@/shared/lib/database/prisma'

type GiftCatalogRow = Awaited<ReturnType<typeof prisma.gift_catalog.findMany>>[number]
type GiftSendRow = Awaited<ReturnType<typeof prisma.gift_send.findMany>>[number]
type GiftInventoryBaseRow = Awaited<ReturnType<typeof prisma.gift_inventory.findMany>>[number]

export type GiftSendHistoryRow = GiftSendRow & { gift: GiftCatalogRow }

export type GiftInventoryRow = GiftInventoryBaseRow & { gift: GiftCatalogRow }

export type BuyGiftTransactionalInput = {
    userId: string
    giftId: string
    giftName: string
    priceCoins: number
}

export type BuyGiftTransactionalResult = {
    remainingBalance: number
    inventoryQuantity: number
}

export type SendGiftTransactionalInput = {
    senderUserId: string
    recipientDatingUserId: number
    giftId: string
    priceCoins: number
}

export type SendGiftTransactionalResult = {
    giftSend: GiftSendRow
    remainingInventory: number
}

@injectable()
export class GiftRepository {
    async listCatalog(): Promise<GiftCatalogRow[]> {
        return prisma.gift_catalog.findMany({
            where: {
                isActive: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        })
    }

    async findGiftById(giftId: string): Promise<GiftCatalogRow | null> {
        return prisma.gift_catalog.findUnique({
            where: { id: giftId },
        })
    }

    async listUserGiftHistory(senderUserId: string, limit = 20): Promise<GiftSendHistoryRow[]> {
        return prisma.gift_send.findMany({
            where: { senderUserId },
            include: {
                gift: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        })
    }

    async listUserInventory(userId: string): Promise<GiftInventoryRow[]> {
        return prisma.gift_inventory.findMany({
            where: {
                userId,
                quantity: {
                    gt: 0,
                },
            },
            include: {
                gift: true,
            },
            orderBy: [
                {
                    updatedAt: 'desc',
                },
                {
                    gift: {
                        sortOrder: 'asc',
                    },
                },
            ],
        })
    }

    async buyGiftTransactional(input: BuyGiftTransactionalInput): Promise<BuyGiftTransactionalResult> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.user_credits.upsert({
                where: { userId: input.userId },
                update: {
                    updatedAt: new Date(),
                },
                create: {
                    id: crypto.randomUUID(),
                    userId: input.userId,
                    balance: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })

            const updateResult = await tx.user_credits.updateMany({
                where: {
                    userId: input.userId,
                    balance: {
                        gte: input.priceCoins,
                    },
                },
                data: {
                    balance: {
                        decrement: input.priceCoins,
                    },
                    updatedAt: new Date(),
                },
            })

            if (updateResult.count === 0) {
                throw AppError.validationError('Insufficient Love Coins')
            }

            const inventory = await tx.gift_inventory.upsert({
                where: {
                    userId_giftId: {
                        userId: input.userId,
                        giftId: input.giftId,
                    },
                },
                update: {
                    quantity: {
                        increment: 1,
                    },
                    updatedAt: new Date(),
                },
                create: {
                    id: crypto.randomUUID(),
                    userId: input.userId,
                    giftId: input.giftId,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            })

            await tx.credit_transaction.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: input.userId,
                    type: 'spend',
                    amount: -input.priceCoins,
                    status: 'SUCCESSFUL',
                    reason: `Gift purchased: ${input.giftName}`,
                    createdAt: new Date(),
                },
            })

            const updatedCredits = await tx.user_credits.findUnique({
                where: {
                    userId: input.userId,
                },
            })

            if (!updatedCredits) {
                throw AppError.internalError('Failed to fetch updated balance')
            }

            return {
                remainingBalance: updatedCredits.balance,
                inventoryQuantity: inventory.quantity,
            }
        })
    }

    async sendGiftTransactional(input: SendGiftTransactionalInput): Promise<SendGiftTransactionalResult> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const updateInventoryResult = await tx.gift_inventory.updateMany({
                where: {
                    userId: input.senderUserId,
                    giftId: input.giftId,
                    quantity: {
                        gte: 1,
                    },
                },
                data: {
                    quantity: {
                        decrement: 1,
                    },
                    updatedAt: new Date(),
                },
            })

            if (updateInventoryResult.count === 0) {
                throw AppError.validationError('Gift is not available in inventory')
            }

            const inventory = await tx.gift_inventory.findUnique({
                where: {
                    userId_giftId: {
                        userId: input.senderUserId,
                        giftId: input.giftId,
                    },
                },
            })

            const giftSend = await tx.gift_send.create({
                data: {
                    id: crypto.randomUUID(),
                    senderUserId: input.senderUserId,
                    recipientDatingUserId: input.recipientDatingUserId,
                    giftId: input.giftId,
                    priceCoins: input.priceCoins,
                    createdAt: new Date(),
                },
            })

            return {
                giftSend,
                remainingInventory: Math.max(inventory?.quantity ?? 0, 0),
            }
        })
    }
}
