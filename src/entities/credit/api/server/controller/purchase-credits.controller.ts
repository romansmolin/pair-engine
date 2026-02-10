import { inject, injectable } from 'inversify'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { purchaseCreditsSchema } from '../contracts/purchase-credits.dto'
import { PurchaseCreditsUseCase } from '../use-cases/purchase-credits.usecase'
import { AppError } from '@/shared/errors/app-error'

@injectable()
export class PurchaseCreditsController {
    constructor(
        @inject(PurchaseCreditsUseCase)
        private useCase: PurchaseCreditsUseCase,
    ) {}

    async handle(req: NextRequest, userId: string): Promise<NextResponse> {
        let body: unknown

        try {
            body = await req.json()
        } catch {
            throw AppError.validationError('Invalid JSON payload')
        }

        try {
            const dto = purchaseCreditsSchema.parse(body)
            const result = await this.useCase.execute(userId, dto.credits)

            return NextResponse.json({
                checkoutToken: result.checkoutToken,
                redirectUrl: result.redirectUrl,
            })
        } catch (error) {
            if (error instanceof ZodError) {
                throw AppError.validationError(
                    'Invalid request',
                    error.issues.map((issue) => ({
                        field: issue.path.join('.') || 'credits',
                        message: issue.message,
                    })),
                )
            }

            throw error
        }
    }
}
