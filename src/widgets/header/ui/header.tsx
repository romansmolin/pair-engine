import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, Sheet } from '@/shared/ui/sheet'
import { Separator } from '@/shared/ui/separator'

const navigationMenu = [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Safety', href: '/#safety' },
    { label: 'Stories', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
]

export const Header = () => {
    return (
        <header className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-2xl text-primary font-bold tracking-wider">
                Pairly
            </Link>
            <nav className="hidden sm:block">
                <ul className="flex gap-8 text-lg">
                    {navigationMenu.map((menuItem) => (
                        <Link
                            key={menuItem.href}
                            href={menuItem.href}
                            className="hover:text-primary duration-300 font-bold"
                        >
                            {menuItem.label}
                        </Link>
                    ))}
                </ul>
            </nav>
            <div className="hidden sm:flex gap-3">
                <Button asChild>
                    <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
                <Button asChild variant={'outline'}>
                    <Link href="/auth/sign-in">Get started</Link>
                </Button>
            </div>

            {/* MOBILE VIEW */}

            <Sheet>
                <SheetTrigger asChild className="sm:hidden">
                    <Button size={'icon'} variant={'outline'} className="border border-dashed">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent className="felx flex-col gap-2 p-2">
                    <SheetHeader>
                        <SheetTitle className="text-xl text-primary">
                            Pairly | Find The Love ❤️
                        </SheetTitle>
                    </SheetHeader>

                    <Separator className="bg-primary" />

                    <ul className="flex flex-col text-lg gap-5 p-4">
                        {navigationMenu.map((menuItem) => (
                            <Link
                                key={menuItem.href}
                                href={menuItem.href}
                                className="hover:text-primary duration-300 font-bold"
                            >
                                {menuItem.label}
                            </Link>
                        ))}
                    </ul>

                    <Separator className="bg-primary" />

                    <div className="flex gap-3 p-4">
                        <Button asChild className="flex-1">
                            <Link href="/auth/sign-up">Sign Up</Link>
                        </Button>
                        <Button asChild className="flex-1" variant={'outline'}>
                            <Link href="/auth/sign-in">Get started</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    )
}
