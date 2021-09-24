import React from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import {
    Container,
    Header,
    UserInfo,
    UserWrapper,
    Avatar,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards
} from './styles';

export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Avatar source={{ uri: 'https://avatars.githubusercontent.com/u/56945282?v=4' }} />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Julio</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard />
                <HighlightCard />
                <HighlightCard />
            </HighlightCards>
        </Container >
    )
}
