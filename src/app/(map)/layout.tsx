import { DashboardLayout } from '@toolpad/core';

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            {props.children}
        </DashboardLayout>
    );
}
