import { injectable, inject } from 'inversify'
import { NextRequest, NextResponse } from 'next/server'
import { DI_TOKENS } from '@/shared/lib/di/tokens'
import { GetCurrentUserUseCase } from '../use-cases/get-current-user.usecase'
import { toUserResponseDto } from '../contracts/user-response.dto'
import { getSession } from '@/shared/lib/auth/get-session'
import { AppError } from '@/shared/errors/app-error'
@injectable()
export class GetCurrentUserController {
    constructor(
        @inject(DI_TOKENS.GetCurrentUserUseCase)
        private getCurrentUserUseCase: GetCurrentUserUseCase,
    ) {}

    async handle(_req: NextRequest): Promise<NextResponse> {
        void _req
        const session = await getSession()

        if (!session?.user?.id) throw AppError.authenticationError()

        const user = await this.getCurrentUserUseCase.execute(session.user.id)

        return NextResponse.json({
            data: toUserResponseDto(user),
        })
    }
}
