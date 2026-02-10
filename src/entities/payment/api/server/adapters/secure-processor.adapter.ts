import 'server-only'
import { injectable } from 'inversify'
import type {
    CreateCheckoutInput,
    CreateCheckoutResult,
    PaymentGatewayAdapter,
} from '../interfaces/payment-gateway.interface'
import { getEnvVar } from '@/shared/utils/get-env-var'

const SECURE_PROCESSOR_API_BASE_URL = getEnvVar('SECURE_PROCESSOR_API_BASE_URL')
const SECURE_PROCESSOR_CHECKOUT_TOKEN_PATH = getEnvVar('SECURE_PROCESSOR_CHECKOUT_TOKEN_PATH')
const SECURE_PROCESSOR_SHOP_ID = getEnvVar('SECURE_PROCESSOR_SHOP_ID')
const SECURE_PROCESSOR_SECRET_KEY = getEnvVar('SECURE_PROCESSOR_SECRET_KEY')
const NEXT_PUBLIC_SECURE_PROCESSOR_TEST_MODE = getEnvVar('SECURE_PROCESSOR_TEST_MODE')

@injectable()
export class SecureProcessorAdapter implements PaymentGatewayAdapter {
    async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
        const payload = {
            checkout: {
                version: 2.1,
                transaction_type: 'payment',
                test: input.testMode,
                settings: {
                    return_url: input.returnUrl,
                },
                order: {
                    amount: input.amountCents,
                    currency: input.currency,
                    description: input.description,
                },
                customer: {
                    id: input.customerId,
                },
                metadata: input.metadata,
            },
        }

        const url = new URL(SECURE_PROCESSOR_CHECKOUT_TOKEN_PATH, SECURE_PROCESSOR_API_BASE_URL)

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.buildBasicAuthHeader(),
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const bodyText = await response.text()
            throw new Error(`Secure Processor checkout failed: ${response.status} ${bodyText}`)
        }

        const json = await response.json()
        const checkoutToken = json?.token ?? json?.checkout?.token
        const redirectUrl = json?.checkout?.redirect_url

        if (!checkoutToken) {
            throw new Error('Secure Processor did not return a checkout token')
        }

        return {
            checkoutToken,
            redirectUrl,
            rawPayload: json,
        }
    }

    private buildBasicAuthHeader(): string {
        const value = `${SECURE_PROCESSOR_SHOP_ID}:${SECURE_PROCESSOR_SECRET_KEY}`
        const encoded = Buffer.from(value).toString('base64')
        return `Basic ${encoded}`
    }
}

export const isSecureProcessorTestMode = () => {
    if (!NEXT_PUBLIC_SECURE_PROCESSOR_TEST_MODE) return false
    return NEXT_PUBLIC_SECURE_PROCESSOR_TEST_MODE === 'true'
}
