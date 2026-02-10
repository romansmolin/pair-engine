type SendPaymentSuccessEmailInput = {
    email: string
    credits: number
}

export async function sendPaymentSuccessEmail(
    input: SendPaymentSuccessEmailInput,
): Promise<void> {
    console.info('[Mailer] Payment success email stub', input)
}
