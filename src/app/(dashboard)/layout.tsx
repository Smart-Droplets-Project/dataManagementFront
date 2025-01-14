import { DashboardLayout } from '@toolpad/core';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function DashboardPagesLayout(props: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <PageContainer>
                {props.children}
            </PageContainer>
        </DashboardLayout>
    );
}
