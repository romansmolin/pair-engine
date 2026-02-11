import { PhoneCall } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqs = [
    {
        question: 'How does Pairly matching work?',
        answer: 'Pairly prioritizes profile compatibility and real intent, then surfaces curated profiles in Discover so you spend less time swiping and more time connecting.',
    },
    {
        question: 'Do I need to pay to start using Pairly?',
        answer: 'No. You can sign up, create a profile, and start matching for free. Love Coins are optional and can be used for extras like gifts.',
    },
    {
        question: 'What are Love Coins used for?',
        answer: 'Love Coins are used for in-app actions such as buying gifts. You can top up coins from the Wallet page and spend them inside Pairly.',
    },
    {
        question: 'How often are new profiles loaded?',
        answer: 'Discover loads profiles continuously as you interact. If your session expires, Pairly asks you to sign in again and restores your flow.',
    },
    {
        question: 'Can I control what appears on my profile?',
        answer: 'Yes. You can update your profile details and description in the Profile page at any time.',
    },
    {
        question: 'How do gifts work now?',
        answer: 'You buy gifts with Love Coins first, they appear in your inventory, and then you can send them to matched users.',
    },
    {
        question: 'How is chat handled?',
        answer: 'Chat is proxied through our backend to keep client communication consistent with session and error handling used across the app.',
    },
    {
        question: 'What should I do if I see session expired?',
        answer: 'Sign in again. Pairly will redirect you back to your previous page after authentication.',
    },
]

function FAQ() {
    return (
        <div className="w-full" id="faq">
            <div className="container mx-auto">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Badge className="h-auto  max-w-full bg-transparent px-3 py-2 text-center text-sm font-bold text-primary border-2 border-primary border-dashed sm:text-base md:text-lg lg:text-xl">
                                    FAQ
                                </Badge>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
                                    Pairly FAQ
                                </h4>
                                <p className="text-muted-foreground max-w-xl text-left text-lg leading-relaxed tracking-tight lg:max-w-lg">
                                    Everything you need to know about matching, chat, gifts, and
                                    Love Coins in Pairly.
                                </p>
                            </div>
                            <div>
                                <Button asChild className="gap-4" variant="outline">
                                    <Link href="/auth/sign-up">
                                        Join Pairly now <PhoneCall className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((item, index) => (
                            <AccordionItem key={item.question} value={'index-' + index}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export { FAQ }
