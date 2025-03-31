'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from './loading';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push("/login");
        }
    }, [status, router]);

    if (status === 'loading') {
        return (<Loading />);
    }

    return <>{session ? children : null}</>;
}
