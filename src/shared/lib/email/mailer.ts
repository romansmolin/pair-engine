import 'server-only'
import nodemailer from 'nodemailer'

type SendWelcomeEmailInput = {
    email: string
    username?: string
}

type SendPaymentSuccessEmailInput = {
    email: string
    credits: number
}

type EmailContent = {
    to: string
    subject: string
    text: string
    html: string
}

type SmtpConfig = {
    host: string
    port: number
    secure: boolean
    user: string
    pass: string
    from: string
}

let smtpTransporter: ReturnType<typeof nodemailer.createTransport> | null = null

const parseSecureFlag = (value: string | undefined): boolean => {
    return String(value).toLowerCase() === 'true'
}

const resolveSmtpConfig = (): SmtpConfig => {
    const host = process.env.SMTP_HOST
    const portRaw = process.env.SMTP_PORT
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM
    const secure = parseSecureFlag(process.env.SMTP_SECURE)

    if (!host || !portRaw || !user || !pass || !from) {
        throw new Error('SMTP config is incomplete. Check SMTP_* environment variables.')
    }

    const port = Number(portRaw)
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error('SMTP_PORT must be a positive integer.')
    }

    return {
        host,
        port,
        secure,
        user,
        pass,
        from,
    }
}

const getTransporter = () => {
    if (smtpTransporter) return smtpTransporter

    const config = resolveSmtpConfig()
    smtpTransporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
            user: config.user,
            pass: config.pass,
        },
    })

    return smtpTransporter
}

const sendEmail = async (content: EmailContent): Promise<void> => {
    const config = resolveSmtpConfig()
    const transporter = getTransporter()

    await transporter.sendMail({
        from: config.from,
        to: content.to,
        subject: content.subject,
        text: content.text,
        html: content.html,
    })
}

const sendEmailSafely = async (content: EmailContent, emailType: string): Promise<void> => {
    try {
        await sendEmail(content)
    } catch (error) {
        console.error(`[Mailer] Failed to send ${emailType} email`, {
            to: content.to,
            error,
        })
    }
}

export async function sendWelcomeEmail(input: SendWelcomeEmailInput): Promise<void> {
    const displayName = input.username?.trim() || 'there'
    const subject = 'Welcome to PairEngine'

    await sendEmailSafely(
        {
            to: input.email,
            subject,
            text: `Hi ${displayName}, welcome to PairEngine. Your account is ready and you can start using the app now.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
                    <p>Hi ${displayName},</p>
                    <p>Welcome to PairEngine. Your account is ready and you can start using the app now.</p>
                    <p>Thanks for joining us.</p>
                </div>
            `,
        },
        'welcome',
    )
}

export async function sendPaymentSuccessEmail(input: SendPaymentSuccessEmailInput): Promise<void> {
    const subject = 'Credits purchase successful'

    await sendEmailSafely(
        {
            to: input.email,
            subject,
            text: `Your credits purchase was successful. ${input.credits} credits were added to your balance.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
                    <p>Your credits purchase was successful.</p>
                    <p><strong>${input.credits} credits</strong> were added to your balance.</p>
                </div>
            `,
        },
        'payment-success',
    )
}
