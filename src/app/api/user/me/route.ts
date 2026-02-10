import { NextRequest } from 'next/server';
import { asyncHandler } from '@/shared/http/async-handler';
import { container } from '@/shared/lib/di/container.server';
import { GetCurrentUserController } from '@/entities/user';

/**
 * GET /api/user/me
 * Get current authenticated user
 */
export const GET = asyncHandler(async (req: NextRequest) => {
  const controller = container.get(GetCurrentUserController);
  return await controller.handle(req);
});
